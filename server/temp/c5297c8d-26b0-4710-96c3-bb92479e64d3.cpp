
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

// Helper to print results in leetcode format
template<typename T>
void printResult(T val) { cout << val; }

template<typename T>
void printResult(vector<T> val) {
    cout << "[";
    for(size_t i=0; i<val.size(); ++i) {
        cout << val[i] << (i == val.size()-1 ? "" : ",");
    }
    cout << "]";
}

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) return {map[complement], i};
            map[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution sol;
    printResult(sol.twoSum({2,7,11,15}, 9));
    return 0;
}