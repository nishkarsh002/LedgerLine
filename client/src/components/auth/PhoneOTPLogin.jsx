import React, { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Phone, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../api/axios';

const PhoneOTPLogin = ({ onAuthSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          console.log("Invisible reCAPTCHA verified successfully");
        }
      });
    }
  };

  const sendOTP = async (e) => {
    e.preventDefault();
    setError("");
    
    // Strict Normalization for Firebase (+91XXXXXXXXXX)
    const cleanNumber = phoneNumber.replace(/\D/g, '').slice(-10);
    const finalFormattedNumber = cleanNumber.length === 10 ? `+91${cleanNumber}` : phoneNumber;
    
    setLoading(true);

    try {
      // 1. Check if user exists in our DB first
      const checkRes = await api.post('/auth/check-user', { identifier: cleanNumber });
      
      if (!checkRes.data.exists) {
        setError(checkRes.data.message || "You are a new user, please register yourself first.");
        setLoading(false);
        return;
      }

      // 2. If user exists, proceed with Firebase OTP
      console.log(`📡 Sending OTP to Firebase: ${finalFormattedNumber}`);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, finalFormattedNumber, appVerifier);
      setConfirmationResult(result);
      setStep('otp');
      console.log("OTP Sent Successfully");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.message || "Failed to send OTP. Please check the number.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseUser = result.user;
      console.log("Firebase Auth User:", firebaseUser);
      
      if (onAuthSuccess) {
        await onAuthSuccess(firebaseUser);
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div id="recaptcha-container"></div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={20} className="flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={sendOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+919876543210"
                required
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              We'll send a 6-digit code via SMS to verify your number.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Send OTP
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOTP} className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-slate-700">
                Enter Verification Code
              </label>
              <button 
                type="button"
                onClick={() => setStep('phone')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Change Number
              </button>
            </div>
            <div className="relative">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Ex: 123456"
                required
                maxLength={6}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-mono tracking-[0.5em] text-lg text-center"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verify OTP
                <CheckCircle2 className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default PhoneOTPLogin;
