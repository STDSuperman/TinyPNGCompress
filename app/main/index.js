const { app } = require('electron');
const getLock = app.requestSingleInstanceLock();
const {show: showMainWindow, create: createMainWindow, close: closeMainWindow, initDragEvent} = require('./windows/main')

if (!getLock) {
    app.quit()
} else {
    app.on('second-instance', () => {
        showMainWindow();
    })

    app.on("ready", () => {
        createMainWindow()
        // initDragEvent();
    })

    app.on("activate", () => {
        showMainWindow()
    })

    app.on("before-quit", () => {
        closeMainWindow();
    })
}