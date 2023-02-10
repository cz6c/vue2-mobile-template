import Vue, { VNode } from "vue";

declare global {
  interface Window {
    apiready: window.api;
    api: window.api;
  }
}
