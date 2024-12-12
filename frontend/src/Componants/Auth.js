import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = React.createContext(null);

export default function Auth({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('name');
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = (username) => {
    sessionStorage.setItem('name', username);
    setUser(username);
  };

  const logout = () => {
    sessionStorage.removeItem('name');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
