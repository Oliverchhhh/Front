// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Antd from 'ant-design-vue';
// import dataV from '@jiaminghi/data-view';
import 'ant-design-vue/dist/antd.css';
import App from './App'
import router from './router'
import '../src/assets/css/global.css'
import axios from 'axios';
import './assets/css/font.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { FormModel } from 'ant-design-vue';
Vue.use(FormModel);
// save html to pdf
import htmlToPdf from './util/htmlToPdf'
Vue.use(htmlToPdf)

Vue.prototype.$axios = axios;
axios.defaults.baseURL = "/"
Vue.config.productionTip = false
Vue.use(Antd);
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

//弹出框禁止滑动
Vue.prototype.noScroll = function () {
  document.body.style.overflow="hidden";
  document.body.style.height="100%";// 禁止页面滑动
}
 
//弹出框可以滑动
Vue.prototype.canScroll = function () {
  document.body.style.overflow="visible";
  document.body.style.height="auto";
}
import {getCookie} from './assets/js/cookie.js'
axios.interceptors.request.use(
	config => {
		let username = getCookie("username");
		if(username){
			config.headers['user'] = username
		}
		return config
	},
	err => {
		return Promise.reject(err);
	});

