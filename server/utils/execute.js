const { exec } = require('child_process');
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

const executeCode = (language, code) => {
    return new Promise((resolve) => {
        const jobId = uuidv4();
        const opts = { timeout: 5000, maxBuffer: 1024 * 512 };

        if (language === 'cpp') {
            const srcFile = path.join(tempDir, `${jobId}.cpp`);
            const outFile = path.join(tempDir, `${jobId}.exe`);
            fs.writeFileSync(srcFile, code, 'utf8');
            
            exec(`g++ -std=c++17 -O2 -Wall -Wextra "${srcFile}" -o "${outFile}"`, opts, (compileErr, _, compileStderr) => {
                if (compileErr) {
                    cleanup(srcFile, outFile);
                    return resolve({ success: false, error: `Compilation Error:\n${compileStderr}` });
                }
                exec(`"${outFile}"`, opts, (runErr, stdout, stderr) => {
                    cleanup(srcFile, outFile);
                    if (runErr) {
                        if (runErr.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                        return resolve({ success: false, error: `Runtime Error:\n${stderr || runErr.message}` });
                    }
                    resolve({ success: true, stdout: stdout.trim() });
                });
            });

        } else if (language === 'c') {
            const srcFile = path.join(tempDir, `${jobId}.c`);
            const outFile = path.join(tempDir, `${jobId}.exe`);
            fs.writeFileSync(srcFile, code, 'utf8');

            exec(`gcc -O2 -Wall -Wextra "${srcFile}" -o "${outFile}"`, opts, (compileErr, _, compileStderr) => {
                if (compileErr) {
                    cleanup(srcFile, outFile);
                    return resolve({ success: false, error: `Compilation Error:\n${compileStderr}` });
                }
                exec(`"${outFile}"`, opts, (runErr, stdout, stderr) => {
                    cleanup(srcFile, outFile);
                    if (runErr) {
                        if (runErr.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                        return resolve({ success: false, error: `Runtime Error:\n${stderr || runErr.message}` });
                    }
                    resolve({ success: true, stdout: stdout.trim() });
                });
            });

        } else if (language === 'python') {
            const srcFile = path.join(tempDir, `${jobId}.py`);
            fs.writeFileSync(srcFile, code, 'utf8');
            exec(`python "${srcFile}"`, opts, (err, stdout, stderr) => {
                cleanup(srcFile);
                if (err) {
                    if (err.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                    return resolve({ success: false, error: `Runtime Error:\n${stderr || err.message}` });
                }
                resolve({ success: true, stdout: stdout.trim() });
            });

        } else if (language === 'java') {
            const className = `Sol${jobId.replace(/-/g, '')}`;
            const srcFile = path.join(tempDir, `${className}.java`);
            const modifiedCode = code.replace(/class Solution/, `class ${className}`);
            fs.writeFileSync(srcFile, modifiedCode, 'utf8');

            exec(`javac "${srcFile}"`, opts, (compileErr, _, compileStderr) => {
                if (compileErr) {
                    cleanup(srcFile);
                    return resolve({ success: false, error: `Compilation Error:\n${compileStderr}` });
                }
                exec(`java -cp "${tempDir}" ${className}`, opts, (runErr, stdout, stderr) => {
                    cleanup(srcFile, path.join(tempDir, `${className}.class`));
                    if (runErr) {
                        if (runErr.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                        return resolve({ success: false, error: `Runtime Error:\n${stderr || runErr.message}` });
                    }
                    resolve({ success: true, stdout: stdout.trim() });
                });
            });

        } else {
            resolve({ success: false, error: 'Unsupported language' });
        }
    });
};

module.exports = { executeCode };
