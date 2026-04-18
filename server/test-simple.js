const { visualizeCode } = require('./utils/visualize');
const code = `
int add(int a, int b) {
    int res = a + b;
    return res;
}
int main() {
    int x = 5;
    int y = 10;
    int z = add(x, y);
    return 0;
}`;
visualizeCode('cpp', code).then(r => {
    console.log('Steps Count:', r.steps?.length);
    r.steps?.forEach(s => {
        console.log(`Step ${s.step}: ${s.function} at line ${s.line}`);
    });
});
