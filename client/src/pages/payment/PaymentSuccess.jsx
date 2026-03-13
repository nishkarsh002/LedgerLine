import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home, LayoutDashboard, FileText } from 'lucide-react';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(10);

    // Extract state
    const { transactionId, serviceId, purchaseId, planName } = location.state || {};

    // Determine redirect target
    const targetUrl = serviceId && purchaseId
        ? `/services/userform?service=${serviceId}&purchaseId=${purchaseId}`
        : '/dashboard';

    useEffect(() => {
        // If no state exists (e.g. direct access or back button), redirect away
        if (!transactionId) {
            navigate('/dashboard', { replace: true });
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(targetUrl, { replace: true });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, targetUrl, transactionId]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                <p className="text-slate-600 mb-6">
                    Thank you for your payment. You can now proceed to file your
                    <span className="font-semibold text-slate-800"> {planName || 'ITR'}</span>.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 inline-block w-full">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-1">Transaction ID</p>
                    <p className="text-slate-800 font-mono font-medium truncate">{transactionId || 'N/A'}</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(targetUrl, { replace: true })}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        <FileText size={18} />
                        Start Filing Now
                    </button>

                    <button
                        onClick={() => navigate('/dashboard', { replace: true })}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                        <LayoutDashboard size={18} />
                        Go to Dashboard
                    </button>

                    <p className="text-sm text-slate-500 mt-4">
                        Redirecting to filing page in <span className="font-bold text-blue-600">{countdown}</span> seconds...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
