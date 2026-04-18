const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const cleanup = (...files) => {
    files.forEach(f => {
        try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (e) {}
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Python Tracer — uses sys.settrace to capture every execution step
// ─────────────────────────────────────────────────────────────────────────────
const generatePythonTracer = (userCode) => {
    // We wrap the user code in a tracer that captures:
    //   - current line number
    //   - local variables (serializable ones only)
    //   - call stack
    //   - stdout output at each step
    return `
import sys
import json
import io
import copy
import traceback

# ── User code goes into a temp file so line numbers are clean ──
USER_CODE = ${JSON.stringify(userCode)}

_steps = []
_max_steps = 200  # Safety: cap at 200 steps to prevent infinite loops
_step_count = 0
_stdout_capture = io.StringIO()
_original_stdout = sys.stdout

def _safe_repr(val, depth=0):
    """Safely serialize a value for JSON, with depth limit."""
    if depth > 3:
        return "..."
    if val is None:
        return None
    if isinstance(val, (int, float, bool)):
        return val
    if isinstance(val, str):
        return val if len(val) <= 200 else val[:200] + "..."
    if isinstance(val, (list, tuple)):
        return [_safe_repr(v, depth+1) for v in val[:50]]
    if isinstance(val, dict):
        return {str(k): _safe_repr(v, depth+1) for k, v in list(val.items())[:30]}
    if isinstance(val, set):
        return [_safe_repr(v, depth+1) for v in list(val)[:30]]
    return str(val)[:100]

def _trace_calls(frame, event, arg):
    global _step_count
    
    # Only trace user code (filename == <user_code>)
    if frame.f_code.co_filename != '<user_code>':
        return _trace_calls
    
    if event not in ('line', 'call', 'return', 'exception'):
        return _trace_calls
    
    _step_count += 1
    if _step_count > _max_steps:
        return None  # Stop tracing

    # Capture local variables (filter out builtins/modules)
    variables = {}
    for k, v in frame.f_locals.items():
        if k.startswith('_') or k == 'self':
            continue
        try:
            variables[k] = _safe_repr(v)
        except:
            variables[k] = "<unserializable>"

    # Capture stdout so far
    stdout_so_far = _stdout_capture.getvalue()

    # Build call stack
    stack = []
    f = frame
    while f is not None:
        if f.f_code.co_filename == '<user_code>':
            stack.append({
                "function": f.f_code.co_name,
                "line": f.f_lineno
            })
        f = f.f_back
    stack.reverse()

    step = {
        "step": _step_count,
        "line": frame.f_lineno,
        "event": event,
        "function": frame.f_code.co_name,
        "variables": variables,
        "stack": stack,
        "stdout": stdout_so_far
    }
    
    if event == 'return':
        step["returnValue"] = _safe_repr(arg)
    elif event == 'exception':
        step["exception"] = str(arg[1]) if arg else "Unknown error"

    _steps.append(step)
    return _trace_calls

# Redirect stdout to capture print() calls
sys.stdout = _stdout_capture

try:
    code_obj = compile(USER_CODE, '<user_code>', 'exec')
    sys.settrace(_trace_calls)
    exec(code_obj, {"__name__": "__main__", "__builtins__": __builtins__})
    sys.settrace(None)
except Exception as e:
    sys.settrace(None)
    _steps.append({
        "step": _step_count + 1,
        "line": -1,
        "event": "exception",
        "function": "<module>",
        "variables": {},
        "stack": [],
        "stdout": _stdout_capture.getvalue(),
        "exception": traceback.format_exc()
    })

# Restore stdout and print the JSON result
sys.stdout = _original_stdout
result = {
    "success": True,
    "language": "python",
    "steps": _steps,
    "finalStdout": _stdout_capture.getvalue(),
    "totalSteps": len(_steps),
    "code": USER_CODE
}
print("---TRACE_START---")
print(json.dumps(result))
print("---TRACE_END---")
`;
};

// ─────────────────────────────────────────────────────────────────────────────
// C++ Visualizer — compiles with -g, runs GDB in MI mode, step-by-step
// ─────────────────────────────────────────────────────────────────────────────
const generateGDBScript = (srcFile, exeFile, code) => {
    // Detect functions to set explicit breakpoints
    const functions = [];
    const mainMatch = code.match(/int\s+main\s*\(/);
    const solutionMatch = code.match(/class\s+Solution/);
    
    // Find all word characters followed by ( that look like function starts
    const methodMatches = code.matchAll(/(\w+)\s*\([^)]*\)\s*\{/g);
    for (const m of methodMatches) {
        if (!['if', 'for', 'while', 'switch', 'main'].includes(m[1])) {
            functions.push(m[1]);
        }
    }

    const breakpoints = functions.map(f => `break ${f}`).join('\n');

    return `
set pagination off
set print pretty on
set print elements 100
set confirm off

# Skip standard library headers
skip -gfi /usr/include/*
skip -gfi */bits/*
skip -gfi */c++/*
skip -gfi */include/c++/*
skip -gfi */mingw64/*
skip -gfi *libstdc++*
skip -gfi *libc*

file ${exeFile}
break main
${breakpoints}
run

set $step_count = 0
set $max_steps = 500

while $step_count < $max_steps
  set $step_count = $step_count + 1
  
  # Print marker for parsing
  printf "---STEP_START---\\n"
  printf "STEP:%d\\n", $step_count
  
  # Print current location
  frame
  
  # Print local variables and args
  printf "---VARS_START---\\n"
  info args
  info locals
  printf "---VARS_END---\\n"
  
  # Print call stack
  printf "---STACK_START---\\n"
  backtrace
  printf "---STACK_END---\\n"
  
  printf "---STEP_END---\\n"
  
  # Step INTO functions
  step
  
  # Check if program ended
  if $_isvoid($_exitcode) == 0
    printf "---PROGRAM_END---\\n"
    loop_break
  end
end
quit
`;
};

// Parse GDB output into structured steps
const parseGDBOutput = (rawOutput, sourceCode) => {
    const steps = [];
    const lines = rawOutput.split('\n');
    let currentStep = null;
    let section = null; // 'vars' | 'stack' | null
    let sectionLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line === '---STEP_START---') {
            currentStep = {
                step: 0,
                line: 0,
                event: 'line',
                function: 'main',
                variables: {},
                stack: [],
                stdout: ''
            };
            section = null;
            continue;
        }

        if (line === '---STEP_END---') {
            if (currentStep && currentStep.line > 0) {
                // If the top frame isn't in our file, skip this step
                steps.push(currentStep);
            }
            currentStep = null;
            continue;
        }

        if (!currentStep) continue;

        if (line.startsWith('STEP:')) {
            currentStep.step = parseInt(line.split(':')[1]) || 0;
            continue;
        }

        if (line === '---VARS_START---') {
            section = 'vars';
            sectionLines = [];
            continue;
        }

        if (line === '---VARS_END---') {
            // Parse variables from GDB 'info locals' and 'info args' output
            for (const vline of sectionLines) {
                const match = vline.match(/^(\w+)\s*=\s*(.+)$/);
                if (match) {
                    const varName = match[1];
                    let varValue = match[2].trim();
                    
                    // Simple cleaning for strings
                    const strMatch = varValue.match(/_M_p = 0x\w+ "(.+?)"/);
                    if (strMatch) varValue = strMatch[1];
                    else if (varValue.includes('"')) {
                        const qMatch = varValue.match(/"(.*?)"/);
                        if (qMatch) varValue = qMatch[1];
                    }
                    
                    if (/^-?\d+$/.test(varValue)) varValue = parseInt(varValue);
                    else if (/^-?\d+\.\d+$/.test(varValue)) varValue = parseFloat(varValue);
                    else if (varValue === 'true') varValue = true;
                    else if (varValue === 'false') varValue = false;
                    else if (varValue.startsWith('{')) {
                        try {
                            let cleaned = varValue.replace(/^\{/, '[').replace(/\}$/, ']').replace(/,}/, ']');
                            varValue = JSON.parse(cleaned);
                        } catch {}
                    }
                    currentStep.variables[varName] = varValue;
                }
            }
            section = null;
            continue;
        }

        if (line === '---STACK_START---') {
            section = 'stack';
            sectionLines = [];
            continue;
        }

        if (line === '---STACK_END---') {
            for (const sline of sectionLines) {
                // Format: #0  main () at code.cpp:10
                const match = sline.match(/#(\d+)\s+(?:0x\w+\s+in\s+)?([\w:<>, ]+)\s*\(.*?\)\s+at\s+\S+:(\d+)/);
                if (match) {
                    const fn = match[2].split('(')[0].trim();
                    currentStep.stack.push({
                        function: fn,
                        line: parseInt(match[3])
                    });
                    // Deepest frame (0) defines current function and line
                    if (match[1] === '0') {
                        currentStep.function = fn;
                        currentStep.line = parseInt(match[3]);
                    }
                }
            }
            section = null;
            continue;
        }

        if (section === 'vars' || section === 'stack') {
            sectionLines.push(line);
            continue;
        }

        // Fallback line parsing
        const frameMatch = line.match(/^(\d+)\s+/);
        if (frameMatch && currentStep.line === 0) {
            currentStep.line = parseInt(frameMatch[1]);
        }
    }

    return steps;
};

// ─────────────────────────────────────────────────────────────────────────────
// Execute Python Visualizer
// ─────────────────────────────────────────────────────────────────────────────
const visualizePython = (userCode) => {
    return new Promise((resolve) => {
        const jobId = uuidv4();
        const tracerCode = generatePythonTracer(userCode);
        const srcFile = path.join(tempDir, `${jobId}_tracer.py`);
        
        fs.writeFileSync(srcFile, tracerCode, 'utf8');

        const opts = { timeout: 15000, maxBuffer: 1024 * 1024 * 5 };
        
        // Anti-pattern check: did user send C++ to Python visualizer?
        if (userCode.includes('#include') || userCode.includes('using namespace') || userCode.includes('std::')) {
            return resolve({
                success: false,
                error: "Language Mismatch Error: It looks like you're trying to visualize C++ code while the 'Python' mode is selected. Please switch the language toggle at the top to 'C++' and try again.",
                language: 'python'
            });
        }

        exec(`python "${srcFile}"`, opts, (err, stdout, stderr) => {
            cleanup(srcFile);

            if (err && !stdout.includes('---TRACE_START---')) {
                return resolve({
                    success: false,
                    error: `Execution Error:\n${stderr || err.message}`,
                    language: 'python'
                });
            }

            try {
                const traceStart = stdout.indexOf('---TRACE_START---');
                const traceEnd = stdout.indexOf('---TRACE_END---');
                
                if (traceStart === -1 || traceEnd === -1) {
                    return resolve({
                        success: false,
                        error: 'Failed to capture trace output',
                        language: 'python'
                    });
                }

                const jsonStr = stdout.substring(traceStart + '---TRACE_START---'.length, traceEnd).trim();
                const result = JSON.parse(jsonStr);
                resolve(result);
            } catch (e) {
                resolve({
                    success: false,
                    error: `Failed to parse trace: ${e.message}`,
                    language: 'python'
                });
            }
        });
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Execute C++ Visualizer (GDB-based)
// ─────────────────────────────────────────────────────────────────────────────
const visualizeCpp = (userCode) => {
    return new Promise((resolve) => {
        const jobId = uuidv4();
        const srcFile = path.join(tempDir, `${jobId}.cpp`);
        const exeFile = path.join(tempDir, `${jobId}`);
        const gdbScriptFile = path.join(tempDir, `${jobId}.gdb`);

        // Auto-wrap: if code has no main(), add includes + main()
        let finalCode = userCode;
        const hasMain = /\b(int|void)\s+main\s*\(/.test(userCode);
        const hasIncludes = /^\s*#include/m.test(userCode);

        if (!hasMain) {
            // Strip any existing includes/using to avoid conflicts
            const stripped = userCode
                .split('\n')
                .filter(line => {
                    const t = line.trim();
                    return !(
                        t.startsWith('#include') ||
                        t.startsWith('#pragma') ||
                        t.startsWith('using namespace') ||
                        t.startsWith('using std::')
                    );
                })
                .join('\n')
                .trim();

            const isClassSolution = userCode.includes('class Solution');
            
            // Try to find any public method name in the Solution class
            const methodMatch = userCode.match(/public:[\s\S]*?(\w+)\s*\(/);
            const fnName = methodMatch ? methodMatch[1] : 'myFunction';

            finalCode = `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <stack>
#include <queue>
using namespace std;

${stripped}

int main() {
    // Auto-generated main for visualization
    ${isClassSolution ? `Solution sol;
    // TODO: Initialize your arguments here (e.g., vector<int> nums = {...};)
    
    cout << "--- Visualizing ${fnName} ---" << endl;
    
    // Calling your function to start the trace
    // Update arguments below to match your function signature
    sol.${fnName}(/* args */);` : '// Add your code here'}
    
    return 0;
}`;
        } else if (!hasIncludes) {
            // Has main but no includes — add standard includes
            finalCode = `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>
using namespace std;

${userCode}`;
        }

        fs.writeFileSync(srcFile, finalCode, 'utf8');

        const compileOpts = { timeout: 10000, maxBuffer: 1024 * 512 };

        // Step 1: Compile with debug symbols (-g)
        exec(`g++ -std=c++17 -g -O0 "${srcFile}" -o "${exeFile}"`, compileOpts, (compileErr, _, compileStderr) => {
            if (compileErr) {
                cleanup(srcFile, exeFile, gdbScriptFile);
                return resolve({
                    success: false,
                    error: `Compilation Error:\n${compileStderr}`,
                    language: 'cpp'
                });
            }

            // Step 2: Generate GDB script
            const gdbScript = generateGDBScript(srcFile, exeFile, finalCode);
            fs.writeFileSync(gdbScriptFile, gdbScript, 'utf8');

            // Step 3: Run GDB with the script
            const gdbOpts = { timeout: 15000, maxBuffer: 1024 * 1024 * 5 };
            exec(`gdb --batch -x "${gdbScriptFile}" "${exeFile}"`, gdbOpts, (gdbErr, gdbStdout, gdbStderr) => {
                cleanup(srcFile, exeFile, `${exeFile}.exe`, gdbScriptFile);

                const rawOutput = gdbStdout || '';
                const steps = parseGDBOutput(rawOutput, finalCode);

                if (steps.length === 0) {
                    // GDB might not be available — provide a simulated fallback
                    return resolve(simulateCppTrace(finalCode));
                }

                resolve({
                    success: true,
                    language: 'cpp',
                    steps,
                    finalStdout: '',
                    totalSteps: steps.length,
                    code: finalCode
                });
            });
        });
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Simulated C++ Trace (fallback when GDB is not available)
// Parses the code statically and simulates a simple step-through
// ─────────────────────────────────────────────────────────────────────────────
const simulateCppTrace = (userCode) => {
    const lines = userCode.split('\n');
    const steps = [];
    let stepCount = 0;
    const variables = {};
    let inMain = false;
    let braceDepth = 0;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNum = i + 1;

        // Track entering main
        if (line.includes('int main') || line.includes('void main')) {
            inMain = true;
        }

        if (!inMain) continue;

        // Track braces
        const openBraces = (line.match(/{/g) || []).length;
        const closeBraces = (line.match(/}/g) || []).length;
        braceDepth += openBraces - closeBraces;

        // Skip empty lines, comments, includes, braces-only
        if (!line || line.startsWith('//') || line.startsWith('#') || 
            line === '{' || line === '}' || line.startsWith('using ')) {
            continue;
        }

        stepCount++;
        if (stepCount > 200) break;

        // Simple variable detection
        // Match: type varname = value;
        const varDeclMatch = line.match(/^\s*(?:int|float|double|long|char|bool|string|auto|size_t)\s+(\w+)\s*=\s*(.+?)\s*;/);
        if (varDeclMatch) {
            const varName = varDeclMatch[1];
            let varVal = varDeclMatch[2].trim();
            // Try parsing as number
            if (/^-?\d+$/.test(varVal)) varVal = parseInt(varVal);
            else if (/^-?\d+\.\d+$/.test(varVal)) varVal = parseFloat(varVal);
            else if (varVal === 'true') varVal = true;
            else if (varVal === 'false') varVal = false;
            variables[varName] = varVal;
        }

        // Match: varname = value; (reassignment)
        const reassignMatch = line.match(/^\s*(\w+)\s*=\s*(.+?)\s*;/);
        if (!varDeclMatch && reassignMatch && variables.hasOwnProperty(reassignMatch[1])) {
            const varName = reassignMatch[1];
            let varVal = reassignMatch[2].trim();
            if (/^-?\d+$/.test(varVal)) varVal = parseInt(varVal);
            else if (/^-?\d+\.\d+$/.test(varVal)) varVal = parseFloat(varVal);
            variables[varName] = varVal;
        }

        // Match: varname++ or varname--
        const incMatch = line.match(/(\w+)\+\+/);
        if (incMatch && typeof variables[incMatch[1]] === 'number') {
            variables[incMatch[1]]++;
        }
        const decMatch = line.match(/(\w+)--/);
        if (decMatch && typeof variables[decMatch[1]] === 'number') {
            variables[decMatch[1]]--;
        }

        // Detect cout for stdout capture
        let stdout = '';
        const coutMatch = line.match(/cout\s*<<\s*(.+)/);
        if (coutMatch) {
            const parts = coutMatch[1].split('<<').map(p => p.trim().replace(/;$/, '').trim());
            for (const part of parts) {
                if (part.startsWith('"') && part.endsWith('"')) {
                    stdout += part.slice(1, -1);
                } else if (part === 'endl') {
                    stdout += '\n';
                } else if (variables.hasOwnProperty(part)) {
                    stdout += String(variables[part]);
                }
            }
        }

        steps.push({
            step: stepCount,
            line: lineNum,
            event: 'line',
            function: 'main',
            variables: { ...variables },
            stack: [{ function: 'main', line: lineNum }],
            stdout: stdout
        });

        // If we hit return, stop
        if (line.startsWith('return')) break;
    }

    return {
        success: true,
        language: 'cpp',
        steps,
        finalStdout: '',
        totalSteps: steps.length,
        code: userCode,
        simulated: true // Flag that this was statically simulated, not GDB
    };
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Visualizer Entry Point
// ─────────────────────────────────────────────────────────────────────────────
const visualizeCode = async (language, code) => {
    if (language === 'python') {
        return visualizePython(code);
    } else if (language === 'cpp' || language === 'c') {
        return visualizeCpp(code);
    } else {
        return {
            success: false,
            error: `Visualization is not yet supported for "${language}". Currently supported: Python, C++`,
            language
        };
    }
};

module.exports = { visualizeCode };
