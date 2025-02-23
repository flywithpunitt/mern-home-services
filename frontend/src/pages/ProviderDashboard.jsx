import React, { useState, useEffect } from 'react';
import { Home, Calendar, Settings, PlusCircle, Edit, Trash2 } from 'lucide-react';
import Bookings from './Booking';

const API_BASE_URL = 'https://mern-home-services.onrender.com/api';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [error, setError] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    category: 'Repair',
    description: '',
    price: '',
    location: 'Mumbai',
    provider: localStorage.getItem('userId'),
    availability: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch services');
      const data = await response.json();
      setServices(data);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load services');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newService,
          price: Number(newService.price)
        })
      });

      if (!response.ok) throw new Error('Failed to add service');
      await fetchServices();
      setIsAddModalOpen(false);
      setNewService({
        name: '',
        category: 'Repair',
        description: '',
        price: '',
        location: 'Mumbai',
        provider: localStorage.getItem('userId'),
        availability: true
      });
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add service');
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure?')) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete');
      await fetchServices();
    } catch (error) {
      setError('Failed to delete service');
    }
  };

  const handleOpenEditModal = (service) => {
    setSelectedService({
      ...service,
      price: String(service.price)
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/services/${selectedService._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...selectedService,
          price: Number(selectedService.price)
        })
      });

      if (!response.ok) throw new Error('Failed to update');
      await fetchServices();
      setIsEditModalOpen(false);
      setSelectedService(null);
    } catch (error) {
      setError('Failed to update service');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => setActiveTab('services')}
            className={`${
              activeTab === 'services'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Home className="w-5 h-5 mr-2" /> Services
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`${
              activeTab === 'bookings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Calendar className="w-5 h-5 mr-2" /> Bookings
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Settings className="w-5 h-5 mr-2" /> Settings
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'services' && (
          <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Services</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
              >
                <PlusCircle size={20} />
                Add Service
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">
                {error}
              </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div key={service._id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenEditModal(service)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(service._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{service.description}</p>
                  <div className="mt-4 flex justify-between text-sm">
                    <span className="text-gray-500">{service.location}</span>
                    <span className="font-semibold text-blue-600">₹{service.price}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Service Modal */}
            {isAddModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4">Add New Service</h2>
                  <form onSubmit={handleAddService} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={newService.category}
                        onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="Repair">Repair</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Plumbing">Plumbing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={newService.price}
                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <input
                        type="text"
                        value={newService.location}
                        onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddModalOpen(false)}
                        className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add Service
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Service Modal */}
            {isEditModalOpen && selectedService && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4">Edit Service</h2>
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={selectedService.name}
                        onChange={(e) => setSelectedService({ ...selectedService, name: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={selectedService.category}
                        onChange={(e) => setSelectedService({ ...selectedService, category: e.target.value })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="Repair">Repair</option>
                        <option value="Cleaning">Cleaning</option>
                        <option value="Plumbing">Plumbing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={selectedService.description}
                        onChange={(e) => setSelectedService({ ...selectedService, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (₹)</label>
                      <input
                        type="number"
                        value={selectedService.price}
                        onChange={(e) => setSelectedService({ ...selectedService, price: e.target.value })}
                        className="w-full p-2 border rounded"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Location</label>
                      <input
                        type="text"
                        value={selectedService.location}
                        onChange={(e) => setSelectedService({ ...selectedService, location: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

       {activeTab === 'bookings' && <Bookings />}

        {activeTab === 'settings' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600">Settings feature coming soon...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;