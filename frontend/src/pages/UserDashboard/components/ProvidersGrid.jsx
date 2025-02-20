import React from 'react';
import { ChevronLeft, Star, XCircle } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';

export const ProvidersGrid = ({ 
  providers, 
  isLoading, 
  error, 
  onProviderSelect, 
  onBack,
  selectedService 
}) => (
  <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full overflow-y-auto">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">
        {selectedService?.name} Providers
      </h2>
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
    ) : providers.length === 0 ? (
      <div className="text-center py-8">
        <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-600">No providers found for this service and location.</p>
        <p className="text-sm text-gray-500 mt-2">Try selecting a different location or service.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map(provider => (
          <div 
            key={provider._id}
            onClick={() => onProviderSelect(provider)}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">👨‍🔧</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">{provider.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{provider.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{provider.experience} years experience</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-blue-500">₹{provider.price}</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    provider.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {provider.availability ? 'Available' : 'Busy'}
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