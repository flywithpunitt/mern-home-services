import { useEffect, useState } from "react";

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("https://mern-home-services.onrender.com/api/services")
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error("Error fetching services:", error));
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Available Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service._id} className="p-4 border rounded shadow-lg">
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="text-gray-700">{service.description}</p>
              <p className="font-bold mt-2">Price: ${service.price}</p>
            </div>
          ))
        ) : (
          <p>Loading services...</p>
        )}
      </div>
    </div>
  );
};

export default Services;
