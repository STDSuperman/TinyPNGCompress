const { app } = require('electron');
const getLock = app.requestSingleInstanceLock();
const autoUpdate = require('./autoUpdate');
const { show: showMainWindow, create: createMainWindow, close: closeMainWindow, registerShortcut } = require('./windows/main');
const isDev = require("electron-is-dev")

if (!getLock) {
	app.quit();
} else {
	app.on('second-instance', () => {
		showMainWindow();
	});

	app.on('ready', () => {
		createMainWindow();
		!isDev && autoUpdate()
        require('./trayAndMenu/index');
        registerShortcut();
	});

	app.on('activate', () => {
		showMainWindow();
	});

	app.on('before-quit', () => {
		closeMainWindow();
	});
}
