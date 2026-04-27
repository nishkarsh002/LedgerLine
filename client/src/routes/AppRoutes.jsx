import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/frontend/Home';
import Contact from '../pages/frontend/Contact';
import Login from '../pages/Login';
import Sign_up from '../pages/sign-in/Sign_up';
import UnifiedVerification from '../pages/sign-in/UnifiedVerification';
import UserForm from '../pages/from/UserFrom';
import UserDashboard from '../pages/dashboard/UserDashboard';
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminRequestAccess from '../pages/admin/requests/AdminRequestAccess';
import AdminRequestStatus from '../pages/admin/requests/AdminRequestStatus';
import AdminAccessRejected from '../pages/admin/requests/AdminAccessRejected';

// ITR Category Pages (keep existing)
import IndividualITR from '../pages/services/itr/IndividualITR';
import BusinessITR from '../pages/services/itr/BusinessITR';

// Dynamic Service Detail Template
import ServiceDetail from '../pages/services/ServiceDetail';
import PaymentGateway from '../pages/payment/PaymentGateway';
import PaymentSuccess from '../pages/payment/PaymentSuccess';
import PaymentFailure from '../pages/payment/PaymentFailure';

import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path='/sign_up' element={<Sign_up />} />
      <Route path="/verification" element={<UnifiedVerification />} />
      <Route path="/verify-otp" element={<UnifiedVerification />} />
      <Route
        path="/verify-mobile"
        element={
          <PrivateRoute>
            <UnifiedVerification />
          </PrivateRoute>
        }
      />

      {/* ITR Category Routes - Keep existing pages */}
      <Route path="/services/individual" element={<IndividualITR />} />
      <Route path="/services/business" element={<BusinessITR />} />

      {/* Dynamic Service Detail Routes - All individual services use one template */}
      <Route path="/services/:serviceId" element={<ServiceDetail />} />

      {/* {User Form} */}
      <Route
        path="/services/userform"
        element={
          <PrivateRoute>
            <UserForm />
          </PrivateRoute>
        }
      />

      {/* User Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/request-access" element={<AdminRequestAccess />} />
      <Route path="/admin/request-status" element={<AdminRequestStatus />} />
      <Route path="/admin/rejected" element={<AdminAccessRejected />} />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Payment Routes */}
      <Route
        path="/payment"
        element={
          <PrivateRoute>
            <PaymentGateway />
          </PrivateRoute>
        }
      />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailure />} />

      {/* Fallback route for any other services */}
      <Route path="/services/*" element={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold text-slate-900 mb-4">Service Page</h1><p className="text-slate-600">This service page is coming soon!</p></div></div>} />
    </Routes>
  );
}
