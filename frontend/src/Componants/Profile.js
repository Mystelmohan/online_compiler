import React from 'react';
import { useAuth } from './Auth';
import images from './images/image.png';
import './profile.css'; // Dark theme styles

export default function Profile() {
  const auth = useAuth();
  const handleLogout = () => {
    auth.logout();
  };

  const name = sessionStorage.getItem("name");

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={images} alt="Profile" className="profile-avatar" />
        <h1>Welcome!</h1>
        <h2>User Name: <span className="username">{name}</span></h2>
        <button className="logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </div>
  );
}
