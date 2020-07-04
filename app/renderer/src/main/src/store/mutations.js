export const SET_CACHE_FOLDER = 'SET_CACHE_FOLDER';
export const SET_REPLACE_STATUS = 'SET_REPLACE_STATUS';
export const SET_API_KEY = 'SET_API_KEY';
export const ADD_FILE_INFO = 'ADD_FILE_INFO';
export const CHANGE_FILE_INFO = 'CHANGE_FILE_INFO';

export default {
    [SET_CACHE_FOLDER](state, cacheDir) {
        state.cacheDir = cacheDir;
    },
    [SET_REPLACE_STATUS](state, replaceStatus) {
        state.replaceStatus = replaceStatus;
    },
    [SET_API_KEY](state, apiKey) {
        state.apiKey = apiKey;
    },
    [ADD_FILE_INFO](state, { fileInfo, cb }) {
        cb(state.fileList.length);
        state.fileList.push(fileInfo);
    },
    [CHANGE_FILE_INFO](state, { reduceSize, complete, fileIndex }) {
        const target = state.fileList[fileIndex];
        target.reduceSize = reduceSize;
        target.complete = complete;
        state.fileList.splice(fileIndex, 1, target);
    }
}