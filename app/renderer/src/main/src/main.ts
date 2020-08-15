import Vue from "vue";
import App from "./App.vue";
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import Vuex from 'vuex';
Vue.use(Vuex);
import store from './store/index.js';
Vue.use(ViewUI);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store
}).$mount("#app");
