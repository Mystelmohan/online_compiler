import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sign.css';

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

    axios.post('http://localhost:5000/signup', {
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
    <div className='sign-cont'>
      <div className='tot'>
        <div className='left-img'></div>
        <div className='sign'>
          <form onSubmit={handleSignup}>
            <h1>Sign Up</h1>

            <label>Username</label>
            <input 
              type='text' 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            <br />

            <label>E-mail</label>
            <input 
              type='email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <br />

            <label>Password</label>
            <input 
              type='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <br />

            <button type='submit'>Signup</button>
            <br /><br />
            <Link to='/Login'>Already have an account? Log In</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
