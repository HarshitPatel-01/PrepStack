const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const { executeCode } = require('../utils/execute');

const runTest = async () => {
    await mongoose.connect('mongodb://localhost:27017/prepstack');
    const problem = await Problem.findOne({ title: 'Two Sum' });
    const code = `class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) return {map[complement], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`;
    const language = 'cpp';

    for (const testCase of problem.testCases) {
        let input = testCase.input;
        const cppInput = input.replace(/\[/g, '{').replace(/\]/g, '}');
        
        const fullCode = `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <unordered_map>\nusing namespace std;\ntemplate<typename T>\nvoid pr(T v) { cout << v; }\ntemplate<typename T>\nvoid pr(vector<T> v) {\n    cout << "[";\n    for(size_t i=0; i<v.size(); ++i) { cout << v[i] << (i==v.size()-1 ? "" : ","); }\n    cout << "]";\n}\n${code}\nint main() {\n    Solution sol;\n    pr(sol.twoSum(${cppInput}));\n    return 0;\n}`;

        const res = await executeCode(language, fullCode, "");
        console.log(`Input: ${input} | Got: ${res.stdout} | Exp: ${testCase.output}`);
    }
    process.exit();
};

runTest();
