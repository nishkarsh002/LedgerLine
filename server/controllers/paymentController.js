import Stripe from 'stripe';
import asyncHandler from '../middlewares/asyncHandler.js';
import Purchase from '../models/Purchase.js';
import Plan from '../models/Plan.js';
import ITRForm from '../models/ITRForm.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import { getInvoiceTemplate } from '../utils/emailTemplates.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc      Create Stripe Payment Intent
// @route     POST /api/v1/payments/create-intent
// @access    Private
export const createPaymentIntent = asyncHandler(async (req, res, next) => {
    const { planId } = req.body;

    const plan = await Plan.findById(planId);

    if (!plan) {
        return next(new AppError('Plan not found', 404));
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: plan.price * 100, // amount in smallest currency unit (cents/paise)
            currency: 'inr', // Stripe usually handles currency by account, but 'inr' is good for India.
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                planId: plan._id.toString(),
                userId: req.user._id.toString(),
            },
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error(error);
        return next(new AppError('Payment gateway error: ' + error.message, 500));
    }
});

// @desc      Confirm Payment (Verify Intent Status)
// @route     POST /api/v1/payments/confirm
// @access    Private
export const confirmPayment = asyncHandler(async (req, res, next) => {
    const { paymentIntentId, planId } = req.body;

    if (!paymentIntentId) {
        return next(new AppError('Payment Intent ID is required', 400));
    }

    // --- TEMPORARY MOCK BYPASS FOR TESTING ---
    if (paymentIntentId && paymentIntentId.startsWith('mock_')) {
        const existingPurchase = await Purchase.findOne({ paymentId: paymentIntentId });
        if (existingPurchase) {
            return res.status(200).json({
                success: true,
                message: 'Mock Payment already processed',
                purchaseId: existingPurchase._id
            });
        }

        if (!planId) {
            return next(new AppError('Plan ID is required for mock payment', 400));
        }

        const purchase = await Purchase.create({
            userId: req.user.id,
            planId: planId,
            paymentId: paymentIntentId,
            paymentStatus: 'Completed',
            formUnlocked: true
        });

        req.user.purchasedPlans.push(purchase._id);
        await req.user.save();

        // Send confirmation email (Mock)
        try {
            const plan = await Plan.findById(planId);
            if (plan) {
                await sendEmail({
                    email: req.user.email,
                    subject: 'Payment Successful - LedgerLine Receipt',
                    message: `You have successfully purchased ${plan.name}. Transaction ID: ${paymentIntentId}`,
                    html: getInvoiceTemplate(req.user, purchase, plan)
                });
            }
        } catch (err) {
            console.error('Email failed (Mock):', err);
        }

        return res.status(200).json({
            success: true,
            message: 'MOCK Payment confirmed successfully',
            purchaseId: purchase._id
        });
    }
    // ----------------------------------------

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Check if purchase already exists for this payment intent to avoid duplicates
            // This is a basic check. Ideally use idempotency keys or unique constraint on paymentId.
            const existingPurchase = await Purchase.findOne({ paymentId: paymentIntentId });

            if (existingPurchase) {
                return res.status(200).json({
                    success: true,
                    message: 'Payment already processed',
                    purchaseId: existingPurchase._id
                });
            }

            // Create purchase record
            const purchase = await Purchase.create({
                userId: req.user.id,
                planId: planId || paymentIntent.metadata.planId, // Fallback to metadata
                paymentId: paymentIntentId,
                paymentStatus: 'Completed',
                formUnlocked: true
            });

            // Add purchase reference to user
            req.user.purchasedPlans.push(purchase._id);
            await req.user.save();

            // Send confirmation email
            try {
                const plan = await Plan.findById(purchase.planId);
                if (plan) {
                    await sendEmail({
                        email: req.user.email,
                        subject: 'Payment Successful - LedgerLine Receipt',
                        message: `You have successfully purchased ${plan.name}. Transaction ID: ${paymentIntentId}`,
                        html: getInvoiceTemplate(req.user, purchase, plan)
                    });
                }
            } catch (err) {
                console.error('Email failed:', err);
            }

            res.status(200).json({
                success: true,
                message: 'Payment confirmed successfully',
                purchaseId: purchase._id
            });
        } else {
            return next(new AppError(`Payment not successful. Status: ${paymentIntent.status}`, 400));
        }
    } catch (error) {
        console.error(error);
        return next(new AppError('Payment confirmation failed: ' + error.message, 500));
    }
});

