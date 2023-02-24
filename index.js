const fs = require('fs');
const path = require('path');

const argsMemory = process.argv.slice(2);
const argsInputFile = process.argv.slice(3);
// console.log(args[0])
const inputFile = argsInputFile[0] || 'file.txt';

let memoryRAM = argsMemory[0] || 10

if (memoryRAM > 500) memoryRAM = 500

console.log("Limited RAM: " + memoryRAM) 
// Get the list of files in the a-z folder
let aZfiles = fs.readdirSync('a-z');

// Iterate over the files
aZfiles.forEach(file => {
  // Get the file path
  const filePath = path.join('a-z', file);
  // Remove the file
  fs.unlinkSync(filePath);
});

// Get the list of files in the chunks folder
let files = fs.readdirSync('chunks');

// Iterate over the files
files.forEach(file => {
  // Get the file path
  const filePath = path.join('chunks', file);
  // Remove the file
  fs.unlinkSync(filePath);
});


// read the file
let data = fs.readFileSync(inputFile, 'utf-8');

// split the file into an array of lines
let lines = data.split('\n');

// get the number of lines that can fit in the available RAM
let linesPerChunk = Math.ceil(memoryRAM * 1024 * 1024 / lines.length);

// create an array of chunks
let chunks = [];
let currentChunk = [];

for (let i = 0; i < lines.length; i++) {
  currentChunk.push(lines[i]);

  // split into a new chunk
  if (i % linesPerChunk === 0) {
    chunks.push(currentChunk);
    currentChunk = [];
  }
}

if (currentChunk.length > 0) {
  chunks.push(currentChunk);
}

// sort each chunk in memory
chunks.forEach(chunk => {
  chunk.sort((a, b) => {
    let aFirstChar = a.charAt(0);
    let bFirstChar = b.charAt(0);

    if (aFirstChar < bFirstChar) {
      return -1;
    } else if (aFirstChar > bFirstChar) {
      return 1;
    } else {
      return 0;
    }
  });
});

// write the sorted chunks back to disk
let chunkCount = 0;
chunks.forEach(chunk => {
  fs.writeFileSync(`./chunks/chunk-${chunkCount}.txt`, chunk.join('\n'));
  chunkCount++;
});

// // merge the chunks
// let mergedLines = [];
// chunks.forEach(chunk => {
//   mergedLines = mergedLines.concat(chunk);
// });

// // write the merged file back to disk
// fs.writeFileSync('sorted-file.txt', mergedLines.join('\n'));

// Get the list of files in the chunk folder
files = fs.readdirSync('./chunks/');

// Create a-z folder if it doesn't already exist
if (!fs.existsSync('a-z')) {
  fs.mkdirSync('a-z');
}

// Iterate over the list of files
files.forEach(file => {
  // Read the file
  const data = fs.readFileSync(path.join('./chunks/', file), 'utf8');
  // Split the file into lines
  const lines = data.split('\n');
  // Sort the lines by the first letter
  const sortedLines = lines.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0));
  // Iterate over the sorted lines
  sortedLines.forEach(line => {
    // Get the first letter of the line
    const firstLetter = line[0];
    // Create the file path
    const filePath = path.join('a-z', `${firstLetter}.txt`);
    // Append the line to the file
    fs.appendFileSync(filePath, line + '\n');
  });
});

// Create the final file
const finalFile = fs.createWriteStream('final.txt');

// Get the list of files in the a-z folder
aZfiles = fs.readdirSync('a-z');

// Sort the list of files
const sortedFiles = aZfiles.sort();

// Iterate over the sorted files
sortedFiles.forEach(file => {
  // Read the file
  const data = fs.readFileSync(path.join('a-z', file), 'utf8');
  // Write the file to the final file
  finalFile.write(data);
});