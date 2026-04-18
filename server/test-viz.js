const { visualizeCode } = require('./utils/visualize');
const code = `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>
#include <set>
#include <unordered_map>
#include <unordered_set>
#include <stack>
#include <queue>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (mp.find(complement) != mp.end()) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};

int main() {
    Solution sol;
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    sol.twoSum(nums, target);
    return 0;
}`;

visualizeCode('cpp', code).then(r => {
    console.log('Success:', r.success);
    if (!r.success) console.log('Error:', r.error);
    console.log('Steps Count:', r.steps?.length);
    r.steps?.forEach(s => {
        console.log(`Step ${s.step}: ${s.function} at line ${s.line}`);
    });
}).catch(e => console.error(e));
