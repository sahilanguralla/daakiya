/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./dist/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {app, BrowserWindow, Tray} from 'electron';
import MenuBuilder from './menu';

// const {autoUpdater} = require('electron-updater');
// const log = require('electron-log').default;

// class AppUpdater {
//   constructor() {
//     log.transports.file.level = 'info';
//     autoUpdater.logger = log;
//     autoUpdater.checkForUpdatesAndNotify();
//   }
// }

const assetsDirectory = path.join(__dirname, '..', `resources/`);
let tray: Tray;
let mainWindow: BrowserWindow | null;
let loopbackApp;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload)),
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }
  createTray();

  mainWindow = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    loopbackApp = require('./server/server.js');
    // if (process.env.START_MINIMIZED) {
    //   mainWindow.minimize();
    // } else {
    //   mainWindow.show();
    //   mainWindow.focus();
    // }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Write the SQLite database that is in memory to file. Otherwise it will not persist.
    const db = loopbackApp.dataSources.sqlite.connector;
    const fs = require('fs');
    const data = db.client.export();
    const buffer = Buffer.from(data);
    const dbPath = loopbackApp.dataSources.sqlite.connector.file_name;

    fs.writeFile((dbPath: string, buffer:Buffer, err: Error) => {
      if (err) {
        console.error('error writing database file:', err);
      } else {
        console.log('Wrote DB to file at: ', dbPath);
      }
    });

    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.on('blur', () => {
    mainWindow!.hide();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
});

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'icons/24x24.png'));
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', event => {
    toggleWindow();

    // Show devtools when command clicked
  if (mainWindow!.isVisible() && process.defaultApp && event.metaKey) {
      mainWindow!.webContents.openDevTools({mode: 'detach'});
    }
  });
};

const toggleWindow = () => {
  if (mainWindow!.isVisible()) {
    mainWindow!.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  mainWindow!.setPosition(position.x, position.y, false);
  mainWindow!.show();
  mainWindow!.focus();
};

const getWindowPosition = () => {
  const windowBounds = mainWindow!.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2,
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return {x, y};
};
