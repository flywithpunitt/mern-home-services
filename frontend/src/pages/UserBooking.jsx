import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin } from 'lucide-react';

const API_BASE_URL = 'https://mern-home-services.onrender.com/api';

const UserBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/bookings/user`, {
          headers: getAuthHeader()
        });
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Map section - fixed height */}
      <div className="w-full h-[10vh]">
        {/* Your map component here */}
      </div>

      {/* Bookings container - takes remaining height */}
      <div className="flex-1 bg-gray-50 p-6 overflow-hidden flex flex-col rounded-lg border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Bookings</h2>

        {/* Scrollable container for bookings */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
            {isLoading ? (
              <div className="col-span-2 flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : bookings.map((booking) => (
              <div 
                key={booking._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {booking.service?.name || 'Service Name'}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Provider: {booking.provider?.name}
                    </p>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {new Date(booking.date).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {booking.location?.name || 'Location not specified'}
                    </span>
                  </div>
                </div>

                {booking.service?.price && (
                  <div className="mt-3 text-sm font-medium text-blue-600">
                    Price: ₹{booking.service.price}
                  </div>
                )}
              </div>
            ))}

            {!isLoading && bookings.length === 0 && (
              <div className="col-span-2 text-center py-8 bg-white rounded-2xl shadow">
                <p className="text-gray-500">No bookings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBooking;