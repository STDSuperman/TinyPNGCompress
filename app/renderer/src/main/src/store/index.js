import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions'
import { generatorGetters } from '../utils/index';

const state = {
    cacheDir: '',
    replaceStatus: true,
    apiKey: '',
    fileList: [],
    failMap: {},
    cacheStatus: true,
    userConfig: {},
    userDataPath: '',
    apiKeyList: []
}
const config = {
    state,
    getters: generatorGetters(state),
    mutations,
    actions
}

const store = new Vuex.Store(config);
export default store;