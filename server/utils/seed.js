const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const dotenv = require('dotenv');
dotenv.config();

const problems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "Easy",
    category: "Array",
    order: 1,
    starterCode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
    handlerFunction: "twoSum",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution\n        \n    }\n};",
      python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Write your solution\n        pass",
      java:   "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution\n        return new int[]{};\n    }\n}",
      c:      "int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    \n}"
    },
    editorial: {
      intuition: "The simplest way is to check every pair, but we can do better by using a hash map to store seen numbers.",
      approach:  "Iterate through the array once. For each number, check if its complement (target - num) exists in the map. If yes, return indices. Otherwise, add to map.",
      complexity:"Time: O(N), Space: O(N)",
      solutionCode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            int comp = target - nums[i];\n            if (mp.count(comp)) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};"
    },
    testCases: [
      { input: "[2,7,11,15], 9",  output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "[3,2,4], 6",      output: "[1,2]", explanation: "nums[1] + nums[2] == 6" },
      { input: "[3,3], 6",        output: "[0,1]", explanation: "" },
      { input: "[1,5,3,9,4], 12", output: "[2,3]", explanation: "" }
    ]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy and a single day to sell in the future. Return the maximum profit. If no profit, return 0.",
    difficulty: "Easy",
    category: "Array",
    order: 2,
    starterCode: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};",
    handlerFunction: "maxProfit",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        // Write your solution\n        \n    }\n};",
      python: "class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        # Write your solution\n        pass",
      java:   "class Solution {\n    public int maxProfit(int[] prices) {\n        // Write your solution\n        return 0;\n    }\n}",
      c:      "int maxProfit(int* prices, int pricesSize) {\n    \n}"
    },
    editorial: {
      intuition:  "Track the minimum price seen so far and the maximum profit we can get.",
      approach:   "Single pass: keep a running minimum. At each step compute profit = price - minPrice and update maxProfit.",
      complexity: "Time: O(N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};"
    },
    testCases: [
      { input: "[7,1,5,3,6,4]", output: "5",  explanation: "Buy day 2, sell day 5" },
      { input: "[7,6,4,3,1]",   output: "0",  explanation: "No profit possible" },
      { input: "[1,2]",          output: "1",  explanation: "" },
      { input: "[2,4,1]",        output: "2",  explanation: "" }
    ]
  },
  {
    title: "Contains Duplicate",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    difficulty: "Easy",
    category: "Array",
    order: 3,
    starterCode: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};",
    handlerFunction: "containsDuplicate",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        // Write your solution\n        \n    }\n};",
      python: "class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        # Write your solution\n        pass",
      java:   "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution\n        return false;\n    }\n}",
      c:      "bool containsDuplicate(int* nums, int numsSize) {\n    \n}"
    },
    editorial: {
      intuition:  "Use a hash set to track elements seen so far.",
      approach:   "Insert each element into a set. If it's already there, return true. Return false at the end.",
      complexity: "Time: O(N), Space: O(N)",
      solutionCode: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }\n        return false;\n    }\n};"
    },
    testCases: [
      { input: "[1,2,3,1]",     output: "true",  explanation: "" },
      { input: "[1,2,3,4]",     output: "false", explanation: "" },
      { input: "[1,1,1,3,3,4,3,2,4,2]", output: "true", explanation: "" }
    ]
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum. (Kadane's Algorithm)",
    difficulty: "Medium",
    category: "Array",
    order: 4,
    starterCode: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};",
    handlerFunction: "maxSubArray",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        // Write your solution\n        \n    }\n};",
      python: "class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        # Write your solution\n        pass",
      java:   "class Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution\n        return 0;\n    }\n}",
      c:      "int maxSubArray(int* nums, int numsSize) {\n    \n}"
    },
    editorial: {
      intuition:  "Kadane's Algorithm: extend the current subarray or start fresh.",
      approach:   "Keep a running sum. At each element, decide whether to extend the current subarray or start new. Track the global max.",
      complexity: "Time: O(N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int cur = nums[0], mx = nums[0];\n        for (int i = 1; i < (int)nums.size(); i++) {\n            cur = max(nums[i], cur + nums[i]);\n            mx = max(mx, cur);\n        }\n        return mx;\n    }\n};"
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6",  explanation: "[4,-1,2,1] has the largest sum = 6" },
      { input: "[1]",                      output: "1",  explanation: "" },
      { input: "[5,4,-1,7,8]",             output: "23", explanation: "" }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Brackets must close in the correct order.",
    difficulty: "Easy",
    category: "Stack",
    order: 5,
    starterCode: "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
    handlerFunction: "isValid",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    bool isValid(string s) {\n        // Write your solution\n        \n    }\n};",
      python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        # Write your solution\n        pass",
      java:   "class Solution {\n    public boolean isValid(String s) {\n        // Write your solution\n        return false;\n    }\n}",
      c:      "bool isValid(char* s) {\n    \n}"
    },
    editorial: {
      intuition:  "Use a stack. Push open brackets; pop for closing brackets and verify match.",
      approach:   "For every opening bracket push it. For closing bracket check if top of stack matches. If not, return false.",
      complexity: "Time: O(N), Space: O(N)",
      solutionCode: "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c=='(' || c=='{' || c=='[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                if (c==')' && st.top()!='(') return false;\n                if (c=='}' && st.top()!='{') return false;\n                if (c==']' && st.top()!='[') return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};"
    },
    testCases: [
      { input: '"()"',    output: "true",  explanation: "" },
      { input: '"()[]{}"', output: "true", explanation: "" },
      { input: '"(]"',    output: "false", explanation: "" },
      { input: '"([)]"',  output: "false", explanation: "" }
    ]
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "Easy",
    category: "Dynamic Programming",
    order: 6,
    starterCode: "class Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};",
    handlerFunction: "climbStairs",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int climbStairs(int n) {\n        // Write your solution\n        \n    }\n};",
      python: "class Solution:\n    def climbStairs(self, n: int) -> int:\n        # Write your solution\n        pass",
      java:   "class Solution {\n    public int climbStairs(int n) {\n        // Write your solution\n        return 0;\n    }\n}",
      c:      "int climbStairs(int n) {\n    \n}"
    },
    editorial: {
      intuition:  "The number of ways to reach step n = ways to reach (n-1) + ways to reach (n-2). It's Fibonacci!",
      approach:   "Use dynamic programming with just two variables (no array needed) iterating from 1 to n.",
      complexity: "Time: O(N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n};"
    },
    testCases: [
      { input: "2", output: "2", explanation: "1+1 or 2" },
      { input: "3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
      { input: "5", output: "8", explanation: "" }
    ]
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prepstack')
  .then(async () => {
    console.log('Connected to MongoDB');
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log(`✓ Seeded ${problems.length} problems successfully`);
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
