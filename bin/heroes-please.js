#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const colors = require('colors');
const markdown = require('markdown-js');
const htmlToText = require('html-to-text');

const LINE = '\n\n==============================\n\n'.rainbow;

function getFileNames(pathName) {
    return fs.readdirSync(path.join(__dirname, pathName))
        .map(filename => {
            return path.join(__dirname, pathName, filename);
        });
}

function getRandomHero(options) {

    let files = [];
    if (!options.misc && !options.political) {
        files = files.concat(getFileNames('../heroes/cultural'));
    }
    if (!options.misc && !options.cultural) {
        files = files.concat(getFileNames('../heroes/political'));
    }
    if (!options.cultural && !options.political) {
        files = files.concat(getFileNames('../heroes/misc'));
    }
    
    const randomFilePath = files[Math.floor(Math.random() * files.length)];
    const text = fs.readFileSync(randomFilePath, {encoding: 'utf-8'})
    const result = htmlToText.fromString(markdown.makeHtml(text));
    console.log(LINE + result + '\n\nO Canada!'.yellow + LINE);
}

console.log(getFileNames("../heroes/misc"));
getRandomHero(args);
