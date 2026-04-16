const { executeCode } = require('../utils/execute');

// NEW approach: named vector variables
const code = `#include <bits/stdc++.h>
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

class Solution {
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
};

int main() {
    Solution sol;
    vector<int> v0 = {2,7,11,15};
    auto result = sol.twoSum(v0, 9);
    printVal(result);
    cout << endl;
    return 0;
}`;

executeCode('cpp', code).then(r => {
    console.log('success:', r.success);
    console.log('stdout:', JSON.stringify(r.stdout));
    if (r.error) console.log('error:\n', r.error);
    process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
