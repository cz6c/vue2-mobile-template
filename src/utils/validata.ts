/**
 * 判断是否邮箱
 * @param {*} value
 */
export function isEmail(value: string) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value,
  );
}

/**
 * 判断是否手机号码
 * @param {*} value
 * @param {*} type
 */
export function isMobile(value: string, type = 1) {
  switch (type) {
    case 1:
      // 手机号(mobile phone)中国(严谨), 根据工信部2019年最新公布的手机号段
      return /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(
        value,
      );
    case 2:
      // 手机号(mobile phone)中国(宽松), 只要是13,14,15,16,17,18,19开头即可
      return /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value);
    case 3:
      // 手机号(mobile phone)中国(最宽松), 只要是1开头即可, 如果你的手机号是用来接收短信, 优先建议选择这一条
      return /^(?:(?:\+|00)86)?1\d{10}$/.test(value);
  }
}

/**
 * 判断是否电话号码
 * 座机(tel phone)电话(国内),如: 0341-86091234
 * @param {*} value
 */
export function isPhone(value: string) {
  return /^\d{3}-\d{8}$|^\d{4}-\d{7,8}$/.test(value);
}

/**
 * 判断是否URL地址
 * 网址(url,支持端口和"?+参数"和"#+参数)
 * @param {*} value
 */
export function isURL(value: string) {
  return /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(value);
}

/**
 * 判断是否小写字母
 * @param {*} value
 */
export function isLowerCase(value: string) {
  return /^[a-z]+$/.test(value);
}

/**
 * 判断是否大写字母
 * @param {*} value
 */
export function isUpperCase(value: string) {
  return /^[A-Z]+$/.test(value);
}

/**
 * 判断是否大小写字母
 * @param {*} value
 */
export function isAlphabets(value: string) {
  return /^[A-Za-z]+$/.test(value);
}

/**
 * 判断是否为空
 * @param {*} value
 */
export function isNull(value: any) {
  if (typeof value === "boolean") {
    return false;
  }
  if (typeof value === "number") {
    return false;
  }
  if (value instanceof Array) {
    if (value.length == 0) return true;
  } else if (value instanceof Object) {
    if (JSON.stringify(value) === "{}") return true;
  } else {
    if (value == "null" || value == null || value == "undefined" || value == undefined || value == "") return true;
    return false;
  }
  return false;
}

/**
 * 判断是否统一社会信用代码
 * @param {*} value
 */
export function isUSCC(value: string) {
  return /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(value);
}

/**
 * 判断是否车牌号
 * (新能源+非新能源)
 * @param {*} value
 */
export function isCarNumber(value: string) {
  const reg =
    /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))$|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/;
  return reg.test(value);
}

/**
 * 判断是否身份证号, 支持1/2代(15位/18位数字)
 * @param {*} value
 */
export function isCardId(value: string) {
  const reg =
    /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
  return reg.test(value);
}

/**
 * 判断是否护照（包含香港、澳门）
 * @param {*} value
 */
export function isPassport(value: string) {
  const reg =
    /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
  return reg.test(value);
}

/**
 * 判断是否邮政编码(中国)
 * @param {*} value
 */
export function isZipCode(value: string) {
  const reg = /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/;
  return reg.test(value);
}

// 过滤器
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * @param {string} str
 * @returns {Boolean}
 * // 这里的用户名后期需要接口来控制
 */
export function validUsername(str: string) {
  const valid_map = ["admin", "editor"];
  return valid_map.indexOf(str.trim()) >= 0;
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url: string) {
  const reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(url);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str: string) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str: string) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str: string) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email: string) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return reg.test(email);
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str: any) {
  if (typeof str === "string" || str instanceof String) {
    return true;
  }
  return false;
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg: string) {
  if (typeof Array.isArray === "undefined") {
    return Object.prototype.toString.call(arg) === "[object Array]";
  }
  return Array.isArray(arg);
}

// 更多正则
// https://any86.github.io/any-rule/
