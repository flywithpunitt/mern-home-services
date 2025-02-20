import React from 'react';
import { ChevronLeft, Star, MapPin } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';

const getServiceIcon = (category) => {
  const icons = {
    'cleaning': '🧹',
    'cooking': '👨‍🍳',
    'plumbing': '🚿',
    'electrical': '⚡',
    'default': '🔧'
  };
  return icons[category?.toLowerCase()] || icons['default'];
};

export const BookingConfirmation = ({ 
  service, 
  provider, 
  location, 
  isLoading, 
  error, 
  onConfirm, 
  onBack 
}) => (
  <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full overflow-y-auto">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Confirm Booking</h2>
      <button 
        onClick={onBack}
        className="text-gray-600 hover:text-blue-600"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
    </div>

    {error && <ErrorAlert message={error} />}
    
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-2">Service Details</h3>
        <div className="flex items-center">
          <div className="text-3xl mr-4">{getServiceIcon(service.category)}</div>
          <div>
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-gray-600">{service.description}</p>
            <p className="text-sm text-blue-500 mt-1">Base price: ₹{service.price}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-2">Provider Details</h3>
        <div className="flex items-center">
          <div className="text-3xl mr-4">👨‍🔧</div>
          <div>
            <p className="font-medium">{provider.name}</p>
            <p className="text-sm text-gray-600">{provider.experience} years experience</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{provider.rating} rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-2">Location</h3>
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">{location.name}</p>
            <p className="text-sm text-gray-600">{location.area}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-2">Pricing</h3>
        <div className="flex justify-between items-center">
          <span>Service Charge</span>
          <span>₹{provider.price}</span>
        </div>
      </div>

      <button 
        onClick={onConfirm}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          'Confirm Booking'
        )}
      </button>
    </div>
  </div>
);