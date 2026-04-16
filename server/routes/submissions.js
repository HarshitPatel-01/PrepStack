const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const { executeCode } = require('../utils/execute');

// Splits function args by comma, respecting nested brackets
const splitArgs = (input) => {
    const args = [];
    let depth = 0;
    let current = '';
    for (const ch of input) {
        if (ch === '[') depth++;
        else if (ch === ']') depth--;
        if (ch === ',' && depth === 0) {
            args.push(current.trim());
            current = '';
        } else {
            current += ch;
        }
    }
    if (current.trim()) args.push(current.trim());
    return args;
};

// Builds the full file content for each language
const buildCode = (language, userCode, handlerFn, testInput) => {
    
    if (language === 'cpp') {
        const args = splitArgs(testInput);
        const varDecls = [];
        const callArgs = [];
        let varCount = 0;

        for (const arg of args) {
            const varName = `v${varCount++}`;
            let type = "int";
            let val = arg;

            if (arg.startsWith('[[')) {
                type = "vector<vector<int>>";
                val = arg.replace(/\[/g, '{').replace(/\]/g, '}');
            } else if (arg.startsWith('[') && arg.includes('"')) {
                type = "vector<string>";
                val = arg.replace(/\[/g, '{').replace(/\]/g, '}');
            } else if (arg.startsWith('[')) {
                type = "vector<int>";
                val = arg.replace(/\[/g, '{').replace(/\]/g, '}');
            } else if (arg.startsWith('"')) {
                type = "string";
                val = arg;
            } else if (arg === 'true' || arg === 'false') {
                type = "bool";
            } else if (isNaN(arg)) {
                type = "string"; // Fallback for raw unquoted chars if any
            }

            varDecls.push(`    ${type} ${varName} = ${val};`);
            callArgs.push(varName);
        }

        return `#include <bits/stdc++.h>
using namespace std;

// --- Modular Printer System ---
template<typename T>
void printVal(T v) { cout << v; }
void printVal(bool v) { cout << (v ? "true" : "false"); }
void printVal(string v) { cout << "\"" << v << "\""; }

template<typename T>
void printVal(vector<T>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        printVal(v[i]);
        if (i != v.size() - 1) cout << ",";
    }
    cout << "]";
}

${userCode}

int main() {
    Solution sol;
${varDecls.join('\n')}
    auto result = sol.${handlerFn}(${callArgs.join(', ')});
    printVal(result);
    cout << endl;
    return 0;
}`;
    }
    
    if (language === 'python') {
        return `from typing import List, Optional, Dict
import json

${userCode}

def solve():
    sol = Solution()
    result = sol.${handlerFn}(${testInput})
    print(json.dumps(result))

if __name__ == "__main__":
    solve()`;
    }

    if (language === 'java') {
        return `import java.util.*;

${userCode}

class Driver {
    public static void main(String[] args) {
        Solution sol = new Solution();
        Object result = sol.${handlerFn}(${testInput.replace(/\[/g, "new int[]{").replace(/\]/g, "}")});
        System.out.println(Printer.format(result));
    }
}

class Printer {
    public static String format(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof int[]) return Arrays.toString((int[]) obj).replace(" ", "");
        if (obj instanceof long[]) return Arrays.toString((long[]) obj).replace(" ", "");
        if (obj instanceof boolean[]) return Arrays.toString((boolean[]) obj).replace(" ", "");
        if (obj instanceof double[]) return Arrays.toString((double[]) obj).replace(" ", "");
        if (obj instanceof String[]) {
            return "[" + String.join(",", Arrays.stream((String[]) obj).map(s -> "\\"" + s + "\\"").toArray(String[]::new)) + "]";
        }
        if (obj instanceof Object[]) {
            Object[] arr = (Object[]) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                sb.append(format(arr[i]));
                if (i < arr.length - 1) sb.append(",");
            }
            return sb.append("]").toString();
        }
        if (obj instanceof List) {
           return format(((List) obj).toArray());
        }
        return obj.toString();
    }
}`;
    }

    if (language === 'c') {
        return `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

${userCode}

int main() {
    // Basic C judge supports int results for now
    int result = ${handlerFn}(${testInput}); 
    printf("%d\\n", result);
    return 0;
}`;
    }

    return userCode;
};

// Normalize output for comparison
const normalize = (str) => str.trim().replace(/\s+/g, '');

// Compare two values (handles arrays, booleans, numbers)
const isCorrect = (actual, expected) => {
    const a = normalize(actual);
    const e = normalize(expected);
    if (a === e) return true;
    try {
        const aP = JSON.parse(a);
        const eP = JSON.parse(e);
        if (Array.isArray(aP) && Array.isArray(eP)) {
            return JSON.stringify([...aP].sort()) === JSON.stringify([...eP].sort());
        }
        return JSON.stringify(aP) === JSON.stringify(eP);
    } catch {
        return false;
    }
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

router.post('/:id', async (req, res) => {
    try {
        const { code, language } = req.body;
        const problem = await Problem.findById(req.params.id);
        if (!problem) return res.status(404).json({ message: 'Problem not found' });

        // Authenticate user (optional based on whether token is provided)
        let userId = null;
        try {
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            }
        } catch (e) {
            console.error('Auth check in submission failed:', e.message);
        }

        const results = [];
        let allPassed = true;

        for (const testCase of problem.testCases) {
            const fullCode = buildCode(language, code, problem.handlerFunction, testCase.input);
            
            console.log('\n--- Generated Code ---\n', fullCode, '\n---');
            
            const executionResult = await executeCode(language, fullCode);

            if (!executionResult.success) {
                allPassed = false;
                results.push({
                    input: testCase.input,
                    expected: testCase.output,
                    actual: null,
                    error: executionResult.error,
                    passed: false
                });
            } else {
                const actual = executionResult.stdout;
                const passed = isCorrect(actual, testCase.output);
                if (!passed) allPassed = false;

                console.log(`Input: ${testCase.input} | Got: "${actual}" | Expected: "${testCase.output}" | Pass: ${passed}`);

                results.push({
                    input: testCase.input,
                    expected: testCase.output,
                    actual,
                    passed
                });
            }
        }

        // --- Mark as Done if Success ---
        if (allPassed && userId) {
            await User.findByIdAndUpdate(userId, {
                $addToSet: { solvedProblems: problem._id }
            });
            console.log(`User ${userId} solved problem ${problem._id}`);
        }

        res.json({
            success: allPassed,
            message: allPassed ? 'Accepted' : 
                     results[0]?.error ? (results[0].error.includes('TLE') ? 'Time Limit Exceeded' : 
                                         results[0].error.startsWith('Compilation') ? 'Compilation Error' : 
                                         'Runtime Error') : 
                     'Wrong Answer',
            results
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
