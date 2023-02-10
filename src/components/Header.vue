<template>
  <div v-safeTop class="header" :style="configStyle">
    <div class="left-view">
      <div v-if="isBack" class="back" @click="isBackHome ? $router.replace('/') : goBack()">
        <van-icon name="arrow-left" />
      </div>
    </div>
    <div class="title">{{ title }}</div>
    <div class="right-view">
      <slot name="right"></slot>
    </div>
    <div :style="configStyle" class="left-mask"></div>
    <div :style="configStyle" class="right-mask"></div>
  </div>
</template>

<script>
import { removeCache } from "@/utils/lib";
export default {
  name: "Header",
  props: {
    // 标题
    title: {
      type: String,
      default: "",
    },
    // 背景颜色
    bgColor: {
      type: String,
      default: "#fff",
    },
    // 背景颜色
    textColor: {
      type: String,
      default: "#000",
    },
    isBack: {
      type: Boolean,
      default: true,
    },
    isBackHome: {
      type: Boolean,
      default: false,
    },
    // 上级路由
    parentRoute: {
      type: [String, Array],
      default() {
        return [];
      },
    },
  },
  computed: {
    configStyle() {
      return {
        backgroundColor: this.bgColor,
        color: this.textColor,
      };
    },
  },
  watch: {
    $route(to) {
      if (typeof this.parentRoute === "string") {
        if (to.path === this.parentRoute) {
          removeCache(this.$parent.$options.name);
        }
      } else {
        if (this.parentRoute.indexOf(to.path) !== -1) {
          removeCache(this.$parent.$options.name);
        }
      }
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  left: 0;
  top: 0;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 1024;
  .right-view,
  .left-view {
    display: flex;
    flex: 0 0 25%;
  }
  .left-mask {
    left: -100px;
  }
  .right-mask {
    right: -100px;
  }
  .right-mask,
  .left-mask {
    position: absolute;
    height: 100%;
    top: 0;
    width: 100px;
  }
  .left-view {
    .back {
      left: 0;
      justify-content: center;
      padding-left: 0;
      width: 44px;
      height: 44px;
      font-size: 17px;
      display: flex;
      align-items: center;
      cursor: pointer;
    }
  }
  .right-view {
    padding-right: 16px;
    right: 0;
    font-size: 14px;
    justify-content: flex-end;
  }
  .title {
    width: 50%;
    text-align: center;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 18px;
    text-align: center;
  }
}
</style>
