// useProviders.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { getAuthHeader } from '../../../utils/auth';

export const useProviders = (selectedService, selectedLocation) => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      if (!selectedService || !selectedLocation) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/providers`, {
          headers: getAuthHeader(),
          params: {
            serviceId: selectedService._id,
            latitude: selectedLocation.coordinates[0],
            longitude: selectedLocation.coordinates[1]
          }
        });
        
        const processedProviders = (Array.isArray(response.data) ? response.data : response.data.providers || [])
          .map(provider => ({
            _id: provider._id || provider.id,
            name: provider.name,
            experience: provider.experience,
            rating: provider.rating || 0,
            price: provider.price,
            availability: provider.availability
          }));

        setProviders(processedProviders);
        setError(null);
      } catch (error) {
        console.error('Error fetching providers:', error);
        setError('Failed to fetch providers. Please try again.');
        // Fallback to mock data
        const mockProviders = [
          {
            _id: '1',
            name: 'Punit',
            experience: '5 years',
            rating: 4.5,
            price: 500,
            availability: true
          },
          {
            _id: '2',
            name: 'Neyaz',
            experience: '3 years',
            rating: 4.2,
            price: 450,
            availability: true
          }
        ];
        setProviders(mockProviders);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [selectedService, selectedLocation]);

  return { providers, isLoading, error };
};