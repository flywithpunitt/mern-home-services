import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Grid } from 'lucide-react';

// Components
import { DashboardMap } from './components/DashboardMap';
import { ServicesGrid } from './components/ServicesGrid';
import { LocationSearch } from './components/LocationSearch';
import { ProvidersGrid } from './components/ProvidersGrid';
import { BookingConfirmation } from './components/BookingConfirmation';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SuccessAlert } from './components/SuccessAlert';
import { ErrorAlert } from './components/ErrorAlert';

// Hooks and Utils
import { useMap } from './hooks/useMap';
import { useServices } from './hooks/useServices';
import { useProviders } from './hooks/useProviders';
import { useBooking } from './hooks/useBooking';
import { getAuthHeader } from '../../utils/auth';

const UserDashboard = () => {
  const [step, setStep] = useState('dashboard');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const { 
    map, 
    mapRef, 
    currentMarker, 
    handleLocationSelect 
  } = useMap();

  const {
    services,
    filteredServices,
    isLoadingServices,
    servicesError
  } = useServices();

  const {
    providers,
    isLoadingProviders,
    providersError
  } = useProviders(selectedService, selectedLocation);

  const {
    handleBooking,
    isBookingLoading,
    bookingError
  } = useBooking({
    selectedService,
    selectedProvider,
    selectedLocation,
    onSuccess: (message) => {
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(null), 5000);
      setStep('dashboard');
    }
  });

  // Render Dashboard Home
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

  return (
    <div className="h-screen flex flex-col">
      <DashboardMap 
        ref={mapRef}
        currentMarker={currentMarker}
      />
      <div className="w-full h-[60vh] bg-gray-50 p-0 flex items-center justify-center relative">
        {step === 'dashboard' && renderDashboard()}
        {step === 'services' && (
          <ServicesGrid
            services={filteredServices}
            isLoading={isLoadingServices}
            error={servicesError}
            onServiceSelect={(service) => {
              setSelectedService(service);
              setStep('location');
            }}
            onBack={() => setStep('dashboard')}
          />
        )}
        {step === 'location' && (
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            onBack={() => setStep('services')}
          />
        )}
        {step === 'providers' && (
          <ProvidersGrid
            providers={providers}
            isLoading={isLoadingProviders}
            error={providersError}
            onProviderSelect={(provider) => {
              setSelectedProvider(provider);
              setStep('booking');
            }}
            onBack={() => setStep('location')}
          />
        )}
        {step === 'booking' && (
          <BookingConfirmation
            service={selectedService}
            provider={selectedProvider}
            location={selectedLocation}
            isLoading={isBookingLoading}
            error={bookingError}
            onConfirm={handleBooking}
            onBack={() => setStep('providers')}
          />
        )}
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