import Vue from 'vue';
const Store = window.require('electron-store');
const store = new Store();
const path = window.require('path');
const { ipcRenderer } = window.require('electron');
import { dirExist, caculateFileHash } from '../utils/index.js';
const pathModule = window.require('path');
const fs = window.require('fs');

const init = (state) => {
    if (!state.cacheDir) return;
    // 判断缓存目录是否存在
    if (!dirExist(state.cacheDir)) {
        fs.mkdirSync(state.cacheDir);
    }
    state.cacheCompressedDir = pathModule.resolve(state.cacheDir, 'compressed-picture'); // 创建压缩完的文件缓存目录
    state.cacheOriginaldDir = pathModule.resolve(state.cacheDir, 'original-picture'); // 创建压缩文件原图的文件目录
    !dirExist(state.cacheCompressedDir) && fs.mkdirSync(state.cacheCompressedDir);
    !dirExist(state.cacheOriginaldDir) && fs.mkdirSync(state.cacheOriginaldDir);
}

export const SET_CACHE_FOLDER = 'SET_CACHE_FOLDER';
export const SET_REPLACE_STATUS = 'SET_REPLACE_STATUS';
export const SET_API_KEY = 'SET_API_KEY';
export const ADD_FILE_INFO = 'ADD_FILE_INFO';
export const CHANGE_FILE_INFO = 'CHANGE_FILE_INFO';
export const SET_CACHE_STATUS = 'SET_CACHE_STATUS';
export const LOAD_USER_CONFIG = 'LOAD_USER_CONFIG';
export const SET_USER_DATA_PATH = 'SET_USER_DATA_PATH';

export default {
    [LOAD_USER_CONFIG](state) {
        const userConfig = store.get("userConfig") || {};
        state.userConfig = userConfig;
        state.userDataPath = ipcRenderer.sendSync('getUserDataPath');
        state.cacheDir = userConfig.cacheDir;
        if (!state.cacheDir) {
            const folder = path.resolve(state.userDataPath, 'TinyPNGCacheDir')
            state.cacheDir = folder;
            store.set('userConfig.cacheDir', folder);
        }
        state.replaceStatus = userConfig.replaceStatus === undefined ? true : userConfig.replaceStatus;
        state.cacheStatus = userConfig.cacheStatus === undefined ? true : userConfig.cacheStatus;
        state.apiKey = userConfig.apiKey;
    },
    [SET_USER_DATA_PATH](state, userDataPath) {
        state.userDataPath = userDataPath;
    },
    [SET_CACHE_FOLDER](state, cacheDir) {
        state.cacheDir = cacheDir;
        const folder = path.resolve(state.userDataPath, cacheDir);
        store.set('userConfig.cacheDir', folder);
    },
    [SET_REPLACE_STATUS](state, replaceStatus) {
        state.replaceStatus = replaceStatus;
        store.set('userConfig.replaceStatus', replaceStatus);
    },
    [SET_CACHE_STATUS](state, cacheStatus) {
        state.cacheStatus = cacheStatus;
        store.set('userConfig.cacheStatus', cacheStatus);
    },
    [SET_API_KEY](state, apiKey) {
        state.apiKey = apiKey;
        store.set('userConfig.apiKey', apiKey);
    },
    [ADD_FILE_INFO](state, { fileInfo, cb }) {
        cb(state.fileList.length);
        state.fileList.push(fileInfo);
    },
    [CHANGE_FILE_INFO](state, payload) {
        let currentFilePos = payload.currentFilePos;
        const target = state.fileList[currentFilePos];
        if (!target) { return }
        if (payload.status === 2) {
            Vue.prototype.$set(state.failMap, currentFilePos, true)
        } else {
            state.failMap[currentFilePos] && (delete state.failMap[currentFilePos]);// 如果重试成功则从失败列表中删除
        }
        for (let i in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, i)) {
                target[i] = payload[i];
            }
        }
        state.fileList.splice(currentFilePos, 1, target);
    },
    // 拿到压缩结果进行一系列处理
	handleCompressed(state, { resultData, sourceData, path, fileInfo, currentFileInfo }) {
        console.log(Vue);
		const { name, ext } = fileInfo;
		if (state.cacheStatus) {
			const currentHash = caculateFileHash(resultData);
			let compressedPicPath, originalPicPath;
			const setCacheDirPath = () => {
				compressedPicPath = pathModule.resolve(state.cacheCompressedDir, currentHash + ext); // 压缩图缓存路径
				originalPicPath = pathModule.resolve(state.cacheOriginaldDir, name + '-tiny-' + currentHash + ext); // 原图缓存路径
			}
			setCacheDirPath();
			if (!dirExist(originalPicPath) || !dirExist(compressedPicPath)) {
				init(state);
				setCacheDirPath();
			}
			currentFileInfo.originalPicPath = originalPicPath;
			fs.writeFileSync(originalPicPath, sourceData); // 缓存原图
			fs.writeFileSync(compressedPicPath, resultData); // 缓存压缩图
		} else {
			currentFileInfo.originalPicPath = null; // 未开启缓存则置为空
		}
		if (this.replaceStatus) {
			fs.writeFileSync(path, resultData); // 替换目标图
		} else {
			fs.writeFileSync(path.replace(/\./g, '') + '-tiny-' + ext, resultData); // 在目标图位置放置图片
		}
		const proportion = Math.ceil(((sourceData.length - resultData.length) / sourceData.length) * 100);
		const reduceSize = sourceData.length - resultData.length;
		currentFileInfo.status = 1;
		currentFileInfo.reduceSize = reduceSize;
		currentFileInfo.message = `- ${reduceSize / 1000} k（${-proportion}%）`;
		currentFileInfo.sourceDataBuffer = resultData.toString('base64');
		currentFileInfo.isRestore = false;
		this.CHANGE_FILE_INFO(currentFileInfo);
		// this.$Message.success(`压缩${ base }成功，减少尺寸${ reduceSize }`);
	}
}