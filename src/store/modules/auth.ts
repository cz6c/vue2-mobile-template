import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { getLoginUserInfo } from "@api/common";
import { IndexModule } from "@/store/modules/index";

export interface AuthState {
  id: number | string;
}

@Module({ dynamic: true, store, name: "auth" })
class Auth extends VuexModule implements AuthState {
  id: string | number = "";

  @Mutation
  private SET_ID(id: number | string) {
    this.id = id;
  }

  /**
   * @description: 获取用户数据
   * @param {*}
   * @return {*}
   */
  @Action
  getLoginUserInfo(): Promise<Record<string, unknown>> {
    return new Promise((resolve, reject) => {
      // 测试使用
      this.SET_ID("1");
      resolve({});

      // 接入接口后打开
      // getLoginUserInfo()
      //   .then(async response => {
      //     const { data } = response;
      //     if (!data) {
      //       reject("登录过期，请重新登录");
      //     }
      //     const { id } = data;
      //     this.SET_ID(id);
      //     resolve(data);
      //   })
      //   .catch(error => {
      //     reject(error);
      //   });
    });
  }
  /**
   * @description: 登出
   * @param {*}
   * @return {*}
   */
  @Action
  async logout() {
    localStorage.removeItem("userInfo");
    IndexModule.clearCache();
  }
}

export const AuthModule = getModule(Auth);
