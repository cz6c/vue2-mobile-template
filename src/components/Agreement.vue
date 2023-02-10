<template>
  <div>
    <div v-if="type === 1" class="sec-tips">
      <b v-for="(x,i) in contentList" :key="i" @click="showType = i, isShow = true">《{{ x.title }}》</b>
    </div>
    <van-checkbox v-else v-model="isAgreement" shape="square" icon-size="16px" checked-color="#333" @change="(value)=>{$emit('change',value)}">
      <span>登录即代表您同意</span>
      <b v-for="(x,i) in contentList" :key="i" @click.stop="showType = i, isShow = true">《{{ x.title }}》</b>
    </van-checkbox>
    <!-- 协议内容 -->
    <van-popup v-if="contentList.length > 0" v-model="isShow" position="bottom" class="dialog-box" get-container="body">
      <div class="title">
        <span>{{ contentList[showType].title }}</span>
        <van-icon class="icon" name="close" @click="isShow = false" />
      </div>
      <div class="content rich-text" v-html="contentList[showType].content"></div>
    </van-popup>
  </div>
</template>

<script>
import { getAboutUs } from "@/api/common";
export default {
  name: "Agreement",
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isShow: false,
      showType: 0,
      isAgreement: false,
      contentList: []
    };
  },
  created() {
    this.getAboutUs();
  },

  methods: {
    async getAboutUs() {
      const { data } = await getAboutUs();
      this.contentList = data.list;
    }
  }
};
</script>

<style lang="scss" scoped>
.sec-tips {
  display: inline-block;
  font-size: 12px;
  b {
    font-weight: normal;
    color: #ff4d4a;
    &::after {
      content: "和";
      color: #000;
    }
    &:last-of-type::after {
      display: none;
    }
  }
}

.van-checkbox {
  font-size: 12px;
  margin-left: 5px;
  /deep/.van-checkbox__icon .van-icon {
    border-radius: 2px;
    overflow: hidden;
  }
  /deep/.van-checkbox__label {
    color: #999;
  }
  b {
    font-weight: normal;
    color: #ff4d4a;
    &::after {
      content: "和";
      color: #999;
    }
    &:last-of-type::after {
      display: none;
    }
  }
}
.dialog-box {
  height: 50%;
  overflow: hidden;
  .title {
    position: relative;
    line-height: 44px;
    text-align: center;
    border: 1px solid #ebedf0;
    .icon {
      position: absolute;
      width: 44px;
      height: 44px;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .content {
    padding: 15px;
    height: calc(100% - 80px);
    overflow: auto;
  }
}
</style>
