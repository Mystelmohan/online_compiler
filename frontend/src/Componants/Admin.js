import axios from 'axios';
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

  const API_URL = 'http://localhost:5001/programs';

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
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-4 rounded shadow-md max-w-xl mx-auto">
        <h2 className="text-xl font-bold">Add Program</h2>
        <input type='number' value={id} onChange={(e) => setId(e.target.value)} placeholder="Id" className="w-full p-2 bg-gray-700 rounded" required />
        <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder="Program Name" className="w-full p-2 bg-gray-700 rounded" required />
        <input type='text' value={input1} onChange={(e) => setInput1(e.target.value)} placeholder="Input1" className="w-full p-2 bg-gray-700 rounded" />
        <input type='text' value={output1} onChange={(e) => setOutput1(e.target.value)} placeholder="Output1" className="w-full p-2 bg-gray-700 rounded" />
        <input type='text' value={input2} onChange={(e) => setInput2(e.target.value)} placeholder="Input2" className="w-full p-2 bg-gray-700 rounded" />
        <input type='text' value={output2} onChange={(e) => setOutput2(e.target.value)} placeholder="Output2" className="w-full p-2 bg-gray-700 rounded" />
        <input type='text' value={input3} onChange={(e) => setInput3(e.target.value)} placeholder="Input3" className="w-full p-2 bg-gray-700 rounded" />
        <input type='text' value={output3} onChange={(e) => setOutput3(e.target.value)} placeholder="Output3" className="w-full p-2 bg-gray-700 rounded" />
        <button type='submit' className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">Submit</button>
      </form>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-left text-sm bg-gray-800 rounded">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-2">Id</th>
              <th className="p-2">Name</th>
              <th className="p-2">Input1</th>
              <th className="p-2">Output1</th>
              <th className="p-2">Input2</th>
              <th className="p-2">Output2</th>
              <th className="p-2">Input3</th>
              <th className="p-2">Output3</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {post.map((x) => (
              <tr key={x.id} className="border-t border-gray-700">
                <td className="p-2">{x.id}</td>
                <td className="p-2">{x.program_name}</td>
                <td className="p-2">{x.input1}</td>
                <td className="p-2">{x.output1}</td>
                <td className="p-2">{x.input2}</td>
                <td className="p-2">{x.output2}</td>
                <td className="p-2">{x.input3}</td>
                <td className="p-2">{x.output3}</td>
                <td className="p-2 space-x-2">
                  <button onClick={() => openpopup(x)} className="bg-yellow-500 px-3 py-1 rounded">Update</button>
                  <button onClick={() => handleDelete(x.id)} className="bg-red-600 px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <form onSubmit={handleUpdate} className="bg-gray-800 p-6 rounded w-96 text-white space-y-3 relative">
            <button onClick={() => setPopup(false)} className="absolute top-2 right-2 text-red-500 font-bold">X</button>
            <input type='number' value={id1} onChange={(e) => setId1(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <input type='text' value={name1} onChange={(e) => setName1(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <input type='text' value={inputup1} onChange={(e) => setInputup1(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <input type='text' value={outputup1} onChange={(e) => setOutputup1(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <input type='text' value={inputup2} onChange={(e) => setInputup2(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <input type='text' value={outputup2} onChange={(e) => setOutputup2(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <input type='text' value={inputup3} onChange={(e) => setInputup3(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <input type='text' value={outputup3} onChange={(e) => setOutputup3(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
            <button type='submit' className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">Update</button>
          </form>
        </div>
      )}
    </div>
  );
}