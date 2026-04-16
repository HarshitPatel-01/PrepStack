#include <iostream>
#include <vector>
#include <string>
using namespace std;
#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    // Variant 1: Check if any two numbers sum to target (Brute Force)
    string twoSumExists(vector<int>& arr, int target) {
        int n = arr.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (arr[i] + arr[j] == target) {
                    return "YES";
                }
            }
        }
        return "NO";
    }

    // Variant 2: Return indices (Brute Force)
    vector<int> twoSumIndices(vector<int>& arr, int target) {
        int n = arr.size();
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (arr[i] + arr[j] == target) {
                    return {i, j};
                }
            }
        }
        return {-1, -1};
    }

    // Optimized: Return indices using Hash Map (O(n))
    vector<int> twoSumOptimized(vector<int>& arr, int target) {
        unordered_map<int, int> m; // value -> index

        for (int i = 0; i < arr.size(); i++) {
            int complement = target - arr[i];

            if (m.find(complement) != m.end()) {
                return {m[complement], i};
            }

            m[arr[i]] = i;
        }
        return {-1, -1};
    }
};

int main() {
    Solution sol;

    vector<int> arr = {2, 6, 5, 8, 11};
    int target = 14;

    // Variant 1
    cout << "Exists: " << sol.twoSumExists(arr, target) << endl;

    // Variant 2 (Brute Force)
    vector<int> res1 = sol.twoSumIndices(arr, target);
    cout << "Brute Indices: [" << res1[0] << ", " << res1[1] << "]" << endl;

    // Optimized Version
    vector<int> res2 = sol.twoSumOptimized(arr, target);
    cout << "Optimized Indices: [" << res2[0] << ", " << res2[1] << "]" << endl;

    return 0;
}
int main() {
    cout << twoSum([2,7,11,15], 9) << endl;
    return 0;
}