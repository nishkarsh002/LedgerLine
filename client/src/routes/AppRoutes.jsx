import { Routes, Route } from 'react-router-dom';
import Home from '../pages/frontend/Home';
import Login from '../pages/sign-in/Login';
import Sign_up from '../pages/sign-in/Sign_up';
import UserForm from '../pages/from/UserFrom';
import UserDashboard from '../pages/dashboard/UserDashboard';

// ITR Category Pages (keep existing)
import IndividualITR from '../pages/services/itr/IndividualITR';
import BusinessITR from '../pages/services/itr/BusinessITR';

// Dynamic Service Detail Template
import ServiceDetail from '../pages/services/ServiceDetail';
import PaymentGateway from '../pages/payment/PaymentGateway';
import PaymentSuccess from '../pages/payment/PaymentSuccess';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path='/sign_up' element={<Sign_up />} />

      {/* ITR Category Routes - Keep existing pages */}
      <Route path="/services/individual" element={<IndividualITR />} />
      <Route path="/services/business" element={<BusinessITR />} />

      {/* Dynamic Service Detail Routes - All individual services use one template */}
      <Route path="/services/:serviceId" element={<ServiceDetail />} />

      {/* {User Form} */}
      <Route path="/services/userform" element={<UserForm />} />

      {/* User Dashboard */}
      <Route path="/dashboard" element={<UserDashboard />} />

      {/* Payment Routes */}
      <Route path="/payment" element={<PaymentGateway />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />

      {/* Fallback route for any other services */}
      <Route path="/services/*" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-slate-900 mb-4">Service Page</h1><p className="text-slate-600">This service page is coming soon!</p></div></div>} />
    </Routes>
  );
}
