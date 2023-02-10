declare module "*.vue" {
  import moment from "moment";
  import Mock from "@utils/mockjs";
  import Vue from "vue";
  declare module "vue/types/vue" {
    // 给vue的类型添加新的属性
    interface Vue {
      $mock: Mock;
      $moment: moment;
      $API: window.api;
    }
  }
  export default Vue;
}
