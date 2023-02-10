<template>
  <div class="update-check">
    <van-popup v-model="isShow" class="update-popup" :close-on-click-overlay="false">
      <div class="check-wrap">
        <div class="check-view">
          <img src="@images/icon/bg2.png" />
          <div class="title-dt">升级到新版本</div>
          <div v-if="configInfo.updateInfo" class="rich-text" v-html="configInfo.updateInfo"></div>
          <van-button class="main btn" block :disabled="isUpgradeing" @click="upgradeNow">
            <span v-if="!isUpgradeing">立即升级</span>
            <span v-else>{{ percentText }}</span>
          </van-button>
        </div>
        <van-icon v-if="configInfo.mandatory === 2" class="close-btn" name="cross" @click="updateShow(false)" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getPermission } from "@utils/lib";
import { getConfigInfo } from "@utils/lib";
export default {
  data() {
    return {
      isShow: false,
      isIos: false,
      configInfo: {
        mandatory: 1,
      },
      appVersion: "",
      isUpgradeing: false,
      percentText: "",
    };
  },
  computed: {
    isUpgrade() {
      return this.$store.state.isUpgrade;
    },
  },
  watch: {
    isUpgrade(value) {
      this.isShow = value;
    },
  },
  async created() {
    await getConfigInfo(this);
    if (this.$API) {
      this.isIos = this.$API.systemType === "ios";
      this.appVersion = this.$API.appVersion;
      if (this.appVersion !== this.configInfo.version) {
        this.$store.commit("setUpgrade", true);
      }
    }
  },
  methods: {
    updateShow(data) {
      this.$store.commit("setUpgrade", data);
    },
    async upgradeNow() {
      if (this.isUpgradeing) return;
      if (!this.isIos) {
        await getPermission(["storage"], "存储权限");
        this.$API.download(
          {
            url: this.configInfo.androidDownload,
            report: true,
          },
          ret => {
            this.isUpgradeing = true;
            // 下载中
            if (ret && ret.state == 0) {
              this.percentText = `正在下载应用${ret.percent}%`;
            }
            // 下载完成
            if (ret && ret.state == 1) {
              this.$API.installApp({
                appUri: ret.savePath,
              });
              this.isUpgradeing = false;
            }
          },
        );
      }
      if (this.isIos) {
        this.$API.installApp({
          appUri: this.configInfo.iosDownload,
        });
      }
    },
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
      font-size: 14px;
      color: #fff;
      width: 25px;
      height: 25px;
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
