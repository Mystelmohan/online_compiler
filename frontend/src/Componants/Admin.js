import axios from 'axios';
import './form.css';
import React, { useEffect, useState } from 'react';

export default function Admin() {
  const [post, setPost] = useState([]);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [input1, setInput1] = useState('');
  const [output1, setOutput1] = useState('');
  const [input2, setInput2] = useState('');
  const [output2, setOutput2] = useState('');
  const [input3, setInput3] = useState('');
  const [output3, setOutput3] = useState('');

  const [popup, setPopup] = useState(false);
  const [id1, setId1] = useState('');
  const [name1, setName1] = useState('');
  const [inputup1, setInputup1] = useState('');
  const [outputup1, setOutputup1] = useState('');
  const [inputup2, setInputup2] = useState('');
  const [outputup2, setOutputup2] = useState('');
  const [inputup3, setInputup3] = useState('');
  const [outputup3, setOutputup3] = useState('');

  const API_URL = "http://localhost:5000/programs";

  const openpopup = (data) => {
    setPopup(true);
    setId1(data.id);
    setName1(data.program_name);
    setInputup1(data.input1);
    setOutputup1(data.output1);
    setInputup2(data.input2);
    setOutputup2(data.output2);
    setInputup3(data.input3);
    setOutputup3(data.output3);
  };

  const clearForm = () => {
    setId('');
    setName('');
    setInput1('');
    setOutput1('');
    setInput2('');
    setOutput2('');
    setInput3('');
    setOutput3('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id || !name) return alert('Id and Program Name are required');
    try {
      await axios.post(API_URL, {
        id: Number(id),
        program_name: name,
        input1,
        output1,
        input2,
        output2,
        input3,
        output3,
      });
      fetchPrograms();
      clearForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${id1}`, {
        id: Number(id1),
        program_name: name1,
        input1: inputup1,
        output1: outputup1,
        input2: inputup2,
        output2: outputup2,
        input3: inputup3,
        output3: outputup3,
      });
      setPopup(false);
      fetchPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchPrograms();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPrograms = () => {
    axios
      .get(API_URL)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>
        <label>Id:</label>
        <input type='number' value={id} onChange={(e) => setId(e.target.value)} required />
        <br />
        <label>Program Name:</label>
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} required />
        <br />
        <label>Input1:</label>
        <input type='text' value={input1} onChange={(e) => setInput1(e.target.value)} />
        <br />
        <label>Output1:</label>
        <input type='text' value={output1} onChange={(e) => setOutput1(e.target.value)} />
        <br />
        <label>Input2:</label>
        <input type='text' value={input2} onChange={(e) => setInput2(e.target.value)} />
        <br />
        <label>Output2:</label>
        <input type='text' value={output2} onChange={(e) => setOutput2(e.target.value)} />
        <br />
        <label>Input3:</label>
        <input type='text' value={input3} onChange={(e) => setInput3(e.target.value)} />
        <br />
        <label>Output3:</label>
        <input type='text' value={output3} onChange={(e) => setOutput3(e.target.value)} />
        <br />
        <button type='submit'>Submit</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Program Name</th>
            <th>Input1</th>
            <th>Output1</th>
            <th>Input2</th>
            <th>Output2</th>
            <th>Input3</th>
            <th>Output3</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {post.map((x) => (
            <tr key={x.id}>
              <td>{x.id}</td>
              <td>{x.program_name}</td>
              <td>{x.input1}</td>
              <td>{x.output1}</td>
              <td>{x.input2}</td>
              <td>{x.output2}</td>
              <td>{x.input3}</td>
              <td>{x.output3}</td>
              <td>
                <button onClick={() => openpopup(x)}>Update</button>
                <button onClick={() => handleDelete(x.id)} className='del'>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popup && (
        <div className='popup'>
          <form onSubmit={handleUpdate}>
            <button
              type='button'
              className='close'
              onClick={() => setPopup(false)}
              style={{ float: 'right' }}
            >
              X
            </button>
            <label>Id:</label>
            <input type='number' value={id1} onChange={(e) => setId1(e.target.value)} />
            <br />
            <label>Name:</label>
            <input type='text' value={name1} onChange={(e) => setName1(e.target.value)} />
            <br />
            <label>Input1:</label>
            <input type='text' value={inputup1} onChange={(e) => setInputup1(e.target.value)} />
            <br />
            <label>Output1:</label>
            <input type='text' value={outputup1} onChange={(e) => setOutputup1(e.target.value)} />
            <br />
            <label>Input2:</label>
            <input type='text' value={inputup2} onChange={(e) => setInputup2(e.target.value)} />
            <br />
            <label>Output2:</label>
            <input type='text' value={outputup2} onChange={(e) => setOutputup2(e.target.value)} />
            <br />
            <label>Input3:</label>
            <input type='text' value={inputup3} onChange={(e) => setInputup3(e.target.value)} />
            <br />
            <label>Output3:</label>
            <input type='text' value={outputup3} onChange={(e) => setOutputup3(e.target.value)} />
            <br />
            <button type='submit'>Update</button>
          </form>
        </div>
      )}
    </div>
  );
}
