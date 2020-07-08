const { app, ipcMain } = require('electron');

function initIpcMessage() {
    ipcMain.on('getUserDataPath', (event) => {
        const userDataPath = app.getPath("userData");
        event.returnValue = userDataPath;
    })
}

module.exports = {
    initIpcMessage
}