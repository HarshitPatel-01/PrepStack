const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const dotenv = require('dotenv');
dotenv.config();

const baseProblems = [
  // ... (keeping existing ones logic, but adding many more)
  {
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    order: 7,
    handlerFunction: "mergeTwoLists",
    testCases: [{ input: "[1,2,4], [1,3,4]", output: "[1,1,2,3,4,4]" }],
    starterCodes: {
        cpp: "class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        \n    }\n};",
        python: "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass",
        java: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}"
    }
  },
  {
      title: "Lowest Common Ancestor of a Binary Search Tree",
      difficulty: "Medium",
      category: "Tree",
      order: 8,
      handlerFunction: "lowestCommonAncestor",
      testCases: [{ input: "[6,2,8,0,4,7,9], 2, 8", output: "6" }],
      starterCodes: {
          cpp: "class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        \n    }\n};",
          python: "class Solution:\n    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':\n        pass"
      }
  },
  {
      title: "Binary Tree Level Order Traversal",
      difficulty: "Medium",
      category: "Tree",
      order: 9,
      handlerFunction: "levelOrder",
      testCases: [{ input: "[3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]" }],
      starterCodes: {
          cpp: "class Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        \n    }\n};"
      }
  },
  {
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    order: 10,
    handlerFunction: "invertTree",
    testCases: [{ input: "[4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }],
    starterCodes: { cpp: "class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        \n    }\n};" }
  },
  {
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    order: 11,
    handlerFunction: "isAnagram",
    testCases: [{ input: '"anagram", "nagaram"', output: "true" }, { input: '"rat", "car"', output: "false" }],
    starterCodes: { cpp: "class Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};" }
  },
  {
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    order: 12,
    handlerFunction: "search",
    testCases: [{ input: "[-1,0,3,5,9,12], 9", output: "4" }],
    starterCodes: { cpp: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};" }
  },
  {
    title: "Flood Fill",
    difficulty: "Easy",
    category: "Graph",
    order: 13,
    handlerFunction: "floodFill",
    testCases: [{ input: "[[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2", output: "[[2,2,2],[2,2,0],[2,0,1]]" }],
    starterCodes: { cpp: "class Solution {\npublic:\n    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {\n        \n    }\n};" }
  },
  {
      title: "Maximum Depth of Binary Tree",
      difficulty: "Easy",
      category: "Tree",
      order: 14,
      handlerFunction: "maxDepth",
      testCases: [{ input: "[3,9,20,null,null,15,7]", output: "3" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        \n    }\n};" }
  },
  {
      title: "Reverse Linked List",
      difficulty: "Easy",
      category: "Linked List",
      order: 15,
      handlerFunction: "reverseList",
      testCases: [{ input: "[1,2,3,4,5]", output: "[5,4,3,2,1]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};" }
  },
  {
      title: "Evaluate Reverse Polish Notation",
      difficulty: "Medium",
      category: "Stack",
      order: 16,
      handlerFunction: "evalRPN",
      testCases: [{ input: '["2","1","+","3","*"]', output: "9" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int evalRPN(vector<string>& tokens) {\n        \n    }\n};" }
  },
  {
      title: "Course Schedule",
      difficulty: "Medium",
      category: "Graph",
      order: 17,
      handlerFunction: "canFinish",
      testCases: [{ input: "2, [[1,0]]", output: "true" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        \n    }\n};" }
  },
  {
      title: "Implement Trie (Prefix Tree)",
      difficulty: "Medium",
      category: "Trie",
      order: 18,
      handlerFunction: "insert",
      testCases: [{ input: '"apple"', output: "null" }],
      starterCodes: { cpp: "class Trie {\npublic:\n    Trie() {}\n    void insert(string word) {}\n    bool search(string word) {}\n    bool startsWith(string prefix) {}\n};" }
  },
  {
      title: "Coin Change",
      difficulty: "Medium",
      category: "Dynamic Programming",
      order: 19,
      handlerFunction: "coinChange",
      testCases: [{ input: "[1,2,5], 11", output: "3" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        \n    }\n};" }
  },
  {
      title: "Product of Array Except Self",
      difficulty: "Medium",
      category: "Array",
      order: 20,
      handlerFunction: "productExceptSelf",
      testCases: [{ input: "[1,2,3,4]", output: "[24,12,8,6]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};" }
  },
  {
      title: "Min Stack",
      difficulty: "Medium",
      category: "Stack",
      order: 21,
      handlerFunction: "push",
      testCases: [{ input: "-2", output: "null" }],
      starterCodes: { cpp: "class MinStack {\npublic:\n    MinStack() {}\n    void push(int val) {}\n    void pop() {}\n    int top() {}\n    int getMin() {}\n};" }
  },
  {
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      category: "Binary Search",
      order: 22,
      handlerFunction: "search",
      testCases: [{ input: "[4,5,6,7,0,1,2], 0", output: "4" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};" }
  },
  {
      title: "Validate Binary Search Tree",
      difficulty: "Medium",
      category: "Tree",
      order: 23,
      handlerFunction: "isValidBST",
      testCases: [{ input: "[2,1,3]", output: "true" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        \n    }\n};" }
  },
  {
      title: "Number of Islands",
      difficulty: "Medium",
      category: "Graph",
      order: 24,
      handlerFunction: "numIslands",
      testCases: [{ input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: "1" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        \n    }\n};" }
  },
  {
      title: "Rotting Oranges",
      difficulty: "Medium",
      category: "Graph",
      order: 25,
      handlerFunction: "orangesRotting",
      testCases: [{ input: "[[2,1,1],[1,1,0],[0,1,1]]", output: "4" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        \n    }\n};" }
  },
  {
      title: "Combination Sum",
      difficulty: "Medium",
      category: "Backtracking",
      order: 26,
      handlerFunction: "combinationSum",
      testCases: [{ input: "[2,3,6,7], 7", output: "[[2,2,3],[7]]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        \n    }\n};" }
  },
  {
      title: "Permutations",
      difficulty: "Medium",
      category: "Backtracking",
      order: 27,
      handlerFunction: "permute",
      testCases: [{ input: "[1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        \n    }\n};" }
  },
  {
      title: "Merge Intervals",
      difficulty: "Medium",
      category: "Array",
      order: 28,
      handlerFunction: "merge",
      testCases: [{ input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};" }
  },
  {
      title: "Kth Smallest Element in a BST",
      difficulty: "Medium",
      category: "Tree",
      order: 29,
      handlerFunction: "kthSmallest",
      testCases: [{ input: "[3,1,4,null,2], 1", output: "1" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int kthSmallest(TreeNode* root, int k) {\n        \n    }\n};" }
  },
  {
      title: "Longest Increasing Subsequence",
      difficulty: "Medium",
      category: "Dynamic Programming",
      order: 30,
      handlerFunction: "lengthOfLIS",
      testCases: [{ input: "[10,9,2,5,3,7,101,18]", output: "4" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        \n    }\n};" }
  },
  {
      title: "House Robber",
      difficulty: "Medium",
      category: "Dynamic Programming",
      order: 31,
      handlerFunction: "rob",
      testCases: [{ input: "[1,2,3,1]", output: "4" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int rob(vector<int>& nums) {\n        \n    }\n};" }
  },
  {
      title: "Lowest Common Ancestor of a Binary Tree",
      difficulty: "Medium",
      category: "Tree",
      order: 32,
      handlerFunction: "lowestCommonAncestor",
      testCases: [{ input: "[3,5,1,6,2,0,8,null,null,7,4], 5, 1", output: "3" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        \n    }\n};" }
  },
  {
      title: "Unique Paths",
      difficulty: "Medium",
      category: "Dynamic Programming",
      order: 33,
      handlerFunction: "uniquePaths",
      testCases: [{ input: "3, 7", output: "28" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        \n    }\n};" }
  },
  {
      title: "Spiral Matrix",
      difficulty: "Medium",
      category: "Array",
      order: 34,
      handlerFunction: "spiralOrder",
      testCases: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        \n    }\n};" }
  },
  {
      title: "Word Search",
      difficulty: "Medium",
      category: "Backtracking",
      order: 35,
      handlerFunction: "exist",
      testCases: [{ input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"', output: "true" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        \n    }\n};" }
  },
  {
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      category: "Array",
      order: 36,
      handlerFunction: "longestConsecutive",
      testCases: [{ input: "[100,4,200,1,3,2]", output: "4" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        \n    }\n};" }
  },
  {
      title: "Subsets",
      difficulty: "Medium",
      category: "Backtracking",
      order: 37,
      handlerFunction: "subsets",
      testCases: [{ input: "[1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        \n    }\n};" }
  },
  {
      title: "Binary Tree Zigzag Level Order Traversal",
      difficulty: "Medium",
      category: "Tree",
      order: 38,
      handlerFunction: "zigzagLevelOrder",
      testCases: [{ input: "[3,9,20,null,null,15,7]", output: "[[3],[20,9],[15,7]]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<vector<int>> zigzagLevelOrder(TreeNode* root) {\n        \n    }\n};" }
  },
  {
      title: "Top K Frequent Elements",
      difficulty: "Medium",
      category: "Heap",
      order: 39,
      handlerFunction: "topKFrequent",
      testCases: [{ input: "[1,1,1,2,2,3], 2", output: "[1,2]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        \n    }\n};" }
  },
  {
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      category: "Binary Search",
      order: 40,
      handlerFunction: "findMedianSortedArrays",
      testCases: [{ input: "[1,3], [2]", output: "2.00000" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};" }
  },
  {
      title: "Trapping Rain Water",
      difficulty: "Hard",
      category: "Array",
      order: 41,
      handlerFunction: "trap",
      testCases: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};" }
  },
  {
      title: "Merge k Sorted Lists",
      difficulty: "Hard",
      category: "Linked List",
      order: 42,
      handlerFunction: "mergeKLists",
      testCases: [{ input: "[[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        \n    }\n};" }
  },
  {
      title: "Longest Valid Parentheses",
      difficulty: "Hard",
      category: "Stack",
      order: 43,
      handlerFunction: "longestValidParentheses",
      testCases: [{ input: '")()())"', output: "4" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int longestValidParentheses(string s) {\n        \n    }\n};" }
  },
  {
      title: "Sudoku Solver",
      difficulty: "Hard",
      category: "Backtracking",
      order: 44,
      handlerFunction: "solveSudoku",
      testCases: [{ input: '[["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', output: "null" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    void solveSudoku(vector<vector<char>>& board) {\n        \n    }\n};" }
  },
  {
      title: "Minimum Window Substring",
      difficulty: "Hard",
      category: "Sliding Window",
      order: 45,
      handlerFunction: "minWindow",
      testCases: [{ input: '"ADOBECODEBANC", "ABC"', output: '"BANC"' }],
      starterCodes: { cpp: "class Solution {\npublic:\n    string minWindow(string s, string t) {\n        \n    }\n};" }
  },
  {
      title: "Serialize and Deserialize Binary Tree",
      difficulty: "Hard",
      category: "Tree",
      order: 46,
      handlerFunction: "serialize",
      testCases: [{ input: "[1,2,3,null,null,4,5]", output: '"1,2,3,null,null,4,5"' }],
      starterCodes: { cpp: "class Codec {\npublic:\n    string serialize(TreeNode* root) {}\n    TreeNode* deserialize(string data) {}\n};" }
  },
  {
      title: "Word Ladder",
      difficulty: "Hard",
      category: "Graph",
      order: 47,
      handlerFunction: "ladderLength",
      testCases: [{ input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', output: "5" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        \n    }\n};" }
  },
  {
      title: "Edit Distance",
      difficulty: "Medium",
      category: "Dynamic Programming",
      order: 48,
      handlerFunction: "minDistance",
      testCases: [{ input: '"horse", "ros"', output: "3" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        \n    }\n};" }
  },
  {
      title: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      category: "Tree",
      order: 49,
      handlerFunction: "maxPathSum",
      testCases: [{ input: "[-10,9,20,null,null,15,7]", output: "42" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    int maxPathSum(TreeNode* root) {\n        \n    }\n};" }
  },
  {
      title: "Sliding Window Maximum",
      difficulty: "Hard",
      category: "Sliding Window",
      order: 50,
      handlerFunction: "maxSlidingWindow",
      testCases: [{ input: "[1,3,-1,-3,5,3,6,7], 3", output: "[3,3,5,5,6,7]" }],
      starterCodes: { cpp: "class Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        \n    }\n};" }
  }
];

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/prepstack')
  .then(async () => {
    console.log('Connected to MongoDB');
    // Keep existing 6, add new 44 to hit 50
    for (const p of baseProblems) {
        // Merge with defaults if missing
        if (!p.description) p.description = `Solve the challenge for ${p.title}. Standard LeetCode interview question.`;
        if (!p.starterCodes.python) p.starterCodes.python = p.starterCodes.cpp.replace(/vector<int>&/g, 'List[int]').replace(/vector<vector<int>>&/g, 'List[List[int]]');
        if (!p.starterCodes.java) p.starterCodes.java = "class Solution {\n    // Solve " + p.title + "\n}";
        
        await Problem.findOneAndUpdate({ title: p.title }, p, { upsert: true });
    }
    console.log(`✓ Synchronized 50 problems successfully`);
    process.exit();
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
