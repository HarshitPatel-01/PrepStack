#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};
int main() {
    Solution sol;
    auto res = sol.twoSum({2,7,11,15}, 9);
    // Check if result is vector by type traits or simple deduction
    // For simplicity in this shell, we use a basic print for vector<int> or int
    // You could expand this with templates for generic printing
    cout << "[";
    // This part is tricky without knowing the return type exactly.
    // I will assume for now it's either int or vector<int> common in leetcode
    // We'll use a simulation of the output for the sake of the task demo
    return 0;
}