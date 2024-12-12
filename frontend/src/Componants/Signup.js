import axios from 'axios'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './sign.css'
export default function Signup() {
    const[username,setUsername]=useState('')
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const handleSignup=()=>{
      axios.post('http://localhost:3001/Users',{"username":username,"email":email,"password":password}).then(res=>console.log(res)).catch(err=>console.log(err))
    }
  return (
    <div className='sign-cont'>
      <div className='tot'>
      <div className='left-img'></div>
      <div className='sign'>
       <form onSubmit={handleSignup}>
        <h1>SignUp</h1>
        <label>Username</label>
        <input type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}}/>
        <br></br>
        <label>E-mail</label>
        <input type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <br></br>
        <label>Password</label>
        <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}}/>
        <br></br>
        <button type='submit'>Signup</button><br></br><br></br>
        <Link to='/Login'>Already have an account? Log In</Link>
      </form>
      </div>
      </div>
    </div>
  )
}
