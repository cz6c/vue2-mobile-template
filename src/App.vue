<template>
  <div id="app">
    <transition :name="viewTransition">
      <keep-alive :include="cacheList">
        <router-view :key="$route.path" class="router-view" />
      </keep-alive>
    </transition>
    <!-- 底部tabbar -->
    <transition name="van-fade">
      <Tabbar v-if="$route.meta.index" />
    </transition>
    <!-- 协议弹框 -->
    <!-- <AgreePopup v-if="!isH5" /> -->
    <!-- 检测更新 -->
    <!-- <UpdateCheck v-if="!isH5" /> -->
    <!-- 通知检测 -->
    <!-- <CheckNotify v-if="!isH5" /> -->
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
// import AgreePopup from "@com/AgreePopup.vue";
// import UpdateCheck from "@com/UpdateCheck.vue";
// import CheckNotify from "@com/CheckNotify.vue";
import { IndexModule } from "@/store/modules/index";

@Component({
  // components: {
  //   AgreePopup,
  //   UpdateCheck,
  //   CheckNotify,
  // },
})
export default class App extends Vue {
  viewTransition = "forward";
  isH5 = process.env.VUE_APP_IS_USE_H5;
  get cacheList() {
    return IndexModule.cache;
  }
  @Watch("$route")
  changeRoute(to: any, from: any) {
    const toIndex = to.meta && to.meta.index;
    const fromIndex = from.meta && from.meta.index;

    if (toIndex && fromIndex) {
      const toDepth = toIndex;
      const fromDepth = fromIndex;
      this.viewTransition = toDepth < fromDepth ? "backward" : "forward";
    } else {
      const animation = (this.$router as any).animation || to.query.animation;
      this.viewTransition = animation;
    }

    (this.$router as any).animation = "";
    // 页面缓存
    this.pageCache(to);
    // 原生操作
    this.nativeHandle(to);
  }
  pageCache(to: any) {
    // 动态缓存页面
   const name = to.matched[0].components.default.extendOptions.name || "";
    if (name && name.indexOf("Keep") > -1) {
      const arr = JSON.parse(JSON.stringify(IndexModule.cache));
      arr.includes(name) ? "" : IndexModule.pushCache(name);
    }
  }
  // 原生操作
  nativeHandle(to: any) {
    if (this.$API) {
      // App全局设置是否在根页面
      if (to.meta.index) {
        this.$API.setGlobalData({
          key: "isRoot",
          value: 1,
        });
      } else {
        this.$API.setGlobalData({
          key: "isRoot",
          value: 0,
        });
      }
    }
  }
}
</script>
