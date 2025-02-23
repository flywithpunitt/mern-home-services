import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { googleProvider,auth,signInWithPopup } from "../config/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle Regular Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await axios.post("https://mern-home-services.onrender.com/api/auth/login", {
        email,
        password,
      });

      const { token, name, email: userEmail, role } = response.data;

      // Save user details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userRole", role);

      // Redirect based on role
      navigate(role === "provider" ? "/provider-dashboard" : "/user-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken(); // Firebase Token

      // Send token to backend for verification
      const response = await axios.post("https://mern-home-services.onrender.com/api/auth/google-login", {
        token: idToken
      });

      const { token, name, email: userEmail, role } = response.data;

      // Save user details in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userRole", role);

      // Redirect based on role
      navigate(role === "provider" ? "/provider-dashboard" : "/user-dashboard");
    } catch (err) {
      setError("Google login failed! Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 text-white p-2 rounded mt-3"
        >
          Login with Google
        </button>

        <p className="mt-4 text-sm">
          Don't have an account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
