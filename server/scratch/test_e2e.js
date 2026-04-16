const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const { executeCode } = require('../utils/execute');

// Same logic as submissions.js buildCode
const splitArgs = (input) => {
    const args = [];
    let depth = 0, current = '';
    for (const ch of input) {
        if (ch === '[') depth++;
        else if (ch === ']') depth--;
        if (ch === ',' && depth === 0) { args.push(current.trim()); current = ''; }
        else current += ch;
    }
    if (current.trim()) args.push(current.trim());
    return args;
};

const buildCppCode = (userCode, handlerFn, testInput) => {
    const args = splitArgs(testInput);
    const varDecls = [], callArgs = [];
    let varCount = 0;
    for (const arg of args) {
        if (arg.startsWith('[')) {
            const varName = `v${varCount++}`;
            varDecls.push(`    vector<int> ${varName} = ${arg.replace(/\[/g, '{').replace(/\]/g, '}')};`);
            callArgs.push(varName);
        } else {
            callArgs.push(arg);
        }
    }
    return `#include <bits/stdc++.h>
using namespace std;
template<typename T>
void printVal(T v) { cout << v; }
void printVal(bool v) { cout << (v ? "true" : "false"); }
void printVal(vector<int>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i)
        cout << v[i] << (i == v.size()-1 ? "" : ",");
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
};

const normalize = (str) => str.trim().replace(/\s+/g, '');
const isCorrect = (actual, expected) => {
    const a = normalize(actual), e = normalize(expected);
    if (a === e) return true;
    try {
        const aP = JSON.parse(a), eP = JSON.parse(e);
        if (Array.isArray(aP) && Array.isArray(eP))
            return JSON.stringify([...aP].sort()) === JSON.stringify([...eP].sort());
    } catch {}
    return false;
};

const userCode = `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < (int)nums.size(); i++) {
            int comp = target - nums[i];
            if (mp.count(comp)) return {mp[comp], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};`;

const run = async () => {
    await mongoose.connect('mongodb://localhost:27017/prepstack');
    const problem = await Problem.findOne({ title: 'Two Sum' });

    for (const tc of problem.testCases) {
        const fullCode = buildCppCode(userCode, problem.handlerFunction, tc.input);
        const res = await executeCode('cpp', fullCode);
        const passed = res.success && isCorrect(res.stdout, tc.output);
        console.log(`Input: ${tc.input} | Got: "${res.stdout}" | Exp: "${tc.output}" | ${passed ? '✓ PASS' : '✗ FAIL'}`);
        if (!res.success) console.log('  Error:', res.error);
    }
    process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });
