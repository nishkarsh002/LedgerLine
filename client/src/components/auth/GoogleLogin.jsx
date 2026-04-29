import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { Chrome, Loader2 } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";


const GoogleLogin = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      console.log("Google Auth Success:", firebaseUser);
      
      if (onAuthSuccess) {
        await onAuthSuccess(firebaseUser);
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      <button
        type="button"
        disabled={loading}
        onClick={handleGoogleLogin}
        className="w-full bg-white border border-slate-300 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all flex items-center justify-center gap-3 shadow-sm border-opacity-60 disabled:opacity-70"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <FcGoogle />
            Continue with Google
          </>
        )}
      </button>
    </div>
  );
};

export default GoogleLogin;
