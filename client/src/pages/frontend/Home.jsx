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
  ArrowRight,
} from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

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
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">

      {/* Navigation */}
      <Navbar />
      <main className="flex-1">

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 lg:pt-16 lg:overflow-hidden bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-blue-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ShieldCheck size={16} /> Trusted by Indian Taxpayers
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              File Your Income Tax Return{" "}
              <span className="text-blue-600">Easily & Accurately</span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              Salaried, Business & Capital Gains — Secure, expert-reviewed ITR
              filing for everyone. Don't risk notices, file with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link to="/services/individual" className="w-full sm:w-auto">
                <button className="animate-float w-full bg-blue-600 text-white px-10 py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(37,99,235,0.5)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.7)] hover:bg-blue-700 transition-all duration-300">
                  File ITR Now <ArrowRight size={20} />
                </button>
              </Link>
              <button className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-10 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-1">
                <PlayCircle size={20} /> Watch How it Works
              </button>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-10 grayscale opacity-60 animate-in fade-in duration-1000 delay-500">
              <div className="flex items-center gap-2 font-medium text-slate-600">
                <Lock size={18} /> SSL Secure
              </div>
              <div className="flex items-center gap-2 font-medium text-slate-600">
                <UserCheck size={18} /> CA Reviewed
              </div>
              <div className="flex items-center gap-2 font-medium text-slate-600">
                <ShieldCheck size={18} /> Data Encrypted
              </div>
            </div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-8 bg-slate-50/50 backdrop-blur-sm border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Get your taxes done in 3 simple steps without leaving your home.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-16">
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
              <div key={idx} className="relative group text-center px-4">
                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-blue-600 transition-all duration-300 transform group-hover:rotate-6 group-hover:scale-110 shadow-sm">
                  <span className="text-3xl font-bold text-blue-600 group-hover:text-white">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{item.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{item.desc}</p>
                {idx < 2 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-[2px] bg-gradient-to-r from-blue-100 to-transparent -ml-8 z-0"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ITR Auto-Suggester Widget */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50/50 rounded-[2.5rem] shadow-2xl shadow-blue-100/50 overflow-hidden border border-slate-100">
            <div className="bg-blue-600 p-12 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Calculator size={120} />
              </div>
              <h2 className="text-4xl font-bold mb-4 relative z-10">
                Which ITR should I file?
              </h2>
              <p className="text-xl opacity-90 relative z-10 max-w-xl mx-auto">
                Select your income sources to get an instant recommendation from our AI-powered engine.
              </p>
            </div>
            <div className="p-12">
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                {incomeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => toggleIncome(type.id)}
                    className={`px-8 py-3.5 rounded-2xl font-semibold transition-all duration-300 border-2 ${selectedIncome.includes(type.id)
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105"
                      : "bg-white text-slate-600 border-slate-100 hover:border-blue-200 hover:bg-slate-50"
                      }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSuggest}
                disabled={selectedIncome.length === 0}
                className="w-full bg-[#2563eb] text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Show My Correct ITR Form
              </button>

              {suggestedITR && (
                <div className="mt-10 p-8 bg-blue-50 border border-blue-200 rounded-3xl flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="bg-blue-500 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <p className="text-blue-900 font-extrabold text-2xl mb-1">
                      You should file {suggestedITR}
                    </p>
                    <p className="text-blue-700 text-lg">
                      Our plans start from just <span className="font-bold">₹499</span> for this category.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
              Choose Your Perfect Plan
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transparent pricing for every taxpayer. From simple salary returns to NRI & capital gain filings.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
            {/* Basic Plan */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                  <FileText className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Salary (Basic)</h3>
                <p className="text-slate-500 text-sm">For salaried individuals</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">₹599</span>
                  <span className="text-slate-400 ml-2 font-medium text-sm">/filing</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Up to ₹50 Lakhs income</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "ITR-1 (Sahaj) Filing",
                  "Form 16 Verification",
                  "80C, 80D Deductions",
                  "Bank Interest Reporting",
                  "One House Property",
                  "Refund Status Assistance",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/services/salary-basic-itr">
                <button className="w-full bg-[#2563eb] text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-900/10 text-sm">
                  Get Started
                </button>
              </Link>
            </div>

            {/* Premium Plan - Most Popular */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-blue-500 p-8 flex flex-col relative hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 lg:-mt-4 lg:mb-4 z-10">
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-max">
                <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-bold shadow-xl shadow-blue-200 uppercase tracking-widest whitespace-nowrap block">
                  Most Popular
                </span>
              </div>
              <div className="mb-6 mt-3">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
                  <Calculator className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Salary (Premium)</h3>
                <p className="text-slate-500 text-sm">Multiple income sources</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">₹999</span>
                  <span className="text-slate-400 ml-2 font-medium text-sm">/filing</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Salary + investments + property</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "ITR-2 Filing",
                  "Salary + House Property",
                  "Capital Gain Support",
                  "Dividend & Interest Income",
                  "Foreign Assets Disclosure",
                  "Deduction Optimization",
                  "Expert Consultation",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-bold text-sm">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/services/salary-premium">
                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Choose Premium
                </button>
              </Link>
            </div>

            {/* Capital Gain Plan */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                  <Calculator className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Capital Gain</h3>
                <p className="text-slate-500 text-sm">Stocks, MF & property gains</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">₹1,499</span>
                  <span className="text-slate-400 ml-2 font-medium text-sm">/filing</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">LTCG, STCG & F&O</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "LTCG & STCG Computation",
                  "Equity & Mutual Fund Gains",
                  "Intraday & F&O Support",
                  "Property Sale Gains",
                  "Capital Loss Set-off",
                  "AIS/TIS Reconciliation",
                  "Tax Planning Support",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/services/capital-gain">
                <button className="w-full bg-[#2563eb] text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 text-sm">
                  Get Started
                </button>
              </Link>
            </div>

            {/* NRI / Foreign Income Plan */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5">
                  <MessageSquare className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Foreign / NRI</h3>
                <p className="text-slate-500 text-sm">NRIs & foreign income</p>
              </div>
              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">₹1,999</span>
                  <span className="text-slate-400 ml-2 font-medium text-sm">/filing</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">DTAA, FBAR & FEMA</p>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {[
                  "NRI ITR Filing",
                  "Foreign Salary Income",
                  "DTAA Benefit Claim",
                  "Foreign Tax Credit (FTC)",
                  "Schedule FA Reporting",
                  "FBAR Compliance Guidance",
                  "FEMA Basic Compliance",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <span className="text-slate-600 text-sm font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/services/nri-income">
                <button className="w-full bg-[#2563eb] text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10 text-sm">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6">
              What Clients Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Join thousands of satisfied taxpayers who trust Powerfilling for their tax needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 ">
            {[
              {
                name: "Priya Sharma",
                role: "Software Engineer",
                company: "Tech Innovations Pvt Ltd",
                rating: 5,
                text: "Powerfilling made my tax filing incredibly simple! The CA support was exceptional, and I got my refund processed faster than ever. Their platform is user-friendly and the step-by-step guidance helped me understand every aspect of my tax filing.",
                avatar: "PS"
              },
              {
                name: "Rajesh Kumar",
                role: "Business Owner",
                company: "Kumar Enterprises",
                rating: 5,
                text: "As a business owner with multiple income sources, I was worried about filing my ITR correctly. Powerfilling's premium plan covered everything - from my business income to capital gains. The dedicated CA assigned to me was knowledgeable and always available for queries.",
                avatar: "RK"
              },
              {
                name: "Anita Patel",
                role: "Freelance Designer",
                company: "Creative Solutions",
                rating: 5,
                text: "The presumptive taxation support for my freelancing income was exactly what I needed. Powerfilling's team understood my unique situation and filed my ITR perfectly. The pricing is transparent and the service is top-notch. Highly recommended!",
                avatar: "AP"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-slate-50/50 rounded-[2rem] p-10 relative hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-black">
                <div className="flex items-center mb-8">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mr-5 shadow-lg shadow-blue-100">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-5 h-5 text-yellow-400 mr-1">
                      ⭐
                    </div>
                  ))}
                </div>

                <p className="text-slate-600 leading-relaxed italic text-lg mb-4">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <div className="flex justify-center items-center gap-3 mb-6 bg-blue-50/50 w-fit mx-auto px-6 py-3 rounded-full border border-blue-100">
              <span className="text-slate-900 font-bold">⭐⭐⭐⭐⭐ Trusted by Professionals, Businesses & Individuals Across India</span>
            </div>
            <p className="text-slate-500 font-medium tracking-wide">
              Delivering Reliable Tax, GST & Compliance Solutions with Expert Support
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-slate-50/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center text-slate-900 mb-16">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What documents are required for ITR filing?",
                a: "You'll typically need Form 16 (for salaried), bank statements, Form 26AS, AIS/TIS, investment proofs, and details of any other income sources like rent, capital gains, or freelance income.",
              },
              {
                q: "How long does the filing process take?",
                a: "Once you submit your details and documents, our CA team typically completes the filing within 1–3 working days. Simple salary returns can be done even faster.",
              },
              {
                q: "Can I revise my filed return?",
                a: "Yes, you can file a revised return before the end of the relevant assessment year. Our team can assist you with revisions if any corrections are needed.",
              },
              {
                q: "Do you handle notices from Income Tax Department?",
                a: "Yes, we provide support for responding to income tax notices. Our CAs will review the notice, prepare the response, and guide you through the process.",
              },
              {
                q: "Is CA support available?",
                a: "Every paid plan includes a dedicated Chartered Accountant to review your filing, answer queries, and ensure accuracy.",
              },
              {
                q: "Do you support crypto and F&O taxation?",
                a: "Yes, we handle taxation for cryptocurrency gains and Futures & Options (F&O) trading, including proper classification and computation under the Income Tax Act.",
              },
              {
                q: "Can NRIs file returns with you?",
                a: "Absolutely. We assist NRIs with filing Indian income tax returns, including income from rent, capital gains, interest, and other Indian sources.",
              },
              {
                q: "Will I get post-filing support?",
                a: "Yes, we provide post-filing support including refund status tracking, intimation under Section 143(1), and assistance with any follow-up queries from the tax department.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group border border-slate-200 bg-white rounded-2xl p-6 hover:bg-slate-50 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              >
                <summary className="flex justify-between items-center font-bold text-slate-800 list-none">
                  {faq.q}
                  <div className="bg-slate-100 p-1 rounded-lg group-open:bg-blue-600 group-open:text-white transition-colors">
                    <ChevronDown
                      size={20}
                      className="group-open:rotate-180 transition-transform"
                    />
                  </div>
                </summary>
                <p className="mt-4 text-slate-600 leading-relaxed text-lg border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-2">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>



      </main>
      {/* Footer */}
      <Footer />

      {/* Floating Action Button */}
      {/* <button className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all z-50">
        <MessageSquare size={24} />
      </button> */}
    </div>
  );
};

export default Home;