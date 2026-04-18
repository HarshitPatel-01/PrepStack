// Fix: replace the ---RESULT--- delimiter with a simpler marker that cannot
// break C++ string literals — no newlines inside the cout string.
const fs = require('fs');
let content = fs.readFileSync('routes/submissions.js', 'utf8');

// C++ template: replace  cout << "\n---RESULT---\n";
// with a safe version using concatenated endl calls
content = content.replace(
    '    cout << "\\n---RESULT---\\n";',
    '    cout << endl << "---RESULT---" << endl;'
);

fs.writeFileSync('routes/submissions.js', content);
console.log('Done. Patched C++ RESULT delimiter.');

// Verify
const newLines = fs.readFileSync('routes/submissions.js', 'utf8').split('\n');
for (let i = 0; i < newLines.length; i++) {
    if (newLines[i].includes('RESULT') || newLines[i].includes('endl')) {
        console.log(`Line ${i+1}: ${newLines[i]}`);
    }
}
