import React from 'react'
import './home.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export const Home = () => {
  const[post,setPost]=useState([])
  useEffect(()=>{
    axios.get("http://localhost:3001/Programs")
    .then(res=>{setPost(res.data)})
    .catch(err=>console.log(err))

  },[])
  return (
    <div>
      <h1>Programs</h1>
      <div className='main'>
        {post.map(x=>
          <div className='list-item'>
            
            <Link to='/program' className='link' state={{data:x}}><p className='programList'>{x.id} . {x.program_name}</p> </Link>
          </div>
        )}
      </div>
    </div>
  )
}
