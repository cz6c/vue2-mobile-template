<template>
  <van-tabbar
    v-safeBottom
    class="tabbar-wrap"
    :class="{ on: isCenterBtn }"
    :value="active"
    active-color="#FF4D4A"
    inactive-color="#666"
    :safe-area-inset-bottom="false"
  >
    <van-tabbar-item v-for="({ name }, i) in navList" :key="i" icon="home-o" @click="change(i)">
      <span class="text">{{ name }}</span>
      <template #icon="props">
        <SvgIcon :icon="`tabbar_${i + 1}${props.active ? '_h' : ''}`"></SvgIcon>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  name: "Tabbar",
  data() {
    return {
      // 中间按钮
      isCenterBtn: false,
      isVisible: false,
      navList: [
        {
          name: "首页",
          href: "/",
        },
        {
          name: "任务",
          href: "/myTasks",
        },
        {
          name: "签到",
          href: "/checkIn",
        },
        {
          name: "我的",
          href: "/me",
        },
      ],
      userInfo: this.$getUserInfo(),
    };
  },
  computed: {
    active: {
      get() {
        return this.$route.meta.index - 1;
      },
      set() {
        console.log();
      },
    },
  },
  methods: {
    change(index) {
      // if (!this.userInfo) {
      //   this.$router.push("/login");
      //   return;
      // }
      // if (index === 2 && this.isCenterBtn) {
      //   this.isVisible = true;
      //   return;
      // }
      // if (index === 3) {
      //   this.$toast("未开放");
      //   return;
      // }
      if (this.active === index) return;
      this.active = index;
      this.$router.push(this.navList[index].href);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabbar-wrap {
  &.on {
    /deep/.van-tabbar-item {
      &:nth-of-type(3) {
        margin-bottom: 30px;
        /deep/ .van-tabbar-item__icon {
          width: 45px;
          flex: 0 0 45px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 4px solid #fff;
          box-shadow: 0px -2px 5px 0px rgba(232, 232, 232, 0.3);
          background: linear-gradient(180deg, #ff8683 0%, #ff4d4a 100%);
        }
      }
    }
  }
  /deep/.van-tabbar-item {
    .van-tabbar-item__icon {
      .svg-icon {
        width: 22px;
        height: 22px;
      }
    }
    &--active {
      color: #3651ff !important;
    }
  }
  &::after {
    display: none;
  }
}
</style>
