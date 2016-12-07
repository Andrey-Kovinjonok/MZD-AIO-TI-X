const electron = require('electron')
const app = electron.app
const dialog = electron.dialog
const globalShortcut = electron.globalShortcut
const ipc = electron.ipcMain

app.on('ready', function () {
  globalShortcut.register('CommandOrControl+Alt+K', function () {
    dialog.showMessageBox({
      type: 'info',
      message: 'Success!',
      detail: 'You pressed the registered global shortcut keybinding.',
      buttons: ['OK']
    })
  })
  globalShortcut.register('CommandOrControl+Alt+P', function () {
    ipc.emit('open-joiner-window')
  })
})

app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})
