/* ************************************************************************** *\
** ************************************************************************** **
** MZD-AIO-TI                                                                 **
** By: Trezdog44 - Trevor Martin                                              **
** http://mazdatweaks.com                                                    **
** ©2016 Trevelopment                                                         **
**                                                                            **
** index.js - Helper javascript functions for the main view using electron    **
** renderer process modules.                                                  **
**                                                                            **
** ************************************************************************** **
\* ************************************************************************** */
/* This does nothing because I changed the way it works to data-binding with user.mainOps*/
function helpToggle () {
  /*$('.w3-tag').toggleClass('w3-hide')*/
}
const { electron, nativeImage, remote, clipboard, shell } = require('electron')
const { BrowserWindow } = remote.BrowserWindow
const { app } = remote
const path = require('path')
const fs = require('fs')
const ipc = require('electron').ipcRenderer
const Config = require('electron-config')
const settings = new Config({"name":"aio-data"})
const persistantData = new Config({"name":"aio-persist"})
const lastView = new Config({"name":"aio-last"})
const electronImageResize = require('electron-image-resize')
const { writeFileSync } = require('fs')
var copyFolderLocation = persistantData.get('copyFolderLocation')
var visits = persistantData.get('visits')
var hasColorFiles = fs.existsSync(`${app.getPath('userData')}/color-schemes/`)
var hasSpeedCamFiles = fs.existsSync(`${app.getPath('userData')}/speedcam-patch/`)
/* TODO: REMOVE LOGS */
/*console.log("colorfiles: "+hasColorFiles)
console.log("speedcamfiles: "+hasSpeedCamFiles)*/
console.log(visits)
/* END LOGS */
var lang = persistantData.get('lang') || 'english'
var langPath = `${app.getPath('home')}/lang/${lang}.aio.json`
var langObj = require(langPath)
/* IDEA FOR AIO BG PICKER
var bg-images = []
fs.readdir('./background-images/', (err, files) => {
files.forEach(file => {
console.log(file)
bg-images.push('<img src="file">')
})
})*/

function saveMenuLock () {
  persistantData.get('menuLock')
  if(!persistantData.has('menuLock')) {
    persistantData.set('menuLock',true)
  }
  persistantData.set('menuLock',!persistantData.get('menuLock'))
  $('.w3-overlay').toggleClass('showNav')
  $('.hideNav').toggleClass('showNav');
}
/* Create Temporary Folder To Hold Images Before Compiling */
if (!fs.existsSync('background')) {
  fs.mkdirSync('background')
}
/*function setBackground( params ){
  download(BrowserWindow.getFocusedWindow(), params.srcURL, {directory: path.resolve(path.join(`${__dirname}`, `../../../background/`))})
  if(fs.existsSync('./background/download.png')) {
    fs.renameSync('./background/download.png','./background/background.png')
  }
}*/
/*function defaultBlankAlbum () {
$('.blnk-albm-art').hide()
document.getElementById('blnk-albm-img').innerHTML = `<img src="../background-images/blank-album-art/no_artwork_icon.png" alt="Image not found"/>`
var inStr = fs.createReadStream(`resources/background-images/blank-album-art/no_artwork_icon.png`)
var outStr = fs.createWriteStream(`../../background/no_artwork_icon.png`)))
inStr.pipe(outStr)
}*/
/*function saveDarkMode() {
settings.set('mzdcolorz',!settings.get('mzdcolorz'))
}
function blert(){
bootbox.alert({
message: "TODO: event handler to drag help messages try angular if not then jQueryUI works for that."})
}*/
//TODO: Use 'bgImages' array when I include in multi-background support
//let bgImages = []
//Was going to use 'image' as a nativeImage object but I don't think I need to
//let image
//TODO: Remove log
//console.log(path.join('file://', __dirname, '/imageWindow.html'))

///* TODO: *******Prevent message stacking******* */
function helpMessageFreeze (item) {
  //TODO: Smooth out this code for the help messages fading in & out
  /*if($(item).children().hasClass('w3-text')){
  if($(item).children().hasClass('w3-show')){
  $(item).children().removeClass('FadeIn')
  $(item).children().addClass('FadeOut')
  setTimeout(function(){
  $(item).children().toggleClass('w3-show')
  $(item).children().addClass('w3-hide')
}, 500)
}
else {
$(item).children().removeClass('w3-hide')
$(item).children().removeClass('FadeOut')
$(item).children().addClass('FadeIn')
$(item).children().toggleClass('w3-show')
}
}*/
$(item).children().toggleClass('w3-show')
}

