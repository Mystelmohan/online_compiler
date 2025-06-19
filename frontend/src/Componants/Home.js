import React, { useEffect, useState } from 'react';
import './home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth'; // Ensure you have auth context

export const Home = () => {
  const [post, setPost] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth(); // username from context

  useEffect(() => {
    axios.get("http://localhost:5000/programs")
      .then(res => setPost(res.data))
      .catch(err => {
        console.error("Error fetching programs:", err);
        alert("Failed to load programs.");
      });

    if (auth.user) {
      axios.get(`http://localhost:5000/user/${auth.user}/completed`)
        .then(res => setCompleted(res.data.completedPrograms || []))
        .catch(err => {
          console.warn("Error fetching completed programs:", err);
          setCompleted([]);
        })
        .finally(() => setLoading(false));
    } else {
      setCompleted([]);
      setLoading(false);
    }
  }, [auth.user]);

  return (
    <div>
      <h1>Programs</h1>
      <div className='main'>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading programs...</p>
        ) : post.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No programs available.</p>
        ) : (
          post.map((program) => (
            <div className='list-item' key={program.id}>
              <Link to='/program' className='link' state={{ data: program }}>
                <p className='programList'>
                  {program.id}. {program.program_name}
                  {completed.includes(program.id) && (
                    <span
                      aria-label="Completed"
                      title="Completed"
                      style={{ color: 'green', marginLeft: 10 }}
                    >
                      ✔
                    </span>
                  )}
                </p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
