<template>
  <!-- 协议弹框 -->
  <van-dialog v-model="tipsShow" title="用户协议与隐私政策" show-cancel-button cancel-button-text="暂不使用" confirm-button-text="同意" :before-close="beforeClose" @cancel="closeApp">
    <div class="content-desc">
      请你务必审慎阅读、充分理解"用户协议"和"隐私政策"各条款，我们需要收集你的设备信息、操作日记等个人信息。<br>你可阅读
      <Agreement is-tips class="agreement" />了解详细信息，如你同意，请点击“同意”开始接受我们的服务。
    </div>
  </van-dialog>
</template>

<script>
import Agreement from "@com/Agreement";
export default {
  components: {
    Agreement
  },
  data() {
    return {
      tipsShow: true,
      checked: true,
    };
  },
  created() {
    // this.$authNotice();
    // 是否同意协议
    const isAgreeAgreement = localStorage.getItem("isAgreeAgreement");
    if (isAgreeAgreement == 1) {
      this.tipsShow = false;
    }
  },
  methods: {
    // 不同意用户协议
    closeApp() {
      if (this.$API) {
        this.$API.closeWidget({ silent: true });
      }
    },

    beforeClose(action, done) {
      if (action == "cancel") {
        done();
        return;
      }
      if (this.checked) {
        localStorage.setItem("isAgreeAgreement", 1);
        done();
      } else {
        this.$toast("未勾选同意用户协议");
        done(false);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.content-desc {
  padding: 24px;
  padding-top: 12px;
  font-size: 13px;
  .van-checkbox {
    margin-top: 10px;
    font-size: 12px;
  }

  /deep/.agreement {
    display: inline-block;
  }
  .tips {
    color: #1989fa;
    margin-top: 5px;
  }
}
</style>
