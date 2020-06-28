export const SET_CACHE_FOLDER = 'SET_CACHE_FOLDER';
export const SET_REPLACE_STATUS = 'SET_REPLACE_STATUS';
export const SET_API_KEY = 'SET_API_KEY';

export default {
    [SET_CACHE_FOLDER](state, cacheDir) {
        state.cacheDir = cacheDir;
    },
    [SET_REPLACE_STATUS](state, replaceStatus) {
        state.replaceStatus = replaceStatus;
    },
    [SET_API_KEY](state, apiKey) {
        state.apiKey = apiKey;
    }
}