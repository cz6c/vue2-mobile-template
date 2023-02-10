import Vue from "vue";
import App from "./App.vue";
import router from "@/router/index";
import store from "./store";
import "@ass/styles/global.scss";
import "@utils/filters";
import VConsole from "vconsole";
Vue.config.productionTip = false;

require("./permission");

// 时间插件
import moment from "moment";
Vue.prototype.$moment = moment;

import SvgIcon from "@com/SvgIcon.vue";
Vue.component("SvgIcon", SvgIcon);

// vant操作
import Vant from "vant";
import { Dialog, Lazyload, Toast } from "vant";
import "vant/lib/index.css";
// loading提示常亮
Toast.setDefaultOptions("loading", { overlay: true, duration: 0 });
Vue.use(Dialog).use(Toast).use(Lazyload).use(Vant);
import "vant/lib/index.css";
import "@ass/styles/global.scss";
import safeArea from "@/directive/safeArea";

// 点击延迟
import FastClick from "fastclick";
FastClick.prototype.focus = function (targetElement: any) {
  let length;
  if (
    targetElement.setSelectionRange &&
    targetElement.type.indexOf("date") !== 0 &&
    targetElement.type !== "time" &&
    targetElement.type !== "month"
  ) {
    length = targetElement.value.length;
    targetElement.focus();
    targetElement.setSelectionRange(length, length);
  } else {
    targetElement.focus();
  }
};

// 全局用户信息获取方法
import { getUserInfo } from "@utils/lib";
Vue.prototype.$getUserInfo = getUserInfo;

// 复制组件包含原生复制模块
import VueClipboard from "vue-clipboard2";
Vue.use(VueClipboard);

// 用户返回操作
window.addEventListener(
  "popstate",
  function () {
    (router as any).animation = "backward";
  },
  false,
);

// ===>拓展
import publicComponents from "@com/index"; // 公共组件
Vue.use(publicComponents);

if (window.navigator.userAgent.match(/APICloud/i)) {
  window.apiready = function () {
    // 移动端console
    process.env.NODE_ENV === "development" && new VConsole();

    // 将API链接Vue原型，后续通过this.$APICLOUD代替window.api
    Vue.prototype.$API = window.api;
    // 移动端点击延迟响应（只应用于App
    (FastClick as any).attach(document.body);
    // 全局设置App安全距离
    Vue.use(safeArea);

    new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount("#app");
  };
} else {
  // h5网页
  Vue.prototype.$API = null;
  Vue.use(safeArea);
  new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount("#app");
}
