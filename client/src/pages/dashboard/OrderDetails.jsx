import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, FileText, Upload, CheckCircle, Clock, AlertCircle, User, Activity, MessageSquare, Send, Paperclip, RefreshCw, ChevronDown, X } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../frontend/Navbar';
import Footer from '../frontend/Footer';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdminOrCA = user?.role === 'admin' || user?.role === 'ca';

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [activeTab, setActiveTab] = useState('itr-details');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [itrData, setItrData] = useState(null);
  const [loadingItr, setLoadingItr] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [uploadingRequestId, setUploadingRequestId] = useState(null);
  const [syncCooldown, setSyncCooldown] = useState(0);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusChanged, setStatusChanged] = useState(false);
  const [statusRemarks, setStatusRemarks] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle sync cooldown timer
  useEffect(() => {
    let timer;
    if (syncCooldown > 0) {
      timer = setInterval(() => {
        setSyncCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [syncCooldown]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch the order from the API using orderId from URL
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoadingOrder(true);
        const { data } = await api.get('/payments/my-orders');
        if (data.success) {
          const found = data.data.find(o => o._id === orderId);
          if (found) {
            setOrder({
              id: found._id,
              service: found.planId?.name || 'Tax Service',
              date: found.createdAt,
              status: found.itrStatus || 'Pending',
              amount: found.planId?.price ? `₹${found.planId.price}` : 'Paid',
              originalData: found,
              itrId: found.itrId,
            });
            setSelectedStatus(found.itrStatus || 'Pending');
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoadingOrder(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!order) return;
    const fetchItrDetails = async () => {
      // Only fetch if there's an actual ITR linked to this order
      const idToFetch = order.itrId || order.originalData?.itrId;
      if (!idToFetch) {
        // No ITR filed yet — nothing to fetch
        setLoadingItr(false);
        return;
      }
      try {
        setLoadingItr(true);
        const { data } = await api.get(`/itr/${idToFetch}`);
        if (data.success) {
          setItrData(data.data);
          setSelectedStatus(data.data.status);
          setStatusChanged(false);
        }
      } catch (error) {
        console.error('Error fetching ITR details:', error);
      } finally {
        setLoadingItr(false);
      }
    };
    fetchItrDetails();
  }, [order]);

  const handleUpdateStatus = async () => {
    const idToUpdate = itrData?._id || order?.itrId || order?.originalData?.itrId;
    if (!idToUpdate) return;

    try {
      setUpdatingStatus(true);
      const { data } = await api.put(`/itr/${idToUpdate}/status`, {
        status: selectedStatus,
        remarks: statusRemarks
      });
      if (data.success) {
        setItrData(data.data);
        setStatusChanged(false);
        setStatusRemarks('');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Use real data from itrData if available
  const clientDocuments = itrData?.uploadedDocs || [];
  const caDocuments = []; // This would ideally also come from ITR data once implemented

  const handleSelectAll = () => {
    const docs = activeTab === 'client-docs' ? clientDocuments : caDocuments;
    if (selectedDocs.length === docs.length) {
      setSelectedDocs([]);
    } else {
      setSelectedDocs(docs.map(doc => doc.id));
    }
  };

  const handleSelectDoc = (docId) => {
    if (selectedDocs.includes(docId)) {
      setSelectedDocs(selectedDocs.filter(id => id !== docId));
    } else {
      setSelectedDocs([...selectedDocs, docId]);
    }
  };

  const handleDownloadSelected = () => {
    console.log('Downloading documents:', selectedDocs);
    // Implement download logic
  };

  const handleViewDocument = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    }
  };

  const handleDownloadDocument = (doc) => {
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      verified: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Verified' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock, label: 'Pending Review' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertCircle, label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';

    // If it's already a formatted string like "17/03/2026", return it or try to parse
    // But en-IN toLocaleDateString is common.
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      // If parsing failed, it might already be formatted. Check for basic date patterns.
      if (typeof dateString === 'string' && (dateString.includes('/') || dateString.includes('-'))) {
        return dateString;
      }
      return 'Invalid Date';
    }

    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendRequest = async () => {
    if (!requestMessage.trim()) return;
    try {
      setRequesting(true);
      const { data } = await api.post(`/itr/${itrData._id}/request-document`, { message: requestMessage });
      if (data.success) {
        setItrData(data.data);
        setRequestMessage('');
      }
    } catch (error) {
      console.error('Error sending document request:', error);
    } finally {
      setRequesting(false);
    }
  };

  const handleRefresh = async () => {
    if (syncCooldown > 0) return;
    const idToFetch = itrData?._id || order?.itrId || order?.originalData?.itrId;
    if (!idToFetch) return;

    try {
      setLoadingItr(true);
      const { data } = await api.get(`/itr/${idToFetch}`);
      if (data.success) {
        setItrData(data.data);
        setSyncCooldown(30); // 30 seconds cooldown
      }
    } catch (error) {
      console.error('Error refreshing ITR details:', error);
    } finally {
      setLoadingItr(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !uploadingRequestId) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload the file
      const uploadRes = await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (uploadRes.data.success) {
        const documentId = uploadRes.data.data._id;

        // 2. Link it to the request
        const { data } = await api.put(`/itr/${itrData._id}/request/${uploadingRequestId}/fulfill`, {
          documentId
        });

        if (data.success) {
          setItrData(data.data);
          setUploadingRequestId(null);
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    }
  };

  const triggerUpload = (requestId) => {
    setUploadingRequestId(requestId);
    fileInputRef.current.click();
  };

  if (loadingOrder) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center gap-4">
            <FileText className="w-16 h-16 text-slate-300" />
            <p className="text-slate-600 font-medium text-lg">Order not found.</p>
            <button
              onClick={() => navigate('/dashboard?tab=orders')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-all"
            >
              <ArrowLeft size={16} />
              Back to Orders
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-blue-600 text-white py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/dashboard?tab=orders')}
              className="flex items-center gap-2 text-blue-100 hover:text-white font-semibold transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              Back to Orders
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-extrabold tracking-tight">Order Details</h1>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-white/20 border border-white/20 uppercase tracking-widest">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <p className="text-blue-100 text-sm flex items-center gap-1.5">
                <Clock size={13} className="opacity-80" />
                Placed {formatDate(order.date)}
              </p>
            </div>

            {!isAdminOrCA && (
              <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-2xl px-4 py-2.5 self-start">
                <div className={`w-2 h-2 rounded-full ${(itrData?.status || order.status)?.toLowerCase() === 'completed' ? 'bg-green-400' : 'bg-yellow-300'}`}></div>
                <span className="font-bold text-sm capitalize">{(itrData?.status || order.status)?.replace('-', ' ')}</span>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
            <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-blue-200 text-xs uppercase font-bold tracking-wider mb-2">Plan</p>
              <p className="font-bold text-lg truncate">{order.service}</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-blue-200 text-xs uppercase font-bold tracking-wider mb-2">Amount Paid</p>
              <p className="font-extrabold text-2xl">{order.amount}</p>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-5">
              <p className="text-blue-200 text-xs uppercase font-bold tracking-wider mb-2">Current Status</p>
              {isAdminOrCA ? (
                <div className="flex flex-col gap-2">
                  <div className="relative" ref={statusDropdownRef}>
                    <div
                      onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                      className="flex items-center justify-between bg-white/15 border border-white/20 rounded-xl px-3 py-2 hover:bg-white/25 transition-all cursor-pointer"
                    >
                      <span className="text-white text-sm font-bold uppercase tracking-wide">{selectedStatus}</span>
                      <ChevronDown size={14} className={`text-white/70 transition-transform duration-300 ${showStatusDropdown ? 'rotate-180' : ''}`} />
                    </div>
                    {showStatusDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl py-1 z-[100] border border-slate-200 overflow-hidden">
                        {['Pending', 'CA Reviewing', 'Filed', 'Completed', 'Rejected'].map((status) => (
                          <div
                            key={status}
                            onClick={() => {
                              setSelectedStatus(status);
                              setStatusChanged(status !== (itrData?.status || order.status));
                              setShowStatusDropdown(false);
                            }}
                            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors flex items-center gap-2 ${selectedStatus === status ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                            <div className={`w-2 h-2 rounded-full ${status === 'Completed' ? 'bg-green-500' : status === 'Rejected' ? 'bg-red-500' : status === 'Pending' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {statusChanged && (
                    <div className="flex flex-col gap-2 mt-1">
                      <textarea
                        value={statusRemarks}
                        onChange={(e) => setStatusRemarks(e.target.value)}
                        placeholder="Add remarks for user..."
                        className="bg-white/15 border border-white/20 rounded-xl p-2.5 text-xs text-white placeholder:text-blue-200/50 focus:outline-none focus:ring-1 focus:ring-white/40 resize-none h-16"
                      />
                      <button
                        onClick={handleUpdateStatus}
                        disabled={updatingStatus}
                        className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-xs font-black tracking-widest transition-all"
                      >
                        {updatingStatus ? <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div> : <Send size={11} />}
                        UPDATE &amp; SEND MAIL
                      </button>
                    </div>
                  )}
                  {itrData?.updatedAt && !statusChanged && (
                    <p className="text-blue-200/60 text-xs italic">Last update: {formatDate(itrData.updatedAt)}</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${(itrData?.status || order.status)?.toLowerCase() === 'completed' ? 'bg-green-400' : 'bg-yellow-300'}`}></div>
                  <span className="font-bold text-sm capitalize">{(itrData?.status || order.status)?.replace('-', ' ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Tabs Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-6 overflow-hidden">
            <div className="flex items-center border-b border-slate-100 px-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab('itr-details')}
                className={`relative px-6 py-5 font-bold text-sm whitespace-nowrap transition-all duration-200 ${activeTab === 'itr-details' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Filled Form Details
                {activeTab === 'itr-details' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('ca-docs')}
                className={`relative px-6 py-5 font-bold text-sm whitespace-nowrap transition-all duration-200 ${activeTab === 'ca-docs' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {isAdminOrCA ? 'Request Document from User' : 'Requested Documents by CA'}
                {activeTab === 'ca-docs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`relative px-6 py-5 font-bold text-sm whitespace-nowrap transition-all duration-200 ${activeTab === 'chat' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Chat
                {activeTab === 'chat' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                )}
              </button>
              {isAdminOrCA && (
                <button
                  onClick={handleRefresh}
                  disabled={loadingItr || syncCooldown > 0}
                  className={`ml-auto px-4 py-4 flex items-center gap-1.5 text-sm font-bold transition-all duration-200 whitespace-nowrap ${loadingItr || syncCooldown > 0 ? 'cursor-not-allowed opacity-40 text-slate-400' : 'cursor-pointer text-slate-500 hover:text-blue-600'}`}
                  title={syncCooldown > 0 ? `Please wait ${syncCooldown}s` : 'Refresh Data'}
                >
                  <RefreshCw size={15} className={loadingItr ? 'animate-spin text-blue-600' : ''} />
                  <span className="text-xs uppercase tracking-widest">
                    {syncCooldown > 0 ? `Wait ${syncCooldown}s` : 'Sync'}
                  </span>
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-8">

              {/* ── Filled Form Details Tab ── */}
              {activeTab === 'itr-details' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {loadingItr ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      <p className="text-slate-500 font-medium">Fetching filled form details...</p>
                    </div>
                  ) : itrData ? (
                    <>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                            <User size={16} className="text-blue-600" />
                          </div>
                          Personal Information
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {Object.entries(itrData.personalInfo || {}).map(([key, value]) => {
                            if (typeof value === 'object') return null;
                            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                            return (
                              <div key={key} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-sm transition-all duration-200">
                                <p className="text-xs text-blue-600 uppercase font-bold mb-2 tracking-wide opacity-80">{label}</p>
                                <p className="font-semibold text-slate-800 text-sm break-words line-clamp-2" title={value?.toString()}>{value?.toString() || '—'}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {itrData.incomeDetails && Object.keys(itrData.incomeDetails).length > 0 && (
                        <div className="pt-6 border-t border-slate-100">
                          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                              <AlertCircle size={16} className="text-blue-600" />
                            </div>
                            Income Details
                          </h3>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {Object.entries(itrData.incomeDetails).map(([key, value]) => {
                              if (typeof value === 'object') return null;
                              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                              return (
                                <div key={key} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-sm transition-all duration-200">
                                  <p className="text-xs text-slate-500 uppercase font-bold mb-2 tracking-wide">{label}</p>
                                  <p className="font-semibold text-slate-900 text-sm">{value?.toString() || 'N/A'}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {itrData.uploadedDocs && itrData.uploadedDocs.length > 0 && (
                        <div className="pt-6 border-t border-slate-100">
                          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                              <Upload size={16} className="text-blue-600" />
                            </div>
                            Uploaded Documents
                          </h3>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {itrData.uploadedDocs.map((doc, index) => (
                              <div key={doc._id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-sm transition-all duration-200">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <FileText size={18} className="text-blue-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate max-w-[180px]">{doc.fileName || 'Document'}</p>
                                    <p className="text-xs text-slate-500">{formatDate(doc.uploadedAt || doc.createdAt)}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleViewDocument(doc)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex-shrink-0"
                                  title="View"
                                >
                                  <Eye size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <FileText className="w-14 h-14 text-slate-300" />
                      <p className="text-slate-500 font-medium">No filled form data found for this order.</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Requested Documents Tab ── */}
              {activeTab === 'ca-docs' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {isAdminOrCA && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                      <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Upload size={14} className="text-blue-600" />
                        </div>
                        New Document Request
                      </h4>
                      <div className="space-y-4">
                        <textarea
                          rows={4}
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          placeholder="Type the list of documents you need from the user (e.g., 1. Form 16, 2. Bank Statements...)"
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none transition-all"
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={handleSendRequest}
                            disabled={requesting || !requestMessage.trim()}
                            className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {requesting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Send size={14} />}
                            Send Request to User
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText size={14} className="text-blue-600" />
                      </div>
                      {isAdminOrCA ? 'Request History' : 'Active Requests'}
                    </h4>

                    {itrData?.documentRequests && itrData.documentRequests.length > 0 ? (
                      [...itrData.documentRequests].reverse().map((req, idx) => (
                        <div key={req._id || idx} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              Requested {formatDate(req.requestedAt)}
                            </p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${req.status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 font-medium mb-4 leading-relaxed whitespace-pre-wrap">{req.message}</p>

                          {!isAdminOrCA && req.status !== 'Fulfilled' && (
                            <button
                              onClick={() => triggerUpload(req._id)}
                              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-blue-200/60"
                            >
                              <Paperclip size={14} />
                              Upload Requested Document
                            </button>
                          )}

                          {req.status === 'Fulfilled' && (
                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                              <CheckCircle size={14} />
                              <span className="text-xs font-bold">Document successfully submitted</span>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-14 gap-3 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                        <FileText className="w-12 h-12 text-slate-300" />
                        <p className="text-slate-500 font-medium text-sm">No active requests found.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Chat Tab ── */}
              {activeTab === 'chat' && (
                <div className="flex flex-col h-[420px] animate-in fade-in duration-300">
                  <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-100 p-4 overflow-y-auto mb-4 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <MessageSquare size={48} className="text-slate-400" />
                      <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Chat with Client Coming Soon</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type a message to the client..."
                      className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      disabled
                    />
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm opacity-50 cursor-not-allowed">
                      Send
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard?tab=orders')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-100 hover:border-slate-300 transition-all"
            >
              <ArrowLeft size={16} />
              Back to Orders
            </button>
            {itrData?.updatedAt && (
              <p className="text-xs text-slate-400 hidden sm:block">
                Last updated: {formatDate(itrData.updatedAt)}
              </p>
            )}
          </div>

        </div>
      </main>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Request Document Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Request Document</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Document Type</label>
                <select className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Select document type</option>
                  <option value="form16">Form 16</option>
                  <option value="form26as">Form 26AS</option>
                  <option value="ais">Annual Information Statement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message to Client</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  placeholder="Please provide additional details..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Document requested');
                    setShowRequestModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrderDetails;
