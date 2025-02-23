import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

const API_BASE_URL = 'https://mern-home-services.onrender.com/api';

const Bookings = () => {
 const [bookings, setBookings] = useState([]);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState(null);

 // Get auth header
 const getAuthHeader = () => {
   const token = localStorage.getItem('token');
   return token ? { Authorization: `Bearer ${token}` } : {};
 };

 // Fetch bookings
 useEffect(() => {
   const fetchBookings = async () => {
     setIsLoading(true);
     try {
       const response = await axios.get(`${API_BASE_URL}/bookings/provider`, {
         headers: getAuthHeader()
       });
       setBookings(response.data);
       setError(null);
     } catch (error) {
       console.error('Error fetching bookings:', error);
       setError('Failed to fetch bookings');
     } finally {
       setIsLoading(false);
     }
   };

   fetchBookings();
 }, []);

 // Handle booking status update
 const handleStatusUpdate = async (bookingId, newStatus) => {
   try {
     // Status should be 'confirmed' for accept and 'cancelled' for reject
     const status = newStatus === 'rejected' ? 'cancelled' : 'confirmed';
     
     console.log('Updating booking:', bookingId, 'with status:', status);
     
     const response = await axios.put(
       `${API_BASE_URL}/bookings/${bookingId}/status`,
       { status },
       { 
         headers: {
           ...getAuthHeader(),
           'Content-Type': 'application/json'
         }
       }
     );

     // Update local state
     setBookings(prevBookings => 
       prevBookings.map(booking => 
         booking._id === bookingId ? { ...booking, status } : booking
       )
     );

   } catch (error) {
     console.error('Error details:', error.response?.data);
     alert(`Failed to update booking status: ${error.response?.data?.message || error.message}`);
   }
 };

 if (isLoading) {
   return (
     <div className="flex justify-center items-center min-h-[200px]">
       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
     </div>
   );
 }

 if (error) {
   return (
     <div className="p-4 text-red-600 bg-red-50 rounded-lg">
       {error}
     </div>
   );
 }

 return (
   <div className="p-6">
     <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Bookings</h2>
     
     {bookings.length === 0 ? (
       <div className="text-center py-8 text-gray-500">
         No bookings found.
       </div>
     ) : (
       <div className="grid gap-4">
         {bookings.map(booking => (
           <div 
             key={booking._id} 
             className="bg-white rounded-lg shadow p-4 border border-gray-200"
           >
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h3 className="font-semibold text-lg text-gray-800">
                   {booking.service?.name || 'Service'}
                 </h3>
                 <p className="text-gray-600 text-sm mt-1">
                   Customer: {booking.user?.name || 'Customer'}
                 </p>
               </div>
               <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                 booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                 booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                 'bg-yellow-100 text-yellow-800'
               }`}>
                 {booking.status}
               </div>
             </div>

             <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
               <Clock className="h-4 w-4" />
               <span>{new Date(booking.date).toLocaleString()}</span>
             </div>

             <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
               <MapPin className="h-4 w-4" />
               <span>{booking.location?.name}</span>
             </div>

             {booking.status === 'pending' && (
               <div className="flex gap-2 mt-4">
                 <button
                   onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                   className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                 >
                   <CheckCircle className="h-4 w-4" />
                   Accept
                 </button>
                 <button
                   onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                   className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                 >
                   <XCircle className="h-4 w-4" />
                   Reject
                 </button>
               </div>
             )}
           </div>
         ))}
       </div>
     )}
   </div>
 );
};

export default Bookings;