import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../frontend/Navbar';
import { Mail, Smartphone, CheckCircle, ArrowRight, Loader2, Lock, AlertCircle, Phone, RefreshCcw, LogOut } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import api from '../../api/axios';

const UnifiedVerification = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, loading, user, verifyOTP, resendOTP, verifyMobileOTP, sendMobileOTP, logout } = useAuth();

    // Redirect if not logged in and not in registration flow
    useEffect(() => {
        if (!loading && !isLoggedIn && !state?.email) {
            navigate('/login');
        }
    }, [isLoggedIn, loading, state, navigate]);

    // Identify user/email based on Login vs Register state
    const emailAddress = user?.email || state?.email;
    const isEmailVerified = user?.isEmailVerified;
    const isMobileVerified = user?.isMobileVerified;

    // --- Email State ---
    const [emailOtp, setEmailOtp] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [emailMsg, setEmailMsg] = useState('');
    const [resendEmailTimer, setResendEmailTimer] = useState(0);
    const [emailOtpSent, setEmailOtpSent] = useState(false);

    // --- Mobile State ---
    const [mobileOtp, setMobileOtp] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [mobileLoading, setMobileLoading] = useState(false);
    const [mobileError, setMobileError] = useState('');
    const [mobileMsg, setMobileMsg] = useState('');
    const [resendMobileTimer, setResendMobileTimer] = useState(0);
    const [mobileOtpSent, setMobileOtpSent] = useState(false);
    const [needsMobileInput, setNeedsMobileInput] = useState(false); // If placeholder or user wants to edit

    const [confirmationResult, setConfirmationResult] = useState(null);

    // --- Redirect Logic ---
    useEffect(() => {
        if (isEmailVerified && isMobileVerified) {
            const t = setTimeout(() => navigate('/dashboard'), 1500);
            return () => clearTimeout(t);
        }
    }, [isEmailVerified, isMobileVerified, navigate]);

    // Initialize Mobile preference
    useEffect(() => {
        if (!isMobileVerified && user) {
            const isPlaceholder = !user.mobile || user.mobile.startsWith('G-') || user.mobile === '0000000000';
            if (isPlaceholder) setNeedsMobileInput(true);
        }
    }, [isMobileVerified, user]);

    // --- Timers ---
    useEffect(() => {
        let interval = null;
        if (resendEmailTimer > 0) {
            interval = setInterval(() => setResendEmailTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendEmailTimer]);

    useEffect(() => {
        let interval = null;
        if (resendMobileTimer > 0) {
            interval = setInterval(() => setResendMobileTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendMobileTimer]);


    // --- Email Handlers ---
    const handleSendEmailOTP = async () => {
        if (resendEmailTimer > 0) return;
        setEmailLoading(true);
        setEmailError('');
        setEmailMsg('');
        const res = await resendOTP(emailAddress);
        if (res.success) {
            setEmailMsg('OTP sent to your email!');
            setEmailOtpSent(true);
            setResendEmailTimer(60);
        } else {
            setEmailError(res.message);
        }
        setEmailLoading(false);
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setEmailLoading(true);
        setEmailError('');

        const res = await verifyOTP({ email: emailAddress, otp: emailOtp });
        if (!res.success) {
            setEmailError(res.message || 'Verification failed');
        }
        // Success handled by context update
        setEmailLoading(false);
    };

    // --- reCAPTCHA Setup ---
    const windowVerifierRef = useRef(null);

    const setupRecaptcha = async () => {
        try {
            // 1. Mandatory Cleanup
            if (window.recaptchaVerifier) {
                try { window.recaptchaVerifier.clear(); } catch(e){}
                window.recaptchaVerifier = null;
            }

            const container = document.getElementById('recaptcha-container-verify');
            if (container) container.innerHTML = '';

            // 2. Official Global Initialization
            // size: 'invisible' runs in the background
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-verify', {
                'size': 'invisible',
                'callback': () => { console.log("reCAPTCHA verified"); }
            });

            await window.recaptchaVerifier.render();
            return window.recaptchaVerifier;
        } catch (err) {
            console.error("reCAPTCHA init failed:", err);
            throw err;
        }
    };

    // --- Mobile Handlers ---
    const handleSendMobileOTP = async (customMobile) => {
        if (isMobileVerified || mobileLoading) return;
        if (resendMobileTimer > 0 && !customMobile) return;

        setMobileLoading(true);
        setMobileError('');
        setMobileMsg('');

        try {
            const finalMobile = customMobile || user?.mobile;
            if (!finalMobile || finalMobile.length < 10) {
                setNeedsMobileInput(true);
                setMobileLoading(false);
                return;
            }

            // 0. Strict Normalization for Firebase (+91XXXXXXXXXX)
            const cleanNumber = finalMobile.replace(/\D/g, '').slice(-10);
            const formattedMobile = `+91${cleanNumber}`;

            // Build fresh verifier
            const verifier = await setupRecaptcha();

            const result = await signInWithPhoneNumber(auth, formattedMobile, verifier);
            setConfirmationResult(result);
            setMobileMsg('OTP sent to your mobile!');
            setMobileOtpSent(true);
            setNeedsMobileInput(false);
            setResendMobileTimer(60);
        } catch (err) {
            console.error("Firebase Mobile OTP Fail:", err);
            setMobileError(err.message || 'Failed to send SMS');
        } finally {
            setMobileLoading(false);
        }
    };

    const handleSubmitMobile = async (e) => {
        e.preventDefault();
        if (!mobileNumber || mobileNumber.length < 10) {
            setMobileError('Enter valid mobile number');
            return;
        }
        await handleSendMobileOTP(mobileNumber);
    };

    const handleVerifyMobile = async (e) => {
        e.preventDefault();
        setMobileLoading(true);
        setMobileError('');

        if (mobileOtp.length < 6) {
            setMobileError('Enter valid 6-digit OTP');
            setMobileLoading(false);
            return;
        }

        try {
            if (!confirmationResult) {
                setMobileError("Please request OTP first");
                setMobileLoading(false);
                return;
            }

            const result = await confirmationResult.confirm(mobileOtp);
            const idToken = await result.user.getIdToken();

            // Sync with backend
            const response = await api.post('/auth/verify-mobile-firebase', { idToken });

            if (response.data.success) {
                setMobileMsg("Mobile verified successfully!");
                // The useEffect for redirection will trigger because useAuth user object should refresh
                // However, we might need a window.location.reload() or refresh call if AuthContext isn't polling fast enough
                // Let's rely on the context reload if possible, or force it
                setTimeout(() => window.location.reload(), 1000);
            }
        } catch (err) {
            console.error("Mobile OTP Verification Fail:", err);
            setMobileError('Invalid OTP or verification expired');
        } finally {
            setMobileLoading(false);
        }
    };


    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">


                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900">
                        Account Verification
                    </h2>
                    <p className="mt-2 text-slate-600">
                        Please verify your contact details to secure your account.
                    </p>
                </div>

                <div className="max-w-md w-full space-y-6">

                    {/* --- EMAIL SECTION --- */}
                    <div className={`bg-white rounded-2xl shadow-md border ${isEmailVerified ? 'border-green-200' : 'border-slate-200'} p-6 transition-all`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isEmailVerified ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {isEmailVerified ? <CheckCircle size={24} /> : <Mail size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Email Verification</h3>
                                    <p className="text-sm text-slate-500">{emailAddress || 'Checking...'}</p>
                                </div>
                            </div>
                            {isEmailVerified && <span className="text-green-600 font-medium text-sm">Verified</span>}
                        </div>

                        {!isEmailVerified && (
                            <div className="space-y-4">
                                {emailError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{emailError}</div>}
                                {emailMsg && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{emailMsg}</div>}

                                {!emailOtpSent ? (
                                    <button
                                        onClick={handleSendEmailOTP}
                                        disabled={emailLoading}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2"
                                    >
                                        {emailLoading ? <Loader2 className="animate-spin" size={18} /> : 'Send OTP to Email'}
                                    </button>
                                ) : (
                                    <form onSubmit={handleVerifyEmail} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Enter OTP sent to email</label>
                                            <input
                                                type="text"
                                                maxLength="6"
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest font-mono"
                                                placeholder="XXXXXX"
                                                value={emailOtp}
                                                onChange={(e) => setEmailOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={emailLoading}
                                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 flex justify-center items-center gap-2"
                                        >
                                            {emailLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Email'}
                                        </button>

                                        <div className="text-center text-sm">
                                            <button type="button" onClick={handleSendEmailOTP} disabled={resendEmailTimer > 0} className={resendEmailTimer > 0 ? "text-slate-400" : "text-blue-600 hover:underline"}>
                                                {resendEmailTimer > 0 ? `Resend in ${resendEmailTimer}s` : "Resend OTP"}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>


                    {/* --- MOBILE SECTION --- */}
                    <div className={`bg-white rounded-2xl shadow-md border ${isMobileVerified ? 'border-green-200' : 'border-slate-200'} p-6 transition-all`}>

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isMobileVerified ? 'bg-green-100 text-green-600' : 'bg-green-100 text-green-600'}`}>
                                        {isMobileVerified ? <CheckCircle size={24} /> : <Smartphone size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">Mobile Verification</h3>
                                        <p className="text-sm text-slate-500">
                                            {isMobileVerified ? (user?.mobile) : (needsMobileInput ? 'Enter number' : (user?.mobile || 'Pending...'))}
                                        </p>
                                    </div>
                                </div>
                                {isMobileVerified && <span className="text-green-600 font-medium text-sm">Verified</span>}
                            </div>

                            {!isMobileVerified && (
                                <div className="space-y-4">
                                    {/* reCAPTCHA Container - MUST be always present in DOM */}
                                    <div id="recaptcha-container-verify" className="flex justify-center my-2"></div>

                                    {mobileError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{mobileError}</div>}
                                    {mobileMsg && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{mobileMsg}</div>}

                                    {needsMobileInput ? (
                                        <form onSubmit={handleSubmitMobile}>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="tel"
                                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                                    placeholder="10 digit mobile"
                                                    value={mobileNumber}
                                                    onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={mobileLoading}
                                                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-70 flex items-center justify-center"
                                                >
                                                    {mobileLoading ? <Loader2 className="animate-spin" size={18} /> : 'Send'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            {!mobileOtpSent ? (
                                                <button
                                                    onClick={() => handleSendMobileOTP()}
                                                    disabled={mobileLoading}
                                                    className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-70 flex justify-center items-center gap-2"
                                                >
                                                    {mobileLoading ? <Loader2 className="animate-spin" size={18} /> : 'Send Mobile OTP'}
                                                </button>
                                            ) : (
                                                <form onSubmit={handleVerifyMobile} className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-700 mb-1">Enter Mobile OTP</label>
                                                        <input
                                                            type="text"
                                                            maxLength="6"
                                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-center tracking-widest font-mono"
                                                            placeholder="XXXXXX"
                                                            value={mobileOtp}
                                                            onChange={(e) => setMobileOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        disabled={mobileLoading}
                                                        className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-70 flex justify-center items-center gap-2"
                                                    >
                                                        {mobileLoading ? <Loader2 className="animate-spin" size={18} /> : 'Verify Mobile'}
                                                    </button>

                                                    <div className="text-center text-sm flex justify-center gap-4">
                                                        <button type="button" onClick={() => handleSendMobileOTP()} disabled={resendMobileTimer > 0} className={resendMobileTimer > 0 ? "text-slate-400" : "text-green-600 hover:underline"}>
                                                            {resendMobileTimer > 0 ? `Resend in ${resendMobileTimer}s` : "Resend OTP"}
                                                        </button>
                                                        <button type="button" onClick={() => { setNeedsMobileInput(true); setMobileOtpSent(false); }} className="text-slate-500 hover:text-slate-700 underline">
                                                            Change Number
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center pt-4">
                        <button onClick={() => { logout(); navigate('/login'); }} className="text-slate-500 hover:text-red-600 text-sm flex items-center justify-center gap-1 mx-auto">
                            <LogOut size={14} /> Cancel & Logout
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
};

export default UnifiedVerification;
