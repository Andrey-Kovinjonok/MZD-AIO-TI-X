/* ************************************************************************** *\
** ************************************************************************** **
** MZD-AIO-TI                                                                 **
** By: Trezdog44 - Trevor Martin                                              **
** http://mazdatweaks.com                                                    **
** ©2017 Trevelopment                                                         **
**                                                                            **
** index.js - Helper javascript functions for the main view using electron    **
** renderer process modules.                                                  **
**                                                                            **
** ************************************************************************** **
\* ************************************************************************** */
/* jshint esversion:6, -W033 */
const { electron, nativeImage, remote, clipboard, shell } = require('electron')
const { app, BrowserWindow } = remote
const fs = require('fs')
const ipc = require('electron').ipcRenderer
const Config = require('electron-config')
const settings = new Config({'name': 'aio-data'})
const persistantData = new Config({'name': 'aio-persist'})
const lastView = new Config({'name': 'aio-last'})
const userThemes = new Config({'name': 'user-themes'})
const { writeFileSync } = require('fs')
const isDev = require('electron-is-dev')
const path = require('path')
var copyFolderLocation = persistantData.get('copyFolderLocation')
var visits = persistantData.get('visits')
var hasColorFiles = fs.existsSync(`${app.getPath('userData')}/color-schemes/`)
var hasSpeedCamFiles = fs.existsSync(`${app.getPath('userData')}/speedcam-patch/`)
var translateSchema, langPath, lang
var tempDir = `${app.getPath('userData')}/background`
// require('./lib/log')('MZD-AIO-LOG')
// var output = process.stdout
// var errorOutput = process.stderr
/* TODO: REMOVE LOGS */
/* console.log("colorfiles: "+hasColorFiles)
console.log("speedcamfiles: "+hasSpeedCamFiles) */
// console.log(visits)
/* END LOGS */
lang = persistantData.get('lang') || 'english'
if (window.location.pathname.includes('joiner')) {
  langPath = `../lang/${lang}.aio.json`
  translateSchema = require('../lang/aio.schema.json')
} else {
  translateSchema = require('./lang/aio.schema.json')
  langPath = `${app.getPath('home')}/lang/${lang}.aio.json`
}
var langObj = require(langPath)
/* IDEA FOR AIO BG PICKER
var bg-images = []
fs.readdir('./background-images/', (err, files) => {
files.forEach(file => {
console.log(file)
bg-images.push('<img src="file">')
})
}) */
function saveMenuLock () {
  persistantData.get('menuLock')
  if (!persistantData.has('menuLock')) {
    persistantData.set('menuLock', true)
  }
  persistantData.set('menuLock', !persistantData.get('menuLock'))
  $('body, .hideNav, .w3-overlay').toggleClass('showNav')
}
/* Create Temporary Folder To Hold Images Before Compiling */
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir)
}

function helpMessageFreeze (item) {
  $(item).children().toggleClass('w3-show')
}

