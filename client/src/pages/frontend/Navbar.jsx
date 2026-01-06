import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ChevronDown,
  Menu,
  X,
  User,
  Building2,
  FileCheck,
  Calculator,
  TrendingUp,
  Globe,
  Home,
  Coins,
  Users,
  Building,
  Briefcase,
  Receipt,
  CreditCard,
  Shield
} from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigationItems = [
    {
      title: "Income Tax Return",
      icon: <Calculator size={16} />,
      sections: [
        {
          title: "Individual",
          icon: <User size={14} />,
          items: [
            { name: "Salary (Basic) ITR", icon: <User size={12} />, path: "/services/salary-basic-itr" },
            { name: "Salary (Premium)", icon: <User size={12} />, path: "/services/salary-premium" },
            { name: "Capital Gain", icon: <TrendingUp size={12} />, path: "/services/capital-gain" },
            { name: "Foreign/NRI Income", icon: <Globe size={12} />, path: "/services/nri-income" }
          ]
        },
        {
          title: "Business",
          icon: <Building2 size={14} />,
          items: [
            { name: "Business & Profession", icon: <Briefcase size={12} />, path: "/services/business-profession" },
            { name: "F&O Trading", icon: <TrendingUp size={12} />, path: "/services/fo-trading" },
            { name: "House Property", icon: <Home size={12} />, path: "/services/house-property" },
            { name: "Crypto Trading", icon: <Coins size={12} />, path: "/services/crypto-trading" },
            { name: "HUF Filing", icon: <Users size={12} />, path: "/services/huf-filing" }
          ]
        }
      ]
    },
    {
      title: "Registration",
      icon: <FileCheck size={16} />,
      sections: [
        {
          title: "Business Registration",
          icon: <Building size={14} />,
          items: [
            { name: "GST Registration", icon: <Receipt size={12} />, path: "/services/gst-registration" },
            { name: "HUF Registration", icon: <Users size={12} />, path: "/services/huf-registration" },
            { name: "Company Registration", icon: <Building size={12} />, path: "/services/company-registration" },
            { name: "LLP Registration", icon: <Building2 size={12} />, path: "/services/llp-registration" }
          ]
        }
      ]
    },
    {
      title: "Other Filings",
      icon: <FileText size={16} />,
      sections: [
        {
          title: "Compliance Filings",
          icon: <Shield size={14} />,
          items: [
            { name: "GST Filing", icon: <Receipt size={12} />, path: "/services/gst-filing" },
            { name: "TDS Filing", icon: <CreditCard size={12} />, path: "/services/tds-filing" },
            { name: "PF & ESIC", icon: <Shield size={12} />, path: "/services/pf-esic" }
          ]
        }
      ]
    }
  ];

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-blue-900 tracking-tight">
              FirstFiling
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative group">
                <button 
                  className="flex items-center gap-2 px-4 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  onMouseEnter={() => setActiveDropdown(index)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.icon}
                  {item.title}
                  <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Mega Menu Dropdown */}
                <div 
                  className={`absolute top-full left-0 mt-2 w-96 bg-white shadow-2xl rounded-2xl border border-slate-200 transition-all duration-300 max-h-96 overflow-y-auto ${
                    activeDropdown === index ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                  }`}
                  onMouseEnter={() => setActiveDropdown(index)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </h3>
                    
                    <div className="space-y-6">
                      {item.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2 uppercase tracking-wide">
                            {section.icon}
                            {section.title}
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            {section.items.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                to={subItem.path}
                                className="flex items-center gap-3 p-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                                  {subItem.icon}
                                </div>
                                <span className="text-sm font-medium">{subItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Plans Link */}
            {/* <Link
              to="#pricing"
              className="px-4 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              Plans
            </Link> */}

            {/* Auth Buttons */}
            <Link
              to="/login"
              className="text-blue-600 font-semibold px-4 py-2 hover:bg-blue-50 rounded-lg transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/sign_up"
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="py-4 space-y-2">
            {navigationItems.map((item, index) => (
              <div key={index} className="border-b border-slate-100 pb-4 mb-4">
                <button
                  onClick={() => handleDropdownToggle(index)}
                  className="w-full flex items-center justify-between p-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${activeDropdown === index ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === index && (
                  <div className="mt-2 ml-4 space-y-3">
                    {item.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                          {section.icon}
                          {section.title}
                        </h4>
                        <div className="space-y-1 ml-4">
                          {section.items.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              className="flex items-center gap-2 p-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              {subItem.icon}
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="space-y-2 pt-4">
              <Link
                to="#pricing"
                className="block p-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
              >
                Plans
              </Link>
              <Link
                to="/login"
                className="block p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-semibold"
              >
                Login
              </Link>
              <Link
                to="/sign_up"
                className="block p-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;