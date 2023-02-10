<template>
  <div @click="$router.go(-1)">我的</div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ComponentName extends Vue {}
</script>

<style lang="scss" scoped></style>
