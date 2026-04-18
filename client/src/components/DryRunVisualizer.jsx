import React, { useState, useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, SkipBack, SkipForward, ChevronLeft, ChevronRight, Pause, RotateCcw, Loader2, Zap, Terminal, Layers, Variable, AlertTriangle, Box } from 'lucide-react';
import { apiUrl } from '../lib/api';
import './DryRunVisualizer.css';

const DryRunVisualizer = ({ initialCode, initialLanguage }) => {
  const [language, setLanguage] = useState(initialLanguage || 'python');
  const [code, setCode] = useState(initialCode || STARTER_CODE[initialLanguage || 'python']);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTracing, setIsTracing] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(800);
  const [hasTraced, setHasTraced] = useState(false);
  const [traceInfo, setTraceInfo] = useState(null);
  const playIntervalRef = useRef(null);
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  // Auto-play stepping
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playSpeed);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, steps.length, playSpeed]);

  // Highlight current line in Monaco editor
  useEffect(() => {
    if (editorRef.current && steps.length > 0) {
      const step = steps[currentStep];
      if (step && step.line > 0) {
        const prevStep = currentStep > 0 ? steps[currentStep - 1] : null;
        
        const newDecorationsList = [];
        
        // Next line to execute (Red Arrow)
        newDecorationsList.push({
          range: { startLineNumber: step.line, startColumn: 1, endLineNumber: step.line, endColumn: 1 },
          options: {
            isWholeLine: true,
            className: 'drv-active-line',
            glyphMarginClassName: 'drv-next-glyph',
            marginClassName: 'drv-next-line-margin'
          }
        });

        // Last line executed (Green Arrow)
        if (prevStep && prevStep.line > 0 && prevStep.line !== step.line) {
          newDecorationsList.push({
            range: { startLineNumber: prevStep.line, startColumn: 1, endLineNumber: prevStep.line, endColumn: 1 },
            options: {
              isWholeLine: false,
              glyphMarginClassName: 'drv-prev-glyph'
            }
          });
        }

        decorationsRef.current = editorRef.current.deltaDecorations(
          decorationsRef.current,
          newDecorationsList
        );

        // Center the code
        editorRef.current.revealLineInCenterIfOutsideViewport(step.line);
      } else {
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
      }
    }
  }, [currentStep, steps]);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(STARTER_CODE[newLang] || '');
    resetState();
  };

  const resetState = () => {
    setSteps([]);
    setCurrentStep(0);
    setError(null);
    setHasTraced(false);
    setIsPlaying(false);
    setTraceInfo(null);
    if (editorRef.current) {
      const cleared = editorRef.current.deltaDecorations(decorationsRef.current, []);
      decorationsRef.current = cleared;
    }
  };

  const handleVisualize = async () => {
    setIsTracing(true);
    setError(null);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setHasTraced(false);

    try {
      const response = await fetch(apiUrl('/visualize'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Visualization failed');
        return;
      }

      if (!data.steps || data.steps.length === 0) {
        setError('No execution steps were captured. Make sure your code has executable statements.');
        return;
      }

      // If the backend auto-wrapped the code (added includes/main),
      // update the editor to show the actual executed code so line numbers match
      if (data.code && data.code !== code) {
        setCode(data.code);
      }

      setSteps(data.steps);
      setCurrentStep(0);
      setHasTraced(true);
      setTraceInfo({
        totalSteps: data.totalSteps,
        finalStdout: data.finalStdout || '',
        simulated: data.simulated || false
      });
    } catch (err) {
      setError(`Failed to connect to visualizer: ${err.message}`);
    } finally {
      setIsTracing(false);
    }
  };

  const step = steps[currentStep] || null;

  // Calculate accumulated stdout up to current step
  const currentStdout = step?.stdout || '';

  return (
    <div className="drv-container">
      {/* Header bar */}
      <div className="drv-header">
        <div className="drv-header-left">
          <Zap size={18} className="drv-header-icon" />
          <span className="drv-title">Code Visualizer</span>
          <span className="drv-subtitle">Step-by-step execution</span>
        </div>
        <div className="drv-header-right">
          <div className="drv-lang-picker">
            {[
              { id: 'python', label: 'Python', dot: 'python' },
              { id: 'cpp', label: 'C++', dot: 'cpp' }
            ].map(l => (
              <button
                key={l.id}
                className={`drv-lang-btn ${language === l.id ? 'active' : ''}`}
                onClick={() => handleLanguageChange(l.id)}
              >
                <span className={`drv-lang-dot ${l.dot}`} />
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main split layout */}
      <div className="drv-body">
        {/* Left: Code editor */}
        <div className="drv-editor-pane">
          <div className="drv-pane-header">
            <Terminal size={14} />
            <span>Source Code</span>
            {traceInfo?.simulated && (
              <span className="drv-simulated-badge">
                <AlertTriangle size={12} /> Simulated
              </span>
            )}
          </div>
          <div className="drv-editor-wrapper">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : 'python'}
              theme="vs-dark"
              value={code}
              onChange={(value) => {
                setCode(value || '');
                if (hasTraced) resetState();
              }}
              onMount={handleEditorMount}
              options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 8, bottom: 8 },
                lineNumbers: 'on',
                readOnly: hasTraced,
                renderLineHighlight: 'none',
                glyphMargin: true,
                folding: false,
                automaticLayout: true,
                wordWrap: 'off',
              }}
            />
          </div>

          {/* Action bar */}
          <div className="drv-action-bar">
            {!hasTraced ? (
              <button
                className="drv-visualize-btn"
                onClick={handleVisualize}
                disabled={isTracing || !code.trim()}
              >
                {isTracing ? (
                  <>
                    <Loader2 size={16} className="drv-spin" />
                    Tracing...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Visualize Execution
                  </>
                )}
              </button>
            ) : (
              <button className="drv-reset-btn" onClick={resetState}>
                <RotateCcw size={14} />
                Edit Code
              </button>
            )}

            {hasTraced && (
              <div className="drv-step-info">
                <span className="drv-step-badge">
                  Step {currentStep + 1} / {steps.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Visualization panels */}
        <div className="drv-viz-pane">
          {!hasTraced && !error && (
            <div className="drv-empty-state">
              <div className="drv-empty-icon-wrapper">
                <Zap size={40} />
              </div>
              <h3>Ready to Visualize</h3>
              <p>Write your code and click <strong>"Visualize Execution"</strong> to see a step-by-step breakdown of how your code runs.</p>
              <div className="drv-features-grid">
                <div className="drv-feature">
                  <Variable size={18} />
                  <span>Track variables</span>
                </div>
                <div className="drv-feature">
                  <Layers size={18} />
                  <span>View call stack</span>
                </div>
                <div className="drv-feature">
                  <Terminal size={18} />
                  <span>See output</span>
                </div>
                <div className="drv-feature">
                  <Play size={18} />
                  <span>Auto-play</span>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="drv-error-panel">
              <AlertTriangle size={20} />
              <div>
                <strong>Visualization Error</strong>
                <pre>{error}</pre>
              </div>
            </div>
          )}

          {hasTraced && (
            <>
              {/* Step Controls */}
              <div className="drv-controls">
                <div className="drv-controls-left">
                  <button
                    className="drv-ctrl-btn"
                    onClick={() => setCurrentStep(0)}
                    disabled={currentStep === 0}
                    title="First step"
                  >
                    <SkipBack size={16} />
                  </button>
                  <button
                    className="drv-ctrl-btn"
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                    title="Previous step"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className={`drv-ctrl-btn drv-play-btn ${isPlaying ? 'playing' : ''}`}
                    onClick={() => setIsPlaying(!isPlaying)}
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    className="drv-ctrl-btn"
                    onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
                    disabled={currentStep >= steps.length - 1}
                    title="Next step"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <button
                    className="drv-ctrl-btn"
                    onClick={() => setCurrentStep(steps.length - 1)}
                    disabled={currentStep >= steps.length - 1}
                    title="Last step"
                  >
                    <SkipForward size={16} />
                  </button>
                </div>
                <div className="drv-controls-right">
                  <label className="drv-speed-label">Speed:</label>
                  <select
                    className="drv-speed-select"
                    value={playSpeed}
                    onChange={(e) => setPlaySpeed(Number(e.target.value))}
                  >
                    <option value={1500}>0.5x</option>
                    <option value={800}>1x</option>
                    <option value={400}>2x</option>
                    <option value={200}>4x</option>
                  </select>
                </div>
              </div>

              {/* Progress bar */}
              <div className="drv-progress-track">
                <div
                  className="drv-progress-fill"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>

              {/* Step detail: event & line */}
              {step && (
                <div className="drv-step-detail">
                  <span className={`drv-event-badge ${step.event}`}>
                    {step.event === 'line' ? '→' : step.event === 'call' ? '⤵' : step.event === 'return' ? '⤴' : '⚠'}
                    {' '}{step.event}
                  </span>
                  <span className="drv-step-fn">
                    {step.function}()
                  </span>
                  {step.line > 0 && (
                    <span className="drv-step-line">
                      Line {step.line}
                    </span>
                  )}
                </div>
              )}

              {step && (
                <>
                  {/* Advanced Memory Diagram (Stack & Heap) */}
                  <div className="drv-panel">
                    <div className="drv-panel-header">
                      <Box size={14} />
                      <span>Memory Visualization</span>
                      <div className="drv-panel-count">Stack & Heap</div>
                    </div>
                    <div className="drv-panel-body drv-memory-layout">
                      {/* Stack Column */}
                      <div className="drv-stack-column">
                        <h4 className="drv-column-label">Stack</h4>
                        <div className="drv-frame-box">
                          <div className="drv-frame-header">{step.function || 'main'}</div>
                          <div className="drv-frame-vars">
                            {Object.keys(step.variables || {}).length === 0 ? (
                              <div className="drv-panel-empty">No variables in scope</div>
                            ) : (
                              Object.entries(step.variables).map(([name, val], idx) => {
                                const isComplex = typeof val === 'object' && val !== null;
                                return (
                                  <div key={idx} className="drv-mem-var-row">
                                    <span className="drv-mem-var-name">{name}</span>
                                    <div className="drv-mem-var-connector"></div>
                                    <div className={`drv-mem-var-val-box ${isComplex ? 'pointer' : ''}`}>
                                      {isComplex ? '●' : formatValue(val)}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Heap Column */}
                      <div className="drv-heap-column">
                        <h4 className="drv-column-label">Heap</h4>
                        {Object.entries(step.variables || {}).map(([name, val], idx) => {
                          if (typeof val !== 'object' || val === null) return null;
                          
                          const isArray = Array.isArray(val);
                          return (
                            <div key={idx} className="drv-heap-object">
                              <div className="drv-heap-obj-header">
                                {isArray ? `vector<int> [${val.length}]` : 'object'}
                              </div>
                              <div className="drv-heap-obj-body">
                                {isArray ? (
                                  <div className="drv-heap-array">
                                    {val.map((item, i) => (
                                      <div key={i} className="drv-heap-array-cell">
                                        <div className="drv-cell-idx">{i}</div>
                                        <div className="drv-cell-val">{formatValue(item)}</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="drv-heap-map">
                                     {Object.entries(val).map(([k, v], i) => (
                                       <div key={i} className="drv-heap-map-row">
                                         <span className="drv-map-key">{k}</span>
                                         <span className="drv-map-val">{formatValue(v)}</span>
                                       </div>
                                     ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {Object.values(step.variables || {}).every(v => typeof v !== 'object' || v === null) && (
                           <div className="drv-panel-empty">Heap is empty</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Call Stack Panel */}
                  <div className="drv-panel">
                    <div className="drv-panel-header">
                      <Layers size={14} />
                      <span>Call Stack</span>
                      <span className="drv-panel-count">
                        {step?.stack?.length || 0}
                      </span>
                    </div>
                    <div className="drv-panel-body drv-stack-body">
                      {step?.stack?.length > 0 ? (
                        step.stack.map((frame, idx) => (
                          <div key={idx} className={`drv-stack-frame ${idx === step.stack.length - 1 ? 'active' : ''}`}>
                            <span className="drv-stack-fn">{frame.function}()</span>
                            <span className="drv-stack-line">:{frame.line}</span>
                          </div>
                        ))
                      ) : (
                        <div className="drv-panel-empty">Empty stack</div>
                      )}
                    </div>
                  </div>

                  {/* Stdout Panel */}
                  <div className="drv-panel">
                    <div className="drv-panel-header">
                      <Terminal size={14} />
                      <span>Output</span>
                    </div>
                    <div className="drv-panel-body drv-stdout-body">
                      {currentStdout ? (
                        <pre className="drv-stdout-pre">{currentStdout}</pre>
                      ) : (
                        <div className="drv-panel-empty">No output yet</div>
                      )}
                    </div>
                  </div>

                  {/* Return value if event is return */}
                  {step?.event === 'return' && step.returnValue !== undefined && (
                    <div className="drv-return-panel">
                      <span>↩ Return value:</span>
                      <code>{formatValue(step.returnValue)}</code>
                    </div>
                  )}

                  {/* Exception if present */}
                  {step?.exception && (
                    <div className="drv-exception-panel">
                      <AlertTriangle size={16} />
                      <pre>{step.exception}</pre>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatValue(val) {
  if (val === null || val === undefined) return 'None';
  if (typeof val === 'boolean') return val ? 'True' : 'False';
  if (typeof val === 'string') return `"${val}"`;
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const inner = val.map(v => formatValue(v)).join(', ');
    return `[${inner}]`;
  }
  if (typeof val === 'object') {
    return JSON.stringify(val);
  }
  return String(val);
}

// ─── Starter Code Templates ──────────────────────────────────────────────────
const STARTER_CODE = {
  python: `# Python Visualizer Demo
# Click "Visualize Execution" to step through!

def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for i in range(2, n + 1):
        a, b = b, a + b
    return b

result = fibonacci(6)
print("Fibonacci(6) =", result)
`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    int n = 6;
    int a = 0;
    int b = 1;
    
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    
    cout << "Fibonacci(" << n << ") = " << b << endl;
    return 0;
}
`
};

export default DryRunVisualizer;
