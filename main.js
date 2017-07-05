const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const express = require('express');
const expressApp = express();


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow(url) {
  return new Promise((resolve, reject) => {
    mainWindow = new BrowserWindow({ show: false, fullscreen: true })
    mainWindow.once('page-title-updated', () => {
      setTimeout(() => {
        mainWindow.capturePage((image) => {
          resolve(image);
        });
      }, 500);
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null
    });
    mainWindow.loadURL(url);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

expressApp.get('/', (req, res) => {
  let url = req.query.url;
  createWindow(url).then((image) => {
    res.send(image.toJPEG(100));
  })
});
expressApp.listen(3000);