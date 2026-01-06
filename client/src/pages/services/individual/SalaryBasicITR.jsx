import React from 'react';
import { User, FileText, CheckCircle } from 'lucide-react';

const SalaryBasicITR = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Salary (Basic) ITR Filing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Simple and hassle-free ITR filing for salaried individuals with basic income sources
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h2>
              <ul className="space-y-4">
                {[
                  "ITR-1 (Sahaj) form filing",
                  "Salary income computation",
                  "Standard deduction optimization",
                  "80C deductions (up to ₹1.5 lakh)",
                  "HRA exemption calculation",
                  "Tax refund processing",
                  "Filing confirmation & acknowledgment"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Eligibility</h2>
              <ul className="space-y-4">
                {[
                  "Annual income up to ₹50 lakhs",
                  "Only salary income",
                  "No business or capital gains",
                  "No foreign income",
                  "Resident Indian taxpayer"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors">
              Start Filing - ₹799
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryBasicITR;