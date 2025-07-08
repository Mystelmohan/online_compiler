import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from './Auth';

export const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-slate-900 text-white px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="mx-auto flex items-center justify-between">
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-blue-400 font-semibold'
                : 'hover:text-blue-300 transition'
            }
          >
            Home
          </NavLink>

          {!user && (
            <>
              <NavLink
                to="/Login"
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'hover:text-blue-300 transition'
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/Register"
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'hover:text-blue-300 transition'
                }
              >
                Register
              </NavLink>
            </>
          )}

          {user === 'Admin' && (
            <NavLink
              to="/Admin"
              className={({ isActive }) =>
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'hover:text-blue-300 transition'
              }
            >
              Admin
            </NavLink>
          )}

          {user && (
            <>
              <NavLink
                to="/Profile"
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-400 font-semibold'
                    : 'hover:text-blue-300 transition'
                }
              >
                Profile
              </NavLink>
              <button
                onClick={logout}
                className="ml-4 text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};