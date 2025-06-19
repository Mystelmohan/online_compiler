import React, { useState } from 'react';
import './login.css';
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
      const res = await axios.post('http://localhost:5000/login', {
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
              required
            />
            <br />
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <br />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <br />
            <Link to="/Register">Don't have an account? Sign Up</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
