/* ************************************************************************** *\
** ************************************************************************** **
** MZD-AIO-TI                                                                 **
** By: Trezdog44 - Trevor Martin                                              **
** http://mazdatweaks.com                                                     **
** ©2016 Trevelopment                                                         **
**                                                                            **
** main.js - The main process to run in electron.											        **
**                                                                            **
** ************************************************************************** **
\* ************************************************************************** */
'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = require('electron').BrowserWindow
const Menu = require('electron').Menu
const dialog = require('electron').dialog
const Tray = require('electron').Tray
const ipc = require('electron').ipcMain
const path = require('path')
const pjson = require('./package.json')
const _ = require('lodash')
const fs = require('fs')
const rimraf = require('rimraf')
const extract = require('extract-zip')//For Unzipping
const drivelist = require('drivelist')// Module that gets the available USB drives
require('./menus/menu.js') // Menu
require('./menus/context-menu.js')
require('./menus/shortcuts.js')
const Config = require('electron-config')
const persistantData = new Config({'name':'aio-persist'})
// Use system log facility, should work on Windows too
require('./lib/log')(pjson.productName || 'MZD-AIO-TI')
var hasColorFiles = fs.existsSync(`${app.getPath('userData')}/color-schemes/`)
var hasSpeedCamFiles = fs.existsSync(`${app.getPath('userData')}/speedcam-patch/`)
// Manage unhandled exceptions as early as possible
process.on('uncaughtException', (e) => {
  console.error(`Caught unhandled exception: ${e}`)
  dialog.showErrorBox('Caught unhandled exception', e.message || 'Unknown error message')
  app.quit()
})
console.log('Locale: ' + persistantData.get('locale'))
// Load build target configuration file
try {
  var config = require('./config.json')
  _.merge(pjson.config, config)
} catch (e) {
  console.warn('No config file loaded, using defaults')
}

const isDev = (require('electron-is-dev') || pjson.config.debug)
global.appSettings = pjson.config

if (isDev) {
  console.info('Running in development')
  app.setPath('home',path.resolve(`${__dirname}`))
  console.log(`Home: ${app.getPath('home')}`)
} else {
  console.info('Running in production')
  app.setPath('home',app.getAppPath())
  console.log(`Home: ${app.getPath('home')}`)
}

console.debug(JSON.stringify(pjson.config))

// Adds debug features like hotkeys for triggering dev tools and reload
// (disabled in production, unless the menu item is displayed)
require('electron-debug')({
  enabled: pjson.config.debug || isDev || false
})

// Prevent window being garbage collected
let mainWindow

// Other windows we may need
let infoWindow = null
let downloadwin = null
let mailform = null
let tray = null
let imageJoin = null

app.setName(pjson.productName || 'MZD-AIO-TI')