// @desc Check if user has active purchase for a plan
// @route GET /api/v1/payments/check-status
// @access Private
export const checkPurchaseStatus = asyncHandler(async (req, res, next) => {
    const { planId } = req.query;

    if (!planId) {
        return next(new AppError('Plan ID is required', 400));
    }

    // Find latest completed purchase for this plan
    const purchase = await Purchase.findOne({
        userId: req.user.id,
        planId: planId,
        paymentStatus: 'Completed'
    }).sort({ createdAt: -1 });

    if (!purchase) {
        return res.status(200).json({
            success: true,
            hasActivePlan: false
        });
    }

    // Check if ITR is already filed for this purchase
    const itr = await ITRForm.findOne({ purchaseId: purchase._id });

    if (itr) {
        // ITR already filed, so this purchase is "consumed"
        return res.status(200).json({
            success: true,
            hasActivePlan: false,
            isFiled: true
        });
    }

    return res.status(200).json({
        success: true,
        hasActivePlan: true,
        purchaseId: purchase._id,
        isFiled: false
    });
});

// @desc      Get My Orders (Purchases)
// @route     GET /api/v1/payments/my-orders
// @access    Private
export const getMyOrders = asyncHandler(async (req, res, next) => {
    // 1. Fetch all user purchases, verify auth user matches userId
    const purchases = await Purchase.find({ userId: req.user.id })
        .populate('planId')
        .sort({ createdAt: -1 });

    // 2. Map and add ITR Status
    const ordersWithStatus = await Promise.all(purchases.map(async (purchase) => {
        // Check ITR Status if formUnlocked
        let itrStatus = 'Pending Filing';
        let itrId = null;
        let submittedAt = null;

        if (purchase.formUnlocked) {
            const itr = await ITRForm.findOne({ purchaseId: purchase._id });
            if (itr) {
                itrStatus = itr.status || 'Submitted'; // Or fetch specific status from ITR
                itrId = itr._id;
                submittedAt = itr.submittedAt || itr.createdAt;
            }
        }

        // Convert to plain object to attach properties
        const purchaseObj = purchase.toObject();

        return {
            ...purchaseObj,
            itrStatus,
            itrId,
            submittedAt
        };
    }));

    res.status(200).json({
        success: true,
        count: ordersWithStatus.length,
        data: ordersWithStatus
    });
});
// @desc      Get All Orders (Admin)
// @route     GET /api/v1/payments/all
// @access    Private (Admin)
export const getAllOrders = asyncHandler(async (req, res, next) => {
    const purchases = await Purchase.find()
        .populate('userId', 'name email mobile')
        .populate('planId')
        .sort({ createdAt: -1 });

    const ordersWithStatus = await Promise.all(purchases.map(async (purchase) => {
        let itrStatus = 'Pending Filing';
        let itrId = null;
        let submittedAt = null;

        if (purchase.formUnlocked) {
            const itr = await ITRForm.findOne({ purchaseId: purchase._id });
            if (itr) {
                itrStatus = itr.status || 'Submitted';
                itrId = itr._id;
                submittedAt = itr.submittedAt || itr.createdAt;
            }
        }

        const purchaseObj = purchase.toObject();

        return {
            ...purchaseObj,
            itrStatus,
            itrId,
            submittedAt
        };
    }));

    res.status(200).json({
        success: true,
        count: ordersWithStatus.length,
        data: ordersWithStatus
    });
});
