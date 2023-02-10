import request from "@utils/request";

// 图片上传
export function qiNiuUpload(data: any) {
  return request({
    url: "/api/qiNiuUpload",
    method: "post",
    data,
  });
}
// 获取列表
export function getList(params: any) {
  return request({
    url: "/api/getList",
    method: "get",
    params,
  });
}
// 上传推送id
export function uploadPushRegId(data: any) {
  return request({
    url: "/api/uploadPushRegId",
    method: "post",
    data,
  });
}
// 个人信息接口
export function getLoginUserInfo() {
  return request({
    url: "/api/memberDetail",
    method: "get",
  });
}
// 个人信息接口
export function login(data: any) {
  return request({
    url: "/api/login",
    method: "get",
    data,
  });
}
