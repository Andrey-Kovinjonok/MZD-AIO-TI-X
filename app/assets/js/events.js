/* Automatically Open Background Dialog, Color DL and Speedcam DL On First Checkbox Click Only */
const selectBgDir = $('.menuCheck.bg input')
const selectColorsDL = $('.menuCheck.colors input')
/*selectBgDir.on('click', function () {
if(selectBgDir.hasClass('ng-pristine')) {
ipc.send('open-file-bg')
}
})*/
$(function () {
  /* Attempt to download color scheme files if they don't exist */
  selectColorsDL.on('click', function () {
    if(selectColorsDL.hasClass('ng-pristine') && !hasColorFiles) {
      bootbox.confirm({
        title: "The Color Scheme Tweak Requires Additional Files.",
        message: "Download Color Scheme Files?",
        buttons: {
          confirm: {
            label: 'Download'
          },
          cancel: {
            label: 'Cancel'
          }
        },
        callback: function (result) {
          if(result) {
            ipc.send('download-aio-files','color-schemes.zip')
          } else {
            angular.element(selectColorsDL).scope().checked = false
            window.alert("You Must Download Color Files To Apply Color Scheme Tweak")
          }
        }
      })
    }
  })
  /* Attempt to download speedcam patch files if they don't exist */
  angular.element($('.install-check input#IN23')).on('click', function () {
    if($('.install-check input#IN23, .uninstall-check input#UN23').hasClass('ng-pristine') && !hasSpeedCamFiles) {
      bootbox.confirm({
        title: "The Color Scheme Tweak Requires Additional Files.",
        message: "Download Speedcam Patch Files?",
        buttons: {
          confirm: {
            label: 'Download'
          },
          cancel: {
            label: 'Cancel'
          }
        },
        callback: function (result) {
          if(result) {
            ipc.send('download-aio-files','speedcam-patch.zip')
          } else {
            angular.element($('.install-check input#IN23')).scope().checked = false
            window.alert("You Must Download Speedcam Patch Files To Apply Speedcam Tweak")
          }
        }
      })
    }
  })
})
ipc.on('already-downloaded', function (event, filename) {
  bootbox.confirm({
    message: "You have already downloaded these files! Would you like to redownload and overwrite files?",
    buttons: {
      cancel: {
        label: 'No - Use The Files I already Have',
        className: 'btn-success'
      },
      confirm: {
        label: 'Yes - Redownload Files',
        className: 'btn-danger'
      }
    },
    callback: function (result) {
      if(result) {
        ipc.send('resume-dl')
      } else {
        ipc.send('cancel-dl')
      }
    }
  })
})
ipc.on('selected-joined-bg', function (event, filepath) {
  var outFile = 'background/background.png'
  document.getElementById('selected-file').innerHTML = `Your Selected Background Image: ${filepath}`
  clipboard.writeImage(filepath)
  // save it as a png file
  writeFileSync(`${outFile}`, clipboard.readImage().toPng())
  let bgNotification = new Notification('Background', {
    body: `Your Infotainment Background Will Be Changed To: ${filepath}`,
    icon: 'favicon.ico',
    silent: true
  })
  bgNotification.onclick = () => {
  }
  ipc.emit('set-bg')
})
ipc.on('selected-bg', function (event, filepath) {
  var outFile = 'background/background.png'
  document.getElementById('selected-file').innerHTML = `Your Selected Background Image: ${filepath}`
  var warnMsg = "{{mainOps.retain.toolTip}}"
  electronImageResize({
    url: `${filepath}`,
    width: 800,
    height: 480,
    delay: 1500
  }).then(img => {
    // save it as a png file
    writeFileSync(`${outFile}`, img.toPng())
    let bgNotification = new Notification('Background', {
      body: `Your Infotainment Background Will Be Changed To: ${filepath}`,
      icon: 'favicon.ico',
      silent: true
    })
    bgNotification.onclick = () => {
    }
    ipc.emit('set-bg')
  })
  // use dot-notation to access nested properties
  //settings.set('foo.bar', true)
  settings.set('background', `${filepath}`)
  //settings.delete('unicorn')
  console.log(settings.get('background'))
})
ipc.on('set-bg', () => {
  var bgNoCache = "../../background/background.png?" + new Date().getTime()
  document.getElementById('imgframe').innerHTML = `<img src='${bgNoCache}' />`
  document.getElementById('imgmodal').innerHTML = `<img src='${bgNoCache}' />`
})
ipc.on('selected-album-art', function (event, filepath) {
  var outFile = `background/no_artwork_icon.png`
  $('.blnk-albm-art').hide()
  $('#blnk-albm-img').show()
  settings.set('blank-album-art', `${filepath}`)
  electronImageResize({
    url: `${filepath}`,
    width: 146,
    height: 146,
    delay: 1500
  }).then(img => {
    // save it as a png file
    writeFileSync(`${outFile}`, img.toPng())
    setTimeout(function(){
      var bgNoCache = "../../background/no_artwork_icon.png?" + new Date().getTime()
      document.getElementById('blnk-albm-img').innerHTML = `<img src="${bgNoCache}">`
    }, 2000)
  })
})
ipc.on('close-featherlight', function (event) {
  $.featherlight.current().close();
})
/*
$(function(){
/* Drag & Drop Functionality * /
const holder = document.getElementById('dropimg')
//const qholder = $('#dropimg > .w3-center')
var backgrounds = []
holder.ondragover = (e) => {
holder.innerHTML = '<h1 style="color:red">DROP!</h1>' + e.dataTransfer.files.path
return false
}
holder.ondragleave = holder.ondragend = (e) => {
for (let f of e.dataTransfer.files) {
console.log('File(s) you dragged here: ', f.path)
backgrounds.push(f.path)
}
console.log(backgrounds)
return false
}
holder.ondrop = (e) => {
e.preventDefault()
for (let f of e.dataTransfer.files) {
console.log('File(s) you dragged here: ', f.path)
backgrounds.push(f.path)
}
console.log(backgrounds)
return false
}
})

*/
