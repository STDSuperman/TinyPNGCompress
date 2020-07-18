## TinyPNGCompress

![preview](https://s1.ax1x.com/2020/07/18/UcxnpR.png)

一个采用`TinyPNG`压缩的客户端App，支持平台：`Mac`、`Win`、`Linux`。`TinyPNG`能够提供“几乎无损”的压缩品质，也是目前大部分图片压缩推崇的选择。

本项目由`Electron`、`Vue`、`TypeScript`、`Node`作为主要开发框架和语言。

### 背景
对于许多用户来说，压缩图片的步骤或许过于繁琐，需要找到网站并压缩图片然后进行下载解压替换一系列操作，这对于用户需要进行大量图片压缩的诉求是不太友好的。`TinyPNGCompress`旨在解放双手，提高效率，让用户能够只要简单的拖拽需要压缩的图片甚至是一个文件夹，就能完成全部压缩任务，并且支持一键重试功能。

### 支持功能
- [x] 点击选择图片进行压缩
- [x] 拖拽单张或多张图片进行压缩
- [x] 拖拽文件夹进行压缩（将对文件夹下所有符合条件的图片进行压缩）
- [x] 压缩成功自动替换原图（默认开启）
- [x] 原图以及压缩图缓存（默认开启）
- [x] 对压缩过的图片不进行二次压缩，确保图片品质（默认开启）
- [x] 失败图片一键重压
- [ ] 还原原图

### 使用
1. 到[`TinyPNG`](https://tinypng.com/developers)注册`API Key`，或者打开`TinyPNGCompress`进行注册。
2. 复制`API Key`并粘贴到App相应位置。
3. 拖拽图片或文件夹到窗口指定位置。

### 协议
Developed by [@STDSuperman](https://github.com/STDSuperman) and available under the [MIT](http://opensource.org/licenses/MIT) license.
