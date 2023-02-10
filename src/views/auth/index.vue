<template>
  <div v-safeHeaderTop class="page">
    <!-- <Header title="无线电设备检测信息" :isBack="false" /> -->
    <div class="top-header">无线电设备</div>
    <!-- 固定结构 container为滚动区域，content为滚动内容 -->
    <div ref="container" class="container">
      <div ref="content">
        <div class="title"></div>
        <div class="login">
          <span class="title">请登录</span>
          <van-cell-group class="list" :border="false">
            <van-field v-model="logData.username" :border="false" placeholder="请输入账号" />
            <van-field
              v-model="logData.password"
              :border="false"
              type="password"
              placeholder="请输入密码"
              @keyup.enter.native="login"
            />
          </van-cell-group>
          <van-button class="login-button" type="primary" @click="login">登录</van-button>
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { setUserInfo } from "@/utils/lib";
import { login } from "@api/common";

@Component
export default class ComponentName extends Vue {
  logData = {
    username: "",
    password: "",
  };
  async login() {
    if (this.logData.username === "") {
      this.$toast("请输入账号");
      return;
    }
    if (this.logData.password === "") {
      this.$toast("请输入密码");
      return;
    }
    try {
      this.$toast.loading("登录中...");
      const data = (await login(this.logData)) as any;
      setUserInfo({ Authorization: data.token });
      this.$toast("登录成功");
      this.$router.replace("/");
    } catch (error) {
      return;
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  background: #fff;
}
.top-header {
  position: fixed;
  left: 0;
  top: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 18px;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.title {
  position: relative;
  img {
    width: 100%;
  }
  span {
    position: absolute;
    z-index: 1;
    top: 35%;
    left: 0;
    width: 100%;
    white-space: nowrap;
    text-align: center;
    font-size: 22px;
    color: #fff;
  }
}
/deep/ .login {
  position: relative;
  z-index: 1;
  margin: -91px 16px;
  padding: 40px 20px 80px;
  background: #ffffff;
  box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title {
    font-size: 24px;
    font-weight: 500;
    color: #333;
    margin-bottom: 40px;
  }
  .van-cell {
    margin-bottom: 20px;
    background: #f5f5f5;
    border-radius: 2px;
  }
  .login-button {
    margin-top: 80px;
    width: 100%;
    height: 44px;
    line-height: 54px;
    font-size: 18px;
    border: none;
    background: #487fc0;
    color: #fff;
    border-radius: 2px;
    text-align: center;
    .van-button__icon {
      font-size: 22px;
    }
  }
}
</style>
