const { ipcRenderer } = window.require('electron');
import * as mutations from './mutations';

export const GET_USER_DATA_PATH = 'GET_USER_DATA_PATH';

export default {
    // 异步获取用户储存数据的位置
    [GET_USER_DATA_PATH]({commit}) {
        ipcRenderer.on('getUserDataPath', (event, userDataPath) => {
            commit(mutations.SET_USER_DATA_PATH, userDataPath);
        })
        ipcRenderer.send('getUserDataPath');
    }
}