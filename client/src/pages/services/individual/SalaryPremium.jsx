import React from 'react';
import { User, Star, CheckCircle } from 'lucide-react';

const SalaryPremium = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Salary (Premium) ITR Filing
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Comprehensive ITR filing for salaried professionals with multiple income sources and investments
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Premium Features</h2>
              <ul className="space-y-4">
                {[
                  "ITR-2 form filing",
                  "Multiple salary sources",
                  "House property income",
                  "Capital gains (LTCG/STCG)",
                  "Dividend income",
                  "Interest from deposits",
                  "Advanced deductions (80D, 80G, etc.)",
                  "Priority CA support",
                  "Tax planning consultation"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Who Should Choose This</h2>
              <ul className="space-y-4">
                {[
                  "Income above ₹50 lakhs",
                  "Multiple employers in a year",
                  "House property owners",
                  "Stock market investors",
                  "Mutual fund investors",
                  "Fixed deposit holders"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all">
              Start Premium Filing - ₹1,299
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryPremium;