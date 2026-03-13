import express from 'express';
import { createPaymentIntent, confirmPayment, checkPurchaseStatus, getMyOrders, getAllOrders } from '../controllers/paymentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/check-status', protect, checkPurchaseStatus);
router.get('/my-orders', protect, getMyOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);

export default router;
