// Boilerplate code for notification management

// Display a notification message when a new version is ready for install
// Customize the code to match your HTML structure
ipc.on('update-downloaded', (event) => {
  showNotification('Update','An updated application package will be installed on next restart, <a id="restart" href="#">click here to update now</a>.',30)
  document.getElementById('restart').addEventListener('click', (e) => {
    e.preventDefault()
    //event.sender.send('restart')
  })
})
ipc.on('dl-progress', (event, megaBytes, fileName, totalSize) => {
  if($('#progress').length) {
    document.getElementById('progress').innerHTML = '<div class="w3-progress-container"><div id="progBar" class="w3-progressbar w3-green" style="width:'+ parseInt((megaBytes/totalSize)*100) +'%"><span class="w3-center w3-text-black color-progress">' + megaBytes.toFixed(2) + 'MB | ' + parseInt((megaBytes/totalSize)*100) + '%</span></div>'
  } else {
    showNotification('Downloading',`<div id="dl-notif"><h5>Downloading ${fileName}: </h5><span id="progress"></span></div>`, 0)
  }
})
ipc.on('notif-progress', (event, message) => {
  if($('#progress').length) {
    document.getElementById('dl-notif').innerHTML = message
    $('#dl-notif').hide(1000)
  } else {
    showNotification('Download',`<div id="dl-notif">${message}</div>`, 10)
  }
})
ipc.on('notif-bg-saved', (event, message) => {
  showNotification('Background',`<div id="dl-notif">${message}</div>`, 10)
})
function showNotification (title, message, fadeouttime) {
  $('#notices').show()
  var notice = document.createElement('div')
  notice.setAttribute('class', 'notice')
  notice.innerHTML = `<span class="w3-closebtn w3-display-topright" onclick="$(this).parent().hide((${fadeouttime}+1)*1000)">&times;</span><div class="w3-hover-text-indigo">${message}</div>`
  if(fadeouttime!==0) {
    setTimeout(function () {
      $(notice).fadeOut(fadeouttime*1000)
    }, 10000)
  }
  //document.body.appendChild(notice)
  var nohtml = message ? String(message).replace(/<[^>]+>/gm, '') : ''
  document.getElementById('notices').appendChild(notice)
  let myNotification = new Notification(title, {
    body: nohtml,
    icon: 'favicon.ico',
    silent: true
  })
  myNotification.onclick = () => {
    remote.BrowserWindow.getChildWindows().close()
    remote.BrowserWindow.fromId(1).focus()
    console.log('Download Notification clicked: ' + myNotification.timestamp)
  }
}
