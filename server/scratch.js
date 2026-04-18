// Test that #include stripping + correct string output works
const mongoose = require('mongoose');
const Problem = require('./models/Problem');
const { executeCode } = require('./utils/execute');
const dotenv = require('dotenv');
dotenv.config();

// Replicate the sanitizer from submissions.js
const sanitizeUserCode = (userCode) => userCode
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

const buildCpp = (sanitizedCode, handlerFn, varDecls, callArgs) =>
`#include <bits/stdc++.h>
using namespace std;

template<typename T>
void printVal(T v) { cout << v; }

void printVal(bool v) { cout << (v ? "true" : "false"); }

void printVal(string v) { cout << "\\"" << v << "\\""; }

template<typename T>
void printVal(vector<T>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        printVal(v[i]);
        if (i != v.size() - 1) cout << ",";
    }
    cout << "]";
}

${sanitizedCode}

int main() {
    Solution sol;
${varDecls}
    auto result = sol.${handlerFn}(${callArgs});
    cout << "\\n---RESULT---\\n";
    printVal(result);
    cout << endl;
    return 0;
}`;

async function test() {
    // User code WITH #include (the problematic case)
    const userCode = `#include <algorithm>

class Solution {
public:
    string reverseString(string s) {
        reverse(s.begin(), s.end());
        return s;
    }
};`;

    const sanitized = sanitizeUserCode(userCode);
    console.log("=== Sanitized user code ===");
    console.log(sanitized);
    console.log("\n=== Lines removed:", userCode.split('\n').length - sanitized.split('\n').length);

    const fullCode = buildCpp(sanitized, 'reverseString', '    string v0 = "hello";', 'v0');
    console.log("\n=== Full generated C++ ===");
    console.log(fullCode);

    const result = await executeCode('cpp', fullCode);
    console.log("\n=== Execution Result ===");
    console.log(result);

    // Check string output parsing
    if (result.success) {
        const parts = result.stdout.split('---RESULT---');
        const answer = parts[parts.length - 1].trim();
        console.log('\nFinal answer:', answer);
        console.log('Expected:    "olleh"');
        console.log('PASS:', answer === '"olleh"');
    }

    process.exit(0);
}

test().catch(console.error);
