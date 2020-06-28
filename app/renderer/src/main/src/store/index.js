import mutations from './mutations';
import actions from './actions'
import { generatorGetters } from '../utils/index';

const state = {
    cacheDir: './cacheDir',
    replaceStatus: true,
    apiKey: 'Tcdl0JRbM7tsfplqJBb9Z69Dvdk1dSHP'
}
export default {
    state,
    getters: generatorGetters(state),
    mutations,
    actions
}