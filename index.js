const fs = require('fs');

// read the file
let data = fs.readFileSync('big-file.txt', 'utf-8');

// split the file into an array of lines
let lines = data.split('\n');

// loop through the array and split every 300mb
let fileCount = 0;
let linesPerFile = Math.ceil(300 * 1024 * 1024 / lines.length);
let currentLines = [];

for (let i = 0; i < lines.length; i++) {
  currentLines.push(lines[i]);

  // split into a new file
  if (i % linesPerFile === 0) {
    fs.writeFileSync(`file-${fileCount}.txt`, currentLines.join('\n'));
    currentLines = [];
    fileCount++;
  }
}

if (currentLines.length > 0) {
  fs.writeFileSync(`file-${fileCount}.txt`, currentLines.join('\n'));
}