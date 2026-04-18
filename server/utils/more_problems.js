const moreProblems = [
  {
    title: "Binary Search",
    description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.\n\n**Constraints:**\n* `1 <= nums.length <= 10^4`\n* `-10^4 < nums[i], target < 10^4`",
    difficulty: "Easy",
    category: "Binary Search",
    order: 7,
    starterCode: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};",
    handlerFunction: "search",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};",
      python: "class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass",
      java:   "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}",
      c:      "int search(int* nums, int numsSize, int target) {\n    \n}"
    },
    editorial: {
      intuition: "Since the array is sorted, we can repeatedly halve the search space.",
      approach: "Maintain two pointers, left and right. Calculate mid. If nums[mid] is the target, return mid. If less, search right half. If greater, search left half.",
      complexity: "Time: O(log N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n};",
      bruteForceApproach: "Iterate through the array one by one until you find the target. This takes O(N) time.",
      bruteForceCode: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        for(int i = 0; i < nums.size(); i++) {\n            if (nums[i] == target) return i;\n        }\n        return -1;\n    }\n};",
      optimalApproach: "Use Binary Search to achieve O(log N) runtime by dividing the array in half each time.",
      optimalCode: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n};"
    },
    testCases: [
      { input: "[-1,0,3,5,9,12], 9", output: "4", explanation: "9 exists in nums and its index is 4" },
      { input: "[-1,0,3,5,9,12], 2", output: "-1", explanation: "2 does not exist in nums" },
      { input: "[5], 5", output: "0", explanation: "Single element found" },
      { input: "[5], -5", output: "-1", explanation: "Single element not found" },
      { input: "[2,5], 5", output: "1", explanation: "Two elements" },
      { input: "[2,5], 2", output: "0", explanation: "Two elements" },
      { input: "[-100,-50,-20,-10,-5,-1], -20", output: "2", explanation: "Negative array" },
      { input: "[10,20,30,40,50,60,70,80], 40", output: "3", explanation: "Even length array" },
      { input: "[10,20,30,40,50,60,70,80,90], 90", output: "8", explanation: "End of array" },
      { input: "[-1000, 0, 1000], 1000", output: "2", explanation: "Large increments" }
    ]
  },
  {
    title: "Valid Anagram",
    description: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\n**Constraints:**\n* `1 <= s.length, t.length <= 5 * 10^4`\n* `s` and `t` consist of lowercase English letters.",
    difficulty: "Easy",
    category: "Hash Map",
    order: 8,
    starterCode: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};",
    handlerFunction: "isAnagram",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};",
      python: "class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass",
      java:   "class Solution {\n    public boolean isAnagram(String s, String t) {\n        return false;\n    }\n}",
      c:      "bool isAnagram(char* s, char* t) {\n    \n}"
    },
    editorial: {
      intuition: "Two strings are anagrams if they have exactly the same characters with the same frequencies.",
      approach: "Use a frequency array or hash map of size 26. Increment counts for characters in s, decrement for t. If all counts are zero, it's an anagram.",
      complexity: "Time: O(N), Space: O(1) (since the alphabet size is fixed to 26).",
      solutionCode: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if(s.length() != t.length()) return false;\n        vector<int> counts(26, 0);\n        for(int i = 0; i < s.length(); i++) {\n            counts[s[i] - 'a']++;\n            counts[t[i] - 'a']--;\n        }\n        for(int count : counts) {\n            if (count != 0) return false;\n        }\n        return true;\n    }\n};",
      bruteForceApproach: "Sort both strings and compare them. Sorting takes O(N log N) time.",
      bruteForceCode: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        sort(s.begin(), s.end());\n        sort(t.begin(), t.end());\n        return s == t;\n    }\n};",
      optimalApproach: "Use a frequency array of size 26. Count occurrences for s, decrement for t. If any value is non-zero, return false.",
      optimalCode: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if(s.length() != t.length()) return false;\n        vector<int> counts(26, 0);\n        for(int i = 0; i < s.length(); i++) {\n            counts[s[i] - 'a']++;\n            counts[t[i] - 'a']--;\n        }\n        for(int count : counts) {\n            if (count != 0) return false;\n        }\n        return true;\n    }\n};"
    },
    testCases: [
      { input: "\"anagram\", \"nagaram\"", output: "true", explanation: "" },
      { input: "\"rat\", \"car\"", output: "false", explanation: "" },
      { input: "\"a\", \"a\"", output: "true", explanation: "" },
      { input: "\"ab\", \"a\"", output: "false", explanation: "" },
      { input: "\"a\", \"ab\"", output: "false", explanation: "" },
      { input: "\"abc\", \"cba\"", output: "true", explanation: "Reverse string is an anagram" },
      { input: "\"aabbbb\", \"ababbb\"", output: "true", explanation: "Same character frequency" },
      { input: "\"aabbbb\", \"baabbc\"", output: "false", explanation: "Different characters" },
      { input: "\"racecar\", \"carrace\"", output: "true", explanation: "Anagrams" },
      { input: "\"xyz\", \"xzy\"", output: "true", explanation: "" }
    ]
  },
  {
    title: "Container With Most Water",
    description: "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `ith` line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.\n\n**Constraints:**\n* `n == height.length`\n* `2 <= n <= 10^5`",
    difficulty: "Medium",
    category: "Two Pointers",
    order: 9,
    starterCode: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};",
    handlerFunction: "maxArea",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};",
      python: "class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        pass",
      java:   "class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}",
      c:      "int maxArea(int* height, int heightSize) {\n    \n}"
    },
    editorial: {
      intuition: "The water capacity is determined by the shorter building multiplied by the width between them.",
      approach: "Use a two-pointer approach (left and right). Always move the pointer that points to the shorter building inward, calculating max area at each step.",
      complexity: "Time: O(N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int left = 0, right = (int)height.size() - 1;\n        int mx = 0;\n        while(left < right) {\n            int h = min(height[left], height[right]);\n            int w = right - left;\n            mx = max(mx, h * w);\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return mx;\n    }\n};",
      bruteForceApproach: "Test all possible pairs of lines using two nested loops. Time complexity is O(N^2).",
      bruteForceCode: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int mx = 0;\n        for(int i=0; i<height.size(); i++) {\n            for(int j=i+1; j<height.size(); j++) {\n                mx = max(mx, min(height[i], height[j]) * (j - i));\n            }\n        }\n        return mx;\n    }\n};",
      optimalApproach: "Two pointers starting at the ends. Since the width is maximized, we greedily pursue taller heights by moving the shorter pointer inwards.",
      optimalCode: "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int left = 0, right = height.size() - 1;\n        int mx = 0;\n        while(left < right) {\n            int h = min(height[left], height[right]);\n            mx = max(mx, h * (right - left));\n            if(height[left] < height[right]) left++;\n            else right--;\n        }\n        return mx;\n    }\n};"
    },
    testCases: [
      { input: "[1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Max area is between index 1 and 8 (height 7 * width 7 = 49)." },
      { input: "[1,1]", output: "1", explanation: "" },
      { input: "[4,3,2,1,4]", output: "16", explanation: "Ends with 4 and 4, width is 4." },
      { input: "[1,2,1]", output: "2", explanation: "" },
      { input: "[10,9,8,7,6,5,4,3,2,1]", output: "25", explanation: "Left side is highest." },
      { input: "[1000, 1000]", output: "1000", explanation: "" },
      { input: "[1,8,6,2,5,4,100,100,7]", output: "100", explanation: "" },
      { input: "[0,0,0,0]", output: "0", explanation: "No water possible" },
      { input: "[1,0,0,1]", output: "3", explanation: "" },
      { input: "[4,4]", output: "4", explanation: "" }
    ]
  },
  {
    title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with `O(1)` extra memory.\n*(For this judge system, input is passed as a string and you return the reversed string)*.\n\n**Constraints:**\n* `1 <= s.length <= 10^5`",
    difficulty: "Easy",
    category: "Two Pointers",
    order: 10,
    starterCode: "class Solution {\npublic:\n    string reverseString(string s) {\n        \n    }\n};",
    handlerFunction: "reverseString",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    string reverseString(string s) {\n        \n    }\n};",
      python: "class Solution:\n    def reverseString(self, s: str) -> str:\n        pass",
      java:   "class Solution {\n    public String reverseString(String s) {\n        return \"\";\n    }\n}",
      c:      "char* reverseString(char* s) {\n    \n}"
    },
    editorial: {
      intuition: "Swap characters from the ends moving towards the center.",
      approach: "Keep one pointer at the beginning and one at the end. Swap their values and move them closer until they meet.",
      complexity: "Time: O(N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    string reverseString(string s) {\n        int left = 0, right = (int)s.length() - 1;\n        while (left < right) {\n            swap(s[left++], s[right--]);\n        }\n        return s;\n    }\n};",
      bruteForceApproach: "Create a new string and append characters from the end of the original string. Takes O(N) extra space.",
      bruteForceCode: "class Solution {\npublic:\n    string reverseString(string s) {\n        string out = \"\";\n        for(int i = s.length() - 1; i >= 0; i--) out += s[i];\n        return out;\n    }\n};",
      optimalApproach: "Two pointers, swap in-place.",
      optimalCode: "class Solution {\npublic:\n    string reverseString(string s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            char temp = s[l];\n            s[l] = s[r];\n            s[r] = temp;\n            l++; r--;\n        }\n        return s;\n    }\n};"
    },
    testCases: [
      { input: "\"hello\"", output: "\"olleh\"", explanation: "" },
      { input: "\"Hannah\"", output: "\"hannaH\"", explanation: "" },
      { input: "\"a\"", output: "\"a\"", explanation: "" },
      { input: "\"ab\"", output: "\"ba\"", explanation: "" },
      { input: "\"abcde\"", output: "\"edcba\"", explanation: "" },
      { input: "\"racecar\"", output: "\"racecar\"", explanation: "Palindrome remains the same" },
      { input: "\"123456789\"", output: "\"987654321\"", explanation: "" },
      { input: "\"    \"", output: "\"    \"", explanation: "Spaces" },
      { input: "\"A b C\"", output: "\"C b A\"", explanation: "" },
      { input: "\"x\"", output: "\"x\"", explanation: "" }
    ]
  },
  {
    title: "Missing Number",
    description: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.\n\n**Constraints:**\n* `n == nums.length`\n* `1 <= n <= 10^4`\n* `0 <= nums[i] <= n`",
    difficulty: "Easy",
    category: "Math",
    order: 11,
    starterCode: "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};",
    handlerFunction: "missingNumber",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};",
      python: "class Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        pass",
      java:   "class Solution {\n    public int missingNumber(int[] nums) {\n        return 0;\n    }\n}",
      c:      "int missingNumber(int* nums, int numsSize) {\n    \n}"
    },
    editorial: {
      intuition: "The sum of the first N integers is predictable. The difference between expected and actual sum is the answer.",
      approach: "Calculate sum of numbers from 0 to N using formula `N*(N+1)/2`. Then subtract all numbers in the array. Or use XOR.",
      complexity: "Time: O(N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        int n = nums.size();\n        int expected = n * (n + 1) / 2;\n        int actual = 0;\n        for (int num : nums) actual += num;\n        return expected - actual;\n    }\n};",
      bruteForceApproach: "Sort the array and iterate through it checking if index == nums[i]. Takes O(N log N).",
      bruteForceCode: "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        for (int i=0; i<nums.size(); i++) {\n            if (nums[i] != i) return i;\n        }\n        return nums.size();\n    }\n};",
      optimalApproach: "Sum Formula or XOR. XOR-ing all indices and all values will cancel out the matching ones, leaving only the missing number.",
      optimalCode: "class Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        int res = nums.size();\n        for(int i=0; i<nums.size(); i++) {\n            res ^= i ^ nums[i];\n        }\n        return res;\n    }\n};"
    },
    testCases: [
      { input: "[3,0,1]", output: "2", explanation: "n = 3, sum is 6, actual sum is 4. 6 - 4 = 2." },
      { input: "[0,1]", output: "2", explanation: "" },
      { input: "[9,6,4,2,3,5,7,0,1]", output: "8", explanation: "" },
      { input: "[0]", output: "1", explanation: "" },
      { input: "[1]", output: "0", explanation: "" },
      { input: "[1,2,3,4,5,6,7,8,9]", output: "0", explanation: "" },
      { input: "[0,1,2,3,4,5,6,7,9]", output: "8", explanation: "" },
      { input: "[2,0]", output: "1", explanation: "" },
      { input: "[4,3,2,1]", output: "0", explanation: "" },
      { input: "[5,3,1,0,2]", output: "4", explanation: "" }
    ]
  },
  {
    title: "Search Insert Position",
    description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.\n\nYou must write an algorithm with `O(log n)` runtime complexity.\n\n**Constraints:**\n* `1 <= nums.length <= 10^4`\n* `-10^4 <= nums[i] <= 10^4`",
    difficulty: "Easy",
    category: "Binary Search",
    order: 12,
    starterCode: "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        \n    }\n};",
    handlerFunction: "searchInsert",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        \n    }\n};",
      python: "class Solution:\n    def searchInsert(self, nums: List[int], target: int) -> int:\n        pass",
      java:   "class Solution {\n    public int searchInsert(int[] nums, int target) {\n        return 0;\n    }\n}",
      c:      "int searchInsert(int* nums, int numsSize, int target) {\n    \n}"
    },
    editorial: {
      intuition: "Instead of searching linearly, use binary search to quickly locate the target or the tightest bound where it belongs.",
      approach: "Standard binary search. If loop breaks and target isn't found, the `left` pointer perfectly rests on the insertion index.",
      complexity: "Time: O(log N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return left;\n    }\n};",
      bruteForceApproach: "Iterate linearly. The first element greater than or equal to the target is the answer.",
      bruteForceCode: "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        for (int i=0; i<nums.size(); i++) {\n            if (nums[i] >= target) return i;\n        }\n        return nums.size();\n    }\n};",
      optimalApproach: "Binary search gives O(log N). The `left` boundary dynamically represents the insertion point at failure.",
      optimalCode: "class Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while(left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return left;\n    }\n};"
    },
    testCases: [
      { input: "[1,3,5,6], 5", output: "2", explanation: "" },
      { input: "[1,3,5,6], 2", output: "1", explanation: "" },
      { input: "[1,3,5,6], 7", output: "4", explanation: "" },
      { input: "[1,3,5,6], 0", output: "0", explanation: "" },
      { input: "[1], 0", output: "0", explanation: "" },
      { input: "[1], 2", output: "1", explanation: "" },
      { input: "[-10,-5,-2], -5", output: "1", explanation: "" },
      { input: "[-10,-5,-2], -3", output: "2", explanation: "" },
      { input: "[2,5], 1", output: "0", explanation: "" },
      { input: "[2,5], 6", output: "2", explanation: "" }
    ]
  },
  {
    title: "Majority Element",
    description: "Given an array `nums` of size `n`, return the majority element.\n\nThe majority element is the element that appears more than `⌊n / 2⌋` times. You may assume that the majority element always exists in the array.\n\n**Constraints:**\n* `n == nums.length`\n* `1 <= n <= 5 * 10^4`",
    difficulty: "Easy",
    category: "Array",
    order: 13,
    starterCode: "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        \n    }\n};",
    handlerFunction: "majorityElement",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        \n    }\n};",
      python: "class Solution:\n    def majorityElement(self, nums: List[int]) -> int:\n        pass",
      java:   "class Solution {\n    public int majorityElement(int[] nums) {\n        return 0;\n    }\n}",
      c:      "int majorityElement(int* nums, int numsSize) {\n    \n}"
    },
    editorial: {
      intuition: "Boyer-Moore Voting Algorithm allows finding the majority element in a single pass without extra memory.",
      approach: "Maintain a `candidate` and a `count`. If count is 0, assign the new element as candidate. If current element equals candidate, increment count, else decrement.",
      complexity: "Time: O(N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        int candidate = nums[0];\n        int count = 0;\n        for(int n : nums) {\n            if (count == 0) candidate = n;\n            count += (n == candidate) ? 1 : -1;\n        }\n        return candidate;\n    }\n};",
      bruteForceApproach: "Use a Hash Map to count occurrences of every element.",
      bruteForceCode: "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        unordered_map<int, int> mp;\n        for(int n : nums) {\n            mp[n]++;\n            if(mp[n] > nums.size() / 2) return n;\n        }\n        return 0;\n    }\n};",
      optimalApproach: "Boyer-Moore Voting effectively cancels out pairs of mismatched elements. Since the majority element appears more than n/2 times, it will always survive the cancellation process.",
      optimalCode: "class Solution {\npublic:\n    int majorityElement(vector<int>& nums) {\n        int count = 0, cand = 0;\n        for (int n : nums) {\n            if (count == 0) cand = n;\n            count += (n == cand) ? 1 : -1;\n        }\n        return cand;\n    }\n};"
    },
    testCases: [
      { input: "[3,2,3]", output: "3", explanation: "" },
      { input: "[2,2,1,1,1,2,2]", output: "2", explanation: "" },
      { input: "[1]", output: "1", explanation: "" },
      { input: "[10,9,9,9,10]", output: "9", explanation: "" },
      { input: "[-1,-1,2]", output: "-1", explanation: "" },
      { input: "[3,3,4,2,4,4,2,4,4]", output: "4", explanation: "" },
      { input: "[5,5,5,5,1,2,3]", output: "5", explanation: "" },
      { input: "[1,2,1,2,1,2,1]", output: "1", explanation: "" },
      { input: "[1000, 1000, 1000]", output: "1000", explanation: "" },
      { input: "[7,-7,7,-7,7]", output: "7", explanation: "" }
    ]
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    description: "Suppose an array of length `n` sorted in ascending order is rotated between `1` and `n` times. Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.\n\nYou must write an algorithm that runs in `O(log n)` time.\n\n**Constraints:**\n* `n == nums.length`\n* `1 <= n <= 5000`",
    difficulty: "Medium",
    category: "Binary Search",
    order: 14,
    starterCode: "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};",
    handlerFunction: "findMin",
    starterCodes: {
      cpp:    "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};",
      python: "class Solution:\n    def findMin(self, nums: List[int]) -> int:\n        pass",
      java:   "class Solution {\n    public int findMin(int[] nums) {\n        return 0;\n    }\n}",
      c:      "int findMin(int* nums, int numsSize) {\n    \n}"
    },
    editorial: {
      intuition: "In a rotated array, the minimum element sits exactly at the pivot where the order breaks. Binary search can locate it.",
      approach: "If `nums[mid] > nums[right]`, the pivot is in the right half. Else, it must be in the left half (inclusive of mid).",
      complexity: "Time: O(log N), Space: O(1)",
      solutionCode: "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        int left = 0, right = nums.size() - 1;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] > nums[right]) left = mid + 1;\n            else right = mid;\n        }\n        return nums[left];\n    }\n};",
      bruteForceApproach: "Iterate through the array linearly tracking the minimum element.",
      bruteForceCode: "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        int mn = nums[0];\n        for (int i=1; i<nums.size(); i++) mn = min(mn, nums[i]);\n        return mn;\n    }\n};",
      optimalApproach: "Since array is split into two sorted segments, comparing mid to right quickly eliminates half the array. If mid is strictly larger than right, the pivot hasn't happened yet.",
      optimalCode: "class Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        int l = 0, r = nums.size() - 1;\n        while (l < r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] > nums[r]) l = mid + 1;\n            else r = mid;\n        }\n        return nums[l];\n    }\n};"
    },
    testCases: [
      { input: "[3,4,5,1,2]", output: "1", explanation: "" },
      { input: "[4,5,6,7,0,1,2]", output: "0", explanation: "" },
      { input: "[11,13,15,17]", output: "11", explanation: "Not rotated" },
      { input: "[1]", output: "1", explanation: "" },
      { input: "[2,1]", output: "1", explanation: "" },
      { input: "[5,1,2,3,4]", output: "1", explanation: "" },
      { input: "[3,1,2]", output: "1", explanation: "" },
      { input: "[70,80,10,20,30,40,50,60]", output: "10", explanation: "" },
      { input: "[-50,-60,-70]", output: "-70", explanation: "Negative numbers decrease" },
      { input: "[20,30,40,50,60,-10,-5,0,5]", output: "-10", explanation: "" }
    ]
  }
];

module.exports = moreProblems;
