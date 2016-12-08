/* ************************************************************************** *\
|** ************************************************************************ **|
|** MZD-AIO-TI                                                               **|
|** By: Trezdog44 - Trevor Martin                                            **|
|** http://mazdatweaks.com                                                   **|
|** ©2016 Trevelopment                                                       **|
|**                                                                          **|
|** build-tweaks.js - The main 'builder' component copys neccesary files to  **|
|** a temporary folder for copying to a usb additionaly                      **|
|** gives the option to copy files directly to an available usb drive.       **|
|**                                                                          **|
|** ************************************************************************ **|
\* ************************************************************************** */
// var approot = './app/'// for dev
var approot = app.getAppPath()// for dist
var builddir = `${approot}/files/tweaks/` // Location of tweak files (as .txt files)
var extradir = app.getPath('userData') // Location of downloaded tweak files (userData)
var logFileName = 'MZD_LOG' // Name of log file (without extension)
var tweaks2write = [`${builddir}00_start.txt`]// Queue for order consistantcy writing tweaks.sh (Always starts with 00_start.txt)
const appender = require('appender')// Appends the tweak files syncronously
const crlf = require('crlf')// Converts tweaks.sh line endings from CRLF to LF
const copydir = require('copy-dir')// Copys full directories
const drivelist = require('drivelist')// Module that gets the available USB drives
const extract = require('extract-zip')// For Unzipping
const mkdirp = require('mkdirp')
//const langObj = require(`${app.getPath('home')}/lang/${lang}.aio.json`)
var fileCount = 0
var opsComplete = false
var filesComplete = true
// First line of AIO log
var AIO_LOG = `# __MZD-AIO-TI__ | MZD All In One Tweaks Installer\n#### AIO COMPILATION LOG - ${Date()}=\n\n___\n\n- *START!*`
var AIO_LOG_HTML = `<h1><b>MZD-AIO-TI</b> | MZD All In One Tweaks Installer</h1><br><h4> AIO COMPILATION LOG - ${Date()}</h4><hr><div><ul><li><b><i>START!</i></b></li>`
// flag to prevent disclaimer&audiosource folder from being copied twice
var disclaimerAndAudioFlag = false
var errFlag = false
var copySwapfile = false
/*                                      *********\
|*  START BUILD OF TWEAKS.SH & ASSOCIATED FILES *|
\**********                                     */
var tmpdir
function buildTweakFile (user) {
  tmpdir = path.normalize(path.join(persistantData.get('copyFolderLocation'), '/_copy_to_usb')) // Place to hold USB drive files before copying
  AIO_LOG += `_copy_to_usb Location: ${tmpdir}`
  AIO_LOG += `<li><b>_copy_to_usb Location: ${tmpdir}</b></li>`
  bootbox.dialog({
    message: `<div style='text-align:center;' data-hint='If copying to a USB drive is taking a very long time, try picking less tweaks at once. The Color Scheme and Swapfile tweaks take the longest to copy bacause of their size, copying may take up to 30 minutes if both are chosen.' data-hintPosition='top-middle' data-position='auto'>Compiling... Please Wait <br><div id='userLogView' style='text-align:center;' ></div><br><img class='loader' src='./files/load-1.gif' alt='...' /></div><div id='copy-loc'>Location of _copy_to_usb Folder: ${tmpdir}</div>`,
    closeButton: false
  })
  try {
    // delete tmp folder if it exists and make new tmp dir
    deleteFolderRecursive(`${tmpdir}`)
    fs.mkdirSync(`${tmpdir}`)
    fs.mkdirSync(`${tmpdir}/config/`)
    fs.mkdirSync(`${tmpdir}/config_org/`)
  } catch(e) {
    var m = `${e} <br>Leaving the '_copy_to_usb' folder open is most likely the cause of this error. Try closing all other running programs and folders before compiling.`
    aioLog(m, m)
  }
  // Pre-Installs

  // first back up JCI folder if chosen
  if (user.mainOps.indexOf(1) !== -1) {
    addTweak('00_backup.txt')
  }
  if (user.mainOps.indexOf(0) !== -1) {
    addTweak('00_wif i.txt')
  }
  if (user.mainOps.indexOf(4) !== -1) {
    addTweak('00_sshbringback.txt')
    addTweakDir('ssh_bringback', true)
  }
  if (user.options.indexOf(16) !== -1) {
    mkdirp.sync(`${tmpdir}/config/blank-album-art-frame/jci/gui/common/images/`)
    addTweakDir('blank-album-art-frame', true)
  }
  if (user.options.indexOf(123) !== -1) {
    addTweak('23_speedcam-u.txt')
    copydir(`${extradir}/org`, `${tmpdir}/config_org/speedcam-patch`, function (err) {
      if (err) {
        aioLog(`File Copy Error: Speedcam Patch`, `Speedcam Patch`)
      } else {
        aioLog(`Files for Uninstall Speedcam Patch copied successfully!`)
      }
    })
  }
  if (user.options.indexOf(23) !== -1) {  // Put this higher to give more time to copy. it needs to be patched as well
    speedcamPatch(user)
  } else {
    speedcamIsPatched(user)
  }
}
function speedcamPatch (user) {
  if (!fs.existsSync(`${extradir}/speedcam-patch/`)) {
    window.alert('Please Download Speed Cam Patch Files Before Compiling')
    bootbox.hideAll()
    return
  } else {
    aioLog('Preparing Speedcam Files For Patching')
    copydir(`${extradir}/speedcam-patch/`, `./resources/speedcam-patch/`, function (err) {
      if (err) { aioLog(err, err) }
      copydir (`${extradir}/org/`, `./resources/org/`, function (err) {
        if (err) { aioLog(err, err) }
        aioLog('Patching Speedcam Files')
        const spawn = require('child_process').spawn
        // var patchTool = `cp -a ${extradir}/speedcam-patch/ ./resources/ && cp -a ${extradir}/org/ ./resources/  && cd resources/tools/ && NNG_Patch.bat`
        var patchTool = `cd resources/tools/ && NNG_Patch.bat`
        const bat = spawn('cmd.exe', ['/c', patchTool])

        bat.stdout.on('data', (data) => {
          var strdata = String.fromCharCode.apply(null, data)
          aioLog(strdata)
        })

        bat.stderr.on('data', (data) => {
          var strdata = String.fromCharCode().apply(null, data) + '<br />Error Patching Speedcam Files'
          aioLog(strdata, strdata)
        })

        bat.on('exit', (code) => {
          if (`${code}` === 0) {
            aioLog('Speedcam Files Patched Successfully ')
          } else {
            aioLog(`Speedcam Patch Exit Code: ${code}`)
          }
          fs.rename(`./resources/speedcam-patch`, `${tmpdir}/config/speedcam-patch`)
          speedcamIsPatched(user)
        })
      })
    })
  }
}
function speedcamIsPatched (user) {
  if (user.mainOps.indexOf(3) !== -1) {
    if (user.colors === 0) {
      setColor('Red', user)
    } else if (user.colors === 1) {
      setColor('Blue', user)
    } else if (user.colors === 2) {
      setColor('Green', user)
    } else if (user.colors === 3) {
      setColor('Silver', user)
    } else if (user.colors === 4) {
      setColor('Pink', user)
    } else if (user.colors === 5) {
      setColor('Purple', user)
    } else if (user.colors === 6) {
      setColor('Orange', user)
    } else if (user.colors === 7) {
      setColor('Yellow', user)
    } else if (user.colors === 8) {
      setColor('CarOS', user)
    } else {
      buildTweak(user)
    }
  } else {
    buildTweak(user)
  }
}
function setColor (color, user) {
  var c = `COLORTHEME=${color}`
  fs.mkdirSync(`${tmpdir}/config/color-schemes`)
  copydir(`${extradir}/color-schemes/speedometer/`, `${tmpdir}/config/color-schemes/speedometer`, function (err) {
    if (err) { aioLog(err, err) }
  })
  aioLog('Speedometer Color Files Copied')
  fs.writeFileSync(`background/color.txt`, c)
  tweaks2write.push(`background/color.txt`)
  // extract(`${approot}files/tweaks/config/color-schemes/${color}/jci.zip`, {dir: `${tmpdir}/config/color-schemes/${color}`}, function (err) {
  aioLog(`Unzipping ${color} color theme folder`)
  extract(`${extradir}/color-schemes/${color}/jci.zip`, {dir: `${tmpdir}/config/color-schemes/${color}`}, function (err) {
    if (err) { aioLog(err, err) }
    aioLog(`${color} Color Scheme Folder Unzipped... Continue Build.`)
    if (!user.useColorBG) {
      if (fs.existsSync(`${tmpdir}/config/color-schemes/${color}/jci/gui/common/images/background.png`))
      fs.unlinkSync(`${tmpdir}/config/color-schemes/${color}/jci/gui/common/images/background.png`)
      aioLog('Removed Color Scheme Background')
    }
    buildTweak(user)
  })
}
function buildTweak (user) {
  // ****************************************************/
  // **********Write uninstalls first********************/
  // ****************************************************/
  if (user.options.indexOf(101) !== -1) {
    addTweak('01_touchscreen-u.txt')
  }
  if (user.options.indexOf(102) !== -1) {
    addTweak('02_disclaimer-u.txt')
    addTweakDir('audio_order_AND_no_More_Disclaimer', false)
    disclaimerAndAudioFlag = true
  }
  if (user.options.indexOf(103) !== -1) {
    addTweak('03_warning-u.txt')
    addTweakDir('safety-warning-reverse-camera', false)
  }
  if (user.options.indexOf(104) !== -1) {
    addTweak('04_sensor-u.txt')
    addTweakDir('transparent-parking-sensor', false)
  }
  if (user.options.indexOf(105) !== -1) {
    addTweak('05_mainloop-u.txt')
    addTweakDir('main-menu-loop', false)
  }
  if (user.options.indexOf(106) !== -1) {
    addTweak('06_listloop-u.txt')
    addTweakDir('list-loop', false)
  }
  if (user.options.indexOf(107) !== -1) {
    if (user.options.indexOf(106) === -1) {
      addTweak('07_shorterdelay-u.txt')
    }
  }
  if (user.options.indexOf(108) !== -1) {
    addTweak('08_orderflac-u.txt')
    addTweakDir('media-order-patching', false)
  }
  if (user.options.indexOf(109) !== -1) {
    addTweak('09_audioorder-u.txt')
    if (!disclaimerAndAudioFlag) {
      addTweakDir('audio_order_AND_no_More_Disclaimer', false)
    }
  }
  if (user.options.indexOf(110) !== -1) {
    addTweak('10_pausemute-u.txt')
    addTweakDir('pause-on-mute', false)
  }
  if (user.options.indexOf(111) !== -1) {
    addTweak('11_msgreplies-u.txt')
    addTweakDir('message_replies', false)
  }
  if (user.options.indexOf(112) !== -1) {
    addTweak('12_diag-u.txt')
  }
  if (user.options.indexOf(113) !== -1) {
    addTweak('13_boot-u.txt')
    addTweakDir('bootanimation', false)
  }
  if (user.options.indexOf(114) !== -1) {
    addTweak('14_bgart-u.txt')
    addTweakDir('bigger-album-art', false)
  }
  if (user.options.indexOf(115) !== -1) {
    addTweak('15_btnbackground-u.txt')
    addTweakDir('NoButtons', false)
  }
  if (user.options.indexOf(116) !== -1) {
    addTweak('16_blnkframe-u.txt')
    addTweakDir('blank-album-art-frame', false)
  }
  if (user.options.indexOf(117) !== -1) {
    addTweak('17_videoplayer-u.txt')
  }
  if (user.options.indexOf(118) !== -1) {
    addTweak('18_swapfile-u.txt')
  }
  if (user.options.indexOf(119) !== -1) {
    addTweak('19_speedo-u.txt')
    addTweakDir('speedometer', false)
  }
  if (user.options.indexOf(120) !== -1) {
    addTweak('20_date-u.txt')
    addTweakDir('date-to-statusbar_mod', false)
  }
  if (user.options.indexOf(122) !== -1) {
    addTweak('22_fuel-u.txt')
    addTweakDir('FuelConsumptionTweak', false)
  }
  if (user.options.indexOf(124) !== -1) {
    addTweak('24_castscreen-u.txt')
  }
  if (user.options.indexOf(125) !== -1) {
    addTweak('25_androidauto-u.txt')
    addTweakDir('androidauto', false)
  }
  if (user.mainOps.indexOf(106) !== -1) {
    addTweak('00_bgrotator-u.txt')
    addTweakDir('BackgroundRotator', false)
  }
  // reset flag for installs
  disclaimerAndAudioFlag = false
  // ****************************************************/
  // ******************Write installs********************/
  // ****************************************************/
  if (user.mainOps.indexOf(3) !== -1) {
    addTweak('21_colors-i1.txt')
    addTweak('21_colors-i2.txt')
  }
  if (user.options.indexOf(1) !== -1) {
    addTweak('01_touchscreen-i.txt')
  }
  if (user.options.indexOf(2) !== -1) {
    if (user.disclaimOps === 1) {
      addTweak('02_disclaimer5-i.txt')
    } else {
      addTweak('02_disclaimer-i.txt')
      addTweakDir('audio_order_AND_no_More_Disclaimer', true)
    }
    disclaimerAndAudioFlag=true
  }
  if (user.options.indexOf(3) !== -1) {
    addTweak('03_warning-i.txt')
    addTweakDir('safety-warning-reverse-camera', true)
  }
  if (user.options.indexOf(4) !== -1) {
    addTweak('04_sensor-i.txt')
    addTweakDir('transparent-parking-sensor', true)
  }
  if (user.options.indexOf(5) !== -1) {
    addTweak('05_mainloop-i.txt')
    addTweakDir('main-menu-loop', true)
  }
  if (user.options.indexOf(6) !== -1) {
    addTweak('06_listloop-i.txt')
    addTweakDir('list-loop', true)
  }
  if (user.options.indexOf(7) !== -1) {
    addTweak('07_shorterdelay-i.txt')
  }
  if (user.options.indexOf(8) !== -1) {
    addTweak('08_orderflac-i.txt')
    addTweakDir('media-order-patching', true)
  }
  if (user.options.indexOf(9) !== -1) {
    addTweak('09_audioorder-i.txt')
    if (!disclaimerAndAudioFlag) {
      addTweakDir('audio_order_AND_no_More_Disclaimer', true)
    }
  }
  if (user.options.indexOf(10) !== -1) {
    addTweak('10_pausemute-i.txt')
    addTweakDir('pause-on-mute', true)
  }
  if (user.options.indexOf(11) !== -1) {
    addTweak('11_msgreplies-i.txt')
    addTweakDir('message_replies', true)
  }
  if (user.options.indexOf(12) !== -1) {
    addTweak('12_diag-i.txt')
  }
  if (user.options.indexOf(13) !== -1) {
    addTweak('13_boot-i.txt')
  }
  if (user.options.indexOf(14) !== -1) {
    addTweak('14_bgart-i.txt')
    addTweakDir('bigger-album-art', true)
  }
  if (user.options.indexOf(15) !== -1) {
    addTweak('15_btnbackground-i.txt')
    addTweakDir('NoButtons', true)
  }
  if (user.options.indexOf(17) !== -1) {
    addTweak('17_videoplayer-i.txt')
    addTweakDir('videoplayer', true)
  }
  if (user.options.indexOf(18) !== -1) {
    addTweak('18_swapfile-i.txt')
  }
  if (user.options.indexOf(19) !== -1) {
    addTweak('19_speedo-i1.txt', true)
    if (user.speedoOps.lang.id === 0) {
      addTweak('19_speedo-english.txt', true)
    } else if (user.speedoOps.lang.id === 2) {
      addTweak('19_speedo-spanish.txt', true)
    } else if (user.speedoOps.lang.id === 3) {
      addTweak('19_speedo-polish.txt', true)
    } else if (user.speedoOps.lang.id === 4) {
      addTweak('19_speedo-slovic.txt', true)
    } else if (user.speedoOps.lang.id === 5) {
      addTweak('19_speedo-turkish.txt', true)
    } else if (user.speedoOps.lang.id === 6) {
      addTweak('19_speedo-french.txt', true)
    }
    if (user.speedoOps.xph.id === 10) {
      addTweak('19_speedo-mph.txt', true)
    }
    if (user.speedoOps.sml.id === 21) {
      addTweak('19_speedo-small_speedo_on_vehicle.txt', true)
    } else if (user.speedoOps.sml.id === 22) {
      addTweak('19_speedo-small_speedo_off.txt', true)
    }
    if (user.speedoOps.bg.id === 30) {
      fs.writeFileSync('background/bgopacity.txt','OPACITY='+user.speedoOps.opac)
      crlf.set('background/bgopacity.txt', 'LF', function (err, endingType) {
        if (err) {
          aioLog(err, err)
        } else {
          aioLog('Converted OPACITY file from ' + endingType + ' to LF')
        }
      })
      tweaks2write.push('background/bgopacity.txt')
      addTweak('19_speedo-own_background.txt', true)
    } else if (user.speedoOps.bg.id === 31) {
      addTweak('19_speedo-old_background.txt', true)
    }
    addTweak('19_speedo-i2.txt', true)
    addTweakDir('speedometer', true)
  }
  if (user.options.indexOf(20) !== -1) {
    if (user.d2sbOps==0) {
      addTweak('20_date-iv1.txt')
    } else if (user.d2sbOps === 1) {
      addTweak('20_date-iv2.1.txt')
    } else if (user.d2sbOps === 2) {
      addTweak('20_date-iv2.2.txt')
    } else if (user.d2sbOps === 3) {
      addTweak('20_date-iv2.3.txt')
    }
    addTweakDir('date-to-statusbar_mod', true)
  }
  if (user.options.indexOf(22) !== -1) {
    addTweak('22_fuel-i.txt')
    addTweakDir('FuelConsumptionTweak', true)
  }
  if (user.options.indexOf(23) !== -1) {
    addTweak('23_speedcam-i.txt')
    if (user.speedcamOps==0) {
      addTweak('23_speedcam-a.txt')
    } else if (user.speedcamOps === 1) {
      addTweak('23_speedcam-b.txt')
    } else if (user.speedcamOps === 2) {
      addTweak('23_speedcam-c.txt')
    } else if (user.speedcamOps === 3) {
      addTweak('23_speedcam-e.txt')
    } else if (user.speedcamOps === 4) {
      addTweak('23_speedcam-f.txt')
    } else if (user.speedcamOps === 5) {
      addTweak('23_speedcam-g.txt')
    }
  }
  if (user.options.indexOf(24) !== -1) {
    addTweak('24_castscreen-i.txt')
    addTweakDir('castscreen-receiver', true)
  }
  if (user.options.indexOf(25) !== -1) {
    addTweak('25_androidauto-i.txt')
    addTweakDir('androidauto', true)
  }
  if (user.options.indexOf(18) !== -1) {
    copySwapfile = true
  }
  // Add chosen background
  if (user.mainOps.indexOf(2) !== -1) {
    if (user.mainOps.indexOf(6) !== -1) {
      addTweak('00_bgrotator-i.txt')
      addTweakDir('BackgroundRotator', true)
    }
    var inStr = fs.createReadStream('background/background.png')

    var out = fs.createWriteStream(`${tmpdir}/config/background.png`,{flags: 'a+'})
    out.on('close', function () {
      aioLog('Background Copy Successful!')
    })
    inStr.pipe(out)
    addTweak('00_background.txt')
  }
  if (user.options.indexOf(16) !== -1) {
    var outStr = fs.createWriteStream(`${tmpdir}/config/blank-album-art-frame/jci/gui/common/images/no_artwork_icon.png`)
    var inStr = fs.createReadStream('background/no_artwork_icon.png')
    outStr.on('close', function () {
      aioLog('Blank Album Art Copy Successful!')
    })
    inStr.pipe(outStr)
    addTweak('16_blnkframe-i.txt')
  }
  if (user.mainOps.indexOf(5) !== -1) {
    addTweak('00_sd-cid.txt')
    addTweakDir('get_sd_cid', true)
  }
  if (user.mainOps.indexOf(19) !== -1 || user.mainOps.indexOf(17) !== -1) {
    addTweakDir('bin', true)
  }
  // Finish with the end script
  addTweak('00_end.txt')
  // add bin and get_sd_cid directories
  // Add root files to tmp and write tweaks.sh
  addRootFiles()
  writeTweaksFile()
}
// function to add each tweak to the array
function addTweak(twk) {
  tweaks2write.push(`${builddir}${twk}`)
  twk=twk.substr(3)
  twk=twk.replace('.txt', "")
  twk=twk.replace('-i', ' Install ')
  twk=twk.replace('-u', ' Uninstall ')
  twk=twk.charAt(0).toUpperCase() + twk.slice(1)
  aioLog(`${twk} added successfully.`)
}
function writeTweaksFile () {
  // write stream writes tweaks.txt
  var tweaks = fs.createWriteStream(`${tmpdir}/tweaks.txt`)
  // file appender function is given the array and piped to the write stream
  new appender(tweaks2write).pipe(tweaks)
  tweaks.on('close', convert2LF)
}
function convert2LF() {
  /* For now the files are pre converted, but this needs to stay in just in case EOL format changes.************/
  crlf.set(`${tmpdir}/tweaks.txt`, 'LF', function (err, endingType) {
    if (err) {
      aioLog(err,'LF Convert Error')
    }  else if (endingType=='NA') {
      aioLog('EOL FORMAT (Format should be: LF)')
    } else if (endingType=='LF') {
      aioLog(`EOL Format OK: ${endingType}`)
    } else if (endingType=='CRLF') {
      aioLog(`EOL Format OK: ${endingType}`)
    } else {
      aioLog('EOL FORMAT (Format should be: LF)')
    }
    // if (err) aioLog(err,'LF Convert Error')throw err **********************
    // Rename tweaks.txt to tweaks.sh
    fs.rename(`${tmpdir}/tweaks.txt`,`${tmpdir}/tweaks.sh`)
    aioLog('Writing Tweaks.sh')
    opsComplete = true
    setTimeout(function () {
      if (filesComplete) {
        /* finishedMessage()*/
        printAIOlog()
      }
    }, 5000)
  })
}
// Function for copying tweak folders
function addTweakDir (twk, inst) {
  filesComplete = false
  aioLog(`Copying ${twk} files...`)
  fileCount++
  if (inst) {
    var twkdir = '/config/'
  } else {
    twkdir = '/config_org/'
  }
  try {
    if (!fs.existsSync(`${tmpdir}${twkdir}${twk}`)) {
      fs.mkdirSync(`${tmpdir}${twkdir}${twk}`)
    }
    // console.log(`${approot}/files/tweaks/${twkdir}${twk}`)
    // Above creates, below copies to tmp
    copydir(`${approot}/files/tweaks/${twkdir}${twk}`, `${tmpdir}${twkdir}${twk}`, function (err) {
      if (err) {
        aioLog(`File Copy Error: ${twk}-${err}`, `${err}-${twk}`)
      } else {
        aioLog(`Files for ${twk} copied successfully!`)
      }
      fileCount--
      if (fileCount === 0) {
        setTimeout(function () {
          if (fileCount === 0) {
            filesComplete = true
          }
          if (opsComplete) {
            printAIOlog()
          }
        }, 8000)
      }
    })
  } catch (e) {
    aioLog(e, e)
  }
}
// Function copys root files
function addRootFiles () {
  try {
    copydir(`${approot}/files/tweaks/root`, `${tmpdir}`, function (err) {
      if (err) {
        errFlag = true
        aioLog('ERROR COPYING ROOT FILES', err)
        throw (err)
      } else {
        aioLog('Root files copied successfully!')
      }
    })
  } catch (e) {
    aioLog(e, e)
  }
}
// recursive method for deleting a folder with contents
var deleteFolderRecursive = function (path) {
  try {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file, index) {
        var curPath = path + '/' + file
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath)
        } else { // delete file
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  } catch (e) {
    aioLog(e, e)
  }
}
function aioLog (logMsg, err) {
  if (err) {
    errFlag = true
    bootbox.alert({
      message: err
    })
    AIO_LOG_HTML += `<li style='font-weight:600;color:red'> ${logMsg}</li>\n`
  } else {
    AIO_LOG_HTML += `<li style='color:#004c00'> ${logMsg}</li>\n`
  }
  var userView = document.getElementById(`userLogView`)
  if (userView) {
    userView.innerHTML = logMsg
  }
  console.log(logMsg)
  AIO_LOG += `- ${logMsg}\n`
}
// Prints out the log
function printAIOlog () {
  if (filesComplete && opsComplete) {
    filesComplete = false
    opsComplete = false
    fs.writeFile(`${tmpdir}/${logFileName}.md`, AIO_LOG, {flag: 'w'}, (err) => {
      if (err) throw err
      console.log('AIO log saved!')
      AIO_LOG_HTML += '</ul></div>'
      fs.writeFile(path.resolve(path.join(`${approot}`, `../../${logFileName}.htm`)), AIO_LOG_HTML, {flag: 'w'}, (err) => {
        if (err) throw err
        console.log('AIO log saved! (HTML version)')
        bootbox.hideAll()
        if (!errFlag) {
          usbDrives()
        } else {
          finishedMessage()
        }
      })
    })
  }
}
function unzipSwapfile (dest, callback) {
  if (copySwapfile) {
    copySwapfile = false
    console.log('Unzipping Swapfile')
    if (!dest || `${dest}` === `copy`) {
      dest = `${tmpdir}`
    }
    var swapMsg = bootbox.dialog({
      message: `<div class='w3-center'><h3>Unzipping Swapfile To: ${dest}...  Please Wait... </h3><br><div id='swapLogView' style='text-align:center;' ></div><br><img class='loader' src='./files/load-0.gif' alt='...' /></div>`,
      closeButton: false
    })
    setTimeout(function () {
      if(document.getElementById('swapLogView')) {
        document.getElementById('swapLogView').innerHTML = 'This takes a few minutes... be patient.'
      }
    }, 10000)
    setTimeout(function () {
      if(document.getElementById('swapLogView')) {
        document.getElementById('swapLogView').innerHTML = 'The Swapfile size is 1 GB.'
      }
    }, 30000)
    setTimeout(function () {
      if(document.getElementById('swapLogView')) {
        document.getElementById('swapLogView').innerHTML = `While you wait, here is some information:<br>${langObj.tweakOps[17].toolTip}`
      }
    }, 40000)
    fs.mkdirSync(`${dest}/config/swapfile/`)
    extract(`${approot}/files/tweaks/config/swapfile/swapfile.zip`, {dir: `${dest}/config/swapfile/`}, function (err) {
      if (err) { console.error(err, err) }
      console.log('Swapfile Unzipped.')
      swapMsg.modal('hide')
      if (callback) {
        if (!dest || `${dest}` === `${tmpdir}`) {
          callback()
        } else {
          callback(dest)
        }
      } else {
        finishedMessage(dest)
      }
    })
  } else {
    finishedMessage(dest)
  }
}
// Returns the available usb drives
function usbDrives () {
  var disks = []
  var usbDriveLst = []
  drivelist.list(function (error, dsklst) {
    if (error) {
      bootbox.alert({
        title: 'Error',
        message: `Error finding USB drives: ${error}`,
        callback: function () {
          bootbox.hideAll()
          finishedMessage()
        }
      })
      throw error
    }
    for (var i = 0; i < dsklst.length; i++) {
      if (!dsklst[i].system) {
        disks.push({'desc': dsklst[i].description, 'mp': dsklst[i].mountpoints[0].path})
        usbDriveLst.push({'text': `<span class='icon-usb'></span> ${dsklst[i].mountpoints[0].path} ${dsklst[i].description.replace(' USB Device', '')}`, 'value': dsklst[i].mountpoints[0].path})
      }
    }
    var usb = disks
    if (usb.length < 1) {
      unzipSwapfile('copy', function () { noUsbDrive() })
    } else if (usb.length > 1) {
      var lst = `<h2><b>${usb.length} USB drives Found:</b></h2>`
      var usbuttons = ''
      for (var j = 0; j < usb.length; j++) {
        lst += `<h4> ${usb[j].mp} ${usb[j].desc} `
        lst += `<button class="w3-round-large w3-btn w3-ripple w3-hover-green w3-medium" title='Open USB Drive ${usb[j].mp}' onclick="shell.showItemInFolder('${usb[j].mp}')"></span><span class="icon-usb2"></span> Open Drive ${usb[j].mp}</button></h4>`
      }
      lst += `<h5><b>Choose a USB drive to copy files onto:</b></h5><small>(For best results, erase USB drive prior to copying)</small>`
      lst += usbuttons
      bootbox.prompt({
        title: lst,
        inputType: 'select',
        inputOptions: usbDriveLst,
        buttons: {
          confirm: {
            label: "<span class='icon-usb'></span> Copy to USB Drive"
          },
          cancel: {
            label: "<span class='icon-x'></span> Not Yet"
          }
        },
        callback: function (result) {
          if (!result) {
            unzipSwapfile()
          } else {
            copyToUSB(result)
          }
        }
      })
    } else if (usb.length === 1) {
      lst = '<h2><b>USB drive Found: </b></h2><br>'
      for (var k = 0; k < usb.length; k++) {
        lst += `${usb[k].mp} ${usb[k].desc} <br>`
      }
      lst += `<b>Do you want to copy files to USB drive ${usb[0].mp}?</b><br><small>(For best results, erase USB drive prior to copying)</small>`
      lst += `<button class="w3-round-xlarge w3-grey w3-btn w3-ripple w3-hover-blue w3-large w3-display-bottomleft" style="margin-bottom: -50px;margin-left: 10px;" title='Open USB Drive' onclick="shell.showItemInFolder('${usb[0].mp}')"></span><span class="icon-usb3"></span> Open USB Drive</button>`
      bootbox.confirm({
        title: `Copy files to USB drive?`,
        message: lst,
        buttons: {
          confirm: {
            label: "<span class='icon-usb'></span> Copy to USB"
          },
          cancel: {
            label: "<span class='icon-x'></span> Not Yet"
          }
        },
        callback: function (result) {
          if (!result) {
            unzipSwapfile()
          } else {
            copyToUSB(usb[0].mp)
          }
        }
      })
      return usb
    }
  })
}
function noUsbDrive () {
  bootbox.hideAll()
  bootbox.alert({
    title: `<h2>Compilation Finished!</h2>`,
    message: `No available USB drives found. Copy the entire contents of ${tmpdir} onto a blank, FAT32 formatted usb flash drive. <button href='' class='w3-round w3-black w3-btn w3-ripple nousbbutton' title='Copy These Files To A Blank USB Drive' onclick='openCopyFolder()'>Open '_copy_to_usb' Folder</button>`,
    callback: function () { finishedMessage() }
  })
}
function copyToUSB (mp) {
  var copyingUSB = bootbox.dialog({
    message: `<div class='w3-center'><h3>Copying to USB Drive ${mp}...  Please Wait</h3><br><div id='userLogView' style='text-align:center;' ></div><br><img class='loader' src='./files/load-0.gif' alt='...' /></div>`,
    closeButton: false
  })
  try {
    copydir(tmpdir, mp, function (err) {
      if (err) {
        showNotification('Error Copying Files to USB', 'Unable to copy files to USB drive', 13)
        bootbox.alert(err + 'Unable to copy files to USB drive')
        console.log(err + 'Unable to copy files to USB drive')
      } else {
        copyingUSB.hide()
        unzipSwapfile(mp)
      }
    })
  } catch (error) {
    bootbox.hideAll()
    bootbox.alert(error + 'Copying to USB error')
  }
}
function usbCopyComplete () {

}
var strtOver = '<button class="w3-round-xlarge w3-btn w3-ripple w3-large w3-hover-white .w3-border-black" onclick="location.reload()"><span class="icon-space-shuttle"></span> Start Over</button>'
var viewLog = `<button class="w3-round-xlarge w3-indigo w3-btn w3-ripple w3-hover-cyan w3-large .w3-border-black" title='Compile Log' onclick="$('#opn-mzd-log').click()"><span class='icon-star-full'></span> View AIO Compile Log</button>`
var cp2usb = '<button class="w3-round-xlarge w3-teal w3-btn w3-ripple w3-hover-pink w3-large .w3-border-black" title="Copy These Files To A Blank USB Drive" onclick="openCopyFolder()"><span class="icon-copy2"></span> Open \'_copy_to_usb\' Folder</button>'
var closeApp = '<button class="w3-round-xlarge w3-red w3-btn w3-ripple w3-hover-lime w3-large .w3-border-black" title="Close The App" onclick="window.close()"><span class="icon-exit"></span> Exit</button>'
var openUSB = ''
function finishedMessage (mp) {
  // Finished message
  if (mp) {
    openUSB = `<h3><button class="w3-round-xlarge w3-amber w3-btn w3-ripple w3-hover-blue w3-large" title='Open USB Drive' onclick="shell.showItemInFolder('${mp}')"></span><span class="icon-usb3"></span> Open USB Drive</button></h3>`
  }
  bootbox.hideAll()
  if (errFlag) {
    bootbox.alert({
      message: '<div class="errMessage w3-center"><span class="w3-closebtn" onclick="location.reload()">&times;</span><h2>An error has occured, DO NOT use this compilation. Try Again.</h2><br /><h3>' + strtOver + '</h3><br /><h3>' + viewLog + '</h3></div>'
    })
    // deleteFolderRecursive(tmpdir)
  } else {
    /* document.getElementById('mzd-title').innerHTML = "Success!" + strtOver + "<br>" + viewLog + cp2usb */
    setTimeout(function () {
      bootbox.dialog({
        message: '<span class="w3-closebtn" onclick="postInstallTitle()">&times;</span><div class="w3-center w3-container w3-blue-grey" style="line-height:1.5;"><h1><span class="icon-bolt3"></span> Success! <span class="icon-magic-wand"></span></h1><h3>' + strtOver + '</h3><h3>' + viewLog + '</h3><h3>' + openUSB + '</h3><h3>' + cp2usb + '</h3><h3>' + closeApp + '</h3></div>',
        closeButton: false
      })
    }, 100)
  }
}
function postInstallTitle () {
  bootbox.hideAll()
  $('.twkfltr').hide()
  document.getElementById(`mzd-title`).innerHTML = `${viewLog}${document.getElementById(`mzd-title`).innerHTML}${strtOver}`
}
function cleanUpTempFolders () {
  fs.writeFileSync(logFileName + '.htm','MZD_LOG.md')
  deleteFolderRecursive('..\\_copy_to_usb\\')
  deleteFolderRecursive('..\\tmp\\')
  // deleteFolderRecursive('..\\')
}
