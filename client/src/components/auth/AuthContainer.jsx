import React, { useState } from 'react';
import PhoneOTPLogin from './PhoneOTPLogin';
import GoogleLogin from './GoogleLogin';
import EmailLogin from './EmailLogin';
import SignupForm from './SignupForm';
import { Smartphone, Mail, Globe, ShieldCheck, ArrowLeft } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const AuthContainer = ({ onAuthSuccess, externalError }) => {
  const [method, setMethod] = useState('google'); // 'phone', 'google', 'email'
  const [isSignup, setIsSignup] = useState(false);

  const tabs = [
    { id: 'google', label: 'Google', icon: <FcGoogle /> },
    { id: 'phone', label: 'Mobile OTP', icon: <Smartphone size={18} /> },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Powerfilling</h1>
        <p className="text-blue-200">The safest way to manage your taxes</p>
      </div>

      {/* Auth Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {externalError && !isSignup && (
          <div className="m-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-600 font-bold">!</div>
            <div>
              <p className="text-sm font-bold tracking-tight">{externalError}</p>
              {!isSignup && (
                <button 
                  onClick={() => setIsSignup(true)}
                  className="text-xs font-bold underline hover:no-underline"
                >
                  Create an account now →
                </button>
              )}
            </div>
          </div>
        )}

        {!isSignup ? (
          <div className="p-1.5 bg-slate-100 flex gap-1 m-4 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setMethod(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${method === tab.id
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <button
              onClick={() => setIsSignup(false)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-slate-700">Create Account</span>
          </div>
        )}

        <div className="px-8 pb-10 pt-4">
          {isSignup ? (
            <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
          ) : (
            <>
              {method === 'phone' && <PhoneOTPLogin onAuthSuccess={onAuthSuccess} />}
              {method === 'google' && <GoogleLogin onAuthSuccess={onAuthSuccess} />}
            </>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignup(!isSignup)}
                className="text-blue-600 font-bold hover:underline"
              >
                {isSignup ? "Login here" : "Sign up now"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
