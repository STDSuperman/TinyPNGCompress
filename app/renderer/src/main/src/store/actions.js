import * as mutations from './mutations';
import Bmob from "hydrogen-js-sdk";
import { SafeKey, SecretKey } from '../utils/sensitive';
Bmob.initialize(SecretKey, SafeKey);
const { ipcRenderer } = window.require('electron');
const TinyAPIKey = Bmob.Query('TinyAPIKey');

export const GET_USER_DATA_PATH = 'GET_USER_DATA_PATH';
export const COMPRESS_IMAGE = 'COMPRESS_IMAGE';
export const SAVE_APIKEY_BMOB = 'SAVE_APIKEY_BMOB'
export const GET_API_KEY_LIST = 'GET_API_KEY_LIST';
export const DELETE_ERROR_ACCOUNT = 'DELETE_ERROR_ACCOUNT';

export default {
    // 异步获取用户储存数据的位置
    [GET_USER_DATA_PATH]({commit}) {
        ipcRenderer.on('getUserDataPath', (event, userDataPath) => {
            commit(mutations.SET_USER_DATA_PATH, userDataPath);
        })
        ipcRenderer.send('getUserDataPath');
    },
    // 将用户的API_KEY保存进行共享
    [SAVE_APIKEY_BMOB](context, apiKey) {
        TinyAPIKey.set('apiKey', apiKey);
        TinyAPIKey.save();
    },
    [GET_API_KEY_LIST]({state, commit}) {
        TinyAPIKey.find().then(res => {
            if (res) {
                const apiKeyList = res.filter(item => item && item.apiKey !== state.apiKey);
                commit(mutations.SET_API_KEY_LIST, apiKeyList);
            }
        })
    },
    [DELETE_ERROR_ACCOUNT]({state}, apiKey) {
        const apiInfo = state.apiKeyList.find(item => item.apiKey === apiKey) || {};
        apiInfo.objectId && TinyAPIKey.destroy(apiInfo.objectId);
    }
}