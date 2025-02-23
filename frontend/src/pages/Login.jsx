import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth, provider, signInWithPopup } from "../config/firebase";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Existing handleLogin function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("https://mern-home-services.onrender.com/api/auth/login", {
        email,
        password,
      });
      const { token, name, email: userEmail, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userRole", role);
      navigate(role === "provider" ? "/provider-dashboard" : "/user-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  // Existing handleGoogleLogin function
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      const response = await axios.post("https://mern-home-services.onrender.com/api/auth/google-login", {
        token: idToken
      });
      const { token, name, email: userEmail, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userRole", role);
      navigate(role === "provider" ? "/provider-dashboard" : "/user-dashboard");
    } catch (err) {
      setError("Google login failed! Try again.");
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
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to continue to Home Services</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 transform hover:scale-[1.02]"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-gray-400">Or continue with</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg border border-gray-700 transition duration-200 transform hover:scale-[1.02] flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;