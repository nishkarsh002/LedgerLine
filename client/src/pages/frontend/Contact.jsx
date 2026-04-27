import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Mail, Phone, MapPin, Send, Clock, ShieldCheck, Users } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const serviceOptions = [
  "Income Tax Filing",
  "GST Registration and Filing",
  "TDS and TCS Compliance",
  "Business Tax Consultancy",
  "Tax Planning and Advisory",
  "Tax Audit and Other",
];

// Rate limiting config — max 3 submissions per 10 minutes (stored in localStorage)
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

const checkRateLimit = () => {
  const now = Date.now();
  const raw = localStorage.getItem("cf_submissions");
  const timestamps = raw ? JSON.parse(raw) : [];
  // Keep only timestamps within the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    const retryAfterMs = RATE_LIMIT_WINDOW_MS - (now - recent[0]);
    const retryMins = Math.ceil(retryAfterMs / 60000);
    return { allowed: false, retryMins };
  }
  recent.push(now);
  localStorage.setItem("cf_submissions", JSON.stringify(recent));
  return { allowed: true };
};

// Field validation rules
const validate = (form) => {
  const errors = {};

  const name = form.fullName.trim();
  if (!name) {
    errors.fullName = "Full name is required.";
  } else if (name.length < 2) {
    errors.fullName = "Name must be at least 2 characters.";
  } else if (!/^[a-zA-Z\s.'-]+$/.test(name)) {
    errors.fullName = "Name contains invalid characters.";
  }

  const phone = form.phone.trim();
  if (!phone) {
    errors.phone = "Phone number is required.";
  } else if (!/^[+]?[\d\s\-()]{7,15}$/.test(phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  const email = form.email.trim();
  if (!email) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.service) {
    errors.service = "Please select a service.";
  }

  const message = form.message.trim();
  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.length > 1000) {
    errors.message = "Message must be under 1000 characters.";
  }

  return errors;
};

const inputClass = (hasError) =>
  `w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
    hasError
      ? "border-red-400 focus:ring-red-400 bg-red-50"
      : "border-slate-200 focus:ring-blue-500"
  }`;

const Contact = () => {
  const formRef = useRef(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Field validation
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // Rate limiting
    const { allowed, retryMins } = checkRateLimit();
    if (!allowed) {
      setError(`Too many submissions. Please try again in ${retryMins} minute${retryMins > 1 ? "s" : ""}.`);
      return;
    }

    setLoading(true);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setSubmitted(true);
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-3">Contact Us</h1>
            <p className="text-slate-600 text-lg">
              Have questions? We're here to help. Reach out and we'll get back to you shortly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Left Column */}
            <div className="space-y-6">

              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Phone className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Phone</p>
                    <p className="text-slate-600 text-sm">+91 97852 02585</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Mail className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Email</p>
                    <p className="text-slate-600 text-sm">support@powerfilling.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <MapPin className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Address</p>
                    <p className="text-slate-600 text-sm">
                      Jtm Mall, FF25, Jagatpura Rd, near Jagatpura Flyover, Model Town,
                      Malviya Nagar, Jaipur, Rajasthan 302017
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <Clock className="text-blue-600 w-5 h-5" />
                  </div>
                  <p className="font-semibold text-slate-800">Business Hours</p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span className="font-medium text-slate-700">10 am – 7 pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-medium text-slate-700">10 am – 4 pm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium text-red-500">Closed</span>
                  </div>
                </div>
              </div>

              {/* Why Choose Powerfiling */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Why Choose Powerfiling?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2.5 rounded-xl">
                      <Users className="text-green-600 w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 text-sm">Expert Advisors</p>
                      <p className="text-slate-500 text-xs">Experienced professionals guiding you at every step.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2.5 rounded-xl">
                      <ShieldCheck className="text-green-600 w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 text-sm">100% Secure</p>
                      <p className="text-slate-500 text-xs">Your data is safe and handled with complete confidentiality.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column — Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <Send className="text-green-600 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                  <p className="text-slate-600 text-sm">We'll respond within 1 business day.</p>
                </div>
              ) : (
                <>
                  <div className="mb-5">
                    <h2 className="text-lg font-bold text-slate-800">Send us a Message</h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Fill in the details below and we'll respond within 1 business day.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} ref={formRef} className="space-y-4" noValidate>

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={inputClass(fieldErrors.fullName)}
                      />
                      {fieldErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className={inputClass(fieldErrors.phone)}
                      />
                      {fieldErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={inputClass(fieldErrors.email)}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                      )}
                    </div>

                    {/* Service */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Service Required</label>
                      <select
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        className={`${inputClass(fieldErrors.service)} bg-white text-slate-700`}
                      >
                        <option value="" disabled>Select a service</option>
                        {serviceOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      {fieldErrors.service && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.service}</p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Message
                        <span className="text-slate-400 font-normal ml-1">
                          ({form.message.length}/1000)
                        </span>
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        maxLength={1000}
                        className={`${inputClass(fieldErrors.message)} resize-none`}
                      />
                      {fieldErrors.message && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.message}</p>
                      )}
                    </div>

                    {/* Global error (rate limit / send failure) */}
                    {error && (
                      <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
