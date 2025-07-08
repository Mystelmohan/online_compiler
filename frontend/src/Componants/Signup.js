import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    axios.post('http://localhost:5001/signup', {
      username,
      email,
      password
    })
    .then(res => {
      alert("Signup successful!");
      navigate('/Login');
    })
    .catch(err => {
      console.error("Signup error:", err);
      const msg = err.response?.data?.error || "Signup failed. Please try again.";
      alert(msg);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-12">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-white border border-white/20">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-white">Create Your Account</h2>
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200">Username</label>
            <input 
              type='text' 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              placeholder="Enter your username"
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 placeholder-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">E-mail</label>
            <input 
              type='email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 placeholder-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200">Password</label>
            <input 
              type='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 bg-white/10 border border-white/30 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/20 placeholder-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded-md font-semibold"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-300 mt-5">
          Already have an account?{' '}
          <Link to="/Login" className="text-blue-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}