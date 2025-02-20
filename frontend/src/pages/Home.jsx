import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const coreServices = [
    {
      name: 'Home Cleaning',
      description: 'Comprehensive cleaning solutions for every home',
      icon: '🧹',
      background: 'bg-gradient-to-br from-blue-500 to-blue-700'
    },
    {
      name: 'Home Cooking',
      description: 'Professional chefs bringing culinary magic to your kitchen',
      icon: '👨‍🍳',
      background: 'bg-gradient-to-br from-green-500 to-green-700'
    },
    {
      name: 'Plumbing Services',
      description: 'Expert solutions for all your plumbing needs',
      icon: '🚿',
      background: 'bg-gradient-to-br from-indigo-500 to-indigo-700'
    },
    {
      name: 'Electrical Services',
      description: 'Safe and reliable electrical maintenance',
      icon: '⚡',
      background: 'bg-gradient-to-br from-purple-500 to-purple-700'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Working Professional',
      quote: 'CoderCraftes has completely transformed how I manage home services. It\'s like having a personal assistant for my home!',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Busy Entrepreneur',
      quote: 'The platform\'s AI matching is incredible. I always get the perfect service provider for my needs.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Homemaker',
      quote: 'Finally, a solution that makes home maintenance simple, transparent, and reliable.',
      avatar: '👩‍🍳'
    }
  ];

  const platformFeatures = [
    {
      title: 'Comprehensive Dashboard',
      description: 'Your all-in-one hub for home services, bookings, and management',
      icon: '📊',
      color: 'bg-gradient-to-r from-blue-500 to-indigo-600'
    },
    {
      title: 'Smart Booking System',
      description: 'Intelligent scheduling with real-time availability and personalized recommendations',
      icon: '🤖',
      color: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      title: 'Secure Payments',
      description: 'Multiple payment options and transparent pricing',
      icon: '💳',
      color: 'bg-gradient-to-r from-purple-500 to-violet-600'
    },
    {
      title: 'Service Tracking',
      description: 'Real-time updates and seamless communication with service providers',
      icon: '📍',
      color: 'bg-gradient-to-r from-rose-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            to="/" 
            className="text-3xl font-bold text-gray-800 hover:text-blue-600 transition duration-300"
          >
            CoderCraftes
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg transition duration-300"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-16 pb-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-800 leading-tight">
          Transform Your Home <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Service Experience
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Unlock a world of seamless home services, personalized solutions, and hassle-free maintenance - 
          all at your fingertips
        </p>
        <div className="space-x-4">
          <Link 
            to="/register" 
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 inline-block"
          >
            Unlock Full Platform
          </Link>
        </div>
      </div>

      {/* Core Services Section */}
      <div className="container mx-auto px-6 py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Our Core Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreServices.map((service, index) => (
            <div 
              key={index} 
              className="relative group overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 ${service.background} opacity-80`}></div>
              <div className="relative z-10 p-6 text-white h-full flex flex-col">
                <div className="text-6xl mb-4 opacity-80">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                <p className="text-sm mb-4 opacity-90 flex-grow">{service.description}</p>
                <Link 
                  to="/register" 
                  className="mt-4 inline-block bg-white text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300 self-start"
                >
                  Book Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          What Awaits You Inside
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platformFeatures.map((feature, index) => (
            <div 
              key={index}
              className="relative group overflow-hidden rounded-2xl shadow-lg transform transition duration-300 hover:scale-105"
            >
              <div 
                className={`absolute inset-0 ${feature.color} opacity-90`}
              />
              <div className="relative z-10 p-6 text-white h-full flex flex-col">
                <div className="text-6xl mb-4 opacity-80">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-sm opacity-90 flex-grow">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-6 py-20 bg-gray-50">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          What Our Users Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 text-center transform transition duration-300 hover:scale-105"
            >
              <div className="text-6xl mb-4 opacity-80">{testimonial.avatar}</div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <h3 className="font-bold text-gray-800">{testimonial.name}</h3>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signup Call to Action */}
      <div className="container mx-auto px-6 py-24 text-center">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          Your Complete Home Services Solution
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Join thousands of satisfied homeowners who have simplified their home maintenance 
          with our intelligent, comprehensive platform
        </p>
        <Link 
          to="/register" 
          className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 inline-block"
        >
          Create Your Account Now
        </Link>
      </div>

     {/* Footer */}
     <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CoderCraftes</h3>
              <p className="text-gray-400">Transforming Home Services Through Innovation</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/register" className="text-gray-300 hover:text-white">Register</Link></li>
                <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
                <li><Link to="/services" className="text-gray-300 hover:text-white">Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-300">📧 info@codercraftes.com</p>
              <p className="text-gray-300">📞 +91-9798075389</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2024 CoderCraftes. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Styles for floating animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>
  );
};

export default Home;