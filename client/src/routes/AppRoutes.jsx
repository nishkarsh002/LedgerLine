import { Routes, Route } from 'react-router-dom';
import Home from '../pages/frontend/Home';
import Login from '../pages/sign-in/Login';
import Sign_up from '../pages/sign-in/Sign_up';

// Service Pages
import SalaryBasicITR from '../pages/services/individual/SalaryBasicITR';
import SalaryPremium from '../pages/services/individual/SalaryPremium';
import BusinessProfession from '../pages/services/business/BusinessProfession';
import GSTRegistration from '../pages/services/registration/GSTRegistration';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path='/sign_up' element={<Sign_up/>} />
      
      {/* Service Routes */}
      <Route path="/services/salary-basic-itr" element={<SalaryBasicITR />} />
      <Route path="/services/salary-premium" element={<SalaryPremium />} />
      <Route path="/services/business-profession" element={<BusinessProfession />} />
      <Route path="/services/gst-registration" element={<GSTRegistration />} />
      
      {/* Placeholder routes for other services */}
      <Route path="/services/*" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-slate-900 mb-4">Service Page</h1><p className="text-slate-600">This service page is coming soon!</p></div></div>} />
    </Routes>
  );
}
