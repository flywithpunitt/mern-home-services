import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState(""); // To handle provider/user roles
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (token) {
      const name = localStorage.getItem("userName");
      const email = localStorage.getItem("userEmail");
      const role = localStorage.getItem("userRole");
      setUserName(name || "Guest");
      setUserEmail(email || "guest@example.com");
      setUserRole(role || "user"); // Default to user if role is missing
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 shadow-md backdrop-blur-md" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo */}
          <Link to="/" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent hover:from-indigo-700 hover:to-blue-600 transition duration-500">
            Home Services
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:bg-gray-100">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:bg-gray-100">
              About Us
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:bg-gray-100">
              Services
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:bg-gray-100">
              Contact Us
            </Link>

            {token ? (
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <strong>{userName}</strong>
                      <p className="text-gray-500">{userEmail}</p>
                    </div>
                    <div className="border-t border-gray-200"></div>
                    
                    {/* Dynamic Dashboard Link */}
                    {userRole === "provider" ? (
                      <Link to="/provider-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Provider Dashboard
                      </Link>
                    ) : (
                      <Link to="/user-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        User Dashboard
                      </Link>
                    )}
                    
                    <Link to="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Manage Bookings
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-sm">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:bg-gray-100">
                  Login
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition duration-500">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              {isMenuOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 w-full bg-white shadow-lg z-50">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 text-lg" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 text-lg" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-600 text-lg" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 text-lg" onClick={() => setIsMenuOpen(false)}>Contact Us</Link>

            {token ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 text-lg" onClick={() => setIsMenuOpen(false)}>View Profile</Link>
                <Link to="/bookings" className="text-gray-600 hover:text-blue-600 text-lg" onClick={() => setIsMenuOpen(false)}>Manage Bookings</Link>
                <button onClick={handleLogout} className="text-red-600 text-lg">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 text-lg" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-full text-lg" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
