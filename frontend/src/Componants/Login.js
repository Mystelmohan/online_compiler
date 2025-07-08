import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Username and Password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/login', {
        username,
        password
      });

      if (res.status === 200) {
        auth.login(username);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-12">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-white border border-white/20">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Welcome Back</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 placeholder-gray-300"
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 placeholder-gray-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md font-semibold ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-300 mt-5">
          Don’t have an account?{' '}
          <Link to="/Register" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}