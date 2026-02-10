import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Gift, LogOut, HelpCircle, ChevronRight, Mail, Phone, MapPin, Edit2, Package, Clock, CheckCircle } from 'lucide-react';
import Navbar from '../frontend/Navbar';
import Footer from '../frontend/Footer';
import { useAuth } from '../../context/AuthContext';
import OrderDetails from './OrderDetails';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mock data - replace with actual API calls
  const orders = [
    {
      id: 'ORD001',
      service: 'Salary (Basic) ITR',
      date: '2024-01-15',
      status: 'completed',
      amount: '₹799'
    },
    {
      id: 'ORD002',
      service: 'GST Registration',
      date: '2024-02-01',
      status: 'in-progress',
      amount: '₹1,499'
    }
  ];

  const rewards = {
    points: 250,
    tier: 'Silver',
    nextTier: 'Gold',
    pointsToNext: 250
  };

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'rewards', label: 'My Rewards', icon: Gift },
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
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
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
              <p className="font-semibold text-slate-900">{user?.phone || '+91 98765 43210'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <MapPin className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <p className="text-sm text-slate-600 mb-1">Address</p>
              <p className="font-semibold text-slate-900">{user?.address || 'Address not provided'}</p>
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
              <p className="text-sm text-slate-600 mb-1">Member Since</p>
              <p className="font-semibold text-slate-900">{user?.joinDate || 'January 2024'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 mb-4">No orders yet</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
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
                  <p className="text-sm text-slate-600">Order ID: {order.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 text-lg">{order.amount}</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === 'completed' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                    {order.status === 'completed' ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">Order Date: {order.date}</p>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                >
                  View Details
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRewards = () => (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Rewards</h2>

      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-purple-100 mb-2">Current Tier</p>
            <h3 className="text-3xl font-bold">{rewards.tier}</h3>
          </div>
          <Gift className="w-16 h-16 text-white opacity-50" />
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Points to {rewards.nextTier}</span>
            <span>{rewards.points}/{rewards.points + rewards.pointsToNext}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all"
              style={{ width: `${(rewards.points / (rewards.points + rewards.pointsToNext)) * 100}%` }}
            ></div>
          </div>
        </div>
        <p className="text-purple-100 text-sm">Earn {rewards.pointsToNext} more points to reach {rewards.nextTier} tier</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">Available Points</h3>
        <div className="bg-slate-50 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-slate-900 mb-2">{rewards.points}</p>
          <p className="text-slate-600">Reward Points</p>
        </div>

        <div className="pt-6">
          <h3 className="font-bold text-slate-900 text-lg mb-4">How to Earn Points</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Complete a Service</p>
                <p className="text-sm text-slate-600">Earn 50 points per service</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Refer a Friend</p>
                <p className="text-sm text-slate-600">Earn 100 points per referral</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              <a href="mailto:support@ledgerline.com" className="text-blue-600 hover:underline">
                support@ledgerline.com
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

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
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
      case 'rewards':
        return renderRewards();
      case 'help':
        return renderHelp();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="py-12">
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
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                          isLogout
                            ? 'text-red-600 hover:bg-red-50'
                            : isActive
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
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
      </div>

      <Footer />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default UserDashboard;
