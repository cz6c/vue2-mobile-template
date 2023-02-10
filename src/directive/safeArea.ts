let safeTop = 0;
let safeBottom = 0;
import Vue from "vue";

const install = function (Vue: Vue.VueConstructor) {
  if (window.api) {
    safeTop = window.api.safeArea.top;
    safeBottom = window.api.safeArea.bottom;
  }
  Vue.prototype.$safeTop = safeTop;
  Vue.prototype.$safeBottom = safeBottom;
  for (const key in safeAreaJson) {
    // 组件循环注册
    Vue.directive(key, safeAreaJson[key]);
  }
};

if (window.Vue) {
  Vue.use(install); // eslint-disable-line
}

const safeAreaJson: { [key: string]: any } = {
  // 页面上下安全距离
  pageSafe: {
    inserted: function (el: HTMLElement) {
      el.style.paddingTop = `${safeTop}px`;
      el.style.paddingBottom = `${safeBottom}px`;
    },
  },
  // 上安全距离
  safeTop: {
    inserted: function (el: HTMLElement) {
      el.style.paddingTop = `${safeTop}px`;
    },
  },
  // 下安全距离
  safeBottom: {
    inserted: function (el: HTMLElement) {
      el.style.paddingBottom = `${safeBottom}px`;
    },
  },
  // 页面顶部距离（只有头部
  safeHeaderTop: {
    inserted: function (el: HTMLElement) {
      el.style.paddingTop = `${safeTop + 44}px`;
      el.style.paddingBottom = `${safeBottom}px`;
    },
  },
  // 页面底部距离（只有tabbar
  safeTabbarBottom: {
    inserted: function (el: HTMLElement) {
      el.style.paddingTop = `${safeTop}px`;
      el.style.paddingBottom = `${safeBottom + 50}px`;
    },
  },
  // 页面底部距离（包含tabbar和header页面
  allSafeArea: {
    inserted: function (el: HTMLElement) {
      el.style.paddingTop = `${safeTop + 44}px`;
      el.style.paddingBottom = `${safeBottom + 50}px`;
    },
  },
  topType: {
    inserted: function (el: HTMLElement) {
      el.style.top = `${safeTop}px`;
    },
  },
};

export default install;
