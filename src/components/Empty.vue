<template>
  <div v-if="type" class="null_div">
    <div v-if="type === 1" class="loading_div">
      <van-loading size="14px">{{ loadingText }}</van-loading>
    </div>
    <div v-if="type === 2" class="null_text">{{ noMoreText }}</div>
    <div v-if="type === 3" class="null_list">
      <img src="@images/icon/null.png" mode="widthFix" />
      <div class="tips_text">{{ nullText }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Empty",
  props: {
    // 类型
    // 0：无显示
    // 1：加载中
    // 2：无更多
    // 3：列表为空
    type: {
      type: Number,
      default: 0,
    },
    nullText: {
      type: String,
      default: "暂无内容",
    },
    noMoreText: {
      type: String,
      default: "没有更多了",
    },
    loadingText: {
      type: String,
      default: "加载中...",
    },
    bgColor: {
      type: String,
      default: "transparent",
    },
  },
};
</script>

<style lang="scss" scoped>
.null_div {
  line-height: 35px;
  text-align: center;
  .null_view {
    line-height: 30px;
    margin-bottom: 16px;
    text-align: center;
    flex: 1;
    width: 100%;
  }

  .null_list {
    // margin-top: 50px;
    padding-bottom: 100px;
    text-align: center;
    img {
      width: 200px;
    }
  }

  .loading_div {
    .van-loading {
      color: #999;
      .van-loading__text {
        color: #999;
      }
    }
  }
  .null_text {
    font-size: 12px;
    color: #999;
  }

  .tips_text {
    font-size: 12px;
    color: #999;
    text-align: center;
    margin-top: 5px;
  }

  .loading_view {
    text-align: center;
  }
}
</style>
