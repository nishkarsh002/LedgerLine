import {
  ShieldCheck,
  Lock,
  FileText,
  Calculator,
  MessageSquare,
 
} from "lucide-react";

const Footer = () => {
  return (
    <>
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
    </>
  )
}

export default Footer;