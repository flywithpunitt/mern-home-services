import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../config/firebase"; // Import Firebase auth
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔹 Handle Google Sign-In
  const handleGoogleLogin = async () => {
    setError(""); // Clear previous errors
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const tokenId = await result.user.getIdToken();
      
      console.log("Google Token ID:", tokenId); // ✅ Check in browser console

      // Send token to backend for verification
      const response = await axios.post("https://mern-home-services.onrender.com/api/auth/google-login", {
        token: tokenId,
      });

      const { token, name, email: userEmail, role } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userRole", role);

      navigate(role === "provider" ? "/provider-dashboard" : "/user-dashboard");

    } catch (error) {
      console.error("Google Sign-In failed!", error);
      setError("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        
        {/* Normal Login Form */}
        <form onSubmit={handleGoogleLogin}>
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
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
        </form>

        {/* 🔹 Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-600 text-white p-2 mt-3 rounded flex items-center justify-center"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" alt="Google" className="h-5 w-5 mr-2" />
          Sign in with Google
        </button>

        <p className="mt-4 text-sm">
          Don't have an account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
