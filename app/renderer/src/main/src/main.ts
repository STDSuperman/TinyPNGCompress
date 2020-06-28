import Vue from "vue";
import App from "./App.vue";
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import Vuex from 'vuex';
import StoreData from './store/index.js';

Vue.use(Vuex);
Vue.use(ViewUI);

const store = new Vuex.Store(StoreData)

Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
  store
}).$mount("#app");
