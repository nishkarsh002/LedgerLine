import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Shield, CheckCircle, FileText } from 'lucide-react';
import Navbar from '../../frontend/Navbar';

const GSTRegistration = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Receipt className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              GST Registration
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Quick and hassle-free GST registration for your business with expert guidance
            </p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Registration Services</h2>
                <ul className="space-y-4">
                  {[
                    "GST registration application",
                    "Document preparation & review",
                    "GSTIN certificate processing",
                    "Business activity classification",
                    "State-wise registration",
                    "Composition scheme guidance",
                    "Digital signature support",
                    "Post-registration compliance setup"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Required Documents</h2>
                <ul className="space-y-4">
                  {[
                    "PAN card of business/proprietor",
                    "Aadhaar card",
                    "Business registration certificate",
                    "Address proof of business",
                    "Bank account details",
                    "Digital signature (if applicable)",
                    "Authorized signatory details"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="inline-block bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-colors"
              >
                Start GST Registration - ₹1,499
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 text-white mb-6">
                <FileText className="w-6 h-6" />
                <span className="text-2xl font-bold">FirstFiling</span>
              </div>
              <p className="text-sm leading-relaxed mb-6">
                India's leading cloud-based tax filing and business compliance platform.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="/services/salary-basic-itr" className="hover:text-white">Individual ITR</Link></li>
                <li><Link to="/services/gst-filing" className="hover:text-white">GST Filing</Link></li>
                <li><Link to="#" className="hover:text-white">Tax Planning</Link></li>
                <li><Link to="/services/gst-registration" className="hover:text-white">Business Registration</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="#" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="#" className="hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm">
                <li><Link to="#" className="hover:text-white">Help Center</Link></li>
                <li><Link to="#" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-white">Live Chat</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 text-center">
            <p className="text-sm">© 2025 FirstFiling. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GSTRegistration;