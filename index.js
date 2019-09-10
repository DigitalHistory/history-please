const path = require('path');
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

//  ipcMain handles events
// this allows us to do some event-based logic below
// honestly this is a little convoluted
// and it would be simpler to just run a function directly
// in index.html
const {ipcMain} = require('electron');
const getHistory = require('./lib/get-history');

// first shuffle the array, to randomize
getHistory.shuffleHistory();

// this is obsolete and will be sunset
ipcMain.on('get-history', (event, arg) => {
  getHistory.getRandomRecipe()
    .then(text => event.sender.send('recipe', text))
    .catch(err => {
      console.log(err);
      event.sender.send('recipe', `Oops, there was an error: ${err}`);
    });
});

// handle `next` and `previous` events with the appropriate functions
ipcMain.on('get-next', (event, arg) => {
  getHistory.getNext()
    .then(text => event.sender.send('recipe', text))
    .catch(err => {
      console.log(err);
      event.sender.send('recipe', `Oops, there was an error: ${err}`);
    });
});

ipcMain.on('get-previous', (event, arg) => {
  getHistory.getPrevious()
    .then(text => event.sender.send('recipe', text))
    .catch(err => {
      console.log(err);
      event.sender.send('recipe', `Oops, there was an error: ${err}`);
    });
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;


function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800 ,
    height: 600,
    icon: path.join(__dirname, 'images/Canada-Flag-icon.png'),
    webPreferences: {
      nodeIntegration: true
    }});
  mainWindow.maximize();
  // debugging
  // mainWindow.webContents.openDevTools();
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
