const markdown = require('markdown-it')('commonmark');
const fs = require('fs');
const path = require('path');

function getFileNames(pathName) {
  return fs.readdirSync(path.resolve(__dirname, pathName))
    .map(filename => {
      return path.join(__dirname, pathName, filename);
    });
}

const allPeople = getFileNames('../history/people');
const allEvents = getFileNames('../history/events');
const allTrends = getFileNames('../history/trends');
const allHistory = allPeople.concat(allEvents).concat(allTrends);
console.log(allHistory);
let lastFile,
    currentFile = 0;

function readAndParse(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, text) => {
      if (err) return reject(err);
      resolve(markdown.render(text));
    });
  });
}

// stolen from https://javascript.info/task/shuffle
// note that array elements are replaced "in-place"
// no value is returned, but the array is destructively
// reconstituted.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// gonna export this later...
function shuffleHistory() {
  return shuffle (allHistory); 
}

// simplified next and previous functions
// simply return the next andp revious elements of the array
function getNext() {
  return new Promise(resolve => {
    currentFile = (currentFile < allHistory.length - 1 ) ? currentFile + 1 : 0 ;
    resolve(readAndParse(allHistory[currentFile]));
  });
}

function getPrevious () {
  return new Promise(resolve => {
    currentFile = (currentFile > 0) ? currentFile - 1  : allHistory.length -1 ;
    resolve(readAndParse(allHistory[currentFile]));
  });
}

// this is nice
// uses array.splice to remove current file from array
// then chooses file from array at random
// however, we're going to use `shuffle` because we've now implemented
// `next` and `previous`
// so this is just here as an example
function getRandomRecipe() {
  return new Promise(resolve => {
    let files;
    if (lastFile) {
      files = [].concat(allHistory);
      files.splice (allHistory.indexOf(lastFile), 1);
    } else {
      files = allHistory;
    }
    const index = Math.floor(Math.random() * files.length);
    lastFile = files[index];
    resolve(readAndParse(lastFile));
  });
}


// now export everything. 
exports = module.exports = {};

// TODO: there's enough we should do this in a loop... for later
exports.shuffleHistory = shuffleHistory;
exports.getNext = getNext;
exports.getPrevious = getPrevious;
exports.getRandomRecipe = getRandomRecipe; 
