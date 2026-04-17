import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Send, Settings, RotateCcw, ChevronDown, Loader2, MessageCircle, Info, FileCode, History, Copy, Clock, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Workspace.css';

const Workspace = () => {
  const { id } = useParams();
  const { refreshUser } = useAuth();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [outputTab, setOutputTab] = useState('testcases');
  const [language, setLanguage] = useState('cpp');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeCase, setActiveCase] = useState(0);
  const [editorFlex, setEditorFlex] = useState(60);
  const [leftWidth, setLeftWidth] = useState(450); // initial 450px

  const startDragHorizontal = (e) => {
    e.preventDefault();
    const handleMouseMove = (mouseEvent) => {
       const newWidth = mouseEvent.clientX;
       if (newWidth > 300 && newWidth < window.innerWidth - 300) {
          setLeftWidth(newWidth);
       }
    };
    const handleMouseUp = () => {
       document.removeEventListener('mousemove', handleMouseMove);
       document.removeEventListener('mouseup', handleMouseUp);
       document.body.style.cursor = 'default';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ew-resize';
  };

  const startDrag = (e) => {
    e.preventDefault();
    const handleMouseMove = (mouseEvent) => {
       const container = document.querySelector('.workspace-right');
       if (container) {
         const rect = container.getBoundingClientRect();
         // Height from top divided by total height
         const newFlex = ((mouseEvent.clientY - rect.top) / rect.height) * 100;
         if (newFlex > 10 && newFlex < 90) {
            setEditorFlex(newFlex);
         }
       }
    };
    const handleMouseUp = () => {
       document.removeEventListener('mousemove', handleMouseMove);
       document.removeEventListener('mouseup', handleMouseUp);
       document.body.style.cursor = 'default';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'ns-resize';
  };

  // starterCodes from DB per problem
  const getStarterCode = (prob, lang) => {
    if (prob?.starterCodes?.[lang]) return prob.starterCodes[lang];
    // Fallback generic template if DB doesn't have it
    const fn = prob?.handlerFunction || 'solve';
    const map = {
      cpp:    `class Solution {\npublic:\n    auto ${fn}(/* args */) {\n        \n    }\n};`,
      python: `class Solution:\n    def ${fn}(self, /* args */):\n        pass`,
      java:   `class Solution {\n    public Object ${fn}(/* args */) {\n        return null;\n    }\n}`,
      c:      `// C solution\nvoid ${fn}() {\n    \n}`
    };
    return map[lang] || '';
  };

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/problems/${id}`);
        const data = await response.json();
        setProblem(data);
        setCode(getStarterCode(data, language));
      } catch (err) {
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    setSubmitting(true);
    setResult(null);
    setOutputTab('result');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/submit/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      setResult(data);
      if (data.success) {
        refreshUser();
      }
    } catch (err) {
      setResult({ success: false, message: 'Server error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    setOutputTab('result');
    try {
      const response = await fetch(`http://localhost:5000/api/submit/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ success: false, message: 'Server error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatText = (text) => {
    if(!text) return '';
    const replacedBullets = text.replace(/^\* /gm, '• ');
    const parts = replacedBullets.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} style={{backgroundColor: '#2a2a2a', padding: '2px 4px', borderRadius: '4px', color: '#e2e8f0'}}>{part.slice(1, -1)}</code>;
        }
        return part;
    });
  };

  if (loading) return <div className="workspace-loading">Loading Workspace...</div>;
  if (!problem) return <div className="workspace-error">Problem not found</div>;

  return (
    <div className="workspace-container tuf-style">
      <div className="workspace-left glass" style={{ width: `${leftWidth}px`, flex: `0 0 ${leftWidth}px` }}>
        <div className="tab-header tuf-tabs">
          <button className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}><FileCode size={16} /> Description</button>
          <button className={`tab-btn ${activeTab === 'editorial' ? 'active' : ''}`} onClick={() => setActiveTab('editorial')}><Info size={16} /> Editorial</button>
          <button className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`} onClick={() => setActiveTab('submissions')}><History size={16} /> Submissions</button>
          <button className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`} onClick={() => setActiveTab('discussion')}><MessageCircle size={16} /> Discussion</button>
        </div>

        <div className="problem-content tuf-card">
          {activeTab === 'editorial' && (
            <div className="editorial-view">
              <h2>Editorial</h2>
              <div className="accordion-container">
                <details open>
                  <summary>Intuition</summary>
                  <p>{problem.editorial?.intuition || "No intuition provided."}</p>
                </details>
                <details>
                  <summary>Approach</summary>
                  <p>{problem.editorial?.approach || "No approach provided."}</p>
                </details>
                <details>
                  <summary>Complexity Analysis</summary>
                  <p>{problem.editorial?.complexity || "Time: O(?), Space: O(?)"}</p>
                </details>
                <details>
                  <summary>Code Solution</summary>
                  <pre className="editorial-code"><code>{problem.editorial?.solutionCode || "// No solution code provided."}</code></pre>
                </details>
              </div>
            </div>
          )}
          {activeTab === 'description' && (
            <>
              <div className="problem-title-section">
                <h1>{problem.title}</h1>
                <div className="problem-badges">
                </div>
              </div>
              
              <div className="problem-description-text">
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', marginBottom: '20px' }}>{formatText(problem.description)}</div>
                {problem.testCases?.slice(0, 3).map((tc, idx) => (
                  <div key={idx} className="example-block">
                    <h4>Example {idx + 1}</h4>
                    <div className="example-content">
                      <p><strong>Input:</strong> {tc.input}</p>
                      <p><strong>Output:</strong> {tc.output}</p>
                      {tc.explanation && <p><strong>Explanation:</strong> {tc.explanation}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="bottom-meta glass">
          <button className="icon-btn"><Clock size={16} /></button>
          <button className="icon-btn"><Info size={16} /></button>
        </div>
      </div>

      <div className="horizontal-resizer-handle" onMouseDown={startDragHorizontal}>
        <div className="horizontal-resizer-line"></div>
      </div>

      <div className="workspace-right">
        <div className="editor-section glass" style={{ flex: `${editorFlex} 1 0%` }}>
          <div className="editor-header tuf-header">
            <div className="lang-selector">
              <select 
                value={language} 
                onChange={(e) => {
                  const newLang = e.target.value;
                  setLanguage(newLang);
                  setCode(getStarterCode(problem, newLang));
                }} 
                className="tuf-select"
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>
            </div>
            <div className="editor-actions">
              <button className="icon-btn"><Copy size={18} /></button>
              <button className="icon-btn" onClick={() => setCode(starterTemplates[language])}><RotateCcw size={18} /></button>
              <button className="tuf-try-btn" onClick={handleRun}>Run</button>
              <button className="tuf-submit-btn" onClick={handleSubmit}>Submit</button>
            </div>
          </div>
          
          <div className="monaco-wrapper">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 10 } }}
            />
          </div>
        </div>

        <div className="resizer-handle" onMouseDown={startDrag}>
          <div className="resizer-line"></div>
        </div>

        <div className="testcase-section glass" style={{ flex: `${100 - editorFlex} 1 0%` }}>
          <div className="testcase-header tuf-header">
            <div className="header-left">
              <History size={16} className="text-muted" />
              <span>Test Cases</span>
            </div>
            <div className="header-right">
            </div>
          </div>

          <div className="testcase-body">
            <div className="case-tabs">
              {problem.testCases?.slice(0, 3).map((_, i) => (
                <button key={i} className={`case-tab ${activeCase === i ? 'active' : ''}`} onClick={() => setActiveCase(i)}>Case {i + 1}</button>
              ))}
              <button className="add-btn">+</button>
            </div>
            <div className="case-content">
              {problem.testCases?.[activeCase] && (
                <>
                  <div className="input-field">
                    <label>INPUT</label>
                    <div className="input-box-tuf">{problem.testCases[activeCase].input}</div>
                  </div>
                  <div className="input-field mt-3">
                    <label>EXPECTED OUTPUT</label>
                    <div className="input-box-tuf">{problem.testCases[activeCase].output}</div>
                  </div>
                </>
              )}
              {submitting && (
                <div className="judging-loader">
                  <div className="spinner-ring"></div>
                  <span>Compiling & judging...</span>
                </div>
              )}
              {result && !submitting && (
                <div className={`result-summary ${result.success ? 'success' : 'fail'}`}>
                  <div className="result-badge">
                    <span className="result-icon">{result.success ? '✓' : '✗'}</span>
                    <span className="result-message">{result.message}</span>
                  </div>
                  {result.results?.map((r, i) => (
                    <div key={i} className={`case-result ${r.passed ? 'pass' : 'fail'}`}>
                      <div className="case-result-header">
                        {r.passed ? '✓' : '✗'} Case {i + 1}
                      </div>
                      {r.error ? (
                        <div className="case-error"><pre>{r.error}</pre></div>
                      ) : (
                        <div className="case-io">
                          <div><span>Input:</span> <code>{r.input}</code></div>
                          <div><span>Expected:</span> <code>{r.expected}</code></div>
                          <div><span>Got:</span> <code>{r.actual}</code></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
