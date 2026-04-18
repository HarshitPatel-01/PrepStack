const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const dotenv = require('dotenv');
dotenv.config();

const problems = [
  {
    title: "Two Sum",
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.\n\n**Constraints:**\n* `2 <= nums.length <= 10^4`\n* `-10^9 <= nums[i] <= 10^9`\n* `-10^9 <= target <= 10^9`\n* Only one valid answer exists.",
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
      intuition: "For each element of the given array, try to find another element such that their sum equals the target. If such two numbers exist, return their indices; otherwise, return -1.",
      approach:  "Iterate in array from 0 to last index of the array (lets call this variable i). Now, run another loop say(j) from i+1 to last index of the array.\nIf sum of arr[i] and arr[j] equals to target then return the i and j. If no such indices are found then return -1 and -1.",
      complexity:"Time: O(N), Space: O(N)",
      solutionCode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            int comp = target - nums[i];\n            if (mp.count(comp)) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};",
      bruteForceApproach: "Will that work?\nYes, by checking every possible pair, we can find the pair that sums to the target.",
      bruteForceCode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        for (int i = 0; i < nums.size(); i++) {\n            for (int j = i + 1; j < nums.size(); j++) {\n                if (nums[i] + nums[j] == target) {\n                    return {i, j};\n                }\n            }\n        }\n        return {};\n    }\n};",
      optimalApproach: "To optimize space and time, we can use a hash map to keep track of the elements visited so far. By doing this we can look up the complement in O(1) time.",
      optimalCode: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (mp.count(comp)) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};"
    },
    testCases: [
      { input: "[2,7,11,15], 9",  output: "[0,1]", explanation: "nums[0] + nums[1] == 9" },
      { input: "[3,2,4], 6",      output: "[1,2]", explanation: "nums[1] + nums[2] == 6" },
      { input: "[3,3], 6",        output: "[0,1]", explanation: "" },
      { input: "[1,5,3,9,4], 12", output: "[2,3]", explanation: "" },
      { input: "[3,2,3], 6",      output: "[0,2]", explanation: "Elements at index 0 and 2 add up to 6" },
      { input: "[-1,-2,-3,-4,-5], -8", output: "[2,4]", explanation: "Negative numbers" },
      { input: "[0,4,3,0], 0",    output: "[0,3]", explanation: "Zeros" },
      { input: "[-1000000000,1000000000], 0", output: "[0,1]", explanation: "Large values" },
      { input: "[2,5,5,11], 10",  output: "[1,2]", explanation: "Duplicates forming target" },
      { input: "[10,20,30,40,50,60,70,80,90,100], 190", output: "[8,9]", explanation: "End of array" }
    ]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.\n\n**Constraints:**\n* `1 <= prices.length <= 10^5`\n* `0 <= prices[i] <= 10^4`",
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
      solutionCode: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};",
      bruteForceApproach: "Will that work?\nYes, we can try all possible pairs of buying and selling days by iterating through the array with two loops. However, this takes O(N^2) time.",
      bruteForceCode: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int maxP = 0;\n        for (int i = 0; i < prices.size(); i++) {\n            for (int j = i + 1; j < prices.size(); j++) {\n                if (prices[j] - prices[i] > maxP) {\n                    maxP = prices[j] - prices[i];\n                }\n            }\n        }\n        return maxP;\n    }\n};",
      optimalApproach: "To optimize to O(N), we only need a single pass. Keep track of the minimum price seen so far, and at each step, compute the current profit and update the maximum profit.",
      optimalCode: "class Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minP = INT_MAX, maxP = 0;\n        for (int p : prices) {\n            minP = min(minP, p);\n            maxP = max(maxP, p - minP);\n        }\n        return maxP;\n    }\n};"
    },
    testCases: [
      { input: "[7,1,5,3,6,4]", output: "5",  explanation: "Buy day 2, sell day 5" },
      { input: "[7,6,4,3,1]",   output: "0",  explanation: "No profit possible" },
      { input: "[1,2]",          output: "1",  explanation: "" },
      { input: "[2,4,1]",        output: "2",  explanation: "" },
      { input: "[1,2,3,4,5]",    output: "4",  explanation: "Buy on day 1 (price=1) and sell on day 5 (price=5)" },
      { input: "[2,1,2,1,0,1,2]", output: "2", explanation: "Fluctuating with zero" },
      { input: "[3,3,3,3,3]",    output: "0",  explanation: "Constant price" },
      { input: "[10000,0,10000]", output: "10000", explanation: "Large variance" },
      { input: "[1,4,2]",        output: "3",  explanation: "Local max" },
      { input: "[3,2,6,5,0,3]",  output: "4",  explanation: "Best profit is earlier" }
    ]
  },
  {
    title: "Contains Duplicate",
    description: "Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.\n\n**Constraints:**\n* `1 <= nums.length <= 10^5`\n* `-10^9 <= nums[i] <= 10^9`",
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
      solutionCode: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }\n        return false;\n    }\n};",
      bruteForceApproach: "Will that work?\nYes, we can compare every element with every other element to check for duplicates. This requires two nested loops and takes O(N^2) time.",
      bruteForceCode: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        for (int i = 0; i < nums.size(); i++) {\n            for (int j = i + 1; j < nums.size(); j++) {\n                if (nums[i] == nums[j]) return true;\n            }\n        }\n        return false;\n    }\n};",
      optimalApproach: "The optimal approach uses a hash set. As we iterate, we check if the element is already in the set. If it is, we found a duplicate. This drops the time to O(N).",
      optimalCode: "class Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }\n        return false;\n    }\n};"
    },
    testCases: [
      { input: "[1,2,3,1]",     output: "true",  explanation: "" },
      { input: "[1,2,3,4]",     output: "false", explanation: "" },
      { input: "[1,1,1,3,3,4,3,2,4,2]", output: "true", explanation: "" },
      { input: "[0,4,5,0,3,6]", output: "true",  explanation: "" },
      { input: "[1]",           output: "false", explanation: "Array of size 1 cannot have duplicates." },
      { input: "[]",            output: "false", explanation: "Empty array" },
      { input: "[2,2]",         output: "true",  explanation: "Two elements" },
      { input: "[-1,-1]",       output: "true",  explanation: "Negative values" },
      { input: "[1000000000,-1000000000]", output: "false", explanation: "Extreme values" },
      { input: "[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1]", output: "true", explanation: "Large distance" }
    ]
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array `nums`, find the subarray (a contiguous non-empty sequence of elements within an array) with the largest sum, and return its sum.\n\n**Constraints:**\n* `1 <= nums.length <= 10^5`\n* `-10^4 <= nums[i] <= 10^4`",
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
      solutionCode: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int cur = nums[0], mx = nums[0];\n        for (int i = 1; i < (int)nums.size(); i++) {\n            cur = max(nums[i], cur + nums[i]);\n            mx = max(mx, cur);\n        }\n        return mx;\n    }\n};",
      bruteForceApproach: "Will that work?\nYes, we can compute the sum of all possible subarrays systematically using two loops. But this takes O(N^2) time.",
      bruteForceCode: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int mx = -1e9;\n        for (int i = 0; i < nums.size(); i++) {\n            int cur = 0;\n            for (int j = i; j < nums.size(); j++) {\n                cur += nums[j];\n                mx = max(mx, cur);\n            }\n        }\n        return mx;\n    }\n};",
      optimalApproach: "Using Kadane's Algorithm, we can solve this in O(N). We track the maximum ending here implicitly, allowing us to compute it in a single pass.",
      optimalCode: "class Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int cur = nums[0], mx = nums[0];\n        for (int i = 1; i < (int)nums.size(); i++) {\n            cur = max(nums[i], cur + nums[i]);\n            mx = max(mx, cur);\n        }\n        return mx;\n    }\n};"
    },
    testCases: [
      { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6",  explanation: "[4,-1,2,1] has the largest sum = 6" },
      { input: "[1]",                      output: "1",  explanation: "" },
      { input: "[5,4,-1,7,8]",             output: "23", explanation: "" },
      { input: "[-1]",                     output: "-1", explanation: "" },
      { input: "[-2,-1]",                  output: "-1", explanation: "The maximum is the single element -1" },
      { input: "[-1,-2,-3,-4]",            output: "-1", explanation: "All negatives" },
      { input: "[0,0,0]",                  output: "0",  explanation: "All zeros" },
      { input: "[-2, -3, 4, -1, -2, 1, 5, -3]", output: "7", explanation: "[4,-1,-2,1,5] sum is 7" },
      { input: "[1,2,3,4,5]",              output: "15", explanation: "Entire array sum" },
      { input: "[8,-19,5,-4,20]",          output: "21", explanation: "[5,-4,20] sum is 21" }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.\n\n**Constraints:**\n* `1 <= s.length <= 10^4`\n* `s` consists of parentheses only `'()[]{}'`.",
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
      solutionCode: "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c=='(' || c=='{' || c=='[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                if (c==')' && st.top()!='(') return false;\n                if (c=='}' && st.top()!='{') return false;\n                if (c==']' && st.top()!='[') return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};",
      bruteForceApproach: "Will that work?\nYes, a naive approach is to continuously find and replace empty pairs like '()', '[]', or '{}' until the string is completely empty or no more pairs can be removed. This takes O(N^2).",
      bruteForceCode: "class Solution {\npublic:\n    bool isValid(string s) {\n        int len = -1;\n        while(s.length() != len) {\n            len = s.length();\n            size_t pos = s.find(\"()\");\n            if(pos != string::npos) s.erase(pos, 2);\n            pos = s.find(\"[]\");\n            if(pos != string::npos) s.erase(pos, 2);\n            pos = s.find(\"{}\");\n            if(pos != string::npos) s.erase(pos, 2);\n        }\n        return s.empty();\n    }\n};",
      optimalApproach: "The optimal O(N) strategy uses a stack. We push opening brackets and when a closing bracket is encountered, we verify it matches the bracket currently on the top of our stack.",
      optimalCode: "class Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c=='(' || c=='{' || c=='[') st.push(c);\n            else {\n                if (st.empty()) return false;\n                if (c==')' && st.top()!='(') return false;\n                if (c=='}' && st.top()!='{') return false;\n                if (c==']' && st.top()!='[') return false;\n                st.pop();\n            }\n        }\n        return st.empty();\n    }\n};"
    },
    testCases: [
      { input: '"()"',    output: "true",  explanation: "" },
      { input: '"()[]{}"', output: "true", explanation: "" },
      { input: '"(]"',    output: "false", explanation: "" },
      { input: '"([)]"',  output: "false", explanation: "" },
      { input: '"[({(())}[()])]"', output: "true", explanation: "Complex nested structure." },
      { input: '""',      output: "true",  explanation: "Empty string is valid" },
      { input: '"{"',     output: "false", explanation: "Incomplete" },
      { input: '"}"',     output: "false", explanation: "Invalid start" },
      { input: '"((("',   output: "false", explanation: "Unclosed" },
      { input: '"()()()()()()()()()()()()()()()"', output: "true", explanation: "Long flat string" }
    ]
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?\n\n**Constraints:**\n* `1 <= n <= 45`",
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
      solutionCode: "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n};",
      bruteForceApproach: "Will that work?\nYes, heavily branching recursion can explore every path step by step. You either take 1 step or 2 steps. The time complexity is O(2^N).",
      bruteForceCode: "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 1) return 1;\n        return climbStairs(n - 1) + climbStairs(n - 2);\n    }\n};",
      optimalApproach: "Since the recursion contains multiple redundant calls, we can optimize it using Dynamic Programming (similar to Fibonacci sequence) achieving an O(N) solution using minimal variables.",
      optimalCode: "class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n};"
    },
    testCases: [
      { input: "2", output: "2", explanation: "1+1 or 2" },
      { input: "3", output: "3", explanation: "1+1+1, 1+2, 2+1" },
      { input: "5", output: "8", explanation: "" },
      { input: "1", output: "1", explanation: "Only 1 step needed." },
      { input: "4", output: "5", explanation: "1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2" },
      { input: "6", output: "13", explanation: "" },
      { input: "10", output: "89", explanation: "" },
      { input: "20", output: "10946", explanation: "" },
      { input: "35", output: "14930352", explanation: "" },
      { input: "45", output: "1836311903", explanation: "Max edge case" }
    ]
  }
];

const moreProblems = require('./more_problems');
const allProblems = [...problems, ...moreProblems];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prepstack')
  .then(async () => {
    console.log('Connected to MongoDB');
    await Problem.deleteMany({});
    await Problem.insertMany(allProblems);
    console.log(`✓ Seeded ${allProblems.length} problems successfully`);
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
