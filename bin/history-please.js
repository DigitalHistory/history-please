#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const args = require('minimist')(process.argv.slice(2));
const colors = require('colors');
const markdown = require('markdown-it')('commonmark');
const htmlToText = require('html-to-text');
// const {shell } = require('electron');
const open = require('open');

const pathToServe = path.join(__dirname, "result.html");
// const header = path.join(__dirname, "../templates/header.html");
// const footer = path.join(__dirname, "../templates/footer.html");

const LINE = '\n\n==============================\n\n'.rainbow;

function getFileNames(pathName) {
    return fs.readdirSync(path.join(__dirname, pathName))
        .map(filename => {
            return path.join(__dirname, pathName, filename);
        });
}

function getRandomHero(options) {

    let files = [];
    if (!options.trends && !options.events) {
        files = files.concat(getFileNames('../history/people'));
    }
    if (!options.trends && !options.people) {
        files = files.concat(getFileNames('../history/events'));
    }
    if (!options.cultural && !options.events) {
        files = files.concat(getFileNames('../history/trends'));
    }
    
    const randomFilePath = files[Math.floor(Math.random() * files.length)];
    const text = fs.readFileSync(randomFilePath, {encoding: 'utf-8'})
    // const html = fs.readFileSync(header) + text + fs.readFileSync(footer);
    const result = htmlToText.fromString(markdown.render(text));
    console.log(LINE + result + '\n\nO Canada!'.yellow + LINE);
    if (options.browser) {
        const file = fs.writeFile(pathToServe, html, function(err) {
            if(err) {
                return console.log(err);
            }
        });
      open(pathToServe);
      // shell.openItem(pathToServe);
      // open(pathToServe);
    }
}

getRandomHero(args);
