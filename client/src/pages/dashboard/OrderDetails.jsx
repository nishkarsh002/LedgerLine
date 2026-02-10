import { useState } from 'react';
import { X, Download, Eye, FileText, Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const OrderDetails = ({ order, onClose }) => {
  const [activeTab, setActiveTab] = useState('client-docs');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Mock data - replace with actual API data
  const clientDocuments = [
    {
      id: 1,
      name: 'Screenshot_2026-01-11_....png',
      type: 'UnsupportedDocumentTypeClearTax',
      uploadDate: '2026-01-18T19:40:21.4216420',
      size: '2.3 MB',
      status: 'verified'
    },
    {
      id: 2,
      name: 'Screenshot_2026-01-11_....png',
      type: 'UnsupportedDocumentTypeClearTax',
      uploadDate: '2026-01-18T19:40:20.2507480',
      size: '1.8 MB',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Form_16_2024.pdf',
      type: 'Form 16',
      uploadDate: '2026-01-15T10:30:00',
      size: '450 KB',
      status: 'verified'
    }
  ];

  const caDocuments = [
    {
      id: 1,
      name: 'ITR_Acknowledgement.pdf',
      type: 'ITR Acknowledgement',
      uploadDate: '2026-01-20T14:30:00',
      size: '320 KB',
      sentBy: 'CA Rajesh Kumar'
    },
    {
      id: 2,
      name: 'Tax_Computation.pdf',
      type: 'Tax Computation Sheet',
      uploadDate: '2026-01-19T16:45:00',
      size: '180 KB',
      sentBy: 'CA Rajesh Kumar'
    }
  ];

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
    console.log('Viewing document:', doc);
    // Implement view logic
  };

  const handleDownloadDocument = (doc) => {
    console.log('Downloading document:', doc);
    // Implement download logic
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
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Order Details</h2>
              <p className="text-blue-100">Order ID: {order.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">Service</p>
              <p className="font-semibold">{order.service}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Amount</p>
              <p className="font-semibold">{order.amount}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Status</p>
              <p className="font-semibold capitalize">{order.status.replace('-', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('client-docs')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'client-docs'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Client Uploaded Docs
            </button>
            <button
              onClick={() => setActiveTab('ca-docs')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'ca-docs'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Documents Sent to Client
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Action Bar */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <p className="text-slate-600">
                Please verify the documents and update the appropriate status.
              </p>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
            >
              Request Document
            </button>
          </div>

          {/* Download All Section */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Download All Documents</h3>
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <CheckCircle size={18} />
              {selectedDocs.length === (activeTab === 'client-docs' ? clientDocuments : caDocuments).length
                ? 'Deselect All'
                : 'Select All'}
            </button>
          </div>

          {/* Documents List */}
          <div className="space-y-4">
            {(activeTab === 'client-docs' ? clientDocuments : caDocuments).map((doc, index) => (
              <div key={doc.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={() => handleSelectDoc(doc.id)}
                    className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 mb-1">
                          {index + 1}. Upload Tax Notice to Connect With Tax ...
                        </h4>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-2 text-blue-600">
                            <FileText size={18} />
                            <span className="font-medium">{doc.name}</span>
                          </div>
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                            {doc.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">
                          {formatDate(doc.uploadDate)}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-3">
                        {activeTab === 'client-docs' && (
                          <>
                            {getStatusBadge(doc.status)}
                            <select className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              <option value="">Select action</option>
                              <option value="verify">Mark as Verified</option>
                              <option value="reject">Reject Document</option>
                              <option value="request-reupload">Request Re-upload</option>
                            </select>
                          </>
                        )}
                        {activeTab === 'ca-docs' && (
                          <div className="text-right">
                            <p className="text-sm text-slate-600 mb-1">Sent by</p>
                            <p className="font-semibold text-slate-900">{doc.sentBy}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Download Selected Button */}
          {selectedDocs.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleDownloadSelected}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Download size={20} />
                Download Selected ({selectedDocs.length})
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
              Save Changes
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
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
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
