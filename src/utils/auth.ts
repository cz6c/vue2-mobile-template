// 控制token ,保存于cookie中，也可保存于localStorage中
import Cookies from "js-cookie";

const TokenKey = "token";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token:string) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}

