import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User, ShoppingBag, LogOut, HelpCircle, ChevronRight, Mail, Phone, Edit2, Package, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import Navbar from '../frontend/Navbar';
import Footer from '../frontend/Footer';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await api.get('/payments/my-orders');
      if (data.success) {
        // Map API data to dashboard format
        const mappedOrders = data.data.map(order => ({
          id: order._id,
          service: order.planId?.name || 'Tax Service',
          date: order.createdAt,
          status: order.itrStatus || 'Pending',
          amount: order.planId?.price ? `₹${order.planId.price}` : 'Paid',
          originalData: order,
          statusDate: order.itrUpdatedAt || order.updatedAt,
          canFile: order.itrStatus === 'Pending Filing',
          serviceSlug: order.planId?.slug || 'salary-basic-itr' // Fallback or handle error
        }));
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'orders', 'help'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);




  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'help', label: 'Need Help', icon: HelpCircle },
    { id: 'logout', label: 'Log Out', icon: LogOut }
  ];

  const handleMenuClick = (id) => {
    if (id === 'logout') {
      handleLogout();
    } else {
      setActiveTab(id);
    }
  };

  const renderProfile = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Profile Information</h2>
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold">
          <Edit2 size={18} />
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold font-['Outfit']">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{user?.name || 'User Name'}</h3>
            <p className="text-slate-600">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-slate-600 mb-1">Email Address</p>
              <p className="font-semibold text-slate-900">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-slate-600 mb-1">Phone Number</p>
              <p className="font-semibold text-slate-900">{user?.mobile || 'Not provided'}</p>
            </div>
          </div>


        </div>

        <div className="pt-6 border-t border-slate-200">
          <h4 className="font-bold text-slate-900 mb-4">Account Details</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600 mb-1">PAN Number</p>
              <p className="font-semibold text-slate-900">{user?.pan || 'Not provided'}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm text-slate-600 mb-1">Role</p>
              <p className="font-semibold text-slate-900 capitalize">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h2>

      {loadingOrders ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">No orders yet</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{order.service}</h3>
                  <p className="text-sm text-slate-600">Order ID: {order.id.substring(0, 8)}...</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-lg">{order.amount}</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${['completed', 'submitted'].includes(order.status.toLowerCase())
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {['completed', 'submitted'].includes(order.status.toLowerCase()) ? <CheckCircle size={14} /> : <Clock size={14} />}
                    <span className="capitalize">{order.status}</span>
                  </div>
                  {order.statusDate && (
                    <p className="text-[10px] text-slate-500 mt-1 flex items-center justify-end gap-1">
                      <Clock size={10} />
                      {new Date(order.statusDate).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">Order Date: {new Date(order.date).toLocaleDateString()}</p>
                <div className="flex gap-3">
                  {order.canFile && (
                    <button
                      onClick={() => navigate(`/services/userform?service=${order.serviceSlug}&purchaseId=${order.id}`)}
                      className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                    >
                      Complete Filing
                      <ArrowRight size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                  >
                    View Details
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );



  const renderHelp = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Need Help?</h2>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-slate-900 mb-4">Contact Support</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <a href="mailto:support@powerfiling.com" className="text-blue-600 hover:underline">
                support@powerfiling.com
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <a href="tel:+911234567890" className="text-blue-600 hover:underline">
                +91 123 456 7890
              </a>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {[
              'How do I track my order?',
              'What documents do I need for ITR filing?',
              'How long does the filing process take?',
              'Can I get a refund?'
            ].map((question, index) => (
              <button
                key={index}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left"
              >
                <span className="font-medium text-slate-900">{question}</span>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-500/10">
          <h3 className="font-bold mb-2">Need Immediate Assistance?</h3>
          <p className="text-purple-100 mb-4">Chat with our support team</p>
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
            Start Live Chat
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'orders':
        return renderOrders();

      case 'help':
        return renderHelp();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="py-12 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Dashboard</h1>
            <p className="text-slate-600">Manage your account and track your services</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-4">
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isLogout = item.id === 'logout';

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleMenuClick(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${isLogout
                          ? 'text-red-600 hover:bg-red-50'
                          : isActive
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserDashboard;
