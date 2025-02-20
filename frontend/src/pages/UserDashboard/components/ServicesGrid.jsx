import React from 'react';
import { ChevronLeft, Star, Clock } from 'lucide-react';
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

export const ServicesGrid = ({ 
  services, 
  isLoading, 
  error, 
  onServiceSelect, 
  onBack 
}) => (
  <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full overflow-y-auto">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Available Services</h2>
      <button 
        onClick={onBack}
        className="text-gray-600 hover:text-blue-600"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
    </div>

    {error && <ErrorAlert message={error} />}
    
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map(service => (
          <div 
            key={service._id}
            onClick={() => onServiceSelect(service)}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">
                {getServiceIcon(service.category)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{service.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {service.rating?.average || 0}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-500">
                    Starting from ₹{service.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);