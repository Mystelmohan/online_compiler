import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './Auth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <NavLink to="/">Home</NavLink>
      {!user && <NavLink to="/Login">Login</NavLink>}
      {!user && <NavLink to="/Register">Register</NavLink>}
      {user === "Admin" && <NavLink to="/Admin">Admin</NavLink>}
      {user && <NavLink to="/Profile">Profile</NavLink>}
      
    </div>
  );
};
