import { Link } from "react-router-dom";
import {
  ChevronDown,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div>
        <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-blue-900 tracking-tight">
                FirstFiling
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <div className="group relative">
                <button className="flex items-center gap-1 font-medium text-slate-700 hover:text-blue-600">
                  Individual <ChevronDown size={16} />
                </button>
                <div className="absolute hidden group-hover:block w-48 bg-white shadow-xl rounded-lg border mt-2 py-2">
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50">
                    Salary ITR
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50">
                    Capital Gains
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50">
                    NRI Tax Filing
                  </a>
                </div>
              </div>
              <div className="group relative">
                <button className="flex items-center gap-1 font-medium text-slate-700 hover:text-blue-600">
                  Business <ChevronDown size={16} />
                </button>
                <div className="absolute hidden group-hover:block w-48 bg-white shadow-xl rounded-lg border mt-2 py-2">
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50">
                    GST Registration
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50">
                    Company Formation
                  </a>
                  <a href="#" className="block px-4 py-2 hover:bg-slate-50">
                    TDS Returns
                  </a>
                </div>
              </div>
              <a
                href="#"
                className="font-medium text-slate-700 hover:text-blue-600"
              >
                Plans
              </a>
              <button className="text-blue-600 font-semibold px-4 py-2">
                <Link to="/login">
                Login
                </Link>
              </button>
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all">
                Sign Up
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;