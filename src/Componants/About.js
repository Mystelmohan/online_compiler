import React, { useState } from 'react';
import run from './run.png';
import './editor.css';
import { CodeEdit } from './CodeEdit';
import { saveAs } from 'file-saver';

export const About = () => {
  const [selectedOption, setSelectedOption] = useState('java');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setCode(''); // Reset code when language changes
    setOutput(''); // Reset output
    setError(''); // Reset error
  };

  const handleRun = async () => {
    setLoading(true);
    const endpoint = selectedOption === 'python' ? 'http://localhost:5000/run-python' : 'http://localhost:5000/run-java';
    const formData = new FormData();
    const file = new Blob([code], { type: 'text/plain' });
    const fileName = selectedOption === 'python' ? 'Main.py' : 'Main.java';
    formData.append('codeFile', file, fileName);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();

      if (data.error) {
        setError(`Error: ${data.error}`);
        setOutput('');
      } else {
        setOutput(data.output);
        setError('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`Error: ${error.message}`);
      setOutput('');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Main.${selectedOption === 'python' ? 'py' : 'java'}`);
  };

  return (
    <div className='editor-container'>
      <div className='question'>
        <h1>Question</h1>
        <p>Write a Fibonacci program.</p>
      </div>
      <div className='code-editor'>
        <div className='top-edit'>
          <div>
            <p>Language</p>
            <select id="option" value={selectedOption} onChange={handleChange}>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select> 
          </div>
          <div className='btn-group'>
            <button className='btn-run' onClick={handleRun} disabled={loading}>
              {loading ? 'Running...' : 'Run'} <img src={run} width={15} height={15} alt="run" />
            </button>
            <button className='btn-save' onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
        <CodeEdit selectedOption={selectedOption} onChange={setCode} value={code} />
      </div>
      <div className='output'>
        {error && <div className='error'>{error}</div>}
        {!error && output && (
          <>
            <h2>Output</h2>
            <pre>{output}</pre>
          </>
        )}
      </div>
    </div>
  );
};
