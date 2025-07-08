import React, { useState } from 'react';
import { CodeEdit } from './CodeEdit';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth';
import { saveAs } from 'file-saver';
import confetti from 'canvas-confetti';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircledIcon } from '@radix-ui/react-icons';

export const Program = () => {
  const { user } = useAuth();
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
  const [questionVisible, setQuestionVisible] = useState(true);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <h2 className="text-xl">Please login to access this page.</h2>
        <button onClick={() => navigate('/Login')} className="ml-4 px-4 py-2 bg-blue-600 rounded">
          Login
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    setCode('');
    setOutput('');
    setError('');
    setTestCasesPassed(0);
    setCanSubmit(false);
  };

  const showPopup = (msg, type) => {
    setPopup({ msg, type });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
   setError('');
    let endpoint = '';
    switch (selectedOption) {
      case 'java':
        endpoint = 'http://localhost:5001/run-java';
        break;
      case 'c':
        endpoint = 'http://localhost:5001/run-c';
        break;
      case 'cpp':
        endpoint = 'http://localhost:5001/run-cpp';
        break;
      default:
        showPopup('❌ Unsupported language selected', 'error');
        setLoading(false);
        return;
    }

    let passed = 0;
    for (let i = 1; i <= 3; i++) {
      const formData = new FormData();
      const extension = selectedOption === 'java' ? 'java' : selectedOption;
      const file = new Blob([code], { type: 'text/plain' });
      formData.append('codeFile', file, `Main.${extension}`);
      formData.append('input', data[`input${i}`]);

      try {
        const res = await fetch(endpoint, { method: 'POST', body: formData });
        const result = await res.json();

        if (result.error) {
          setError(result.error);
          showPopup(`❌ Test case ${i} failed`, 'error');
          break;
        }

        const actual = result.output.trim();
        const expected = data[`output${i}`].trim();
        if (actual === expected) {
          passed++;
          showPopup(`✅ Test case ${i} passed`, 'success');
        } else {
          setOutput(`Output: ${actual}\n❌ Test case ${i} failed\nExpected: ${expected}`);
          showPopup(`❌ Test case ${i} failed`, 'error');
          break;
        }
      } catch (err) {
        showPopup('❌ Server error', 'error');
        break;
      }
    }

    setTestCasesPassed(passed);
    if (passed === 3) {
      setCanSubmit(true);
      showPopup('🎉 All test cases passed!', 'success');
      setOutput('ALL_PASSED');
    }
    setLoading(false);
  };

  const handleSave = () => {
    const getFileExtension = (language) => {
      switch (language) {
        case 'java':
          return 'java';
        case 'c':
          return 'c';
        case 'cpp':
          return 'cpp';
        default:
          return 'txt';
      }
    };

    const extension = getFileExtension(selectedOption);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Main.${extension}`);
  };

  const handleSubmit = async () => {
    const res = await fetch(`http://localhost:5001/user/${user}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ programId: data.id }),
    });
    if (res.ok) {
      showPopup('🎉 Submitted!', 'success');
      confetti({ 
        particleCount: 200, 
        spread: 180, 
        origin: { y: 0.6 },
        zIndex: 9999
      });
    } else {
      showPopup('❌ Failed to submit.', 'error');
    }
  };

  return (
    <>
      <style>
        {`
          html, body, #root {
            width: 100vw;
            height: 100vh;
            overflow: hidden;
          }
        `}
      </style>
      <div className="w-screen h-screen overflow-hidden">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 overflow-hidden">
          <div className="relative bg-gray-900 rounded-lg shadow-lg w-full h-full flex flex-col border border-gray-800 overflow-hidden">
            {popup && (
              <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow z-50 ${
                popup.type === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {popup.msg}
              </div>
            )}

            {/* Toggle Button */}
            <button
              className="absolute top-4 left-4 z-50 bg-blue-700 hover:bg-blue-800 p-2 rounded text-white shadow"
              onClick={() => setQuestionVisible(!questionVisible)}
            >
              {questionVisible ? <ArrowLeftIcon /> : <ArrowRightIcon />}
            </button>

            <PanelGroup direction="horizontal" className="flex-1 w-full">
              {questionVisible && (
                <Panel defaultSize={35} minSize={20} className="border-r border-gray-800 bg-gray-950 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-900 scrollbar-track-gray-800">
                  <div className="p-6">
                    <h1 className="text-2xl text-blue-400 font-bold mb-3">Question</h1>
                    <p className="mb-6 text-lg text-blue-200">{data.program_name}</p>
                    <h3 className="text-blue-300 font-semibold">Sample Input</h3>
                    <pre className="text-gray-300 mb-3 bg-gray-900 rounded p-2">{data.input1}</pre>
                    <h3 className="text-blue-300 font-semibold">Sample Output</h3>
                    <pre className="text-gray-300 bg-gray-900 rounded p-2">{data.output1}</pre>
                  </div>
                </Panel>
              )}

              {questionVisible && <PanelResizeHandle className="w-2 bg-blue-900 hover:bg-blue-700 cursor-col-resize" />}

              <Panel minSize={30} defaultSize={questionVisible ? 65 : 100} className="h-full w-full">
                <PanelGroup direction="vertical" className="h-full w-full">
                  <Panel minSize={20} defaultSize={60} className="flex flex-col">
                    <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-gray-700">
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-blue-200">Language:</label>
                        <select
                          value={selectedOption}
                          onChange={handleChange}
                          className="bg-slate-900 border border-blue-700 px-3 py-1 rounded text-white"
                        >
                          <option value="java">Java</option>
                          <option value="c">C</option>
                          <option value="cpp">C++</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleRun} disabled={loading} className="bg-blue-700 px-4 py-1 rounded hover:bg-blue-800 text-white shadow">
                          {loading ? 'Running...' : 'Run'}
                        </button>
                        <button onClick={handleSave} className="bg-yellow-500 px-4 py-1 rounded hover:bg-yellow-600 text-white shadow">
                          Save
                        </button>
                        {canSubmit && (
                          <button onClick={handleSubmit} className="bg-green-600 px-4 py-1 rounded hover:bg-green-700 text-white shadow flex items-center gap-1">
                            <CheckCircledIcon /> Submit
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-auto bg-gray-950">
                      <CodeEdit selectedOption={selectedOption} onChange={setCode} value={code} />
                    </div>
                  </Panel>
                  <PanelResizeHandle className="h-2 bg-blue-900 hover:bg-blue-700 cursor-row-resize" />
                  <Panel minSize={20} defaultSize={40} className="bg-slate-900 p-4 overflow-auto text-sm border-t border-gray-800">
                    <h2 className="text-green-400 font-semibold mb-2">Output</h2>
                    {error ? (
                      <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
                    ) : output === 'ALL_PASSED' ? (
                      <div className="flex items-center gap-2 bg-green-900 border border-green-700 rounded p-4 text-green-200 font-semibold shadow">
                        <CheckCircledIcon className="w-6 h-6 text-green-400" />
                        All test cases passed! 🎉
                      </div>
                    ) : (
                      <pre className="whitespace-pre-wrap">{output}</pre>
                    )}
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </div>
        </div>
      </div>
    </>
  );
};
