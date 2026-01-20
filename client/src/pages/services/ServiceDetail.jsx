import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, FileText, Clock, Shield } from 'lucide-react';
import Navbar from '../frontend/Navbar';
import Footer from '../frontend/Footer';
import { individualServices, businessServices, registrationServices, otherServices } from '../../data/servicesData';
import { useAuth } from '../../context/AuthContext';

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  // Find service in all categories
  const allServices = [
    ...individualServices,
    ...businessServices, 
    ...registrationServices,
    ...otherServices
  ];

  console.log("all the data " , allServices);
  
  const service = allServices.find(s => s.id === serviceId);

  const handleStartFiling = () => {
    if (isLoggedIn) {
      navigate(`/services/userform?service=${serviceId}`);
    } else {
      navigate('/login');
    }
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 mb-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className={`w-20 h-20 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                  <ServiceIcon className={`w-10 h-10 ${service.iconColor}`} />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
                  {service.title}
                </h1>
                <p className="text-xl text-slate-600 mb-6">
                  {service.description}
                </p>
                <div className="text-4xl font-extrabold text-slate-900 mb-8">
                  {service.price}
                </div>
                <button
                  onClick={handleStartFiling}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all group"
                >
                  Start Filing Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">What's Included</h3>
                <ul className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
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
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Service Overview</h3>
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
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Documents Required</h3>
                <p className="text-slate-600 mb-6">Please keep these documents ready for smooth processing:</p>
                
                <ul className="space-y-3">
                  {service.detailContent.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Process & Timeline */}
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Process & Timeline</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Document Collection</h4>
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
                  
                  <div className="mt-6 p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-2 text-green-700">
                      <Shield className="w-4 h-4" />
                      <span className="font-semibold text-sm">Completion: 3-5 business days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust FirstFiling for their tax needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartFiling}
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-colors"
              >
                Start Filing Now - {service.price}
              </button>
              <Link
                to="/"
                className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-blue-600 transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetail;