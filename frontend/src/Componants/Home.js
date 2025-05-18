import React, { useEffect, useState } from 'react';
import './home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [post, setPost] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/Programs")
      .then(res => setPost(res.data))
      .catch(err => console.log(err));

    const completedFromStorage = JSON.parse(localStorage.getItem('completedPrograms') || '[]');
    setCompleted(completedFromStorage);
  }, []);

  return (
    <div>
      <h1>Programs</h1>
      <div className='main'>
        {post.map(x =>
          <div className='list-item' key={x.id}>
            <Link to='/program' className='link' state={{ data: x }}>
              <p className='programList'>
                {x.id}. {x.program_name}
                {completed.includes(x.id) && <span style={{ color: 'green', marginLeft: 10 }}>✔</span>}
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
