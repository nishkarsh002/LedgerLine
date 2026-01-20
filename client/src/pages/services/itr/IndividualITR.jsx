import { Link, useNavigate } from "react-router-dom";
import { User,  ArrowRight } from "lucide-react";
import Navbar from "../../frontend/Navbar";
import Footer from "../../frontend/Footer";
import { individualServices } from "../../../data/servicesData";
import { useAuth } from "../../../context/AuthContext";

const IndividualITR = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleChoosePlan = (serviceId) => {
    if (isLoggedIn) {
      navigate(`/services/userform?service=${serviceId}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              Individual ITR Filing Services
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose the perfect ITR filing service based on your income sources
              and requirements
            </p>
          </div>

          {/* Service Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {individualServices.map((service, index) => {
              const ServiceIcon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <ServiceIcon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 mb-4">{service.description}</p>
                    <div className="text-3xl font-extrabold text-slate-900 mb-6">
                      {service.price}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-between row gap-2">
                    <Link
                       to={`/services/${service.id}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 group"
                    >
                      View Plan
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <button
                     onClick={() => handleChoosePlan(service.id)}
                      className="w-full bg-gradient-to-r from-blue-600
                      to-purple-600 text-white py-4 px-6 rounded-2xl font-bold
                      hover:from-blue-700 hover:to-purple-700 transition-all
                      flex items-center justify-center gap-2 group" > Buy Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Need Help Choosing?
              </h3>
              <p className="text-slate-600 mb-6">
                Not sure which ITR form is right for you? Our tax experts can
                help you choose the perfect plan.
              </p>
              <Link
                to="/login"
                className="inline-block bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-colors"
              >
                Get Expert Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndividualITR;
