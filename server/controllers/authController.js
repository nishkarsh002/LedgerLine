import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/User.js';
import { Admin } from '../config/index.js';
import ErrorResponse from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import { getVerificationTemplate } from '../utils/emailTemplates.js';
import admin from 'firebase-admin';

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, mobile, role } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorResponse('Email already registered', 400));
    }

    // Create user
    user = await User.create({
        name,
        email,
        password,
        mobile,
        role,
        isEmailVerified: false // Default false
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send Verify Email
    const message = `Your verification code is: ${otp}\n\nThis code expires in 10 minutes.`;

    // Log OTP for Development (in case email fails)
    console.log(`OTP sent to ${user.email}: ${otp}`);

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification - LedgerLine',
            message: `Your verification code is: ${otp}`,
            html: getVerificationTemplate(otp, 'Verification')
        });
    } catch (err) {
        console.error(err);
        // OTP sending failed, but we keep the OTP in DB for dev testing (check console)
        // user.otp = undefined;
        // user.otpExpires = undefined;
        // await user.save({ validateBeforeSave: false });
    }

    res.status(200).json({
        success: true,
        requireVerification: true,
        email: user.email,
        message: 'Registration successful. Please check your email for verification code.'
    });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body; // email field accepts email or mobile

    // Validate email/mobile & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide email/mobile and password', 400));
    }

    // Check if input is likely a mobile number
    const isMobile = /^\d{10}$/.test(email);

    let query = {};
    if (isMobile) {
        query = { mobile: email };
    } else {
        query = { email: email };
    }

    // Check for user
    const user = await User.findOne(query).select('+password');

    if (!user) {
        return next(new ErrorResponse('You are a new user, please register yourself first.', 404));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Determine Verification Requirement
    if (!user.googleId) {
        if (isMobile) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.mobileOtp = otp;
            user.mobileOtpExpires = Date.now() + 10 * 60 * 1000;
            await user.save({ validateBeforeSave: false });
            console.log(`Login Mobile OTP: ${otp}`);
            return res.status(200).json({
                success: true,
                requireVerification: true,
                verificationType: 'mobile',
                email: user.email,
                mobile: user.mobile,
                message: 'Mobile verification required.'
            });
        }
        // Email Logic (Fallthrough)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // Log OTP for Development
        console.log(`Login OTP for ${user.email}: ${otp}`);

        try {
            await sendEmail({
                email: user.email,
                subject: 'Login Verification - LedgerLine',
                message: `Your verification code is: ${otp}`,
                html: getVerificationTemplate(otp, 'Login')
            });
        } catch (err) {
            console.error('Email send fail', err);
        }

        return res.status(200).json({
            success: true,
            requireVerification: true,
            email: user.email,
            message: 'Email not verified. An OTP has been sent.'
        });
    }

    sendTokenResponse(user, 200, res);
});

// @desc      Verify OTP
// @route     POST /api/v1/auth/verify-otp
// @access    Public
export const verifyOTP = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await User.findOne({
        email,
        otp,
        otpExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    // Verify
    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
});

// @desc      Resend OTP
// @route     POST /api/v1/auth/resend-otp
// @access    Public
export const resendOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }



    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // Log OTP for Development
    console.log(`Resend OTP for ${user.email}: ${otp}`);

    try {
        await sendEmail({
            email: user.email,
            subject: 'New Verification Code - LedgerLine',
            message: `Your new verification code is: ${otp}`,
            html: getVerificationTemplate(otp, 'Verification')
        });
    } catch (err) {
        if (process.env.NODE_ENV === 'development') {
            return res.status(200).json({
                success: true,
                message: 'Email service not configured. Check backend console for OTP.'
            });
        }
        return next(new ErrorResponse('Email could not be sent', 500));
    }

    res.status(200).json({
        success: true,
        message: 'OTP resent successfully'
    });
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
export const getMe = asyncHandler(async (req, res, next) => {
    // Check Admin DB first then User DB
    let user = await Admin.findById(req.user.id);
    if (!user) {
        user = await User.findById(req.user.id);
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc      Google Auth Callback
// @route     GET /api/v1/auth/google/callback
// @access    Public
export const googleCallback = asyncHandler(async (req, res, next) => {
    // Generate Token
    const user = req.user;
    const token = user.getSignedJwtToken();
    const state = req.query.state; // 'admin' or undefined

    // Set cookie
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.cookie('token', token, options);

    // Default redirect
    let redirectUrl = `http://localhost:5173/login?token=${token}`;

    if (state === 'admin') {
        // User intended to log into admin portal
        if (user.role === 'admin' || (user.role === 'ca' && user.adminStatus === 'approved')) {
            redirectUrl = `http://localhost:5173/admin/dashboard?token=${token}`;
        } else if (user.adminStatus === 'pending') {
            redirectUrl = `http://localhost:5173/admin/request-status?token=${token}`;
        } else if (user.adminStatus === 'rejected') {
            redirectUrl = `http://localhost:5173/admin/rejected?token=${token}`;
        } else {
            // First time or 'none' status, needs to raise request
            redirectUrl = `http://localhost:5173/admin/request-access?token=${token}`;
        }
    } else {
        // Regular user login
        if (user.role === 'admin' || (user.role === 'ca' && user.adminStatus === 'approved')) {
            redirectUrl = `http://localhost:5173/admin/dashboard?token=${token}`;
        } else {
            redirectUrl = `http://localhost:5173/login?token=${token}`;
        }
    }

    res.redirect(redirectUrl);
});

// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc      Send Mobile OTP
// @route     POST /api/v1/auth/send-mobile-otp
// @access    Private
export const sendMobileOTP = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { mobile } = req.body;

    if (!user) return next(new ErrorResponse('User not found', 404));

    if (user.isMobileVerified) {
        return next(new ErrorResponse('Mobile already verified', 400));
    }

    // Update mobile if provided
    if (mobile && mobile !== user.mobile) {
        // Check uniqueness
        const existingUser = await User.findOne({ mobile });
        if (existingUser) {
            return next(new ErrorResponse('Mobile number already in use', 400));
        }
        user.mobile = mobile;
    } else if (!user.mobile || user.mobile.startsWith('G-') || user.mobile === '0000000000') {
        return next(new ErrorResponse('Please provide a valid mobile number', 400));
    }

    // Generate Mobile OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.mobileOtp = otp;
    user.mobileOtpExpires = Date.now() + 10 * 60 * 1000;

    // Log OTP for Dev
    console.log(`Mobile OTP for ${user.mobile} (${user.email}): ${otp}`);

    await user.save({ validateBeforeSave: false });

    // Also send via Email as a backup/reference since user requested it
    try {
        await sendEmail({
            email: user.email,
            subject: 'Mobile Verification Code - LedgerLine',
            message: `Your mobile verification code is: ${otp}`,
            html: getVerificationTemplate(otp, 'Verification')
        });
    } catch (err) {
        console.error('Email backup for mobile OTP failed:', err);
    }

    res.status(200).json({
        success: true,
        message: 'Mobile verification OTP sent via SMS and Email'
    });
});

// @desc      Verify Mobile OTP
// @route     POST /api/v1/auth/verify-mobile-otp
// @access    Private
export const verifyMobileOTP = asyncHandler(async (req, res, next) => {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return next(new ErrorResponse('User not found', 404));

    if (!user.mobileOtp || user.mobileOtp !== otp) {
        return next(new ErrorResponse('Invalid OTP', 400));
    }

    if (user.mobileOtpExpires < Date.now()) {
        return next(new ErrorResponse('OTP Expired', 400));
    }

    user.isMobileVerified = true;
    user.mobileOtp = undefined;
    user.mobileOtpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
});

// @desc      Request Admin Access
// @route     POST /api/v1/auth/request-admin
// @access    Private
export const requestAdminAccess = asyncHandler(async (req, res, next) => {
    // Try finding in both DBs
    let user = await Admin.findById(req.user.id);
    if (!user) user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    if ((user.role === 'admin' || user.role === 'ca') && user.adminStatus === 'approved') {
        return next(new ErrorResponse('User already has administrative access', 400));
    }

    if (user.adminStatus === 'pending') {
        return next(new ErrorResponse('Access request is already pending', 400));
    }

    user.adminStatus = 'pending';
    user.adminRequestedAt = Date.now();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: 'Administrative access request submitted successfully'
    });
});

// @desc      Get all admin access requests
// @route     GET /api/v1/auth/admin-requests
// @access    Private/Admin
export const getAdminRequests = asyncHandler(async (req, res, next) => {
    const adminReqs = await Admin.find({ adminStatus: 'pending' });
    const userReqs = await User.find({ adminStatus: 'pending' });
    
    const allRequests = [...adminReqs, ...userReqs].sort((a,b) => b.adminRequestedAt - a.adminRequestedAt);

    res.status(200).json({
        success: true,
        count: allRequests.length,
        data: allRequests
    });
});

