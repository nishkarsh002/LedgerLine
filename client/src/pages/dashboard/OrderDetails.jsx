import { useState, useEffect } from 'react';
import { X, Eye, FileText, Upload, CheckCircle, Clock, AlertCircle, User, Activity } from 'lucide-react';
import api from '../../api/axios';

const OrderDetails = ({ order, onClose }) => {
  const [activeTab, setActiveTab] = useState('itr-details');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [itrData, setItrData] = useState(null);
  const [loadingItr, setLoadingItr] = useState(false);

  useEffect(() => {
    const fetchItrDetails = async () => {
      // If we already have personalInfo in originalData, it's already the ITR form object (e.g. from Admin Dashboard)
      if (order.originalData && order.originalData.personalInfo) {
        setItrData(order.originalData);
        return;
      }

      // Otherwise, get the ID of the ITR
      const idToFetch = order.itrId || order.originalData.itrId;
      if (!idToFetch) return;

      try {
        setLoadingItr(true);
        const { data } = await api.get(`/itr/${idToFetch}`);
        if (data.success) {
          setItrData(data.data);
        }
      } catch (error) {
        console.error('Error fetching ITR details:', error);
      } finally {
        setLoadingItr(false);
      }
    };

    fetchItrDetails();
  }, [order.itrId, order.originalData]);

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
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden transition-all duration-500 scale-100 animate-in fade-in zoom-in-95">
        {/* Header - Balanced Compact */}
        <div className="relative bg-[#2563eb] p-6 text-white flex-shrink-0 overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
          
          <div className="relative flex items-center justify-between mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-bold tracking-tight">Order Insight</h2>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-white/20 backdrop-blur-md border border-white/10 uppercase tracking-widest">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
              </div>
              <p className="text-blue-50 text-[12px] flex items-center gap-2 opacity-90 font-medium">
                <Clock size={12} />
                Placed {formatDate(order.date)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-2xl transition-all group"
            >
              <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <div className="relative grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <p className="text-blue-100 text-[9px] uppercase font-black opacity-70 mb-1 tracking-wider">Service Line</p>
              <p className="font-bold text-xs truncate">{order.service}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <p className="text-blue-100 text-[9px] uppercase font-black opacity-70 mb-1 tracking-wider">Investment</p>
              <p className="font-black text-base">{order.amount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/5">
              <p className="text-blue-100 text-[9px] uppercase font-black opacity-70 mb-1 tracking-wider">Cycle Stage</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  order.status === 'completed' ? 'bg-green-400' : 'bg-yellow-400'
                }`}></div>
                <p className="font-bold capitalize text-xs">{order.status.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Sleek */}
        <div className="bg-slate-50 border-b border-slate-200 flex-shrink-0 px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('itr-details')}
              className={`relative px-1 py-4 font-bold text-sm transition-all duration-300 ${
                activeTab === 'itr-details' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Filled Form Details
              {activeTab === 'itr-details' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2563eb] rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('ca-docs')}
              className={`relative px-1 py-4 font-bold text-sm transition-all duration-300 ${
                activeTab === 'ca-docs' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Requested Documents by CA
              {activeTab === 'ca-docs' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2563eb] rounded-t-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="p-6 space-y-8">

            {/* Documents List */}
            {activeTab === 'itr-details' ? (
              <div className="space-y-8 animate-in fade-in duration-500">
                {loadingItr ? (
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Fetching filled form details...</p>
                  </div>
                ) : itrData ? (
                  <>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <User className="text-blue-600" />
                        Personal Information
                      </h3>
                       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(itrData.personalInfo || {}).map(([key, value]) => {
                           if (typeof value === 'object') return null;
                           const label = key
                             .replace(/([A-Z])/g, ' $1')
                             .replace(/^./, str => str.toUpperCase());
                           
                           return (
                             <div key={key} className="group bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300">
                               <p className="text-[10px] text-blue-600 uppercase font-black mb-1.5 opacity-70 tracking-tight">{label}</p>
                               <p className="font-bold text-slate-800 text-[13px] break-words line-clamp-2" title={value?.toString()}>{value?.toString() || '—'}</p>
                             </div>
                           )
                        })}
                      </div>
                    </div>

                    {itrData.incomeDetails && Object.keys(itrData.incomeDetails).length > 0 && (
                      <div className="pt-8 border-t border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <AlertCircle className="text-blue-600" />
                          Income Details
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(itrData.incomeDetails).map(([key, value]) => {
                             if (typeof value === 'object') return null;
                             const label = key
                               .replace(/([A-Z])/g, ' $1')
                               .replace(/^./, str => str.toUpperCase());
                             
                             return (
                               <div key={key} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                 <p className="text-xs text-slate-500 uppercase font-bold mb-1 tracking-wider">{label}</p>
                                 <p className="font-semibold text-slate-900">{value?.toString() || 'N/A'}</p>
                               </div>
                             )
                          })}
                        </div>
                      </div>
                    )}

                    {itrData.uploadedDocs && itrData.uploadedDocs.length > 0 && (
                      <div className="pt-8 border-t border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                          <Upload className="text-blue-600" />
                          Uploaded Documents
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {itrData.uploadedDocs.map((doc, index) => (
                            <div key={doc._id || index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                  <FileText size={20} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-slate-900 truncate max-w-[200px]">
                                    {doc.fileName || 'Document'}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {formatDate(doc.uploadedAt || doc.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewDocument(doc)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View"
                                >
                                  <Eye size={18} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 font-medium">No filled form data found for this order.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium text-lg">No documents requested by CA yet.</p>
                <p className="text-slate-500 text-sm mt-1">When your assigned CA requests additional documents, they will appear here.</p>
              </div>
            )}

          </div>
        </div>

        {/* Footer - Balanced */}
        <div className="border-t border-slate-200 p-6 bg-slate-50 flex-shrink-0">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-10 py-3 bg-white border border-slate-300 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm"
            >
              Close Insight
            </button>
          </div>
        </div>
      </div>

      {/* Request Document Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Request Document</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Document Type
                </label>
                <select className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select document type</option>
                  <option value="form16">Form 16</option>
                  <option value="form26as">Form 26AS</option>
                  <option value="ais">Annual Information Statement</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message to Client
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Please provide additional details..."
                ></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Document requested');
                    setShowRequestModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-[#2563eb] text-white rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
