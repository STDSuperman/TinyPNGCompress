import Vue from 'vue';
const Store = window.require('electron-store');
const store = new Store();

export const SET_CACHE_FOLDER = 'SET_CACHE_FOLDER';
export const SET_REPLACE_STATUS = 'SET_REPLACE_STATUS';
export const SET_API_KEY = 'SET_API_KEY';
export const ADD_FILE_INFO = 'ADD_FILE_INFO';
export const CHANGE_FILE_INFO = 'CHANGE_FILE_INFO';
export const SET_CACHE_STATUS = 'SET_CACHE_STATUS';
export const LOAD_USER_CONFIG = 'LOAD_USER_CONFIG';

export default {
    [LOAD_USER_CONFIG](state) {
        const userConfig = store.get("userConfig") || {};
        state.userConfig = userConfig;
        state.cacheDir = userConfig.cacheDir || './TinyPNGCacheDir';
        state.replaceStatus = userConfig.replaceStatus === undefined ? true : userConfig.replaceStatus;
        state.cacheStatus = userConfig.cacheStatus === undefined ? true : userConfig.cacheStatus;
        state.apiKey = userConfig.apiKey || 'Tcdl0JRbM7tsfplqJBb9Z69Dvdk1dSHP';
    },
    [SET_CACHE_FOLDER](state, cacheDir) {
        state.cacheDir = cacheDir;
        store.set('userConfig.cacheDir', cacheDir);
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
    }
}