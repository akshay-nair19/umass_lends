/**
 * Custom Requests Page
 * Combined page showing available requests with option to create new requests
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { itemRequestsAPI } from '../utils/api';
import { uploadImage } from '../utils/imageUpload';
import { formatDateOnlyEST } from '../utils/dateUtils';
import Notification from '../components/Notification';
import { useNotification } from '../hooks/useNotification';

const CustomRequests = () => {
  const navigate = useNavigate();
  const { session } = UserAuth();
  const [availableRequests, setAvailableRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const [acceptFormData, setAcceptFormData] = useState({
    condition: '',
    location: '',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [acceptingRequestId, setAcceptingRequestId] = useState(null);
  const { notification, showSuccess, showError, hideNotification } = useNotification();

  useEffect(() => {
    if (!session) {
      navigate('/signin');
      return;
    }
    loadRequests();
  }, [session, navigate]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      // Load available requests (open requests from all users)
      const availableResponse = await itemRequestsAPI.get({ status: 'open' });
      // Load user's own requests
      const myResponse = await itemRequestsAPI.get({ mine: true });
      
      if (availableResponse.success) {
        setAvailableRequests(availableResponse.data || []);
      }
      if (myResponse.success) {
        setMyRequests(myResponse.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load requests');
      showError(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setCreateFormData({ title: '', description: '', category: '' });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!createFormData.title.trim()) {
      showError('Please enter a title for your request');
      return;
    }

    try {
      setSubmitting(true);
      const response = await itemRequestsAPI.create({
        title: createFormData.title.trim(),
        description: createFormData.description.trim() || null,
        category: createFormData.category.trim() || null,
      });

      if (response.success) {
        showSuccess('Request created successfully!');
        setShowCreateModal(false);
        setCreateFormData({ title: '', description: '', category: '' });
        await loadRequests();
      } else {
        showError(response.error || 'Failed to create request');
      }
    } catch (err) {
      showError(err.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptClick = (request) => {
    setSelectedRequest(request);
    setAcceptFormData({ condition: '', location: '' });
    setSelectedImage(null);
    setImagePreview(null);
    setShowAcceptModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showError('Please select an image file');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showError('Image must be less than 5MB');
        return;
      }

      setSelectedImage(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAccept = async (e) => {
    e.preventDefault();
    if (!selectedRequest || !session) return;

    try {
      setAcceptingRequestId(selectedRequest.id);
      setError(null);

      let imageUrl = null;
      if (selectedImage && session.user?.id) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(selectedImage, session.user.id);
        } catch (uploadError) {
          showError(`Failed to upload image: ${uploadError.message}`);
          setUploadingImage(false);
          setAcceptingRequestId(null);
          return;
        }
        setUploadingImage(false);
      }

      const response = await itemRequestsAPI.accept(selectedRequest.id, {
        condition: acceptFormData.condition || null,
        location: acceptFormData.location || null,
        image_url: imageUrl,
      });

      if (response.success) {
        showSuccess('Request accepted! Item created successfully.');
        setShowAcceptModal(false);
        setSelectedRequest(null);
        await loadRequests();
        // Navigate to the created item
        if (response.data?.item?.id) {
          navigate(`/items/${response.data.item.id}`);
        }
      } else {
        showError(response.error || 'Failed to accept request');
      }
    } catch (err) {
      showError(err.message || 'Failed to accept request');
    } finally {
      setAcceptingRequestId(null);
      setUploadingImage(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-green-100 text-green-800 border-green-300',
      accepted: 'bg-blue-100 text-blue-800 border-blue-300',
      fulfilled: 'bg-gray-100 text-gray-800 border-gray-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    };
    return badges[status] || badges.open;
  };

  const getStatusLabel = (status) => {
    const labels = {
      open: 'Open',
      accepted: 'Accepted',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Custom Requests</h1>
        <p className="text-center">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Notification notification={notification} onClose={hideNotification} />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-umass-maroon">Custom Requests</h1>
        <button
          onClick={handleCreateClick}
          className="bg-umass-maroon text-umass-cream px-6 py-3 rounded-lg hover:bg-umass-maroonDark font-semibold transition-colors shadow-md flex items-center gap-2"
        >
          <span>+</span>
          <span>Create Request</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      )}

      {/* My Requests Section (collapsible, shown at top if user has any) */}
      {myRequests.length > 0 && (
        <div className="mb-8">
          <details className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <summary className="cursor-pointer text-xl font-bold text-gray-900 mb-4 list-none">
              <div className="flex justify-between items-center">
                <span>My Requests ({myRequests.length})</span>
                <span className="text-sm font-normal text-gray-500">Click to expand/collapse</span>
              </div>
            </summary>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded border ${getStatusBadge(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                  </div>

                  {request.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{request.description}</p>
                  )}

                  {request.category && (
                    <span className="inline-block mb-3 px-2 py-1 bg-umass-maroon text-umass-cream text-xs rounded">
                      {request.category}
                    </span>
                  )}

                  <div className="text-sm text-gray-500 mb-3">
                    Created: {formatDateOnlyEST(request.created_at)}
                  </div>

                  {request.status === 'accepted' && request.created_item_id && (
                    <Link
                      to={`/items/${request.created_item_id}`}
                      className="block w-full bg-umass-maroon text-umass-cream px-4 py-2 rounded-lg hover:bg-umass-maroonDark font-semibold text-center transition-colors mt-3"
                    >
                      View Item →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Available Requests Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Available Requests
          {availableRequests.length > 0 && (
            <span className="text-lg font-normal text-gray-600 ml-2">
              ({availableRequests.length} {availableRequests.length === 1 ? 'request' : 'requests'})
            </span>
          )}
        </h2>

        {availableRequests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
            <p className="text-gray-600 mb-4">No open requests available at the moment.</p>
            <button
              onClick={handleCreateClick}
              className="inline-block bg-umass-maroon text-umass-cream px-6 py-2 rounded-lg hover:bg-umass-maroonDark font-semibold transition-colors"
            >
              Create the First Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{request.title}</h3>

                {request.description && (
                  <p className="text-gray-600 mb-3 line-clamp-3">{request.description}</p>
                )}

                {request.category && (
                  <span className="inline-block mb-3 px-2 py-1 bg-umass-maroon text-umass-cream text-xs rounded">
                    {request.category}
                  </span>
                )}

                <div className="text-sm text-gray-500 mb-4">
                  Requested: {formatDateOnlyEST(request.created_at)}
                </div>

                <button
                  onClick={() => handleAcceptClick(request)}
                  className="w-full bg-umass-maroon text-umass-cream px-4 py-2 rounded-lg hover:bg-umass-maroonDark font-semibold transition-colors"
                >
                  Accept Request
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-umass-maroon">Create New Request</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateFormData({ title: '', description: '', category: '' });
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold">Title *</label>
                  <input
                    type="text"
                    value={createFormData.title}
                    onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                    placeholder="What item are you looking for?"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-umass-maroon focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Description</label>
                  <textarea
                    value={createFormData.description}
                    onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                    placeholder="Tell lenders more about what you're looking for..."
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-umass-maroon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Category</label>
                  <input
                    type="text"
                    value={createFormData.category}
                    onChange={(e) => setCreateFormData({ ...createFormData, category: e.target.value })}
                    placeholder="e.g., Electronics, Books, Clothing"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-umass-maroon focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setCreateFormData({ title: '', description: '', category: '' });
                      setError(null);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-umass-maroon text-umass-cream px-4 py-2 rounded-lg hover:bg-umass-maroonDark font-semibold transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Create Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Accept Request Modal */}
      {showAcceptModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-umass-maroon">Accept Request</h2>
                <button
                  onClick={() => {
                    setShowAcceptModal(false);
                    setSelectedRequest(null);
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Request:</p>
                <p className="font-semibold text-gray-900">{selectedRequest.title}</p>
                {selectedRequest.description && (
                  <p className="text-sm text-gray-600 mt-1">{selectedRequest.description}</p>
                )}
              </div>

              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="block mb-2 font-semibold">Condition</label>
                  <select
                    value={acceptFormData.condition}
                    onChange={(e) => setAcceptFormData({ ...acceptFormData, condition: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-umass-maroon focus:outline-none"
                  >
                    <option value="">Select condition</option>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Location</label>
                  <input
                    type="text"
                    value={acceptFormData.location}
                    onChange={(e) => setAcceptFormData({ ...acceptFormData, location: e.target.value })}
                    placeholder="e.g., Southwest Residential Area"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-umass-maroon focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">Item Image (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-umass-maroon focus:outline-none"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded"
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAcceptModal(false);
                      setSelectedRequest(null);
                      setError(null);
                    }}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={acceptingRequestId === selectedRequest.id || uploadingImage}
                    className="flex-1 bg-umass-maroon text-umass-cream px-4 py-2 rounded-lg hover:bg-umass-maroonDark font-semibold transition-colors disabled:opacity-50"
                  >
                    {uploadingImage ? 'Uploading...' : acceptingRequestId === selectedRequest.id ? 'Accepting...' : 'Accept & Create Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomRequests;

