<template>
  <div class="update-check">
    <van-popup v-model="isShow" class="update-popup" :close-on-click-overlay="false">
      <div class="check-wrap">
        <div class="check-view">
          <img src="@images/icon/bg3.png">
          <div class="title-dt">开启消息通知</div>
          <div class="rich-text">
            开启消息通知，可随时了解任务状态、接单状态等消息
          </div>
          <van-button class="main btn" block @click="openPermission">
            <span>去开启</span>
          </van-button>
        </div>
        <van-icon class="close-btn" name="cross" @click="isShow = false" />
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    isUpgrade() {
      return this.$store.state.isUpgrade;
    }
  },
  watch: {

  },
  created() {
    if (this.$API) {
      var resultList = this.$API.hasPermission({
        list: ["notification"]
      });
      console.log(resultList);
      if (!resultList[0].granted && !this.isUpgrade) {
        this.isShow = true;
      }
    }
  },
  methods: {
    openPermission() {
      if (!this.$API) {
        this.$toast("仅限App使用");
        return;
      }
      this.isShow = false;
      if (this.$API.systemType === "android") {
        this.$API.requestPermission({
          list: ["notification"]
        });
      } else {
        var setJumpNew = this.$API.require("setJumpNew");
        setJumpNew.open();
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.update-popup {
  background-color: transparent;
  width: 300px;
  .check-wrap {
    overflow: hidden;
    padding-top: 43px;
    position: relative;
    .check-view {
      padding-top: 110px;
      background-color: #fff;
      border-radius: 16px;
      padding: 110px 24px 20px;
      img {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        display: block;
        width: 100%;
      }

      .title-dt {
        font-size: 16px;
        font-weight: 700;
        color: #323233;
        text-align: center;
      }
      .rich-text {
        color: #5f6067;
        font-size: 14px;
        margin: 12px 0;
        min-height: 30px;
        max-height: 98px;
        overflow-y: auto;
      }
      .btn {
        border-radius: 22px;
        font-size: 15px;
        height: 44px;
        margin-top: 30px;
      }
    }
    .close-btn {
      font-size: 16px;
      color: #fff;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #666;
      border-radius: 50%;
      margin: 40px auto 0;
    }
  }
}
</style>
