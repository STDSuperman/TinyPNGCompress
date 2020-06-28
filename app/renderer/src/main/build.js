// 将打包完的目录移动到指定位置
const fs = require("fs-extra");
const desk = '../../pages/main';
fs.removeSync(desk);
fs.moveSync('./dist', desk);