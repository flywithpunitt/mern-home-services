// useBooking.js
import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { getAuthHeader } from '../../../utils/auth';

export const useBooking = ({ selectedService, selectedProvider, selectedLocation, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBooking = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Create the booking
      const bookingResponse = await axios.post(`${API_BASE_URL}/bookings`, {
        serviceId: selectedService._id,
        providerId: selectedProvider._id,
        location: {
          name: selectedLocation.name,
          coordinates: selectedLocation.coordinates
        }
      }, {
        headers: getAuthHeader()
      });

      // Send notification to provider
      await axios.post(`${API_BASE_URL}/notifications/provider`, {
        providerId: selectedProvider._id,
        bookingId: bookingResponse.data._id,
        type: 'NEW_BOOKING',
        message: `New booking request for ${selectedService.name}`,
        details: {
          serviceName: selectedService.name,
          customerLocation: selectedLocation.name,
          bookingTime: new Date().toISOString(),
          price: selectedProvider.price
        }
      }, {
        headers: getAuthHeader()
      });

      onSuccess(`Booking confirmed successfully! Provider ${selectedProvider.name} has been notified and will contact you shortly.`);
    } catch (error) {
      console.error('Error in booking process:', error);
      setError(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleBooking, isLoading, error };
};