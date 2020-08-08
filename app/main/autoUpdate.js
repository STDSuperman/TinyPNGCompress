const log = require('electron-log')
const { autoUpdater } = require('electron-updater')

autoUpdater.logger = log
// autoUpdater.autoDownload = false
autoUpdater.logger.transports.file.level = 'info'

let isFirstCheckedUpdate = true

log.info('App starting...')

function sendStatusToWindow(text) {
  log.info(text)
}


// -------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
// -------------------------------------------------------------------
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (ev, info) => {
// })
// autoUpdater.on('update-not-available', (ev, info) => {
// })
// autoUpdater.on('error', (ev, err) => {
// })
// autoUpdater.on('download-progress', (ev, progressObj) => {
// })
// autoUpdater.on('update-downloaded', (ev, info) => {
//   // Wait 5 seconds, then quit and install
//   // In your application, you don't need to wait 5 seconds.
//   // You could call autoUpdater.quitAndInstall(); immediately
//   // setTimeout(function() {
//   // autoUpdater.quitAndInstall()
//   // }, 5000)

// })

let waitEvent = []
const handleSendEvent = action => {
    waitEvent.push(action)
}

module.exports = () => {
  if (!isFirstCheckedUpdate) {
    if (waitEvent.length) {
      waitEvent.forEach((event, index) => {
        setTimeout(() => { // 延迟发送事件，过早发送可能渲染进程还没启动完成
          
        }, 2000 * (index + 1))
      })
      waitEvent = []
    }
    return
  }
  isFirstCheckedUpdate = false

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
  })
  autoUpdater.on('update-available', info => {
    sendStatusToWindow('Update available.')
    handleSendEvent({ type: "update_available", info })
  })
  autoUpdater.on('update-not-available', info => {
    sendStatusToWindow('Update not available.')
    handleSendEvent({ type: "update_not_available", info })
  })
  autoUpdater.on('error', err => {
    sendStatusToWindow('Error in auto-updater.')
    handleSendEvent({ type: "update_error", info: err.message })
  })
  autoUpdater.on('download-progress', progressObj => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    sendStatusToWindow(log_message)
    handleSendEvent({ type: "update_progress", info: progressObj })
  })
  autoUpdater.on('update-downloaded', info => {
    sendStatusToWindow('Update downloaded.')
    handleSendEvent({ type: "update_downloaded", info })
  })
  autoUpdater.checkForUpdates()
}