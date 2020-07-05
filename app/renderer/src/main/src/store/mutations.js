export const SET_CACHE_FOLDER = 'SET_CACHE_FOLDER';
export const SET_REPLACE_STATUS = 'SET_REPLACE_STATUS';
export const SET_API_KEY = 'SET_API_KEY';
export const ADD_FILE_INFO = 'ADD_FILE_INFO';
export const CHANGE_FILE_INFO = 'CHANGE_FILE_INFO';
export const SET_CACHE_STATUS = 'SET_CACHE_STATUS';

export default {
    [SET_CACHE_FOLDER](state, cacheDir) {
        state.cacheDir = cacheDir;
    },
    [SET_REPLACE_STATUS](state, replaceStatus) {
        state.replaceStatus = replaceStatus;
    },
    [SET_CACHE_STATUS](state, cacheStatus) {
        state.cacheStatus = cacheStatus;
    },
    [SET_API_KEY](state, apiKey) {
        state.apiKey = apiKey;
    },
    [ADD_FILE_INFO](state, { fileInfo, cb }) {
        cb(state.fileList.length);
        state.fileList.push(fileInfo);
    },
    [CHANGE_FILE_INFO](state, payload) {
        let currentFilePos = payload.currentFilePos;
        const target = state.fileList[currentFilePos];
        if (!target) { return }
        for (let i in payload) {
            if (Object.prototype.hasOwnProperty.call(payload, i)) {
                target[i] = payload[i];
            }
        }
        state.fileList.splice(currentFilePos, 1, target);
    }
}