import React from 'react'
import { useAuth } from './Auth'
import images from './images/image.png'
export default function Profile() {
  const auth=useAuth()
  const handleLogout=()=>{
    auth.logout()
  }
  return (
    <div className='prof'>
      <br></br>
      <img src={images} alt='pic' height='100px' width='100px'/>
      <h1>Welcome </h1><br></br>
      <h2>User Name: {sessionStorage.getItem("name")}</h2><br></br>
      <button className='butn' onClick={handleLogout}>Log Out</button>
    </div>
  )
}
