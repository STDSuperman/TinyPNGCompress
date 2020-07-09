const { app, Tray, Menu } = require('electron');
const path = require('path');
const { show: openMainWindow } = require('../windows/main');
const {create: createAboutWindow} = require('../windows/about')

function setTray() {
    const tray = new Tray(path.resolve(__dirname, './icon_darwin.png'));
    tray.on('click', () => {
        openMainWindow();
    })

    tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
            {label: '显示', click: openMainWindow},
            {label: '退出', click: app.quit()}
        ])
        tray.popUpContextMenu(contextMenu);
    })
}

function setAppMenu() {
    let appMenu = Menu.buildFromTemplate([
        {
            label: app.name,
            submenu: [
                {label: 'About', click: createAboutWindow},
                {type: 'separator'},
                {role: 'services'},
                {type: 'separator'},
                {role: 'hide'},
                {role: "hideOthers"},
                {role: "unhide"},
                {type: 'separator'},
                {role: 'quit'}
            ]
        },
        {role: "fileMenu"},
        {role: "windowMenu"},
        {role: "editMenu"}
    ])
    app.applicationMenu = appMenu;
}

app.whenReady().then(() => {
    setTray();
    setAppMenu()
})