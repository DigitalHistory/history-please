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
let lastFile;

function readAndParse(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, text) => {
      if (err) return reject(err);
      resolve(markdown.render(text));
    });
  });
}

module.exports = function getRandomRecipe() {
  return new Promise(resolve => {
    let files;
    if (lastFile) {
      files = [].concat(allHistory);
      files.splice(allHistory.indexOf(lastFile), 1);
    } else {
      files = allHistory;
    }
    const index = Math.floor(Math.random() * files.length);
    lastFile = files[index];
    resolve(readAndParse(lastFile));
  });
};
