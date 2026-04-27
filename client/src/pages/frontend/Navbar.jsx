import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  ChevronDown,
  Menu,
  X,
  User,
  Building2,
  FileCheck,
  Calculator,
  Building,
  Receipt,
  CreditCard,
  Shield,
  Users,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    {
      title: "Income Tax Return",
      icon: <Calculator size={16} />,
      sections: [
        {
          // title: "ITR Filing Services",
          // icon: <User size={14} />,
          items: [
            {
              name: "Individual",
              icon: <User size={14} />,
              path: "/services/individual",
            },
            {
              name: "Business",
              icon: <Building2 size={14} />,
              path: "/services/business",
            },
          ],
        },
      ],
    },
    {
      title: "Registration",
      icon: <FileCheck size={16} />,
      sections: [
        {
          // title: "Business Registration",
          // icon: <Building size={14} />,
          items: [
            {
              name: "GST Registration",
              icon: <Receipt size={14} />,
              path: "/services/gst-registration",
            },
            {
              name: "HUF Registration",
              icon: <Users size={14} />,
              path: "/services/huf-registration",
            },
            {
              name: "Company Registration",
              icon: <Building size={14} />,
              path: "/services/company-registration",
            },
            {
              name: "LLP Registration",
              icon: <Building2 size={14} />,
              path: "/services/llp-registration",
            },
          ],
        },
      ],
    },
    {
      title: "Other Filings",
      icon: <FileText size={16} />,
      sections: [
        {
          // title: "Compliance Filings",
          // icon: <Shield size={14} />,
          items: [
            {
              name: "GST Filing",
              icon: <Receipt size={14} />,
              path: "/services/gst-filing",
            },
            {
              name: "TDS Filing",
              icon: <CreditCard size={14} />,
              path: "/services/tds-filing",
            },
            {
              name: "PF & ESIC",
              icon: <Shield size={14} />,
              path: "/services/pf-esic",
            },
          ],
        },
      ],
    },
    {
      title: "Contact Us",
      icon: <CreditCard size={14} />,
      path:"/contact",
    }
  ];

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-blue-900 tracking-tight">
              Powerfilling
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigationItems.map((item, index) => (
              <div key={index} className="relative group">
                {/* Plain link item (no dropdown) */}
                {!item.sections ? (
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                ) : (
                  <>
                    <button
                      className="flex items-center gap-2 px-4 py-2 font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      onMouseEnter={() => setActiveDropdown(index)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.icon}
                      {item.title}
                      <ChevronDown
                        size={16}
                        className="transition-transform group-hover:rotate-180"
                      />
                    </button>

                    {/* Mega Menu Dropdown */}
                    <div
                      className={`absolute top-full left-0 mt-1 w-max bg-white shadow-2xl rounded-2xl border border-slate-200 transition-all duration-300 max-h-96 overflow-y-auto ${
                        activeDropdown === index
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-2"
                      }`}
                      onMouseEnter={() => setActiveDropdown(index)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="p-5">
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
                                    <span className="text-sm font-medium">
                                      {subItem.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
            {!isLoggedIn ? (
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 p-1 border-2 border-slate-100 rounded-full hover:border-blue-600 transition-all duration-200 bg-slate-50"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                </button>

                {/* Profile Dropdown */}
                <div
                  onMouseEnter={() => setIsProfileOpen(true)}
                  onMouseLeave={() => setIsProfileOpen(false)}
                  className={`absolute right-0 top-full mt-2 w-48 bg-white shadow-2xl rounded-2xl border border-slate-100 transition-all duration-300 ${
                    isProfileOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible translate-y-2"
                  }`}
                >
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.name || "User"}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard size={18} />
                      <span className="text-sm font-semibold">Dashboard</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
        <div
          className={`lg:hidden transition-all duration-300 ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="py-4 space-y-2">
            {navigationItems.map((item, index) => (
              <div key={index} className="border-b border-slate-100 pb-4 mb-4">
                {/* Plain link item (no dropdown) */}
                {!item.sections ? (
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 p-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(index)}
                      className="w-full flex items-center justify-between p-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
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
                  </>
                )}
              </div>
            ))}

            <div className="space-y-2 pt-4">
              {!isLoggedIn ? (
                <Link
                  to="/login"
                  className="block p-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center"
                >
                  Login
                </Link>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account</p>
                      <p className="text-sm font-bold text-slate-800">{user?.name || "User"}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 p-3 text-slate-700 hover:bg-white rounded-xl transition-all font-semibold shadow-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={20} className="text-blue-600" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-white rounded-xl transition-all font-semibold shadow-sm"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
