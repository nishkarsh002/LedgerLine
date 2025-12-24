import React, { useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  Lock,
  ChevronDown,
  PlayCircle,
  CheckCircle2,
  FileText,
  Calculator,
  MessageSquare,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import Navbar from "./Navbar";

const Home = () => {
  
  const [selectedIncome, setSelectedIncome] = useState([]);
  const [suggestedITR, setSuggestedITR] = useState(null);

  const incomeTypes = [
    { id: "salary", label: "Salary/Pension" },
    { id: "house", label: "House Property" },
    { id: "business", label: "Business/Profession" },
    { id: "capgains", label: "Capital Gains" },
    { id: "foreign", label: "Foreign Income" },
  ];

  const handleSuggest = () => {
    if (selectedIncome.length === 0) return;
    if (selectedIncome.includes("business")) setSuggestedITR("ITR-3 or ITR-4");
    else if (selectedIncome.includes("salary") && selectedIncome.length === 1)
      setSuggestedITR("ITR-1 (Sahaj)");
    else setSuggestedITR("ITR-2");
  };

  const toggleIncome = (id) => {
    setSelectedIncome((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full text-blue-700 text-sm font-semibold mb-6">
                <ShieldCheck size={16} /> Trusted by 1M+ Indian Taxpayers
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                File Your Income Tax Return{" "}
                <span className="text-blue-600">Easily & Accurately</span>
              </h1>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                Salaried, Business & Capital Gains — Secure, expert-reviewed ITR
                filing for everyone. Don't risk notices, file with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-all">
                  File ITR Now <ArrowRight size={20} />
                </button>
                <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-bold hover:bg-slate-50 flex items-center justify-center gap-2">
                  <PlayCircle size={20} /> Watch How it Works
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8 grayscale opacity-70">
                <div className="flex items-center gap-2">
                  <Lock size={18} /> SSL Secure
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck size={18} /> CA Reviewed
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} /> Data Encrypted
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-blue-600/10 absolute inset-0 rounded-3xl rotate-3 scale-105 -z-10"></div>
              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800"
                  alt="Dashboard Preview"
                  className="rounded-xl mb-6 shadow-sm"
                />
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                      Users
                    </p>
                    <p className="text-lg font-bold text-blue-600">500k+</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                      CAs
                    </p>
                    <p className="text-lg font-bold text-blue-600">200+</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">
                      Savings
                    </p>
                    <p className="text-lg font-bold text-blue-600">₹10Cr+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Get your taxes done in 3 simple steps without leaving your home.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Answer Questions",
                desc: "Fill out a simple form about your income sources and deductions.",
              },
              {
                step: "02",
                title: "Review Computation",
                desc: "Our algorithm and CAs calculate your tax liability and double-check errors.",
              },
              {
                step: "03",
                title: "File & e-Verify",
                desc: "We file your return instantly. Simply e-verify via Aadhaar OTP.",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative group text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 transition-colors">
                  <span className="text-2xl font-bold text-blue-600 group-hover:text-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ITR Auto-Suggester Widget */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-blue-600 p-8 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Which ITR should I file?
              </h2>
              <p className="opacity-90">
                Select your income sources to get an instant recommendation.
              </p>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-3 mb-8">
                {incomeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleIncome(type.id)}
                    className={`px-6 py-3 rounded-full font-medium transition-all border ${
                      selectedIncome.includes(type.id)
                        ? "bg-blue-600 text-white border-blue-600 shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSuggest}
                disabled={selectedIncome.length === 0}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Show My Correct ITR Form
              </button>

              {suggestedITR && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                  <div className="bg-green-500 p-2 rounded-full text-white">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <p className="text-green-800 font-bold text-lg">
                      You should file {suggestedITR}
                    </p>
                    <p className="text-green-700 text-sm">
                      Our plans start from ₹499 for this category.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Which ITR should I file?",
                a: "It depends on your income sources. Use our auto-suggester tool above for an instant answer!",
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. We use bank-grade 256-bit encryption and our systems are SSL secured.",
              },
              {
                q: "Can I file for previous years?",
                a: "Yes, you can file updated returns for previous financial years through our CA-assisted plans.",
              },
              {
                q: "Do you support capital gains?",
                a: "Yes, we handle complex computations for stocks, mutual funds, and property sales.",
              },
              {
                q: "Is CA help available?",
                a: "Every paid plan includes a dedicated Chartered Accountant to review your filing.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group border border-slate-200 rounded-2xl p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <summary className="flex justify-between items-center font-bold text-slate-800 list-none">
                  {faq.q}
                  <ChevronDown
                    size={20}
                    className="group-open:rotate-180 transition-transform"
                  />
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

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
                India's leading cloud-based tax filing and business compliance
                platform.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                  <Calculator size={18} />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white">
                  <MessageSquare size={18} />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Services</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Individual ITR
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    GST Filing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tax Planning
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Business Registration
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Tools</h4>
              <ul className="space-y-4 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    HRA Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Income Tax Calculator
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Compliance Calendar
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Tax Tips Widget
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm">
              © 2025 FirstFiling. All rights reserved. Designed for Indian
              Taxpayers.
            </p>
            <div className="flex gap-8 text-sm">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} /> ISO 27001 Certified
              </span>
              <span className="flex items-center gap-1">
                <Lock size={14} /> 256-bit Encrypted
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all z-50">
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

export default Home;