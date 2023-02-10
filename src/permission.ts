import router from "./router";
import store from "./store";
import { getUserInfo } from "@/utils/lib"; // get token from cookie
import { AuthModule } from "@/store/modules/auth";
import { Toast } from "vant";
const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist
router.beforeEach(async (to: any, from: any, next: any) => {
  // set page title
  // document.title = defaultSettings.title;

  // determine whether the user has logged in
  // 静态写死true，接入接口后修改
  const hasToken = true || getUserInfo();

  if (hasToken) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      const userId = AuthModule.id;
      if (userId) {
        next();
      } else {
        try {
          await AuthModule.getLoginUserInfo();
          next({ ...to, replace: true });
        } catch (error) {
          store.dispatch("logout");
          Toast.fail("登录超时！请重新登录");
          next(`/login`);
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login`);
    }
  }
});
