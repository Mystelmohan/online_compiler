import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from './Auth';
import { FaCheckCircle } from 'react-icons/fa';

export const Home = () => {
  const [post, setPost] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = useAuth();

  useEffect(() => {
    axios.get("http://localhost:5001/programs")
      .then(res => setPost(res.data))
      .catch(err => {
        console.error("Error fetching programs:", err);
        alert("Failed to load programs.");
      });

    if (auth.user) {
      axios.get(`http://localhost:5001/user/${auth.user}/completed`)
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
    <div className="min-h-screen bg-gray-950 text-white py-10 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-blue-400">Available Programs</h1>
      <div className="max-w-4xl mx-auto space-y-6">
        {loading ? (
          <p className="text-center text-lg">Loading programs...</p>
        ) : post.length === 0 ? (
          <p className="text-center text-lg">No programs available.</p>
        ) : (
          post.map((program) => (
            <div
              key={program.id}
              className="bg-gray-800 hover:bg-gray-700 transition-colors duration-300 p-6 rounded-xl shadow-lg"
            >
              <Link
                to='/program'
                className='flex items-center justify-between text-lg font-medium text-white hover:text-blue-400'
                state={{ data: program }}
              >
                <span>
                  {program.id}. {program.program_name}
                </span>
                {completed.includes(program.id) && (
                  <FaCheckCircle className='text-blue-400 text-xl ml-3' title="Completed" />
                )}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};