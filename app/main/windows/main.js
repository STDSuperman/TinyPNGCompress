// 主窗口
const { BrowserWindow, ipcMain } = require('electron');
const { initIpcMessage } = require('./message');
const path = require('path')
const isDev = require("electron-is-dev")

let win;
let willClose = false; // 用于实现用户点击窗口关闭按钮进行隐藏或右键图标进行真正的退出
function create() {
    win = new BrowserWindow({
        height: 660,
        width: 520,
        webPreferences: {
            nodeIntegration: true
        }
    })
    // 打开devtools
    win.webContents.openDevTools();
    // 处理渲染进程与主线程通信
    initIpcMessage();

    win.on('close', (e) => {
        if (willClose) {
            win = null;
        } else {
            e.preventDefault();
            win.hide();
        }
    })

    if (isDev) {
        win.loadURL('http://localhost:8080/')
    } else {
        win.loadFile(path.resolve(__dirname, '../../renderer/pages/main/index.html'))
    }
}

function close() {
    willClose = true;
    win.close()
}

function show() {
    win.show();
}

function initDragEvent() {
    ipcMain.on('ondragstart', (e, filepath) => {
        e.sender.startDrag({file: filepath,icon: './图片.png'})
    })
}

module.exports = {
    create,
    show,
    close,
    initDragEvent
}