/*function createImageWindow() {
var imageWindow = windowManager.open('imageWindow')//, 'Drag & Drop Background Image', '/views/imageWindow.html','imageWindow')
}*/
ipc.on('open-copy-folder', () => {
  openCopyFolder()
})
function openCopyFolder () {
  copyFolderLocation = path.normalize(path.join(persistantData.get('copyFolderLocation'),"/_copy_to_usb/config"))
  if(!shell.showItemInFolder(copyFolderLocation)) {
    bootbox.alert({
      message: `"${copyFolderLocation}" Does Not Exist.  Click "Start Compilation" to Run The Tweak Builder and Create the _copy_to_usb Folder.`
    })
  }
}
function openApkFolder () {
  shell.showItemInFolder(path.normalize(path.join(copyFolderLocation,"_copy_to_usb/config/castscreen-receiver/")))
}
function openDefaultFolder () {
  shell.showItemInFolder(path.normalize(path.join('file://', __dirname, '../background-images/default/defaut.png')))
}
function firstTimeVisit () {
  if (persistantData.has('visits')) {
    //alert("Visits: " + persistantData.get("visits"))
  } else {
    var firstTimeMessage = bootbox.dialog({
      title: `<div class='w3-center'>Welcome To MZD-AIO-TI v${app.getVersion()} | MZD All In One Tweaks Installer</div>`,
      message: `<div class='w3-center'><h3>Welcome!  This is a message for your first time running MZD-AIO-TI!</h3></div><div class='w3-justify'> <b>All changes happen at your own risk! Please understand that you can damage or brick your infotainment system running these tweaks!  mIf you are careful, follow all instructions carefully, and heed all warnings the chances of damaging your system are greatly reduced. For more help, open the <a href='' onclick='helpDropdown()'>Help Panel</a> or visit <a href='' onclick="externalLink('mazdatweaks')">MazdaTweaks.com</a></b><br> <h2><br></div><div class="w3-center">"<img class='loader' src='./files/load-0.gif' alt='...' /></div>`,
      closeButton: false
    })
    setTimeout(function(){
      firstTimeMessage.modal('hide')
    }, 30000)
  }
}
var helpClick = false
function helpDropdown () {
  var x = document.getElementById("helpDrop")
  var y = document.getElementById("helpDropBtn")
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show"
    y.innerHTML = "<span class='icon-x'></span>"
    if(!helpClick) {
      let myNotification = new Notification('Help', {
        body: 'Visit MazdaTweaks.com for more help',
        icon: 'favicon.ico',
        tag: 'MZD-AIO-TI',
        silent: true
      })
      myNotification.onclick = () => {
        externalLink('mazdatweaks')
      }
    }
    helpClick = true
  }
  else {
    x.className = x.className.replace(" w3-show", "")
    y.innerHTML = "<span class='icon-cog3'></span>"
  }
}

//Normal Drop Down Menus
function dropDownMenu (id) {
  var x = document.getElementById(id)
  var y = $('#'+id)
  if (x.className.indexOf("w3-show") == -1) {
    $('.w3-dropdown-content').removeClass('w3-show')
    x.className += " w3-show"
  } else {
    x.className = x.className.replace(" w3-show", "")
  }
  y.on({
    mouseleave: function(){
      y.toggleClass('w3-show')
    }
  })
}
function toggleFullScreen () {
  remote.BrowserWindow.getFocusedWindow().setFullScreen(!remote.BrowserWindow.getFocusedWindow().isFullScreen())
  $('.icon-fullscreen').toggleClass('icon-fullscreen-exit')
}
//Extra Options Togglers
var togg = false
function toggleOps (x) {
  $(x).toggleClass('icon-plus-square').toggleClass('icon-minus-square')
}
function toggleAllOps () {
  var x = $('.toggleExtra')
  if (togg){
    $('#alltoggle').addClass('icon-minus-alt').removeClass('icon-plus-alt')
    x.removeClass('icon-plus-square').addClass('icon-minus-square')
  } else {
    $('#alltoggle').removeClass('icon-minus-alt').addClass('icon-plus-alt')
    x.addClass('icon-plus-square').removeClass('icon-minus-square')
  }
  togg = !togg
}
function externalLink (link) {
  shell.openExternal(`https://aio.trevelopment.win/${link}`)
}
function cleanArray (actual) {
  var newArray = new Array()
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}
function donate () {
  let donatewin = new remote.BrowserWindow({
    width: 500,
    height: 600,
    resizable: false,
    movable: false,
    'parent': remote.BrowserWindow.fromId(1),
    'modal': true,
    'icon': './app/favicon.ico',
    'autoHideMenuBar': true
  })
  donatewin.loadURL("https://aio.trevelopment.win/donate")
  donatewin.on('closed', () => {
    remote.BrowserWindow.fromId(1).focus()
  })
}
//Returns list of USB Drives
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
function getParameterByName(name, url) {
  if (!url) url = window.location.href
  url = url.toLowerCase() // This is just to avoid case sensitiveness
  name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();// This is just to avoid case sensitiveness for query parameter name
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url)
  if (!results) return ''//url.substr(url.lastIndexOf('/') + 1)
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, " "))
}
function getLanguage() {
  var language = getParameterByName('lang')
  if(!language) {
    if(persistantData.has('lang')){
      language = persistantData.get('lang')
    } else {
      language = 'english'
    }
  }
  persistantData.set('lang',language)
  if(`${language}`==='index.html') {language = 'english'}
  var langURL = `lang/${language}.aio.json`
  lang = `${language}`
  langPath = `${app.getPath('home')}/lang/${lang}.aio.json`
  langObj = require(langPath)
  /*$.get( langURL, function( data, textStatus, jqxhr ) {
    console.log( `Language: ${lang}` )
  })
  .fail(function( jqxhr, settings, exception ) {
    window.location.assign('./index.html?lang=english') //Fallback to English
  })*/
}
