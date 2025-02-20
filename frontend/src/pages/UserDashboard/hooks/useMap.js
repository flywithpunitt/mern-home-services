// useMap.js
import { useState, useRef, useEffect } from 'react';
import L from 'leaflet';

export const useMap = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentMarker, setCurrentMarker] = useState(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const mapInstance = L.map(mapRef.current, {
      center: [28.6139, 77.2090],
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

  useEffect(() => {
    return () => {
      if (currentMarker) {
        currentMarker.remove();
      }
    };
  }, [currentMarker]);

  const handleLocationSelect = (location) => {
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
    return location;
  };

  return { map, mapRef, currentMarker, handleLocationSelect };
};