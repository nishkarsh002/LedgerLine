import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, FileText, Clock, Shield, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navbar from '../frontend/Navbar';
import Footer from '../frontend/Footer';
import { individualServices, businessServices, registrationServices, otherServices } from '../../data/servicesData';
import { useAuth } from '../../context/AuthContext';
import { planMapping } from '../../data/planMapping';
import api from '../../api/axios';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [loading, setLoading] = useState(false);
  const [planError, setPlanError] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  // State for existing purchase
  const [hasActivePurchase, setHasActivePurchase] = useState(false);
  const [activePurchaseId, setActivePurchaseId] = useState(null);

  // Find service in all categories
  const allServices = [
    ...individualServices,
    ...businessServices,
    ...registrationServices,
    ...otherServices
  ];

  const service = allServices.find(s => s.id === serviceId);

  useEffect(() => {
    const fetchPlanAndStatus = async () => {
      if (!serviceId) return;

      setLoading(true);
      try {
        const mappedPlan = planMapping[serviceId];
        if (!mappedPlan) {
          console.warn(`No plan mapping found for service: ${serviceId}`);
          setLoading(false);
          return;
        }

        // 1. Fetch Plan Details
        const { data } = await api.get('/plans');
        let matchedPlan = null;

        if (data.success) {
          matchedPlan = data.data.find(p => p.name === mappedPlan.name);
          if (matchedPlan) {
            setSelectedPlan(matchedPlan);
          } else {
            console.warn(`Plan '${mappedPlan.name}' not found in backend.`);
            // Fallback: If backend plans are empty but valid mapping exists, maybe don't error out entirely?
            // But we need planId for payment. So we stick to "Plan Unavailable" if not found.
            // Exception: If user already bought it, maybe we don't strictly need plan object for checking purchase?
            // But we need plan._id to check purchase status.
          }
        }

        // 2. Check Active Purchase Status (Only if logged in and plan found)
        if (isLoggedIn && matchedPlan) {
          try {
            const statusRes = await api.get('/payments/check-status', {
              params: { planId: matchedPlan._id }
            });

            if (statusRes.data.success && statusRes.data.hasActivePlan) {
              setHasActivePurchase(true);
              setActivePurchaseId(statusRes.data.purchaseId);
            }
          } catch (statusErr) {
            console.error("Error checking purchase status:", statusErr.response || statusErr);
            // Allow continuing to payment if check fails, logic handles duplicate payments on backend too
          }
        }

      } catch (error) {
        console.error("Backend API Error:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: error.message,
          url: error.config?.url
        });
        setPlanError('Unable to load latest pricing. Using default rates.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlanAndStatus();
  }, [serviceId, isLoggedIn]);

  const handleStartFiling = () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/services/${serviceId}` } });
      return;
    }

    if (hasActivePurchase && activePurchaseId) {
      // Redirect directly to form
      navigate(`/services/userform?service=${serviceId}&purchaseId=${activePurchaseId}`);
      return;
    }

    if (!selectedPlan) {
      alert("The pricing plan for this service is currently unavailable. Please contact support.");
      return;
    }

    // Navigate to Payment Gateway
    navigate('/payment', {
      state: {
        serviceId,
        planId: selectedPlan._id,
        amount: selectedPlan.price,
        planName: selectedPlan.name
      }
    });
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Service Not Found</h1>
          <p className="text-slate-600">The requested service does not exist.</p>
          <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const ServiceIcon = service.icon;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mb-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-5`}>
                  <ServiceIcon className={`w-8 h-8 ${service.iconColor}`} />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                  {service.title}
                </h1>
                <p className="text-lg text-slate-600 mb-5">
                  {service.description}
                </p>
                <div className="text-3xl font-extrabold text-slate-900 mb-6">
                  {selectedPlan ? `₹${selectedPlan.price}` : service.price}
                </div>

                {planError && (
                  <div className="mb-4 p-3 bg-amber-50 text-amber-700 rounded-lg flex items-center gap-2 border border-amber-100 italic transition-all">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">{planError}</span>
                  </div>
                )}

                {hasActivePurchase && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800">Active Plan Found</h4>
                      <p className="text-sm text-green-700">You have already purchased this plan. Click below to continue filing.</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleStartFiling}
                  disabled={loading || (!selectedPlan && !hasActivePurchase)}
                  className="inline-flex items-center gap-3 bg-[#2563eb] text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Checking status...' : hasActivePurchase ? 'Continue Filing' : 'Start Filing Now'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">What's Included</h3>
                <ul className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Content - Only for services with detailContent */}
          {service.detailContent && (
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Overview */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Service Overview</h3>
                <p className="text-slate-600 mb-6">{service.detailContent.overview}</p>

                <h4 className="font-semibold text-slate-900 mb-3">Service Inclusions:</h4>
                <ul className="space-y-2">
                  {service.detailContent.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                      <span className="text-sm text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents Required */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Documents Required</h3>
                <p className="text-slate-600 mb-6">Please keep these documents ready for smooth processing:</p>

                <ul className="space-y-3">
                  {service.detailContent.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process & Timeline */}
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Process & Timeline</h3>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                    <div>
                      <p className="text-sm text-slate-600">Upload required documents</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Expert Review</h4>
                      <p className="text-sm text-slate-600">CA reviews and prepares return</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Filing & Submission</h4>
                      <p className="text-sm text-slate-600">ITR filed with income tax department</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700">
                      <Shield className="w-4 h-4" />
                      <span className="font-semibold text-sm">Completion: 3-5 business days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-[#2563eb] rounded-3xl p-10 text-center text-white shadow-xl shadow-blue-900/10">
            <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust FirstFiling for their tax needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartFiling}
                disabled={loading || (!selectedPlan && !hasActivePurchase)}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? 'Checking status...' : hasActivePurchase ? 'Continue Filing' : `Start Filing Now - ${selectedPlan ? '₹' + selectedPlan.price : service.price}`}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ServiceDetail;