import React from 'react';
import { Briefcase, TrendingUp, CheckCircle } from 'lucide-react';

const BusinessProfession = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Business & Profession ITR Filing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive tax filing for business owners, professionals, and entrepreneurs
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Business Filing Services</h2>
              <ul className="space-y-4">
                {[
                  "ITR-3 or ITR-4 form filing",
                  "Business income computation",
                  "Professional income calculation",
                  "Presumptive taxation (44AD/44ADA)",
                  "Depreciation calculations",
                  "Business expense optimization",
                  "GST integration support",
                  "Advance tax planning",
                  "Audit requirement assessment"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Suitable For</h2>
              <ul className="space-y-4">
                {[
                  "Sole proprietors",
                  "Freelancers & consultants",
                  "Doctors & lawyers",
                  "Chartered accountants",
                  "Architects & engineers",
                  "Small business owners",
                  "Commission agents"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transition-colors">
              Start Business Filing - ₹2,999
            </button>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default BusinessProfession;