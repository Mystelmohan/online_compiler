import React from 'react';
import { useAuth } from './Auth';
import { FaUserNinja } from 'react-icons/fa';
import './profile.css'; // Dark theme styles

export default function Profile() {
  const auth = useAuth();
  const handleLogout = () => {
    auth.logout();
  };

  const name = sessionStorage.getItem("name");

  return (
    <div>
      <style>
        {`
          html, body, #root {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
          }
        `}
      </style>
    
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center py-12 px-6">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <FaUserNinja className="text-blue-400 text-6xl" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-blue-400">Welcome!</h1>
        <h2 className="text-xl mb-6">User Name: <span className="text-white font-semibold">{name}</span></h2>
        <button
          className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg font-medium shadow-md"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
    </div>
  );
}