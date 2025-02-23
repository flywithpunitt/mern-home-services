import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Clock, ChevronLeft, Star, XCircle, Grid,Home,Calendar,Settings  } from 'lucide-react';
import axios from 'axios';
import UserBooking from './UserBooking';


// Base API URL
const API_BASE_URL = 'https://mern-home-services.onrender.com/api';

// Custom Error Alert Component
const ErrorAlert = ({ message }) => (
  <div className="bg-red-50 text-red-800 p-4 mb-4 rounded-lg border border-red-200">
    {message}
  </div>
);

// Success Alert Component
const SuccessAlert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 shadow-lg max-w-md">
    <div className="flex justify-between items-start">
      <div className="flex-1">{message}</div>
      <button 
        onClick={onClose}
        className="ml-4 text-green-600 hover:text-green-800"
      >
        ×
      </button>
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const UserDashboard = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [step, setStep] = useState('dashboard');
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [recommendedLocations, setRecommendedLocations] = useState([]);
  const [locationInput, setLocationInput] = useState('');
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    const mapInstance = L.map(mapRef.current, {
      center: [28.6139, 77.2090], // Delhi coordinates
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(mapInstance);

    setMap(mapInstance);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  // Cleanup markers on unmount
  useEffect(() => {
    return () => {
      if (currentMarker) {
        currentMarker.remove();
      }
    };
  }, [currentMarker]);

  // Get auth header
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch Services
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/services`, {
          headers: getAuthHeader()
        });
        
        const processedServices = (Array.isArray(response.data) ? response.data : response.data.services || [])
          .map(service => ({
            _id: service._id || service.id,
            name: service.name,
            category: service.category,
            description: service.description,
            price: service.price,
            rating: {
              average: service.rating?.average || 0,
              count: service.rating?.count || 0
            }
          }));

        setServices(processedServices);
        setFilteredServices(processedServices);
        setError(null);
      } catch (error) {
        console.error('Error fetching services:', error);
        setError('Failed to fetch services. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchServices();
  }, []);

  // Fetch Locations using Nominatim API
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

  // Fetch Providers
  useEffect(() => {
    const loadProviders = async () => {
      if (selectedService && selectedLocation) {
        setIsLoading(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/providers`, {
            headers: getAuthHeader(),
            params: {
              serviceId: selectedService._id,
              latitude: selectedLocation.coordinates[0],
              longitude: selectedLocation.coordinates[1],
              radius: 10
            }
          });
          
          const processedProviders = (Array.isArray(response.data) ? response.data : response.data.providers || [])
            .map(provider => ({
              _id: provider._id || provider.id,
              name: provider.name || 'Unknown Provider',
              experience: provider.experience || '0 years',
              rating: Number(provider.rating) || 0,
              price: Number(provider.price) || 0,
              availability: Boolean(provider.availability)
            }));

          if (processedProviders.length === 0) {
            setError('No providers available in your area for this service.');
          }
          
          setProviders(processedProviders);
        } catch (error) {
          console.error('Error fetching providers:', error);
          setError('Failed to fetch providers. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProviders();
  }, [selectedService, selectedLocation]);

  const handleBooking = async () => {
    if (!selectedService || !selectedProvider || !selectedLocation) {
      setError('Please select all required booking details');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Format date to YYYY-MM-DD
      const formattedDate = new Date().toISOString().split('T')[0];
      
      const bookingData = {
        serviceId: selectedService._id,
        providerId: selectedProvider._id,
        date: formattedDate
      };

      // Log the data we're sending
      console.log('Trying to create booking with data:', bookingData);
      console.log('Auth header:', getAuthHeader());

      const response = await axios.post(
        `${API_BASE_URL}/bookings`,
        bookingData,
        { headers: getAuthHeader() }
      );

      console.log('Booking response:', response.data);

      setSuccessMessage('Booking confirmed successfully!');
      setTimeout(() => {
        setSuccessMessage(null);
        setStep('dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error in booking process:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Attempted booking data:', error.config?.data);
      setError(`Failed to create booking: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Icon mapping for services
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

  // Location Selection Handler
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setLocationInput(location.name);
    setRecommendedLocations([]);
    setStep('providers');

    if (map && location.coordinates) {
      if (currentMarker) {
        currentMarker.remove();
      }
      
      try {
        const newMarker = L.marker(location.coordinates)
          .addTo(map)
          .bindPopup(location.name)
          .openPopup();
        
        setCurrentMarker(newMarker);
        map.setView(location.coordinates, 14);
      } catch (error) {
        console.error('Error updating map:', error);
      }
    }
  };

  // Render Dashboard
  const renderDashboard = () => (
    <div className="h-full flex flex-col justify-center items-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Home Services Dashboard
        </h1>
        <button 
          onClick={() => setStep('services')}
          className="bg-blue-600 text-white px-8 py-3 rounded-full flex items-center justify-center mx-auto space-x-2 hover:bg-blue-700 transition duration-300"
        >
          <Grid className="mr-2" />
          View All Services
        </button>
      </div>
    </div>
  );

  // Render Services
  const renderServices = () => (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Services</h2>
        <button 
          onClick={() => setStep('dashboard')}
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
          {filteredServices.map(service => (
            <div 
              key={service._id}
              onClick={() => {
                setSelectedService(service);
                setStep('location');
              }}
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

  // Render Location Search
  const renderLocationSearch = () => (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 w-[420px] max-w-[90%]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Select Location</h2>
        <button 
          onClick={() => setStep('services')}
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
                onClick={() => handleLocationSelect(location)}
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

  // Render Providers
  const renderProviders = () => (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedService.name} Providers
        </h2>
        <button 
          onClick={() => setStep('location')}
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
              onClick={() => {
                setSelectedProvider(provider);
                setStep('booking');
              }}
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
                  <p className="text-sm text-gray-500 mt-1">{provider.experience} experience</p>
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

  // Render Booking Confirmation
  const renderBooking = () => (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Confirm Booking</h2>
        <button 
          onClick={() => setStep('providers')}
          className="text-gray-600 hover:text-blue-600"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Service Details</h3>
          <div className="flex items-center">
            <div className="text-3xl mr-4">{getServiceIcon(selectedService.category)}</div>
            <div>
              <p className="font-medium">{selectedService.name}</p>
              <p className="text-sm text-gray-600">{selectedService.description}</p>
              <p className="text-sm text-blue-500 mt-1">Base price: ₹{selectedService.price}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Provider Details</h3>
          <div className="flex items-center">
            <div className="text-3xl mr-4">👨‍🔧</div>
            <div>
              <p className="font-medium">{selectedProvider.name}</p>
              <p className="text-sm text-gray-600">{selectedProvider.experience} experience</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">{selectedProvider.rating} rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium">{selectedLocation.name}</p>
              <p className="text-sm text-gray-600">{selectedLocation.area}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-2">Pricing</h3>
          <div className="flex justify-between items-center">
            <span>Service Charge</span>
            <span>₹{selectedProvider.price}</span>
          </div>
        </div>

        <button 
          onClick={handleBooking}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  return (
    
    <div className="h-screen flex flex-col">
      {/* User Dashboard Navbar */}
<div className="bg-white shadow-md py-4 px-6 flex justify-between items-center mt-16">
  <h2 className="text-2xl font-bold text-gray-800"></h2>
  <div className="space-x-4">
    <button
      className={`py-2 px-4 rounded-md ${step === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
      onClick={() => setStep("dashboard")}
    >
      <Home className="w-5 h-5 inline-block mr-2" /> Dashboard
    </button>
    <button
      className={`py-2 px-4 rounded-md ${step === "bookings" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
      onClick={() => setStep("bookings")}
    >
      <Calendar className="w-5 h-5 inline-block mr-2" /> Bookings
    </button>
    <button
      className={`py-2 px-4 rounded-md ${step === "settings" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
      onClick={() => setStep("settings")}
    >
      <Settings className="w-5 h-5 inline-block mr-2" /> Settings
    </button>
  </div>
</div>

      <div 
        ref={mapRef}
        id="dashboard-map" 
        className="w-full h-[40vh] z-0 bg-blue-100"
      />
      <div className="w-full h-[60vh] bg-gray-50 p-0 flex items-center justify-center relative">
        {step === 'dashboard' && renderDashboard()}
        {step === 'services' && renderServices()}
        {step === 'location' && renderLocationSearch()}
        {step === 'providers' && renderProviders()}
        {step === 'booking' && renderBooking()}
        {step === "bookings" && <UserBooking />}
      </div>
      {successMessage && (
        <SuccessAlert 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
        />
      )}
    </div>
  );
};

export default UserDashboard;