// @desc      Handle Admin Access Request (Approve/Reject)
// @route     PUT /api/v1/auth/admin-requests/:id
// @access    Private/Admin
export const handleAdminRequest = asyncHandler(async (req, res, next) => {
    const { status, role } = req.body; // status: 'approved' | 'rejected', role: 'admin' | 'ca'

    if (!['approved', 'rejected'].includes(status)) {
        return next(new ErrorResponse('Invalid status provided', 400));
    }

    let user = await Admin.findById(req.params.id);
    if (!user) user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse('User not found', 404));
    }

    user.adminStatus = status;
    
    if (status === 'approved') {
        user.role = role || 'ca'; // Default to CA if role not provided
    } else {
        user.role = 'user'; // Ensure role is user if rejected
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: `Admin request ${status} successfully`,
        data: user
    });
});

// @desc      Firebase Login Sync
// @route     POST /api/v1/auth/firebase-login
// @access    Public
export const firebaseLogin = asyncHandler(async (req, res, next) => {
    const { idToken, uid, mobile } = req.body;

    if (!idToken) {
        return next(new ErrorResponse('Please provide a Firebase ID token', 400));
    }

    try {
        // Verify Firebase Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid: firebaseUid, email: firebaseEmail, phone_number: firebasePhone } = decodedToken;

        // Normalize mobile numbers (use last 10 digits for consistent lookup)
        const normalizeMobile = (num) => {
            if (!num) return null;
            const cleaned = num.replace(/\D/g, '');
            return cleaned.length >= 10 ? cleaned.slice(-10) : cleaned;
        };

        const searchMobile = normalizeMobile(firebasePhone || mobile);

        // Find user in our DB
        // We check firebaseUid, then email, then mobile
        let user = await User.findOne({
            $or: [
                { firebaseUid: decodedToken.uid },
                ...(firebaseEmail ? [{ email: firebaseEmail }] : []),
                ...(searchMobile ? [{ mobile: searchMobile }] : [])
            ]
        });

        if (!user) {
            return next(new ErrorResponse('You are a new user, please register yourself first.', 404));
        } else {
            // Update existing user with info if missing
            let updated = false;
            
            if (!user.firebaseUid) {
                user.firebaseUid = decodedToken.uid;
                updated = true;
            }
            if (!user.email && firebaseEmail) {
                user.email = firebaseEmail;
                user.isEmailVerified = decodedToken.email_verified || true;
                updated = true;
            }
            if (!user.mobile && searchMobile) {
                user.mobile = searchMobile;
                user.isMobileVerified = true;
                updated = true;
            }

            if (updated) {
                await user.save({ validateBeforeSave: false });
            }
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Firebase token verification failed:', error);
        return next(new ErrorResponse('Authentication failed', 401));
    }
});

// @desc      Check if user exists
// @route     POST /api/v1/auth/check-user
// @access    Public
export const checkUser = asyncHandler(async (req, res, next) => {
    const { identifier } = req.body;

    if (!identifier) {
        return next(new ErrorResponse('Please provide an email or mobile number', 400));
    }

    // Normalize identifier (remove spaces and special characters from mobile)
    const normalizedIdentifier = identifier.trim().replace(/\s/g, '');

    // Check if input is likely a mobile number
    const isMobile = /^\d{10}$/.test(normalizedIdentifier) || (/^\+91\d{10}$/.test(normalizedIdentifier));
    
    let query = {};
    if (isMobile) {
        const last10 = normalizedIdentifier.slice(-10);
        query = { mobile: last10 };
    } else {
        query = { email: normalizedIdentifier.toLowerCase() };
    }

    const user = await User.findOne(query);

    if (!user) {
        return res.status(200).json({
            success: false,
            exists: false,
            message: 'You are a new user, please register yourself first.'
        });
    }

    res.status(200).json({
        success: true,
        exists: true
    });
});

// @desc      Verify Mobile via Firebase
// @route     POST /api/v1/auth/verify-mobile-firebase
// @access    Private
export const firebaseVerifyMobile = asyncHandler(async (req, res, next) => {
    const { idToken } = req.body;

    if (!idToken) {
        return next(new ErrorResponse('Please provide a Firebase ID token', 400));
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { phone_number: firebasePhone } = decodedToken;

        if (!firebasePhone) {
            return next(new ErrorResponse('Firebase token does not contain a verified phone number', 400));
        }

        const user = await User.findById(req.user.id);
        if (!user) return next(new ErrorResponse('User not found', 404));

        // Update user
        user.isMobileVerified = true;
        // Also update the mobile number if it's currently a dummy or missing
        const normalizedMobile = firebasePhone.replace(/\D/g, '').slice(-10);
        user.mobile = normalizedMobile;
        user.firebaseUid = decodedToken.uid;

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: 'Mobile verified successfully via Firebase'
        });
    } catch (error) {
        console.error('Firebase verification failed:', error);
        return next(new ErrorResponse('Verification failed', 401));
    }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken ? user.getSignedJwtToken() : null;

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            data: {
                role: user.role,
                adminStatus: user.adminStatus
            }
        });
};