if(!persistantData.has('delCopyFolder')) {
  persistantData.set('delCopyFolder','true')
}
function initialize () {
  var shouldQuit = makeSingleInstance()
  if (shouldQuit) return app.quit()
  if(!persistantData.has('copyFolderLocation')) {
    persistantData.set('copyFolderLocation',app.getPath("desktop"))
  }
  // Use printer utility lib (requires printer module, see README)
  // require('./lib/printer')
  function onClosed () {
    // save some persistant data
    if(persistantData.has('visits')) {
      persistantData.set('visits', Number(persistantData.get('visits'))+1)
    } else {
      persistantData.set('visits', '0')
    }
    // Dereference used windows
    // for multiple windows store them in an array
    downloadwin = null
    mailform = null
    mainWindow = null
    infoWindow = null
    imageJoin = null
    app.quit()
  }

  function createMainWindow () {
    let win = new BrowserWindow({
      width: 1280,
      height: 800,
      'minWidth': 800,
      'minHeight': 650,
      'resizable': true,
      'icon': './app/favicon.ico',
      //'autoHideMenuBar': true,
      'title': app.getName() || 'MZD-AIO-TI | Mazda All In One Tweaks Installer',
      'webPreferences': {
        'nodeIntegration': pjson.config.nodeIntegration || true, // Disabling node integration allows to use libraries such as jQuery/React, etc
        'preload': path.resolve(path.join(__dirname, 'preload.js'))
      }
    })

    // Remove file:// if you need to load http URLs
    win.loadURL(`file://${__dirname}/${pjson.config.url}`, {})

    win.on('closed', onClosed)

    win.on('unresponsive', function () {
      var unresponsiveClose = dialog.showMessageBox({
        type: 'warning',
        title: 'Unresponsive',
        detail: '',
        message: 'MZD-AIO-TI is unresponsive, would you like to close the app?',
        buttons: ['Close', 'Wait'],
        defaultId: 0,
        cancelId: 1
      })
      if (unresponsiveClose === 0) {
        mainWindow.close()
        app.quit()
      }
    })
    win.setMenuBarVisibility(false)
    win.webContents.on('did-fail-load', (error, errorCode, errorDescription) => {
      var errorMessage

      if (errorCode === -105) {
        errorMessage = errorDescription || '[Connection Error] The host name could not be resolved, check your network connection'
        console.log(errorMessage)
      } else {
        errorMessage = errorDescription || 'Unknown error'
      }

      error.sender.loadURL(`file://${__dirname}/404.html`)
      win.webContents.on('did-finish-load', () => {
        win.webContents.send('app-error', errorMessage)
      })
    })

    win.webContents.on('crashed', () => {
      // In the real world you should display a box and do something
      console.error('The browser window has just crashed')
    })

    win.webContents.on('did-finish-load', () => {

    })
    global.localStorage = {
      copyLoc: persistantData.get('copyFolderLocation')
    }
    function setCopyLoc (loc) {
      persistantData.set('copyFolderLocation',app.getPath(loc))
      global.localStorage.copyLoc = app.getPath(loc)
    }
    console.log(global.localStorage.copyLoc)
    tray = new Tray('resources/app.asar/faviconsq.ico')
    var template = [
      {type: 'normal', label: 'Save _copy_to_usb Location'},
      {type: 'separator'},
      {label: 'Downloads', id: 'downloads', type: 'radio', checked: (persistantData.get('copyFolderLocation').includes('downloads')), click: function(menuItem, browserWindow, event){setCopyLoc('downloads')}},
      {label: 'Documents', id: 'documents', type: 'radio', checked: (persistantData.get('copyFolderLocation').includes('documents')), click: function(menuItem, browserWindow, event){setCopyLoc('documents')}},
      {label: 'Desktop', id: "desktop", type: 'radio', checked: (persistantData.get('copyFolderLocation').includes('desktop')), click: function(menuItem, browserWindow, event){setCopyLoc('desktop')}},
      {label: 'Open _copy_to_usb Folder', click: function () {win.webContents.send('open-copy-folder')}},
      {label: 'Delete After Copy to USB', type: 'checkbox', checked: persistantData.get('delCopyFolder'), click: function(menuItem, browserWindow, event){persistantData.set('delCopyFolder', !persistantData.get('delCopyFolder'))}},
      {type: 'separator'},
      {label: 'Fullscreen', click: function () {win.setFullScreen(!win.isFullScreen())}},
      {label: 'Close', role: 'close', click: function () {win.close()}}
    ]

    var trayMenu = Menu.buildFromTemplate(template)
    //    if (process.platform === 'darwin') {
    //  template.upshift(new MenuItem([{type: 'separator'}]))
    //  trayMenu.append(new MenuItem([{label: 'MenuItem2', type: 'checkbox', checked: true}]))

    /*  label: app.getName(),
    submenu: [
    {
    role: 'quit'
  }
]
})
// Edit menu.
template[1].submenu.push(
{
type: 'separator'
},
{
label: 'Speech',
submenu: [
{
role: 'startspeaking'
},
{
role: 'stopspeaking'
}
]
}
)
// Window menu.
template[3].submenu = [
{
label: 'Close',
accelerator: 'CmdOrCtrl+W',
role: 'close'
},
{
label: 'Minimize',
accelerator: 'CmdOrCtrl+M',
role: 'minimize'
},
{
label: 'Zoom',
role: 'zoom'
},
{
type: 'separator'
},
{
label: 'Bring All to Front',
role: 'front'
}
]
}*/

tray.setToolTip('MZD-AIO-TI')
tray.setContextMenu(trayMenu)
tray.on('click', () => {
  win.isVisible() ? win.hide() : win.show()
})
tray.on('double-click', () => {
  win.show()
  win.setFullScreen(!win.isFullScreen())
})
win.on('show', () => {
  tray.setHighlightMode('always')
})
win.on('hide', () => {
  tray.setHighlightMode('never')
})
if(pjson.config.debug) { win.openDevTools() }
return win
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', () => {
  persistantData.set('locale', app.getLocale())
  mainWindow = createMainWindow()
  // Manage automatic updates
  try {
    require('./lib/auto-update/update')({
      url: (pjson.config.update) ? pjson.config.update.url || false : false,
      version: app.getVersion()
    })
    ipc.on('update-downloaded', (autoUpdater) => {
      // Elegant solution: display unobtrusive notification messages
      /*mainWindow.webContents.send('update-downloaded')
      ipc.on('update-and-restart', () => {
      autoUpdater.quitAndInstall()
    })*/

    // Basic solution: display a message box to the user
    var updateNow = dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Yes', 'No'],
      defaultId: 0,
      cancelId: 1,
      title: 'Update available',
      message: 'There is an update available, do you want to restart and install it now?'
    })

    if (updateNow === 0) {

      //autoUpdater.quitAndInstall()
    }
  })
} catch (e) {
  console.error(e.message)
  dialog.showErrorBox('Update Error', e.message)
}
})

