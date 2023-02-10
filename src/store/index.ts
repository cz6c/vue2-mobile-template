import Vue from "vue";
import Vuex from "vuex";
import { IndexState } from "./modules/index";
import { AuthState } from "./modules/auth";

Vue.use(Vuex);

export interface IRootState {
  index: IndexState;
  auth: AuthState;
}

// Declare empty store first, dynamically register all modules later.
// 先声明空存储，然后动态注册所有模块。
export default new Vuex.Store<IRootState>({});
