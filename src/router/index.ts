import Vue from "vue";
import Router, { RouteConfig } from "vue-router";
Vue.use(Router);

// 公共菜单
const routes: RouteConfig[] = [
  {
    path: "/login",
    component: () => import("@views/auth/index.vue"),
  },
  {
    path: "/",
    component: () => import("@views/home/index.vue"),
    meta: {
      index: 1,
    },
  },
  // 我的任务
  {
    path: "/myTasks",
    component: () => import("@views/home/index.vue"),
    meta: {
      index: 2,
    },
  },
  // 签到
  {
    path: "/checkIn",
    component: () => import("@views/home/index.vue"),
    meta: {
      index: 3,
    },
  },
  // 我的
  {
    path: "/me",
    component: () => import("@views/home/index.vue"),
    meta: {
      index: 4,
    },
  },
  // 我的
  {
    path: "/my",
    component: () => import("@views/my/index.vue"),
  },
];
const createRouter = (routes: RouteConfig[]) =>
  new Router({
    routes,
  });

const route = createRouter(routes);

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
function resetRouter(routes: RouteConfig[]): any {
  const newRouter: any = createRouter(routes);
  (route as any).matcher = newRouter.matcher; // reset router
}

// 解决相同路由报错
const originalPush = Router.prototype.push;
(Router as any).prototype.push = function (args: any) {
  const { animation } = args;
  this.animation = animation === undefined ? "forward" : animation;
  return originalPush.call(this, args);
};

const originalGo = Router.prototype.go;
(Router as any).prototype.go = function (args: number) {
  this.animation = args <= 0 ? "backward" : "forward";
  return originalGo.call(this, args);
};

const originalReplace = Router.prototype.replace;
(Router as any).prototype.replace = function (args: any) {
  const { animation } = args;
  this.animation = animation === undefined ? "forward" : animation;
  return originalReplace.call(this, args);
};

// // 代理模式
// (Router as any).prototype.go = (() => {
//   const oldFn = Router.prototype.go;
//   return function (args: any) {
//     this.animation = args <= 0 ? "backward" : "forward";
//     oldFn.call(this, args);
//   };
// })();
// (Router as any).prototype.push = (() => {
//   const oldFn = Router.prototype.push;
//   return function (args: any) {
//     const { animation } = args;
//     this.animation = animation === undefined ? "forward" : animation;
//     oldFn.call(this, args);
//   };
// })();
// (Router as any).prototype.replace = () => {
//   const oldFn = Router.prototype.replace;
//   return function (args: any) {
//     const { animation } = args;
//     this.animation = animation === undefined ? "forward" : animation;
//     oldFn.call(this, args);
//   };
// }();

export { resetRouter };
export default route;
