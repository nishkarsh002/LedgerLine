import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    FileText,
    Settings,
    LogOut,
    TrendingUp,
    DollarSign,
    Clock,
    CheckCircle,
    Search,
    Filter,
    Download,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    ChevronRight,
    SearchIcon,
    ArrowUpRight,
    Shield,
    Briefcase,
    UserPlus,
    Check,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import OrderDetails from '../dashboard/OrderDetails';
import api from '../../api/axios';

const AdminDashboard = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [userFilter, setUserFilter] = useState('ALL'); // ALL, ADMIN, USER, CA

    // Data States
    const [users, setUsers] = useState([]);
    const [filings, setFilings] = useState([]); // This represents TAX FILINGS (ITR)
    const [orders, setOrders] = useState([]);   // This represents PURCHASES/PAYMENTS
    const [adminRequests, setAdminRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState([
        { title: 'Total Orders', value: '0', change: '+0%', icon: ShoppingBag, color: 'blue' },
        { title: 'Total Revenue', value: '₹0', change: '+0%', icon: DollarSign, color: 'green' },
        { title: 'Active Users', value: '0', change: '+0%', icon: Users, color: 'purple' },
        { title: 'Pending Filings', value: '0', change: '0%', icon: Clock, color: 'yellow' }
    ]);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'requests', label: 'Requests', icon: UserPlus },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'filings', label: 'Filings', icon: FileText },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, paymentsRes, itrsRes, requestsRes] = await Promise.allSettled([
                api.get('/auth/users'),
                api.get('/payments/all'),
                api.get('/itr/all'),
                api.get('/auth/admin-requests')
            ]);

            const usersData = usersRes.status === 'fulfilled' ? usersRes.value.data.data : [];
            const paymentsData = paymentsRes.status === 'fulfilled' ? paymentsRes.value.data.data : [];
            const itrsData = itrsRes.status === 'fulfilled' ? itrsRes.value.data.data : [];
            const requestsData = requestsRes.status === 'fulfilled' ? requestsRes.value.data.data : [];

            setUsers(usersData);
            setAdminRequests(requestsData);

            // 1. Map Payments to Orders
            const mappedOrders = paymentsData.map(purchase => ({
                id: purchase._id,
                transactionId: purchase.paymentId,
                clientName: purchase.userId?.name || 'Unknown',
                clientEmail: purchase.userId?.email || 'Unknown',
                clientId: purchase.userId?._id,
                service: purchase.planId?.name || 'Tax Plan',
                amount: `₹${purchase.planId?.price || 0}`,
                date: new Date(purchase.createdAt).toLocaleDateString(),
                status: purchase.paymentStatus,
                itrStatus: purchase.itrStatus || 'Pending Filing',
                originalData: purchase
            }));
            setOrders(mappedOrders);

            // 2. Map ITRs to Filings
            const mappedFilings = itrsData.map(itr => ({
                id: itr._id,
                clientName: itr.userId?.name || 'Unknown',
                clientEmail: itr.userId?.email || 'Unknown',
                clientId: itr.userId?._id,
                service: itr.purchaseId?.planId?.name || 'ITR Filing',
                date: new Date(itr.submittedAt || itr.createdAt).toLocaleDateString(),
                status: itr.status,
                amount: itr.purchaseId?.planId?.price ? `₹${itr.purchaseId.planId.price}` : '-',
                assignedCA: itr.assignedCA?.name || 'Unassigned',
                itrId: itr._id,
                originalData: itr
            }));
            setFilings(mappedFilings);

            calculateStats(usersData, mappedFilings, paymentsData);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (usersList, filingsList, paymentsList) => {
        const totalRevenue = paymentsList.reduce((acc, payment) => {
            const price = payment.planId?.price || 0;
            return acc + price;
        }, 0);
        const pendingCount = filingsList.filter(f => 
            ['pending', 'in-progress', 'ca reviewing'].includes(f.status?.toLowerCase())
        ).length;

        setStats([
            {
                title: 'Total Orders',
                value: paymentsList.length.toString(),
                change: '+12%',
                icon: ShoppingBag,
                color: 'blue'
            },
            {
                title: 'Total Revenue',
                value: `₹${totalRevenue.toLocaleString()}`,
                change: '+8%',
                icon: DollarSign,
                color: 'green'
            },
            {
                title: 'Total Users',
                value: usersList.length.toString(),
                change: '+15%',
                icon: Users,
                color: 'purple'
            },
            {
                title: 'Pending Filings',
                value: pendingCount.toString(),
                change: '-5%',
                icon: Clock,
                color: 'yellow'
            }
        ]);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getStatusBadge = (status) => {
        const statusLower = status?.toLowerCase() || 'pending';
        let config = { bg: 'bg-slate-100', text: 'text-slate-700', label: status };

        if (statusLower === 'completed' || statusLower === 'filed' || statusLower === 'active') {
            config = { bg: 'bg-emerald-500/10', text: 'text-emerald-500', label: status || 'Active' };
        } else if (statusLower === 'in-progress' || statusLower === 'processing' || statusLower === 'ca reviewing') {
            config = { bg: 'bg-blue-500/10', text: 'text-blue-500', label: status || 'In Progress' };
        } else if (statusLower === 'pending' || statusLower === 'pending filing') {
            config = { bg: 'bg-amber-500/10', text: 'text-amber-500', label: statusLower === 'pending' ? 'Pending' : 'Pending Filing' };
        } else if (statusLower === 'rejected' || statusLower === 'cancelled') {
            config = { bg: 'bg-rose-500/10', text: 'text-rose-500', label: 'Rejected' };
        }

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${config.bg} ${config.text}`}>
                <span className={`w-1 h-1 rounded-full mr-1.5 ${config.text.replace('text', 'bg')}`}></span>
                {config.label}
            </span>
        );
    };

    const getUserITRStatus = (userId) => {
        const userOrder = orders.find(o => o.clientId === userId);
        if (!userOrder) return null;
        return userOrder.status;
    };

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group hover:border-zinc-700 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-800 text-zinc-400 group-hover:text-white transition-colors`}>
                                    <Icon size={20} />
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-zinc-400 text-sm font-medium mb-1">{stat.title}</h3>
                            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                            <div className="absolute -right-2 -bottom-2 opacity-5 transform group-hover:scale-110 transition-transform">
                                <Icon size={80} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Recent Filings</h2>
                        <button onClick={() => setActiveTab('filings')} className="text-zinc-400 hover:text-white text-sm font-medium flex items-center gap-1 group">
                            View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Service</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filings.slice(0, 5).map((filing) => (
                                    <tr key={filing.id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-bold">
                                                    {filing.clientName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{filing.clientName}</p>
                                                    <p className="text-[10px] text-zinc-500 font-mono">{filing.id.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-zinc-400">{filing.service}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(filing.status)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm font-bold text-white">{filing.amount}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Activity/Stats */}
                <div className="space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-6">User Distribution</h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Regular Users', count: users.filter(u => u.role === 'user').length, color: 'bg-blue-500' },
                                { label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'bg-emerald-500' },
                                { label: 'CA Partners', count: users.filter(u => u.role === 'ca').length, color: 'bg-purple-500' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-zinc-400">{item.label}</span>
                                        <span className="text-white font-bold">{item.count}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                        <div 
                                            className={`${item.color} h-full transition-all duration-1000`} 
                                            style={{ width: `${(item.count / users.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white overflow-hidden relative group cursor-pointer">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-1">Scale your business</h3>
                            <p className="text-indigo-100/80 text-sm mb-4">Onboard more CA partners and grow your filing volume.</p>
                            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold transition-all">
                                Get Started
                            </button>
                        </div>
                        <ArrowUpRight className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUsers = () => {
        const filteredUsers = users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                user.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = userFilter === 'ALL' || user.role.toUpperCase() === userFilter;
            return matchesSearch && matchesRole;
        });

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400">
                                <Users size={20} />
                            </div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Users</h2>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-zinc-500 text-sm font-medium border-r border-zinc-800 pr-4">
                                Total <span className="text-white ml-1">{users.length}</span>
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-blue-400 uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                    {users.filter(u => u.role === 'admin').length} Admins
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase">
                                    {users.filter(u => u.role === 'user').length} Users
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 text-zinc-200 pl-10 pr-4 py-2.5 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-sm"
                            />
                        </div>
                        <div className="flex bg-zinc-900 p-1 border border-zinc-800 rounded-xl">
                            {['ALL', 'ADMIN', 'USER'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setUserFilter(filter)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${userFilter === filter ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Role</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Account Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">ITR Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filteredUsers.map((u) => {
                                    const itrStatus = getUserITRStatus(u._id);
                                    return (
                                        <tr key={u._id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all font-bold">
                                                        {u.name[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{u.name}</p>
                                                        <p className="text-xs text-zinc-500">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-800 text-[10px] font-bold uppercase ${u.role === 'admin' ? 'text-blue-400' : 'text-zinc-400'}`}>
                                                        {u.role === 'admin' ? <Shield size={10} /> : <Users size={10} />}
                                                        {u.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {getStatusBadge('active')}
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {itrStatus ? (
                                                    getStatusBadge(itrStatus)
                                                ) : (
                                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">— No Filing —</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                                                    <button className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all" title="Edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button className="p-2 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all" title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <SearchIcon size={40} className="text-zinc-700" />
                                                <p className="text-zinc-500 font-medium">No users found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-zinc-800/30 border-t border-zinc-800 flex items-center justify-between">
                        <p className="text-xs text-zinc-500">Showing {filteredUsers.length} of {users.length} users</p>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-md text-xs font-bold opacity-50 cursor-not-allowed">Previous</button>
                            <button className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-md text-xs font-bold hover:text-white transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderOrders = () => {
        const filteredOrders = orders.filter(order =>
            order.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.transactionId.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            Orders <span className="text-zinc-500 font-normal">({orders.length})</span>
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1 font-medium">Manage and review all successful payment transactions.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 text-zinc-200 pl-10 pr-4 py-2.5 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Transaction ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Plan</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Form Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-5 text-sm font-mono text-zinc-500">{order.transactionId}</td>
                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="text-sm font-bold text-zinc-200">{order.clientName}</p>
                                                <p className="text-[10px] text-zinc-500">{order.clientEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-white font-medium">{order.service}</p>
                                            <p className="text-[10px] font-bold text-zinc-500 mt-0.5">{order.amount}</p>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-zinc-400">{order.date}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                                order.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                                order.itrStatus !== 'Pending Filing' ? 'bg-blue-500/10 text-blue-500' : 'bg-zinc-800 text-zinc-500'
                                            }`}>
                                                {order.itrStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-zinc-500 font-medium">No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderFilings = () => {
        const filteredFilings = filings.filter(filing =>
            filing.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            filing.id.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            Filings <span className="text-zinc-500 font-normal">({filings.length})</span>
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1 font-medium">Manage and review all Income Tax Return submissions.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                            <input
                                type="text"
                                placeholder="Search filings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 text-zinc-200 pl-10 pr-4 py-2.5 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Client</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Service Plan</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Submitted</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {filteredFilings.map((filing) => (
                                    <tr key={filing.id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-5 text-sm font-mono text-zinc-500">#{filing.id.substring(0, 8)}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                                                    <Users size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition-colors cursor-pointer">{filing.clientName}</p>
                                                    <p className="text-[10px] text-zinc-500">{filing.clientEmail}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-white font-medium">{filing.service}</p>
                                            <p className="text-[10px] font-bold text-zinc-500 mt-0.5 tracking-wider uppercase">{filing.amount}</p>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-zinc-400">{filing.date}</td>
                                        <td className="px-6 py-5">{getStatusBadge(filing.status)}</td>
                                        <td className="px-6 py-5 text-right">
                                            <button
                                                onClick={() => setSelectedOrder(filing)}
                                                className="inline-flex items-center gap-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
                                            >
                                                <Eye size={14} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredFilings.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-zinc-500 font-medium">No filings found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const handleAction = async (requestId, status, role = 'ca') => {
        try {
            await api.put(`/auth/admin-requests/${requestId}`, { status, role });
            // Refresh data
            fetchData();
        } catch (error) {
            console.error('Error handling admin request:', error);
            alert('Failed to process request');
        }
    };

    const renderRequests = () => {
        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            Access Requests <span className="text-blue-500 font-normal">({adminRequests.length})</span>
                        </h2>
                        <p className="text-zinc-500 text-sm mt-1 font-medium">Pending applications for Administrative Portal access.</p>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-zinc-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Requested At</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {adminRequests.map((request) => (
                                    <tr key={request._id} className="hover:bg-zinc-800/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold">
                                                    {request.name[0].toUpperCase()}
                                                </div>
                                                <p className="text-sm font-bold text-zinc-200">{request.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-zinc-400">{request.email}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-zinc-500">
                                                <Clock size={14} />
                                                <p className="text-sm">{new Date(request.adminRequestedAt).toLocaleString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleAction(request._id, 'approved', 'admin')}
                                                    className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                                                >
                                                    <Shield size={14} /> Approve as Admin
                                                </button>
                                                <button
                                                    onClick={() => handleAction(request._id, 'approved', 'ca')}
                                                    className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                                                >
                                                    <Briefcase size={14} /> Approve as CA
                                                </button>
                                                <button
                                                    onClick={() => handleAction(request._id, 'rejected')}
                                                    className="flex items-center gap-2 px-3 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg text-xs font-bold transition-all"
                                                >
                                                    <X size={14} /> Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {adminRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <CheckCircle size={40} className="text-zinc-800" />
                                                <p className="text-zinc-500 font-medium">No pending access requests.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return renderOverview();
            case 'users': return renderUsers();
            case 'requests': return renderRequests();
            case 'orders': return renderOrders();
            case 'filings': return renderFilings();
            case 'documents':
                return <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center"><p className="text-zinc-500 font-medium">Document Archive coming soon...</p></div>;
            case 'settings':
                return <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center"><p className="text-zinc-500 font-medium">Admin Settings coming soon...</p></div>;
            default: return renderOverview();
        }
    };

    return (
        <div className="min-h-screen bg-black flex overflow-hidden font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col fixed h-full z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">LedgerLine</h1>
                            <div className="flex items-center gap-1.5 h-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Live Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Core Console</p>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all relative group ${isActive 
                                    ? 'bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-500' 
                                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900'}`}
                            >
                                <Icon size={20} className={isActive ? 'text-blue-500' : 'text-zinc-500 group-hover:text-zinc-200 transition-colors'} />
                                <span>{item.label}</span>
                                {isActive && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}
                            </button>
                        );
                    })}

                    <div className="pt-8 opacity-40">
                         <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-4">Operations</p>
                         <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-zinc-700 cursor-not-allowed">
                            <Briefcase size={20} />
                            <span>CA Partners</span>
                         </button>
                         <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-zinc-700 cursor-not-allowed">
                            <TrendingUp size={20} />
                            <span>Revenue</span>
                         </button>
                    </div>
                </nav>

                <div className="p-4 border-t border-zinc-900">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-500/10 transition-all group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col ml-64 min-h-screen">
                {/* Header */}
                <header className="h-20 bg-black/80 backdrop-blur-md border-b border-zinc-900 sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-zinc-500 text-sm font-medium tracking-tight">Console / <span className="text-white capitalize font-bold">{activeTab}</span></h2>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 border-l border-zinc-800 pl-6 cursor-pointer group">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white leading-none mb-1 group-hover:text-blue-400 transition-colors">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">System Root</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center border-2 border-black group-hover:scale-105 transition-transform">
                                <span className="text-white font-black text-sm">{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 p-10 overflow-auto bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.1),transparent)]">
                    {renderContent()}
                </main>
            </div>

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

export default AdminDashboard;

