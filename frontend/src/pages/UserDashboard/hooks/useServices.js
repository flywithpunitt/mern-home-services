// useServices.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../config/api';
import { getAuthHeader } from '../../../utils/auth';

export const useServices = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
        // Fallback to mock data
        const mockServices = [
          {
            _id: '1',
            name: 'House Cleaning',
            category: 'cleaning',
            description: 'Professional house cleaning service',
            price: 299,
            rating: { average: 4.5, count: 120 }
          },
          {
            _id: '2',
            name: 'Plumbing Service',
            category: 'plumbing',
            description: 'Expert plumbing solutions',
            price: 399,
            rating: { average: 4.3, count: 85 }
          }
        ];
        setServices(mockServices);
        setFilteredServices(mockServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  return {
    services,
    filteredServices,
    isLoading,
    error
  };
};