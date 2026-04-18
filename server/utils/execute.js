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

// Check if Docker is available on this machine
let DOCKER_AVAILABLE = null;
const checkDocker = () => {
    return new Promise((resolve) => {
        if (DOCKER_AVAILABLE !== null) return resolve(DOCKER_AVAILABLE);
        exec('docker info', { timeout: 3000 }, (err) => {
            DOCKER_AVAILABLE = !err;
            resolve(DOCKER_AVAILABLE);
        });
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Docker Sandbox Executor (LeetCode-style, fully sandboxed)
// ─────────────────────────────────────────────────────────────────────────────
const executeWithDocker = (language, code) => {
    return new Promise(async (resolve) => {
        const jobId = uuidv4();
        const jobDir = path.join(tempDir, jobId);
        fs.mkdirSync(jobDir, { recursive: true });

        const dockerTimeout = 10; // seconds for the container to fully complete

        try {
            if (language === 'cpp') {
                const srcFile = path.join(jobDir, 'code.cpp');
                fs.writeFileSync(srcFile, code, 'utf8');

                // Convert Windows path to Docker-compatible format (if on Windows)
                const dockerPath = jobDir.replace(/\\/g, '/').replace(/^([A-Z]):/, (_, d) => `/${d.toLowerCase()}`);

                // Docker security flags:
                //   --rm           → auto-delete container after run
                //   --memory=128m  → 128MB RAM limit
                //   --cpus=0.5     → 50% of one CPU core
                //   --network=none → NO internet access
                //   --pids-limit=64→ prevent fork bomb
                //   timeout 5s     → kill infinite loops
                //   USER runner    → non-root user inside container
                const command = `docker run --rm \
                    --memory=128m \
                    --cpus=0.5 \
                    --network=none \
                    --pids-limit=64 \
                    -v "${dockerPath}:/sandbox" \
                    prepstack-runner \
                    sh -c "g++ -std=c++17 -O2 /sandbox/code.cpp -o /sandbox/output 2>&1 && timeout 5s /sandbox/output"`;

                exec(command, { timeout: (dockerTimeout * 1000) + 2000 }, (err, stdout, stderr) => {
                    // Clean up the job directory
                    try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch (_) {}

                    if (err) {
                        // Separate compilation errors from runtime errors
                        const output = stderr || stdout || err.message;
                        if (output.includes('error:') || output.includes('undefined reference')) {
                            return resolve({ success: false, error: `Compilation Error:\n${output}` });
                        }
                        if (err.killed || output.includes('Timeout') || output.includes('timeout')) {
                            return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                        }
                        return resolve({ success: false, error: `Runtime Error:\n${output}` });
                    }

                    resolve({ success: true, stdout: stdout.trim() });
                });

            } else if (language === 'python') {
                const srcFile = path.join(jobDir, 'code.py');
                fs.writeFileSync(srcFile, code, 'utf8');

                const dockerPath = jobDir.replace(/\\/g, '/').replace(/^([A-Z]):/, (_, d) => `/${d.toLowerCase()}`);

                const command = `docker run --rm \
                    --memory=128m \
                    --cpus=0.5 \
                    --network=none \
                    --pids-limit=64 \
                    -v "${dockerPath}:/sandbox" \
                    prepstack-runner \
                    sh -c "timeout 5s python3 /sandbox/code.py"`;

                exec(command, { timeout: (dockerTimeout * 1000) + 2000 }, (err, stdout, stderr) => {
                    try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch (_) {}

                    if (err) {
                        if (err.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                        return resolve({ success: false, error: `Runtime Error:\n${stderr || err.message}` });
                    }

                    resolve({ success: true, stdout: stdout.trim() });
                });

            } else if (language === 'java') {
                const srcFile = path.join(jobDir, 'Solution.java');
                // Patch class name to Solution for java
                const patchedCode = code.replace(/class Driver\s*{/, 'class Driver {').replace(/class Sol\w+/, 'class Solution');
                fs.writeFileSync(srcFile, patchedCode, 'utf8');

                const dockerPath = jobDir.replace(/\\/g, '/').replace(/^([A-Z]):/, (_, d) => `/${d.toLowerCase()}`);

                const command = `docker run --rm \
                    --memory=128m \
                    --cpus=0.5 \
                    --network=none \
                    --pids-limit=64 \
                    -v "${dockerPath}:/sandbox" \
                    prepstack-runner \
                    sh -c "javac /sandbox/Solution.java -d /sandbox && timeout 5s java -cp /sandbox Driver"`;

                exec(command, { timeout: (dockerTimeout * 1000) + 2000 }, (err, stdout, stderr) => {
                    try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch (_) {}

                    if (err) {
                        const output = stderr || stdout || err.message;
                        if (output.includes('error:')) {
                            return resolve({ success: false, error: `Compilation Error:\n${output}` });
                        }
                        if (err.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                        return resolve({ success: false, error: `Runtime Error:\n${output}` });
                    }

                    resolve({ success: true, stdout: stdout.trim() });
                });
            } else {
                resolve({ success: false, error: 'Unsupported language' });
            }
        } catch (e) {
            try { fs.rmSync(jobDir, { recursive: true, force: true }); } catch (_) {}
            resolve({ success: false, error: `Internal error: ${e.message}` });
        }
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Local Fallback Executor (used if Docker isn't running)
// ─────────────────────────────────────────────────────────────────────────────
const executeLocally = (language, code) => {
    return new Promise((resolve) => {
        const jobId = uuidv4();
        const opts = { timeout: 5000, maxBuffer: 1024 * 512 };

        if (language === 'cpp') {
            const srcFile = path.join(tempDir, `${jobId}.cpp`);
            const outFile = path.join(tempDir, `${jobId}.exe`);
            fs.writeFileSync(srcFile, code, 'utf8');

            exec(`g++ -std=c++17 -O2 "${srcFile}" -o "${outFile}"`, opts, (compileErr, _, compileStderr) => {
                if (compileErr) {
                    cleanup(srcFile, outFile);
                    return resolve({ success: false, error: `Compilation Error:\n${compileStderr}` });
                }
                const t0 = process.hrtime.bigint();
                exec(`"${outFile}"`, opts, (runErr, stdout, stderr) => {
                    const runtimeMs = Number(process.hrtime.bigint() - t0) / 1e6;
                    cleanup(srcFile, outFile);
                    if (runErr) {
                        if (runErr.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                        return resolve({ success: false, error: `Runtime Error:\n${stderr || runErr.message}` });
                    }
                    resolve({ success: true, stdout: stdout.trim(), runtimeMs: Math.round(runtimeMs) });
                });
            });

        } else if (language === 'python') {
            const srcFile = path.join(tempDir, `${jobId}.py`);
            fs.writeFileSync(srcFile, code, 'utf8');
            const t0 = process.hrtime.bigint();
            exec(`python "${srcFile}"`, opts, (err, stdout, stderr) => {
                const runtimeMs = Number(process.hrtime.bigint() - t0) / 1e6;
                cleanup(srcFile);
                if (err) {
                    if (err.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                    return resolve({ success: false, error: `Runtime Error:\n${stderr || err.message}` });
                }
                resolve({ success: true, stdout: stdout.trim(), runtimeMs: Math.round(runtimeMs) });
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
                const t0 = process.hrtime.bigint();
                exec(`java -cp "${tempDir}" ${className}`, opts, (runErr, stdout, stderr) => {
                    const runtimeMs = Number(process.hrtime.bigint() - t0) / 1e6;
                    cleanup(srcFile, path.join(tempDir, `${className}.class`));
                    if (runErr) {
                        if (runErr.killed) return resolve({ success: false, error: 'Time Limit Exceeded (5s)' });
                        return resolve({ success: false, error: `Runtime Error:\n${stderr || runErr.message}` });
                    }
                    resolve({ success: true, stdout: stdout.trim(), runtimeMs: Math.round(runtimeMs) });
                });
            });

        } else {
            resolve({ success: false, error: 'Unsupported language' });
        }
    });
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Executor — Auto-selects Docker if available, falls back to local
// ─────────────────────────────────────────────────────────────────────────────
const executeCode = async (language, code) => {
    const dockerAvailable = await checkDocker();
    if (dockerAvailable) {
        console.log(`[Executor] Using Docker sandbox for ${language}`);
        return executeWithDocker(language, code);
    } else {
        console.log(`[Executor] Docker unavailable — using local fallback for ${language}`);
        return executeLocally(language, code);
    }
};

module.exports = { executeCode };
