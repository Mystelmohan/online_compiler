import React, { useState } from 'react';
import run from './images/run.png';
import './editor.css';
import { CodeEdit } from './CodeEdit';
import { saveAs } from 'file-saver';
import { useLocation, useNavigate } from 'react-router-dom';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import confetti from 'canvas-confetti';
import { useAuth } from './Auth'; // Make sure your Auth context is set up correctly

export const Program = () => {
  const { user } = useAuth();   // Get logged-in user from Auth context
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  const [selectedOption, setSelectedOption] = useState('java');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [testCasesPassed, setTestCasesPassed] = useState(0);
  const [canSubmit, setCanSubmit] = useState(false);

  // If user not logged in, show only this message and button
  if (!user) {
    return (
      <div
        className="not-logged-in-message"
        style={{
          padding: 30,
          textAlign: 'center',
          marginTop: 100,
          fontFamily: 'Arial, sans-serif',
          color: '#333',
        }}
      >
        <h2>Please login to access this page.</h2>
        <button
          onClick={() => navigate('/Login')}
          style={{
            marginTop: 20,
            padding: '12px 25px',
            fontSize: '18px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            border: 'none',
            color: 'white',
            borderRadius: '6px',
            boxShadow: '0 4px 8px rgba(0,123,255,0.4)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={e => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={e => (e.target.style.backgroundColor = '#007bff')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    setCode('');
    setOutput('');
    setError('');
    setTestCasesPassed(0);
    setCanSubmit(false);
  };

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleRun = async () => {
    setLoading(true);
    const endpoint =
      selectedOption === 'python'
        ? 'http://localhost:5000/run-python'
        : 'http://localhost:5000/run-java';

    let passed = 0;

    for (let i = 1; i <= 3; i++) {
      const formData = new FormData();
      const file = new Blob([code], { type: 'text/plain' });
      const fileName = selectedOption === 'python' ? 'Main.py' : 'Main.java';
      formData.append('codeFile', file, fileName);
      formData.append('input', data[`input${i}`]);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.error) {
          setError(`Error: ${result.error}`);
          setOutput('');
          showPopup(`❌ Test case ${i} failed (Runtime or Compilation error)`, 'error');
          break;
        } else {
          const actualOutput = result.output.trim();
          const expectedOutput = data[`output${i}`].trim();

          if (actualOutput === expectedOutput) {
            passed++;
            showPopup(`✅ Test case ${i} passed`, 'success');
          } else {
            setOutput(`${actualOutput}\n❌ Test case ${i} failed\nExpected: ${expectedOutput}`);
            showPopup(`❌ Test case ${i} failed (Wrong output)`, 'error');
            break;
          }
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
        setOutput('');
        showPopup(`❌ Internal error at test case ${i}`, 'error');
        break;
      }
    }

    setTestCasesPassed(passed);
    setLoading(false);

    if (passed === 3) {
      setCanSubmit(true);
      showPopup('✅ All 3 test cases passed! You can submit now!', 'success');
      setOutput('✅ All 3 test cases passed!');
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Main.${selectedOption === 'python' ? 'py' : 'java'}`);
  };

  const handleSubmit = () => {
    const completed = JSON.parse(localStorage.getItem('completedPrograms') || '[]');
    if (!completed.includes(data.id)) {
      completed.push(data.id);
      localStorage.setItem('completedPrograms', JSON.stringify(completed));
    }
    showPopup('🎉 Program submitted successfully!', 'success');

    // Confetti effect for 2 seconds
    var duration = 2 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);

      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  };

  return (
    <div className="editor-container dark-theme">
      {popup && <div className={`popup ${popup.type}`}>{popup.message}</div>}

      <Splitter style={{ height: '100vh', width: '100%' }}>
        <SplitterPanel className="left-panel" size={45}>
          <div className="question">
            <h1>Question</h1>
            <p>{data.program_name}</p>
            <h3>Sample Input</h3>
            <p>{data.input1}</p>
            <h3>Sample Output</h3>
            <p>{data.output1}</p>
          </div>
        </SplitterPanel>
        <SplitterPanel className="right-panel" size={65}>
          <Splitter layout="vertical" style={{ height: '100%' }}>
            <SplitterPanel size={60}>
              <div className="code-editor">
                <div className="top-edit">
                  <div>
                    <p>Language</p>
                    <select id="option" value={selectedOption} onChange={handleChange}>
                      <option value="java">Java</option>
                      <option value="python">Python</option>
                    </select>
                  </div>
                  <div className="btn-group">
                    <button className="btn-run" onClick={handleRun} disabled={loading}>
                      {loading ? 'Running...' : 'Run'} <img src={run} width={15} height={15} alt="run" />
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                      Save
                    </button>
                    {canSubmit && (
                      <button className="btn-submit" onClick={handleSubmit}>
                        Submit
                      </button>
                    )}
                  </div>
                </div>
                <CodeEdit selectedOption={selectedOption} onChange={setCode} value={code} />
              </div>
            </SplitterPanel>
            <SplitterPanel size={40} className="left">
              <div className="output">
                <h2>Output</h2>
                {error && <div className="error">{error}</div>}
                {!error && output && <pre>{output}</pre>}
              </div>
            </SplitterPanel>
          </Splitter>
        </SplitterPanel>
      </Splitter>
    </div>
  );
};
