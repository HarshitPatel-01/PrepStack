
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

#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // Function to check if any two numbers sum up to target (variant 1)
    string twoSumExists(vector<int>& arr, int target) {
        int n = arr.size();
        // Outer loop picks one element at a time
        for (int i = 0; i < n; i++) {
            // Inner loop searches for another element that complements arr[i]
            for (int j = i + 1; j < n; j++) {
                // If sum equals target, return "YES"
                if (arr[i] + arr[j] == target) {
                    return "YES";
                }
            }
        }
        // No pair found that sums to target
        return "NO";
    }

    // Function to return indices of two numbers that sum to target (variant 2)
    vector<int> twoSumIndices(vector<int>& arr, int target) {
        int n = arr.size();
        // Outer loop picks one element at a time
        for (int i = 0; i < n; i++) {
            // Inner loop searches for another element that complements arr[i]
            for (int j = i + 1; j < n; j++) {
                // If sum equals target, return the pair of indices
                if (arr[i] + arr[j] == target) {
                    return {i, j};
                }
            }
        }
        // No such pair found
        return {-1, -1};
    }
};

int main() {
    Solution sol;

    vector<int> arr = {2, 6, 5, 8, 11};
    int target = 14;

    // Variant 1
    cout << sol.twoSumExists(arr, target) << "\n";

    // Variant 2
    vector<int> res = sol.twoSumIndices(arr, target);
    cout << "[" << res[0] << ", " << res[1] << "]\n";

    return 0;
}


int main() {
    Solution sol;
    printResult(sol.twoSum({2,7,11,15}, 9));
    return 0;
}