app.on('will-quit', () => {})

ipc.on('open-info-window', () => {
  if (infoWindow) {
    return
  }
  infoWindow = new BrowserWindow({
    width: 600,
    height: 600,
    icon: './app/favicon.ico',
    resizable: false
  })
  infoWindow.loadURL(`file://${__dirname}/views/info.html`)

  infoWindow.on('closed', () => {
    infoWindow = null
  })
})
//Triggers ImageJoiner Window
ipc.on('open-joiner-window', () => {
  if (imageJoin) {
    imageJoin.show()
    return
  }
  imageJoin = new BrowserWindow({
    width: 1600,
    height: 600,
    minWidth: 1450,
    minHeight: 500,
    modal: true,
    icon: './app/favicon.ico',
    title: "Join Images Together to Create a Your Rotating Background Images",
    autoHideMenuBar: true,
    parent: mainWindow,
    resizable: true
  })
  imageJoin.loadURL(`file://${__dirname}/views/joiner.html#joiner`)
  imageJoin.on('did-finish-load', () => {
  })
  //Update the background preview in the Main Window on close
  imageJoin.on('closed', () => {
    mainWindow.webContents.send('set-bg')
    imageJoin = null
  })
  /*ipc.on('set-bg', (event) => {
  imageJoin.webContents.session.once('will-download', (event, item, webContents) => {
  var fileName = item.getFilename()
  item.setSavePath(`./background/background.png`)
  item.on('updated', function (event, state) {
  if (state === 'interrupted') {
  console.error(state)
  mainWindow.webContents.send('notif-bg-saved', 'Saving interrupted. Please try again.')
  dialog.showErrorBox('An Error Has Occured...')
  imageJoin.close()
  item.cancel()
} else if (state === 'progressing') {
if (item.isPaused()) {
console.log('Download is paused')
} else {
console.log(`Received bytes: ${item.getReceivedBytes()}`)
}
}
})
item.once('done', (event, state) => {
if (state === 'completed') {
console.log(`${fileName} Saved successfully`)
mainWindow.webContents.send('notif-bg-saved', `<h3>Your Background Saved Successfully!</h3>`)
} else  if (state === 'cancelled') {
dialog.showErrorBox('Save Cancelled')
console.log(`${fileName} Save Cancelled.`)
imageJoin.close()
} else {
dialog.showErrorBox('Failed Saving Background')
console.log(`${fileName} failed: ${state}`)
imageJoin.close()
}
})
})
})*/
})

}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance () {
  return app.makeSingleInstance(() => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}
function getUSBDrives () {
  var disks = []
  drivelist.list(function (error, dsklst) {
    if (error) {
      bootbox.alert({
        title: "Error",
        message: "Error finding USB drives: " + error,
        callback: function(){
          bootbox.hideAll()
        }
      })
      throw error
    }
    for(var i=0;i<dsklst.length;i++) {
      if(!dsklst[i].system) {
        //console.log(disks[i]);console.log(disks[i].name);console.log(disks[i].description);
        disks.push({"name":dsklst[i].name,"desc":dsklst[i].description,"mp":dsklst[i].mountpoint})
      }
    }
    return disks
  })
}
/*function createMenu () {
return Menu.buildFromTemplate(require('./lib/menu'))
}*/

// Manage Squirrel startup event (Windows)
require('./lib/auto-update/startup')(initialize)
var backgroundDir = path.resolve(path.join(`${__dirname}`, `../background-images/`))
var defaultDir = path.join(backgroundDir, 'default/')
var blankAlbumArtDir = path.join(backgroundDir, 'blank-album-art/')
ipc.on('open-file-bg', function (event) {
  openBGFolder(backgroundDir, event)
})
ipc.on('open-file-default', function (event) {
  event.sender.send('selected-bg', defaultDir + 'default.png')
  //openBGFolder(defaultDir, event)
})
function openBGFolder (path, event) {
  dialog.showOpenDialog({
    title: 'MZD-AIO-TI | Background Image Will Be Resized To: 800 px X 480 px and converted to png format.',
    properties: ['openFile'],
    defaultPath: path,
    filters: [
      { name: 'Background Image', extensions: ['png', 'jpg', 'jpeg'] }
    ]
  }, function (files) {
    if (files) { event.sender.send('selected-bg', files) }
  })
}
ipc.on('default-blnk-art', function (event) {
  event.sender.send('selected-album-art', blankAlbumArtDir + 'no_artwork_icon.png')
})
ipc.on('open-file-blnk-art', function (event) {
  dialog.showOpenDialog({
    title: 'MZD-AIO-TI | Blank Album Art Image Will Be Resized To: 146 px X 146 px and converted to png format.',
    properties: ['openFile'],
    defaultPath: blankAlbumArtDir,
    filters: [
      { name: 'Blank Album Art', extensions: ['png', 'jpg', 'jpeg'] }
    ]
  }, function (files) {
    if (files) { event.sender.send('selected-album-art', files) }
  })
})
ipc.on('bg-no-resize', (event, arg) => {
  dialog.showOpenDialog({
    title: 'MZD-AIO-TI | Choose A Joined Background (Will Not Be Resized).',
    properties: ['openFile'],
    filters: [
      { name: 'Background Image', extensions: ['png', 'jpg', 'jpeg'] }
    ]
  }), function (files) {
    if (files) {
      mainWindow.send('selected-joined-bg', files)
    }
  }
})
// ***********************************  TODO: fix this      *********************
ipc.on('download-aio-files', (event, arg) => {
  //console.log(app.getPath('userData'))
  /*fs.symlink(`${__dirname}/resources/userData/`,'./resources/tmp/', function(err){
  if(err) {console.error(err)}
  else{
  console.log('Symlink Success')
}
})*/
var fileName = `${arg}`
var alreadyDownloaded = false
if(`${fileName}` === 'color-schemes') {
  alreadyDownloaded = hasColorFiles
  hasColorFiles = true
}
else if(`${fileName}` === 'speedcam-patch') {
  alreadyDownloaded = hasSpeedCamFiles
  hasSpeedCamFiles = true
}
if(alreadyDownloaded) {
  mainWindow.webContents.send('already-downloaded')
} else {
  //ipc.emit('resume-dl') //TODO: see if this works
  downloadZip(`${fileName}`)
}
ipc.once('resume-dl', (event) => {
  downloadZip(`${fileName}`)
})

function downloadZip (arg) {
  downloadwin = new BrowserWindow({
    show: false,
    frame: false,
    icon: './app/favicon.ico',
    focusable: false
  })
  resetDL()
  downloadwin.loadURL(`https://aio.trevelopment.win/${arg}`)
}
function resetDL () {
  downloadwin.webContents.session.once('will-download', (event, item, webContents) => {
    // fileSize = (typeof fileSize === 'undefined') ? item.getTotalBytes() : fileSize;
    // Set the save path, making Electron not to prompt a save dialog.
    var fileName = item.getFilename()
    item.setSavePath(`./resources/tmp/${fileName}`)
    var savePath = item.getSavePath()
    /*   ******         TODO:See if I need this or not maybe just need for testing          ***** */
    if(fs.existsSync(`${savePath}`)) {
      console.log(`${path.resolve(savePath)} Already Exists`)
      item.cancel()
      extract(`${savePath}`,{dir: `${app.getPath('userData')}`}, function(err) {
        if (err) {console.error(err)}
        fs.unlinkSync(`${savePath}`)
        console.log(`${fileName} unzipped & deleted`)
        mainWindow.webContents.send('notif-progress', `<h3>${fileName} Unzipped</h3>`)
      })
    }
    /* *** END *** */
    var fileSize = 107
    if(`${fileName}` === 'speedcam-patch.zip') {fileSize+=94}
    //var totalSize = parseInt(`${item.getTotalBytes()}`/1000000)
    item.on('updated', function (event, state) {
      if (state === 'interrupted') {
        mainWindow.webContents.send('notif-progress', 'Download interrupted. Please try again.')
        console.log('Download is interrupted, canceling')
        item.cancel()
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          mainWindow.webContents.send('dl-progress', `${item.getReceivedBytes()}`/1000000, `${fileName}`, `${fileSize}`)
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log(`${savePath} Downloaded successfully`)
        extract(`${savePath}`,{dir: `${app.getPath('userData')}`}, function(err) {
          if (err) {console.error(err)}
          fs.unlinkSync(`${savePath}`)
          console.log(`${fileName} unzipped & deleted`)
          mainWindow.webContents.send('notif-progress', `<h3>${fileName} Unzipped</h3>`)
          mainWindow.webContents.send('downzip-complete')
        })
      } else if (state === 'cancelled') {
        console.log(`${fileName} Download Cancelled.`)
        if(fs.existsSync(`${savePath}`)) {
          fs.rmdirSync(`${savePath}`)
        }
        mainWindow.webContents.send('notif-progress', `<h3>${fileName} Download Cancelled.</h3>`)
      } else {
        mainWindow.webContents.send('notif-progress', `<h3>${fileName} Download failed! Try Again.<br>${state}</h3>`)
        console.log(`${fileName} Download failed: ${state}`)
      }
    })
  })
}
})
