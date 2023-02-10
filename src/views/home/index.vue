<template>
  <div v-safeHeaderTop class="page">
    <Header title="首页" :isBack="false" />
    <!-- 固定结构 container为滚动区域，content为滚动内容 -->
    <div ref="container" class="container">
      <div ref="content">
        <div @click="$router.push('/my')">跳转我的</div>
        <!-- 列表状态组件 -->
        <Empty :type="loadType" nullText="暂无内容" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class KeepHome extends Vue {
  loadType = 0;
}
</script>

<style lang="scss" scoped></style>
