// ===>拓展
import Header from "./Header.vue";
import Tabbar from "./Tabbar.vue";
import Empty from "./Empty.vue";
import { VueConstructor } from "vue";
// 组件列表
const components = [Header, Tabbar, Empty];

const install = function (Vue: VueConstructor) {
  // 组件循环注册
  components.forEach((component: any) => {
    console.log(component.name);

    Vue.component(component.options ? component.options.name : component.name, component);
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

// svg操作
const req = require.context("@/assets/svg", false, /\.svg$/);
const requireAll = (requireContext: any) => requireContext.keys().map(requireContext);
// 获取svg文件的绝对路径
requireAll(req);

// 出口组件
export default {
  version: "1.0.0",
  install,
  Header,
  Tabbar,
  Empty,
};
