import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueBus from "vue-bus";
import http from './utils/http'
// 挂载全局组件
import headerTop from "@/components/common/header"; //引入组件
// 第三方 calendar 的使用
import VCalendar from "v-calendar";
// swiper 插件的使用 ===============================================
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
// 验证控制权限的文件
import "@/permission.js";
import * as echarts from "echarts";
// 下面是高德地图的配置
import VueAMap from "vue-amap";
// 第三方lodash库的全局注册
import _ from "lodash";
// 下面是引入公共样式
import "./assets/index.css";
// 引入debounce函数 用于自定义指令的
import directive from "@/utils/directive";
// 下面是百度地图的相关配置
import BaiduMap from "vue-baidu-map";
// 引入elementUI弹窗【拖曳放大】的自定义指令
import elDragDialog from "./utils/directive/el-dragDialog";
// 引入decimal.js
import Decimal from "decimal.js";
// ============= 下面是自定义的JS方法引入
import globalFnAll from "@/utils/globalFnAll";
import pdf from 'vue-pdf'
import {config} from './config';
Vue.component('pdf', pdf)
Vue.use(VCalendar);
// 将配置对象挂载到 Vue 实例
Vue.mixin({
  data() {
    return {
      globalConfig: config
    };
  }
});

// 将Lodash绑定到Vue的原型，这样在组件中可以通过this._访问Lodash
Vue.prototype._ = _;
// 组件中通过this._.方法调用，例如调用防抖
// export default {
//   created() {
//     let debounced = this._.debounce(this.update, 250);
//     // 使用Lodash的函数
//   },
//   methods: {
//     update() {
//       // 处理函数逻辑
//     }
//   }
// };



// 全局挂载
Vue.use(VueAwesomeSwiper)

// ==============================================================

Vue.prototype.$echarts = echarts; //挂载到Vue实例上面


Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
	//申请地址 https://lbs.amap.com/ 选择web端jsAPI
	key: "7fea91a38c5e36bbf28a347ac8db143f",
	// securityJsCode: "562d262ac11fca404363bb6ffd83e23b",
	// 插件集合，用到什么插件就使用什么插件
	plugin: ["AMap.LineSearch", "AMap.Geocoder", "AMap.Geolocation", "AMap.Autocomplete", "AMap.PlaceSearch", "AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType", "AMap.PolyEditor", "AMap.CircleEditor"],
	v: "1.4.4" // 高德sdk版本，最新的sdk已经出到了2.0
	//官网解释：JSAPI 2.0 提供的开发接口与 1.4 版本达到 99%的兼容度，但是为了保证插件的稳定性我们还是选择1.4.4。
});
// 防止高德地图刷新时候报错（偶尔出现）
const amapKeys = Object.keys(localStorage).filter(key => key.match(/^_AMap_/));
amapKeys.forEach(key => {
	// console.log(key)
	localStorage.removeItem(key);
});



Vue.use(BaiduMap, { ak: "SbdIki5CEjQopBrGl82xRFvIYvOA5KLR" });

Vue.use(VueBus);
Vue.use(ElementUI);


//注册
directive(Vue);


Vue.use(elDragDialog);


Vue.prototype.$Decimal = Decimal;
// ============ 下面是自定义的公共方法
// 自定义校验el-input 的方法
Vue.prototype.$checkElInput = function(e) {
	var keynum = window.event ? e.keyCode : e.which; // 获取键盘码
	if (keynum == 189 || keynum == 190 || keynum == 109 || keynum == 110) {
		this.$message.warning("禁⽌输⼊⼩数以及负数");
		e.target.value = "";
	}
};
// 自定义防抖的公共方法 没生效
// Vue.prototype.$debounce = function (fn, wait = 1000) {
//   console.log('调用了main.js注册的公共防抖方法')
//   let timer;
//   let aaa = true;
//   return function () {
//     let _this = this;
//     let args = arguments;
//     if (aaa) {
//       fn.apply(_this, args);
//     }
//     aaa = false
//     if (timer) clearTimeout(timer);
//     timer = setTimeout(() => {
//       aaa = true
//     }, wait)
//   }
// }
// =============
// 单纯节流防抖函数的公共配置 没生效
// import globalFunction from '@/utils/globalFunction'
// Vue.use(globalFunction);
// Vue.prototype.$debounce = globalFunction.debounce
// 暂时全局防抖的公共方法值封装了全局的自定义指令， 如果不用自定义指令，那就单页面引入


Vue.use(globalFnAll);
// =============


//第一个参数表示 head-view标签的内容都用第二个参数headerTop来代替
Vue.component("head-view", headerTop);

//然后在需要使用的vue文件中引入头部的话,只需要加入 <head-view></head-view>标签//

Vue.config.productionTip = false;

// 将封装的公共请求方法挂载到 Vue 原型
Vue.prototype.$http = http

new Vue({
	router,
	store,
	render: h => {
		return h(App);
	}
}).$mount("#app");
