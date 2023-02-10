/* eslint-disable indent */
const { baseURL } = require("@/settings");
import { getToken } from "@/utils/auth";
// 封装axios
import axios, { AxiosRequestConfig } from "axios";
const service = axios.create({
  baseURL,
  withCredentials: true, // 设置跨域cookie上传
  timeout: 5000, // 请求超时
});

// request 拦截器 ==> 对请求参数做处理
service.interceptors.request.use(
  config => {
    // 判断为模板文件
    if (config.url?.indexOf("/importExcelTemplate") !== -1) {
      config.responseType = "blob";
    }
    config.headers["token"] = config.headers["token"] || getToken();
    return config;
  },
  error => {
    console.log(error); // for debug
    return Promise.reject(error);
  },
);
// response 拦截器 ==> 对响应做处理
service.interceptors.response.use(
  response => {
    const res = response.data;
    // 当请求不为200时，报错
    if (res.code !== 200) {
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  },
);
interface Response<T> {
  code: number; // 接口数据状态码,不是接口状态码
  msg: string; // 接口消息
  data: T;
}
const createGet =
  <P extends Record<string, any>, R extends unknown>(url: string) =>
  (params?: P, config: AxiosRequestConfig = {}): Promise<Response<R>> =>
    service.request({
      method: "get",
      url,
      params,
      ...config,
    });
const createPost =
  <P extends Record<string, any>, R extends any>(url: string) =>
  (data?: P, config: AxiosRequestConfig = {}): Promise<Response<R>> =>
    service.request({
      method: "post",
      url,
      data,
      ...config,
    });

export default service;
export { createGet, createPost, service };
