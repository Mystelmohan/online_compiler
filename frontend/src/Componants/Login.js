import React, { useEffect, useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userList, setUserList] = useState([]);
  const auth = useAuth();

  useEffect(() => {
    axios.get('http://localhost:3001/Users')
      .then(res => setUserList(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load user data. Please check your connection.");
      });
  }, []);

  const handleLogin = (event) => {
    event.preventDefault(); // Prevent page refresh
    if (!username || !password) {
      alert("Username and Password are required.");
      return;
    }
    if (!userList || userList.length === 0) {
      alert("User data not loaded. Please try again.");
      return;
    }
    const userExist = userList.some(u => u.username === username && u.password === password);
    if (userExist) {
      auth.login(username);
      navigate('/');
    } else {
      alert("Invalid Username or Password");
    }
  };

  return (
    <div className="login-cont">
      <div className="tot-log">
        <div className="log-img"></div>
        <div className="login">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>
            <label>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            <br />
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <br />
            <button type="submit">Login</button>
            <br />
            <Link to="/Register">Don't have an account? Sign Up</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
