import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://mern-home-services.onrender.com/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative w-full max-w-md p-8 mx-4">
        {/* Background card with blur effect */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join Home Services today</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <select
                className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 text-white focus:outline-none focus:border-blue-500 transition duration-200 appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user" className="bg-gray-800">User</option>
                <option value="provider" className="bg-gray-800">Provider</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02]"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-blue-400 hover:text-blue-300 font-medium transition duration-200"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Optional decorative elements */}
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;