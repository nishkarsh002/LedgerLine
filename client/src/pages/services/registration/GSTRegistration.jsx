import React from 'react';
import { Receipt, Shield, CheckCircle } from 'lucide-react';

const GSTRegistration = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
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
            <button className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-700 transition-colors">
              Start GST Registration - ₹1,499
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSTRegistration;