const { app } = require('electron');
const getLock = app.requestSingleInstanceLock();
const { show: showMainWindow, create: createMainWindow, close: closeMainWindow, registerShortcut } = require('./windows/main');

if (!getLock) {
	app.quit();
} else {
	app.on('second-instance', () => {
		showMainWindow();
	});

	app.on('ready', () => {
        createMainWindow();
		// registerShortcut();
		// require('./trayAndMenu/index');
	});

	app.on('activate', () => {
		showMainWindow();
	});

	app.on('before-quit', () => {
		closeMainWindow();
	});
}