/* Clock for Background preview */
function startTime () {
  var today = new Date()
  var h = today.getHours()
  var m = today.getMinutes()
  // var s = today.getSeconds()
  m = checkTime(m)
  // s = checkTime(s)
  $('#clock').html(`${h}:${m}`)
  var t = setTimeout(startTime, 10000)
  formatDateCustom(2)
}
function checkTime (i) {
  if (i < 10) { i = '0' + i }  // add zero in front of numbers < 10
  return i
}
/* function createImageWindow() {
var imageWindow = windowManager.open('imageWindow')// , 'Drag & Drop Background Image', '/views/imageWindow.html','imageWindow')
} */
ipc.on('open-copy-folder', () => {
  openCopyFolder()
})
function openCopyFolder () {
  copyFolderLocation = path.normalize(path.join(persistantData.get('copyFolderLocation'), '/_copy_to_usb/config'))
  if (!shell.showItemInFolder(copyFolderLocation)) {
    bootbox.alert({
      message: `"${copyFolderLocation.replace('config', '')}" Does Not Exist.  Click "Start Compilation" to Run The Tweak Builder and Create the _copy_to_usb Folder.`
    })
  }
}
function openApkFolder () {
  shell.showItemInFolder(path.normalize(path.join('file://', __dirname, '../../castscreenApp/castscreen-1.0.apk')))
}
function openDlFolder () {
  shell.showItemInFolder(path.normalize(path.join(app.getPath('userData'), 'color-schemes/Blue')))
}
function openDefaultFolder () {
  shell.showItemInFolder(path.normalize(path.join('file://', __dirname, '../background-images/default/defaut.png')))
}
function updateNotes () {
  $.get('views/update.htm', function (data) { $('#changelog').html(data) })
  bootbox.dialog({
    title: `<div class='w3-center'>Welcome To MZD-AIO-TI v${app.getVersion()} | MZD All In One Tweaks Installer</div>`,
    message: `<div id='changelog'></div><button id='newVerBtn' style='display:none;font-weight:800;' class='w3-btn w3-hover-green w3-hover-text-black w3-display-bottommiddle' onclick='bootbox.hideAll()'>OK</button><br>`,
    className: 'update-info',
    size: 'large',
    closeButton: false
  })
  setTimeout(function () {
    //$('.modal-dialog').animate({'margin-top': '40px', 'margin-bottom': '60px'}, 8000)
    $('#newVerBtn').fadeIn(5000)
  }, 2000)
}
function firstTimeVisit () {
  if (visits > 0) {
    if (!persistantData.has('new-update-first-run') || persistantData.get('new-update-first-run')) {
      updateNotes()
      // $('.modal-dialog').animate({"margin-top":"40px","margin-bottom":"60px"},12000)
      persistantData.set('new-update-first-run', false)
    }
  } else {
    $('body').prepend('<div id="super-overlay" style="z-index:999999;width:9999px;height:9999px;display:block;position:fixed;background:transparent;"></div>')
    var firstTimeMessage = bootbox.dialog({
      title: `<div class='w3-center'>Welcome To MZD-AIO-TI v${app.getVersion()} | MZD All In One Tweaks Installer</div>`,
      message: `<div class='w3-center'><h3>Welcome to the AIO!</h3></div><div class='w3-justify'> <b>All changes happen at your own risk! Please understand that you can damage or brick your infotainment system running these tweaks!  If you are careful, follow all instructions carefully, and heed all warnings, the chances of damaging your system are greatly reduced.<br>For more help, open the <a href='' onclick='helpDropdown()'>Help Panel</a> or visit <a href='' onclick="externalLink('mazdatweaks')">MazdaTweaks.com</a><br><br>I appreciate feedback<br>use the <a href='' onclick='$("#feedback").click()'>feedback link</a> below to let me know what you think.<br><br><a href class='w3-btn w3-blue' onclick='$("#tourBtn").click()'>Take The Tour</a><br></center><br><br></b></div><div id="first-time-msg-btn" class="w3-center"><img class='loader' src='./files/img/load-0.gif' alt='...' /></div>`,
      closeButton: false
    })
    setTimeout(function () { $('#super-overlay').remove() }, 3000)
    setTimeout(function () {
      $('#first-time-msg-btn').html(`<button id='newVerBtn' style='display:none' class='w3-btn w3-hover-text-light-blue w3-display-bottommiddle' onclick='bootbox.hideAll()'>OK</button><br>`)
      $('#newVerBtn').fadeIn(10000)
      persistantData.set('visits', 0)
    }, 20000)
  }
}
var helpClick = false
function helpDropdown () {
  var x = document.getElementById('helpDrop')
  var y = document.getElementById('helpDropBtn')
  if (x.className.indexOf('w3-show') == -1) {
    x.className += ' w3-show'
    y.innerHTML = "<span class='icon-x'></span>"
    document.getElementById('sidenavOverlay').display = 'block'
    if (!helpClick) {
      let myNotification = new Notification('Help', {
        body: 'Visit MazdaTweaks.com for more help',
        icon: 'favicon.ico',
        tag: 'MZD-AIO-TI',
        silent: true
      })
      myNotification.onclick = () => {
        externalLink('mazdatweaks')
      }
      snackbar(`Visit <a href onclick='externalLink("mazdatweaks")'>MazdaTweaks.com</a> for more help`)
    }
    helpClick = true
  } else {
    closeHelpDrop()
  }
}
function closeHelpDrop () {
  var x = document.getElementById('helpDrop')
  var y = document.getElementById('helpDropBtn')
  x.className = x.className.replace(' w3-show', '')
  y.innerHTML = "<span class='icon-cog3'></span>"
}
// Normal Drop Down Menus
function dropDownMenu (id) {
  var x = document.getElementById(id)
  var y = $('#' + id)
  if (x.className.indexOf('w3-show') == -1) {
    $('.w3-dropdown-content').removeClass('w3-show')
    x.className += ' w3-show'
  } else {
    x.className = x.className.replace(' w3-show', '')
  }
  y.on({
    mouseleave: function () {
      y.toggleClass('w3-show')
    }
  })
}
function toggleFullScreen () {
  remote.BrowserWindow.getFocusedWindow().setFullScreen(!remote.BrowserWindow.getFocusedWindow().isFullScreen())
  $('.icon-fullscreen').toggleClass('icon-fullscreen-exit')
}
// Extra Options Togglers
var togg = false
function toggleOps (x) {
  $(x).toggleClass('icon-plus-square').toggleClass('icon-minus-square')
}
function toggleAllOps () {
  var x = $('.toggleExtra')
  if (togg) {
    $('#alltoggle').addClass('icon-minus-alt').removeClass('icon-plus-alt')
    x.removeClass('icon-plus-square').addClass('icon-minus-square')
  } else {
    $('#alltoggle').removeClass('icon-minus-alt').addClass('icon-plus-alt')
    x.addClass('icon-plus-square').removeClass('icon-minus-square')
  }
  togg = !togg
}
function externalLink (link) {
  shell.openExternal(`http://trevelopment.win/${link}`)
}
function cleanArray (actual) {
  var newArray = []
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
    'icon': './app/favicon.ico',
    'autoHideMenuBar': true
  })
  donatewin.loadURL('http://trevelopment.win/donate')
  donatewin.on('closed', () => {
    remote.BrowserWindow.fromId(1).focus()
  })
}
// Returns list of USB Drives
function getUSBDrives () {
  var disks = []
  drivelist.list(function (error, dsklst) {
    if (error) {
      bootbox.alert({
        title: 'Error',
        message: 'Error finding USB drives: ' + error,
        callback: function () {
          bootbox.hideAll()
        }
      })
      throw error
    }
    for (var i = 0; i < dsklst.length; i++) {
      if (!dsklst[i].system) {
        // console.log(disks[i]);console.log(disks[i].name);console.log(disks[i].description);
        disks.push({'name': dsklst[i].name, 'desc': dsklst[i].description, 'mp': dsklst[i].mountpoint})
      }
    }
    return disks
  })
}
function getParameterByName (name, url) {
  if (!url) url = window.location.href
  url = url.toLowerCase() // This is just to avoid case sensitiveness
  name = name.replace(/[[\]]/g, '\\$&').toLowerCase()// This is just to avoid case sensitiveness for query parameter name
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return ''// url.substr(url.lastIndexOf('/') + 1)
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
/* function getLanguage () {
var language = getParameterByName('lang')
if (!language) {
if (persistantData.has('lang')) {
language = persistantData.get('lang')
} else {
language = 'english'
}
}
persistantData.set('lang', language)
if (`${language}` === 'index.html') { language = 'english' }
var langURL = `lang/${language}.aio.json`
lang = `${language}`
langPath = `${app.getPath('home')}/lang/${lang}.aio.json`
langObj = require(langPath)
} */
function alternateLayout () {
  $('#options, #sidePanel').toggleClass('alt-layout')
}
function secretMenu () {
  $(`<div id="secretMenu" class="w3-card-12 w3-container">
  <header class="w3-container w3-teal">
  <span onclick="$(this).parent().parent().remove()"
  class="w3-closebtn">&times;</span>
  <h2>Secret Menu</h2>
  </header>
  <div class="w3-container">
  <button class="w3-btn w3-red w3-hover-yellow w3-ripple w3-border" onclick="persistantData.delete('lang')">Reset Language Variable</button>
  <button class="w3-btn w3-green w3-hover-indigo w3-ripple w3-border" onclick="$('#instAll').click()">Install All</button>
  <button class="w3-btn w3-deep-orange w3-hover-redw3-ripple w3-border" onclick="$('#uninstAll').click()">Uninstall All</button>
  </div>
  <footer class="w3-container w3-teal">
  <p>Modal Footer</p>
  </div>`).insertAfter($('#snackbar'))
  $('#secretMenu').fadeOut(10000)
}
function writeRotatorVars () {
  if ($('#imgCount').text() > 1) {
    fs.writeFileSync(`${tempDir}/bg-rotator.txt`, `BG_STEPS=${$('#imgCount').text()}\nBG_SECONDS=${$('#imgCount').text() * $('#bgRotatorSeconds').val()}\nBG_SEC_EACH=${$('#bgRotatorSeconds').val()}\nBG_WIDTH=${$('#imgCount').text() * 800}`)
  }
}
function saveAIOLogHTML () {
  var a = document.body.appendChild(
    document.createElement('a')
  )
  a.download = 'AIO_Log.html'
  a.href = 'data:text/html,' + document.getElementById('aio-comp-log').innerHTML
  a.click()
}
function formatDateCustom (dateFormatType) {
  var currentTime = new Date()
  var dateStr = null

  // Dissect month (0-11) & day (1-31)
  var month = currentTime.getMonth() + 1
  var day = currentTime.getDate()

  // numeric date output start
  // comment this block for standard
  var dayStr = ((day < 10) ? ('0' + day) : day)
  var monthStr = ((month < 10) ? ('0' + month) : month)
  // 1 For Date Format dd.mm.
  if (dateFormatType === 1) {
    dateStr = dayStr + '.' + monthStr + '.'
    // $('#date').css({'right':'35px','top':'6px','font-size':'18px'})
  } else if (dateFormatType === 2) {
    dateStr = monthStr + '/' + dayStr
    // $('#date').css({'right':'35px','top':'6px','font-size':'18px'})
  } else { // if (dateFormatType === 0)
    dateStr = currentTime.toISOString().substring(0, 10)
    // $('#date').css({'right':'35px','top':'6px','font-size':'18px'})
  }
  $('#date').text(dateStr)
}
function getAIOver () {
  return app.getVersion()
}
/* setInterval(function(){
$('#IN8, #UN8').prop('disabled',true)
},1000) */
function showCompatibility () {
  $(`<div id="compatibilityCheck" class="w3-small w3-padding" style="width:100%;max-width:1200px;margin:auto;background:rgba(0,0,0,.8);color:#fff;">
  <header class="w3-container w3-indigo">
  <span onclick="$(this).parent().parent().remove()"
  class="w3-closebtn">&times;</span>
  <h2>Compatibility</h2>
  </header>
  <div class="w3-container">
  <div class="w3-panel w3-center">
  <H5>ALL TWEAKS ARE COMPATIBLE WITH ALL THESE KNOWN FW VERSIONS:</H5>
  <div class="all-compat" style="">
  55.00.650A-NA  55.00.750B-NA  55.00.753A-NA  55.00.760A-NA  56.00.100A-ADR  56.00.230A-ADR  56.00.240B-ADR  56.00.511A-ADR  56.00.512A-ADR  56.00.513C-ADR  56.00.514A-ADR  56.00.100A-CHN  56.00.100A-EU  56.00.230A-EU  56.00.511A-EU  56.00.512A-EU  56.00.513B-EU  56.00.513C-EU  56.00.521A-NA  56.00.521A-EU  56.00.401A-JP  59.00.331A-EU  58.00.250A-NA  58.00.251A-ADR  59.00.330A-NA  59.00.441A-NA  59.00.443A-NA  59.00.443C-EU  59.00.330A-EU  59.00.330A-ADR  59.00.342A-ADR  59.00.442A-ADR  59.00.443C-ADR 59.00.446A-NA 59.00.450A-NA 59.00.447A-EU 59.00.449A-EU 59.00.326A-ADR
  </div></div>
  <div class="w3-border w3-border-red w3-col w3-padding">
  Advanced Option <b>Media Order Patch & FLAC Support</b> -
  <div class="all-compat" style="">
  55.00.650A-NA  55.00.753A-NA  55.00.760A-NA  56.00.100A-ADR  56.00.230A-EU  56.00.240B-ADR  56.00.511A-EU  56.00.512A-EU  56.00.521A-NA  58.00.250A-NA  59.00.326A-ADR  59.00.331A-EU  56.00.513C-EU  56.00.513B-EU  56.00.513C-ADR   59.00.330A-ADR   59.00.342A-ADR   59.00.441A-NA    59.00.443C-EU
  </div>
  </div>
  <!--div class="additional-sompat-check">These tweaks have additional compatibility checks for firmware specific files:
  <li>No More Disclaimer</li> <li>Order of Audio Source List</li> <li>Improved List Loop</li> <li>Date To Statusbar Mod</li></div--></div>`).insertAfter($('#mzd-title'))
}
$(function () {
  $('.toggleExtra.1').addClass('icon-plus-square').removeClass('icon-minus-square')
  setInterval(function () {
    if (!$('#IN23').prop('disabled')) { $('#IN23').prop('disabled', true) }
    if (!$('#IN8').prop('disabled')){$('#IN8').prop('disabled',true);}
    if (!$('#IN123').prop('disabled')) { $('#IN123').prop('disabled', true) }
    if (!$('#IN108').prop('disabled')){$('#IN108').prop('disabled',true);}
  }, 500)
  setTimeout(function () {
    $('#IN8').click(function () {
      snackbar('THERE MAY BE ISSUES REGARDING COMPATIBILITY WITH THIS TWEAK. AFTER INSTALLING, YOUR USB PORTS MAY BECOME UNREADABLE TO THE CMU. <h3>DO NOT PREFORM THIS INSTALL UNLESS YOU KNOW HOW TO RECOVER YOUR CMU VIA SSH</h3>')
    })
    $('#IN8, #IN23, #IN24, #IN25').click(function () {
      if (!$('#sshbringback').prop('checked')) { $('#sshbringback').click() }
      if (!$('#wifi').prop('checked')) { $('#wifi').click() }
    })
    $('#advancedOptions').click(function () {
      snackbarstay('These Tweaks are disabled due to DMCA takedown request (Speedcam) or due to unresolved issues (Media Order Patch & FLAC Support)')
      $('.advancedOp, #twkOpsTitle').toggle()
      $('.sidePanel').toggleClass('adv')
      if ($('#IN8').prop('checked')) { $('#IN8').click() }
      if ($('#IN23').prop('checked')) { $('#IN23').click() }
      if ($('#IN123').prop('checked')) { $('#IN123').click() }
    })
  }, 1000)
})
