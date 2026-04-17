import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Send, Settings, RotateCcw, ChevronDown, Loader2, MessageCircle, Info, FileCode, History, Copy, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <div className="tab-header tuf-tabs" style={{ display: 'flex', position: 'relative' }}>
          {[
            { id: 'description', label: 'Description', icon: FileCode },
            { id: 'editorial', label: 'Process', icon: Info },
            { id: 'dryrun', label: 'Dry Run', icon: Zap },
            { id: 'submissions', label: 'Submissions', icon: History },
            { id: 'discussion', label: 'Discussion', icon: MessageCircle }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} 
                onClick={() => setActiveTab(tab.id)}
                style={{ position: 'relative', outline: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={16} /> {tab.label}
                </div>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-tab-indicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      right: 0,
                      height: 2,
                      backgroundColor: '#3b82f6',
                      borderRadius: 2
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>

        <div className="problem-content tuf-card">
          <div style={{ padding: '24px' }}>
            {activeTab === 'editorial' && (
              <div className="editorial-view">
                <h2>Process</h2>
                <div className="accordion-container">
                  <details open>
                    <summary>Intuition (No Hints)</summary>
                    <p style={{ whiteSpace: 'pre-line' }}>{problem.editorial?.intuition || "No hints are provided. Formulate your foundational logic cleanly."}</p>
                  </details>
                  <details>
                    <summary>Different ways to Approach</summary>
                    <p style={{ whiteSpace: 'pre-line' }}>{problem.editorial?.approach || "Think about optimal and sub-optimal ways."}</p>
                  </details>
                  <details>
                    <summary>Code Solution 🔒</summary>
                    {result?.success ? (
                      <pre className="editorial-code"><code>{problem.editorial?.solutionCode || "// No solution code provided."}</code></pre>
                    ) : (
                      <div style={{ padding: '20px', color: '#888', fontStyle: 'italic', background: '#151515', fontSize: '0.9rem', borderTop: '1px solid #333' }}>
                         You must successfully submit a passing solution to unlock the reference code. 
                      </div>
                    )}
                  </details>
                </div>
              </div>
            )}
            {activeTab === 'dryrun' && (
              <div className="dryrun-view">
                <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Zap size={22} color="#3b82f6" /> Code Visualizer
                </h2>
                <div style={{ background: '#18181b', borderRadius: '8px', border: '1px solid #27272a', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', background: '#0f0f0f', display: 'flex', gap: '12px', borderBottom: '1px solid #27272a' }}>
                    <button style={{ padding: '6px 12px', background: '#27272a', color: '#f4f4f5', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>&laquo; First</button>
                    <button style={{ padding: '6px 12px', background: '#27272a', color: '#f4f4f5', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>&lsaquo; Prev</button>
                    <button style={{ padding: '6px 12px', background: '#3b82f6', color: '#fff', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Next &rsaquo;</button>
                    <button style={{ padding: '6px 12px', background: '#27272a', color: '#f4f4f5', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>Last &raquo;</button>
                  </div>
                  <div style={{ display: 'flex', height: '350px' }}>
                    <div style={{ flex: 1, borderRight: '1px solid #27272a', padding: '16px', overflowY: 'auto' }}>
                      <h4 style={{ color: '#a1a1aa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '12px' }}>Code Execution</h4>
                      <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.85rem', color: '#e2e8f0', position: 'relative' }}>
<code style={{ display: 'block', paddingLeft: '24px', opacity: 0.5 }}>def solve(nums):</code>
<code style={{ display: 'block', paddingLeft: '24px', opacity: 0.5 }}>  ans = 0</code>
<code style={{ display: 'block', paddingLeft: '24px', background: 'rgba(59, 130, 246, 0.15)', color: '#fff' }}><span style={{ position: 'absolute', left: 0, color: '#3b82f6' }}>&rarr;</span>  for n in nums:</code>
<code style={{ display: 'block', paddingLeft: '24px', opacity: 0.5 }}>    ans += n</code>
<code style={{ display: 'block', paddingLeft: '24px', opacity: 0.5 }}>  return ans</code>
                      </pre>
                    </div>
                    <div style={{ width: '220px', padding: '16px', overflowY: 'auto', background: '#121212' }}>
                      <h4 style={{ color: '#a1a1aa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '12px' }}>Frames & Objects</h4>
                      <div style={{ border: '1px solid #333', borderRadius: '4px', background: '#1a1a1e', marginBottom: '16px' }}>
                        <div style={{ background: '#222', padding: '4px 8px', fontSize: '0.7rem', color: '#888', borderBottom: '1px solid #333' }}>Global frame</div>
                        <div style={{ padding: '8px', fontSize: '0.8rem', color: '#ddd' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>nums</span><span style={{ color: '#3b82f6' }}>[1, 2, 3]</span></div>
                        </div>
                      </div>
                      <div style={{ border: '1px solid #3b82f6', borderRadius: '4px', background: '#1a1e28' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '4px 8px', fontSize: '0.7rem', color: '#3b82f6', borderBottom: '1px solid #3b82f6' }}>solve()</div>
                        <div style={{ padding: '8px', fontSize: '0.8rem', color: '#ddd' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span>n</span><span style={{ color: '#10b981' }}>1</span></div>
                           <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>ans</span><span style={{ color: '#10b981' }}>0</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
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
