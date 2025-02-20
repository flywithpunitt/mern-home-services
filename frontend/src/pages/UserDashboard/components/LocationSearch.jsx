import React, { useState, useEffect } from 'react';
import { MapPin, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';

export const LocationSearch = ({ onLocationSelect, onBack }) => {
  const [locationInput, setLocationInput] = useState('');
  const [recommendedLocations, setRecommendedLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (locationInput.length >= 3) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`
          );
          
          const locations = response.data.map(item => ({
            id: item.place_id,
            name: item.display_name.split(',')[0],
            area: item.display_name.split(',').slice(1, 3).join(','),
            coordinates: [parseFloat(item.lat), parseFloat(item.lon)]
          }));

          setRecommendedLocations(locations);
          setError(null);
        } catch (error) {
          console.error('Error fetching locations:', error);
          setError('Failed to fetch locations. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [locationInput]);

  const handleSelect = (location) => {
    setLocationInput(location.name);
    setRecommendedLocations([]);
    onLocationSelect(location);
  };

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 w-[420px] max-w-[90%]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Select Location</h2>
        <button 
          onClick={onBack}
          className="text-gray-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      
      {error && <ErrorAlert message={error} />}
      
      <div className="relative mb-4">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input 
          type="text"
          value={locationInput}
          onChange={(e) => setLocationInput(e.target.value)}
          placeholder="Enter your location (min. 3 characters)"
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        recommendedLocations.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recommendedLocations.map(location => (
              <div 
                key={location.id}
                onClick={() => handleSelect(location)}
                className="p-3 bg-gray-100 rounded-xl hover:bg-blue-100 cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{location.name}</p>
                    <p className="text-sm text-gray-600">{location.area}</p>
                  </div>
                  <MapPin className="text-blue-500" />
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};