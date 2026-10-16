const fs = require('fs');
const path = require('path');

const viewsDir = 'src/views';
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.tsx') && f !== 'ArchitectedViews.tsx');

console.log('===================================================================');
console.log('  FORENSIC AUDIT OF ALL 16 DEDICATED WORKSPACE VIEWS');
console.log('===================================================================');

const workspaceDetails = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(viewsDir, f), 'utf8');
  const usesStore = content.includes('useSystemStore');
  const lines = content.split('\n').length;
  const buttonCount = (content.match(/<button/g) || []).length;
  const onClickCount = (content.match(/onClick/g) || []).length;
  const containsHardcodedMock = content.includes('TODO') || content.includes('PLACEHOLDER');

  // Check state access
  const storeAccesses = [];
  const stateRegex = /state\.(\w+)/g;
  let match;
  while ((match = stateRegex.exec(content)) !== null) {
    if (!storeAccesses.includes(match[1])) storeAccesses.push(match[1]);
  }

  workspaceDetails.push({
    file: f,
    lines,
    usesStore,
    buttonCount,
    onClickCount,
    stateAccesses: storeAccesses.slice(0, 5).join(', '),
    hasPlaceholder: containsHardcodedMock
  });
});

console.table(workspaceDetails);
