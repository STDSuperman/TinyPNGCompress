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
    userConfig: {}
}
export default {
    state,
    getters: generatorGetters(state),
    mutations,
    actions
}