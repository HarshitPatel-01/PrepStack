import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Play, Send, Settings, RotateCcw, ChevronDown, Loader2, MessageCircle, Info, FileCode, History, Copy, Clock, Zap, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../lib/api';
import './Workspace.css';

const Workspace = () => {
  const { id } = useParams();
  const { refreshUser } = useAuth();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  // Stores user edits per language so switching tabs restores their work
  const [savedCode, setSavedCode] = useState({ cpp: '', python: '', java: '', c: '' });
  const [activeTab, setActiveTab] = useState('description');
  const [outputTab, setOutputTab] = useState('testcases');
  const [language, setLanguage] = useState('cpp');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [activeCase, setActiveCase] = useState(0);
  const [editorFlex, setEditorFlex] = useState(60);
  const [leftWidth, setLeftWidth] = useState(450);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [visualizeCode, setVisualizeCode] = useState('// Enter C++ code here to visualize\n#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << "Hello World!";\n  return 0;\n}');
  const [visualizeUrl, setVisualizeUrl] = useState('');

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
        const response = await fetch(apiUrl(`/problems/${id}`));
        const data = await response.json();
        setProblem(data);
        // Initialize editor with per-language starter codes
        const initial = {
          cpp:    getStarterCode(data, 'cpp'),
          python: getStarterCode(data, 'python'),
          java:   getStarterCode(data, 'java'),
          c:      getStarterCode(data, 'c'),
        };
        setSavedCode(initial);
        setCode(initial[language]);
      } catch (err) {
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const response = await fetch(apiUrl(`/auth/notes/${id}`), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.notes) setNotes(data.notes);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };
    fetchNotes();
  }, [id]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to save notes!");
        setSavingNotes(false);
        return;
      }
      await fetch(apiUrl(`/auth/notes/${id}`), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ notes })
      });
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setTimeout(() => setSavingNotes(false), 500); // UI feedback delay
    }
  };

  const handleVisualize = () => {
    let finalCode = visualizeCode;

    // Python Tutor C++ compilation requires a main() function.
    if (!finalCode.includes('main')) {
      alert("Note: A valid C++ program requires an 'int main()' function. We've automatically wrapped your class in a standard template to prevent compilation errors. You will need to explicitly call your functions inside main() to visualize their execution!");
      finalCode = `#include <iostream>\n#include <vector>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <stack>\n#include <algorithm>\nusing namespace std;\n\n${finalCode}\n\nint main() {\n    // Code wrapped automatically because 'main' was missing.\n    // Example: Solution s; s.twoSum(...);\n    return 0;\n}`;
      setVisualizeCode(finalCode);
    }

    const url = `https://pythontutor.com/iframe-embed.html#code=${encodeURIComponent(finalCode)}&codeDivHeight=400&codeDivWidth=350&cumulative=false&curInstr=0&heapPrimitives=nevernest&origin=opt-frontend.js&py=cpp_g%2B%2B11&rawInputLstJSON=%5B%5D&textReferences=false`;
    setVisualizeUrl(url);
  };

  const handleRun = async () => {
    setSubmitting(true);
    setResult(null);
    setOutputTab('result');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl(`/submit/${id}`), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      setResult(data);
      if (data.status === 'Accepted') {
        refreshUser();
      }
    } catch (err) {
      setResult({ status: 'Error', message: 'Server error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    setOutputTab('result');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(apiUrl(`/submit/${id}`), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ code, language })
      });
      const data = await response.json();
      setResult(data);
      if (data.status === 'Accepted') {
        refreshUser();
      }
    } catch (err) {
      setResult({ status: 'Error', message: 'Server error' });
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
            { id: 'solutions', label: 'Code', icon: FileCode },
            { id: 'dryrun', label: 'Dry Run', icon: Zap },
            { id: 'observations', label: 'Key Observations', icon: Edit3 }
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
                    <summary>Complexity</summary>
                    <p style={{ whiteSpace: 'pre-line' }}>{problem.editorial?.complexity || "Time: O(N), Space: O(1)"}</p>
                  </details>
                </div>
              </div>
            )}
            {activeTab === 'solutions' && (
              <div className="solutions-view">
                <h2>Code</h2>
                <div className="accordion-container">
                  <details open>
                    <summary>Brute Force Process: Will that work?</summary>
                    <p style={{ whiteSpace: 'pre-line', marginBottom: '10px' }}>{problem.editorial?.bruteForceApproach || "Explain the simplest possible solution."}</p>
                    {result?.status === 'Accepted' ? (
                      <pre className="editorial-code"><code>{problem.editorial?.bruteForceCode || "// No brute force code provided."}</code></pre>
                    ) : (
                      <div style={{ padding: '20px', color: '#888', fontStyle: 'italic', background: '#151515', fontSize: '0.9rem', borderTop: '1px solid #333' }}>
                         You must successfully submit a passing solution to unlock the reference code. 
                      </div>
                    )}
                  </details>
                  <details>
                    <summary>Optimal Approach</summary>
                    <p style={{ whiteSpace: 'pre-line', marginBottom: '10px' }}>{problem.editorial?.optimalApproach || "Explain the optimized version."}</p>
                    {result?.status === 'Accepted' ? (
                      <pre className="editorial-code"><code>{problem.editorial?.optimalCode || "// No optimal code provided."}</code></pre>
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
                {!visualizeUrl ? (
                  <div style={{ background: '#18181b', borderRadius: '8px', border: '1px solid #27272a', padding: '16px' }}>
                    <p style={{ marginBottom: '12px', fontSize: '0.9rem', color: '#a1a1aa' }}>Enter your C++ code to step through execution, variables, and memory.</p>
                    <div className="monaco-wrapper" style={{ height: '300px', border: '1px solid #333', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                      <Editor
                        height="100%"
                        language="cpp"
                        theme="vs-dark"
                        value={visualizeCode}
                        onChange={(value) => setVisualizeCode(value)}
                        options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
                      />
                    </div>
                    <button 
                      onClick={handleVisualize}
                      style={{ background: 'var(--primary)', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}
                    >
                      Visualize Code
                    </button>
                  </div>
                ) : (
                  <div style={{ background: '#18181b', borderRadius: '8px', border: '1px solid #27272a', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '8px 16px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'flex-end', background: '#0f0f0f' }}>
                       <button onClick={() => setVisualizeUrl('')} style={{ color: '#a1a1aa', fontSize: '0.85rem', fontWeight: 'bold' }}>&larr; Back to Editor</button>
                    </div>
                    <iframe 
                      title="visualizer"
                      width="100%" 
                      height="500" 
                      frameBorder="0" 
                      src={visualizeUrl}
                      style={{ background: '#fff' }}
                    />
                  </div>
                )}
              </div>
            )}
            {activeTab === 'observations' && (
              <div className="observations-view">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Edit3 size={20} color="var(--primary)" /> Key Observations</h2>
                  <button 
                    onClick={handleSaveNotes} 
                    disabled={savingNotes}
                    style={{ background: 'var(--primary)', color: '#fff', padding: '6px 14px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', opacity: savingNotes ? 0.7 : 1 }}
                  >
                    {savingNotes ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <span style={{display:'inline-block'}}>Save Notes</span>}
                  </button>
                </div>
                <div style={{ background: '#121212', borderRadius: '8px', padding: '16px', border: '1px solid var(--border)', minHeight: '350px' }}>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Jot down your mistakes, edge cases, core logic patterns, or any key insights you gained while solving this..."
                    style={{ width: '100%', minHeight: '320px', background: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '0.95rem', resize: 'vertical', outline: 'none', lineHeight: '1.6' }}
                  />
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
              <div className={`lang-dot ${language}`} />
              <select 
                value={language} 
                onChange={(e) => {
                  const newLang = e.target.value;
                  // Save current edits before switching
                  setSavedCode(prev => ({ ...prev, [language]: code }));
                  setLanguage(newLang);
                  // Restore previously saved code, or the starter code
                  setCode(savedCode[newLang] || getStarterCode(problem, newLang));
                  setResult(null);
                }} 
                className="tuf-select"
              >
                <option value="cpp">C++ 17</option>
                <option value="python">Python 3</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>
            </div>
            <div className="editor-actions">
              <button className="icon-btn" onClick={() => navigator.clipboard.writeText(code)} title="Copy Code"><Copy size={16} /></button>
              <button className="icon-btn" onClick={() => {
                const starter = getStarterCode(problem, language);
                setCode(starter);
                setSavedCode(prev => ({ ...prev, [language]: starter }));
              }} title="Reset to starter code"><RotateCcw size={16} /></button>
              <div style={{ width: 1, height: 20, background: '#333', margin: '0 4px' }} />
              <button className="tuf-try-btn" onClick={handleRun} disabled={submitting}>
                {submitting ? 'Running...' : 'Run'}
              </button>
              <button className="tuf-submit-btn" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Judging...' : 'Submit'}
              </button>
            </div>
          </div>
          
          <div className="monaco-wrapper">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language === 'c' ? 'c' : language}
              theme="vs-dark"
              value={code}
              onChange={(value) => {
                setCode(value);
                setSavedCode(prev => ({ ...prev, [language]: value }));
              }}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorBlinking: 'smooth',
                cursorSmoothCaretAnimation: 'on',
                smoothScrolling: true,
                tabSize: 4,
                wordWrap: 'off',
                automaticLayout: true,
                bracketPairColorization: { enabled: true },
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
                acceptSuggestionOnEnter: 'on',
                formatOnPaste: true,
                formatOnType: true,
              }}
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
                <div className={`result-summary ${result.status === 'Accepted' ? 'success' : 'fail'}`}>
                  {/* Status badge row */}
                  <div className="result-badge">
                    <span className="result-icon">{result.status === 'Accepted' ? '✓' : '✗'}</span>
                    <span className="result-message">{result.status}</span>
                  </div>

                  {/* Stats row — runtime + test case count */}
                  <div style={{ display: 'flex', gap: 16, padding: '0 16px 12px 16px', flexWrap: 'wrap' }}>
                    <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Test Cases</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: result.status === 'Accepted' ? '#10b981' : '#ef4444', fontFamily: 'JetBrains Mono, monospace' }}>
                        {result.passed} / {result.total}
                      </span>
                    </div>
                    {result.runtimeMs > 0 && (
                      <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Runtime</span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffd700', fontFamily: 'JetBrains Mono, monospace' }}>
                          {result.runtimeMs} ms
                        </span>
                      </div>
                    )}
                    <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Language</span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'JetBrains Mono, monospace' }}>
                        {language === 'cpp' ? 'C++ 17' : language === 'python' ? 'Python 3' : language === 'java' ? 'Java' : 'C'}
                      </span>
                    </div>
                  </div>

                  {/* Failed case detail */}
                  {result.failedCase && (
                    <div className="case-result fail">
                      <div className="case-result-header">
                        ✗ Failed Test Case
                      </div>
                      {result.status === 'Compilation Error' || result.status === 'Runtime Error' || result.status === 'Time Limit Exceeded' ? (
                        <div className="case-error"><pre>{result.failedCase.got}</pre></div>
                      ) : (
                        <div className="case-io">
                          <div><span>Input:</span> <code>{result.failedCase.input}</code></div>
                          <div><span>Expected:</span> <code>{result.failedCase.expected}</code></div>
                          <div><span>Got:</span> <code>{result.failedCase.got}</code></div>
                        </div>
                      )}
                    </div>
                  )}
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
