import Vue from 'vue';
import store from './index';
import { SAVE_APIKEY_BMOB } from './actions';
const CacheStore = window.require('electron-store');
const cacheStore = new CacheStore();
const path = window.require('path');
const { ipcRenderer } = window.require('electron');

export const SET_CACHE_FOLDER = 'SET_CACHE_FOLDER';
export const SET_REPLACE_STATUS = 'SET_REPLACE_STATUS';
export const SET_API_KEY = 'SET_API_KEY';
export const ADD_FILE_INFO = 'ADD_FILE_INFO';
export const CHANGE_FILE_INFO = 'CHANGE_FILE_INFO';
export const SET_CACHE_STATUS = 'SET_CACHE_STATUS';
export const LOAD_USER_CONFIG = 'LOAD_USER_CONFIG';
export const SET_USER_DATA_PATH = 'SET_USER_DATA_PATH';
export const SET_API_KEY_LIST = 'SET_API_KEY_LIST';

export default {
    // 加载用户数据
    [LOAD_USER_CONFIG](state) {
        const userConfig = cacheStore.get("userConfig") || {};
        state.userConfig = userConfig;
        state.userDataPath = ipcRenderer.sendSync('getUserDataPath');
        state.cacheDir = userConfig.cacheDir;
        if (!state.cacheDir) {
            const folder = path.resolve(state.userDataPath, 'TinyPNGCacheDir')
            state.cacheDir = folder;
            cacheStore.set('userConfig.cacheDir', folder);
        }
        state.replaceStatus = userConfig.replaceStatus === undefined ? true : userConfig.replaceStatus;
        state.cacheStatus = userConfig.cacheStatus === undefined ? true : userConfig.cacheStatus;
        state.apiKey = userConfig.apiKey;
    },
    // 设置用户数据路径
    [SET_USER_DATA_PATH](state, userDataPath) {
        state.userDataPath = userDataPath;
    },
    // 设置缓存路径
    [SET_CACHE_FOLDER](state, cacheDir) {
        state.cacheDir = cacheDir;
        const folder = path.resolve(state.userDataPath, cacheDir);
        cacheStore.set('userConfig.cacheDir', folder);
    },
    // 设置图片替换状态
    [SET_REPLACE_STATUS](state, replaceStatus) {
        state.replaceStatus = replaceStatus;
        cacheStore.set('userConfig.replaceStatus', replaceStatus);
    },
    // 设置图片是否已缓存
    [SET_CACHE_STATUS](state, cacheStatus) {
        state.cacheStatus = cacheStatus;
        cacheStore.set('userConfig.cacheStatus', cacheStatus);
    },
    // 设置压缩API_KEY
    [SET_API_KEY](state, apiKey) {
        state.apiKey = apiKey;
        cacheStore.set('userConfig.apiKey', apiKey);
        store.dispatch(SAVE_APIKEY_BMOB, apiKey);
    },
    // 将获取的共享apiKey保存
    [SET_API_KEY_LIST](state, apiKeyList) {
        state.apiKeyList = apiKeyList;
    },
    [ADD_FILE_INFO](state, { fileInfo, cb }) {
        cb(state.fileList.length);
        state.fileList.push(fileInfo);
    },
    // 修改图片列表相关数据
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
    }
}