<template>
  <van-search v-model="searchText" class="search-view" left-icon="" :placeholder="placeholder" @search="search" @clear="clear">
    <template slot="right-icon">
      <SvgIcon icon="search" @click="search"></SvgIcon>
    </template>
  </van-search>
</template>
<script lang="ts">
import { Component, ModelSync, Prop, Vue } from "vue-property-decorator";

@Component({
  name: "SearchView",
})
export default class SearchView extends Vue {
  @ModelSync("value", "input", { type: String })
  readonly searchText!: boolean;
  @Prop(String) readonly placeholder!: string;
  search() {
    this.$emit("search", this.searchText);
  }
  clear() {
    this.$emit("clear");
  }
}
</script>

<style lang="scss" scoped>
.search-view {
  /deep/ .svg-icon {
    width: 16px;
    height: 16px;
  }
  /deep/.van-field__right-icon {
    display: flex;
    align-items: center;
  }
  /deep/.van-cell {
    padding-top: 6px;
    padding-bottom: 6px;
  }
}
</style>
