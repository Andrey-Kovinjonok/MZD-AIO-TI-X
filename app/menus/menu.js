/**
* Creates a default menu for electron apps
*
* @param {Object} app electron.app
* @param {Object} shell electron.shell
* @returns {Object}  a menu object to be passed to electron.Menu
*/
const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const app = electron.app
const shell = electron.shell
const ipc = electron.ipcMain

let template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+s',
        role: 'save',
        click: function(item, focusedWindow) {
          focusedWindow.webContents.send('save-options')
        }
      },
      {
        label: 'Load',
        accelerator: 'CmdOrCtrl+l',
        role: 'load',
        click: function(item, focusedWindow) {
          focusedWindow.webContents.send('load-options')
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        role: 'cut'
      },
      {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
      },
      {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
      },
      {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        role: 'selectall'
      },
    ]
  },
  /*{
  label: 'View',
  submenu: [
  {
  label: 'Toggle Developer Tools',
  accelerator: (function() {
  if (process.platform === 'darwin')
  return 'Alt+Command+I';
  else
  return 'Ctrl+Shift+I';
})(),
click: function(item, focusedWindow) {
if (focusedWindow)
focusedWindow.toggleDevTools();
}
},
]
},*/
{
  label: 'Window',
  role: 'window',
  submenu: [
    {
      label: 'Reload App',
      accelerator: 'CmdOrCtrl+R',
      click: function(item, focusedWindow) {
        if (focusedWindow)
        focusedWindow.reload();
      }
    },
    {
      label: 'Full Screen',
      accelerator: (function() {
        if (process.platform === 'darwin')
        return 'Ctrl+Command+F';
        else
        return 'F11';
      })(),
      click: function(item, focusedWindow) {
        if (focusedWindow)
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+Q',
      role: 'close'
    },
  ]
},
{
  label: 'Zoom',
  role: 'zoom',
  submenu: [
    {
      label: 'Reset Zoom',
      accelerator: '=',
      role: "resetzoom"
    },
    {
      label: 'Zoom In',
      accelerator: 'Plus',
      role: "zoomin"
    },
    {
      label: 'Zoom Out',
      accelerator: '-',
      role: "zoomout"
    },
  ]
},
{
  label: 'Help',
  role: 'help',
  submenu: [
    {
      label: 'Info',
      click: () => {
        ipc.emit('open-info-window')
      }
    },
    {
      label: 'Learn More',
      click: function() { shell.openExternal('https://aio.trevelopment.win/mazdatweaks') }
    },
    {
      label: 'Forum',
      click: function() { shell.openExternal('https://aio.trevelopment.win/mazda3revolution') }
    },
  ]
},
{
  label: 'Back',
  accelerator: 'CmdOrCtrl+B',
  click: function (item, focusedWindow) {
    if (focusedWindow) {
      focusedWindow.webContents.goBack()
    }
  }
}
];
if (process.platform === 'darwin') {
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Shift+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: function() { app.quit(); }
      },
    ]
  });
  const windowMenu = template.find(function(m) { return m.role === 'window' })
  if (windowMenu) {
    windowMenu.submenu.push(
      {
        type: 'separator'
      },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    );
  }
  return template;
}
app.on('ready', function () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})
/*
app.on('browser-window-created', function () {
let reopenMenuItem = findReopenMenuItem()
if (reopenMenuItem) reopenMenuItem.enabled = false
})

app.on('window-all-closed', function () {
let reopenMenuItem = findReopenMenuItem()
if (reopenMenuItem) reopenMenuItem.enabled = true
})*/
