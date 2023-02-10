import { IndexModule } from "@/store/modules/index";
import router from "@/router";
import { qiNiuUpload, getLoginUserInfo } from "@api/common";
// import { uploadPushRegId } from "@api/common";
// import { getQiNiuUploadToken } from "@/api/forum";
// import { getAgree } from "@/api/user";
// const qiniu = require("qiniu-js");
// import md5 from "js-md5";
import { Dialog, Toast } from "vant";

/**
 * 原生App统一权限处理
 *
 */
export function getPermission(list: string[], text: string) {
  if (!window.api) {
    Toast("仅限App使用");
    return;
  }
  // 判断是否有权限
  const permission = window.api.hasPermission({
    list,
  });
  return new Promise((resolve, reject) => {
    if (permission[0].granted) {
      // 已授权
      resolve(permission[0].granted);
    } else {
      // 未授权
      Dialog.confirm({
        title: "开启权限",
        message: `应用需要您的授权才能访问${text}`,
        confirmButtonText: "去设置",
      }).then(() => {
        // 获取权限
        window.api.requestPermission(
          {
            list,
            code: 1,
          },
          (res: any) => {
            if (res.list[0].granted) {
              resolve(res.list[0].granted);
            } else {
              reject();
            }
          },
        );
      });
    }
  });
}

/**
 * 去除页面缓存
 *
 */
export function removeCache(...args: any) {
  const arr = IndexModule.cache.filter(x => {
    return args.indexOf(x) === -1;
  });
  IndexModule.setCache(arr);
}

/**
 * 复制
 *
 */
export function copyText(value: string) {
  if (window.api) {
    const clipBoard = window.api.require("clipBoard");
    clipBoard.set(
      {
        value,
      },
      (ret: any) => {
        if (ret.status) {
          Toast("已复制");
        } else {
          Toast("复制失败，请重试");
        }
      },
    );
  }
}

/**
 * 设置token
 * @param {*} val  //用户数据
 */
export function setUserInfo(val: any) {
  val.addTime = Date.now();
  localStorage.setItem("userInfo", JSON.stringify(val));
  // 推送相关
  if (window.api) {
    // var pushApi = window.api.require("mobPushPlus");
    // pushApi.getRegistrationID(async (ret, err) => {
    //   const registrationId = ret.regId;
    //   const regIdArr = val.registrationId;
    //   if (registrationId && regIdArr.indexOf(registrationId) === -1) {
    //     await uploadPushRegId({ registrationId })
    //   }
    // });
    //   const systemType = window.api.systemType;
    //   if (systemType == "ios") {
    //     uploadPushRegId({
    //         mac: window.api.deviceId,
    //         imei: window.api.deviceId
    //       })
    //       .then(res => {
    //         if (res.code == 200) {
    //         }
    //       })
    //       .catch(err => {
    //       });
    //   } else {
    //     var phoneInfoMore = window.api.require("phoneInfoMore");
    //     phoneInfoMore.getMacAddressNew((ret, err) => {
    //       if (ret) {
    //         const mac = ret.toUpperCase();
    //         uploadPushRegId({
    //             mac: mac,
    //             imei: window.api.deviceId
    //           })
    //           .then(res => {
    //             if (res.code == 200) {}
    //           })
    //           .catch(err => {
    //           });
    //       }
    //     });
    //   }
  }
}

/**
 * 获取token
 *
 */
export function getUserInfo() {
  const userInfo = localStorage.getItem("userInfo") ? JSON.parse(String(localStorage.getItem("userInfo"))) : null;
  return userInfo;
}

/**
 * 删除token
 *
 */
export function removeUserInfo() {
  localStorage.removeItem("userInfo");
  router.replace("/");
}

/**
 * 更新用户数据
 *
 */
export async function updateUserInfo(that: any) {
  const { data } = await getLoginUserInfo();
  const userInfo = localStorage.getItem("userInfo") ? JSON.parse(String(localStorage.getItem("userInfo"))) : {};
  Object.assign(userInfo, data);
  if (userInfo.token) {
    that.userInfo = userInfo;
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }
}

/**
 * json转formdata格式
 *
 */
export function changeForm(val: any) {
  const formData = new FormData();
  Object.keys(val).forEach(key => {
    formData.append(key, val[key]);
  });
  return formData;
}

/**
 * base64转bold格式
 *
 */
export function dataURLtoBlob(dataurl: any) {
  return new Promise(resolve => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blod = new Blob([u8arr], { type: mime });
    const file = new File([blod], `${new Date().getTime()}.jpg`);
    resolve(file);
  });
}

/**
 * 公共上传图片
 * @param {*} file  // 文件
 * @param {*} isZip  // 是否压缩
 *
 */
export async function imgUpload(file: any, isZip: any) {
  const json: any = { file };
  isZip && (json.zip = 1);
  const { data } = await qiNiuUpload(changeForm(json));
  return data;
}

/**
 * App原生路径绝对路径转换为blod
 * @param {*} path  // 原生路径
 *
 */
export async function pathToBlod(path: any) {
  // 路径转换为img
  function urltoImage(url: any) {
    return new Promise(resolve => {
      const img = new Image();
      img.src = url;
      img.onload = function () {
        resolve(img);
      };
    });
  }

  // img 转换为 canvas
  function imagetoCanvas(image: any) {
    const cvs = document.createElement("canvas");
    const ctx = cvs.getContext("2d");
    cvs.width = image.width;
    cvs.height = image.height;
    ctx && ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
    return cvs;
  }

  // canvas 转换为 blod
  function canvasResizetoFile(canvas: any, quality = 1) {
    return new Promise(resolve => {
      canvas.toBlob(function (blob: any) {
        resolve(blob);
      }, quality);
    });
  }
  const res = await urltoImage(path);
  const canvas = imagetoCanvas(res);
  const blod = await canvasResizetoFile(canvas);
  return blod;
}

/**
 * 七牛图片上传Api
 * @param {*} index  // 当前上传序号
 * @param {*} totalNum  // 当前上传总数
 * @param {*} type  // 1 图片 2 视频
 *
 */
// export function qiniuPostImg(that: any, file: any, index = 1, type = 1) {
// return new Promise((resolve, reject) => {
// getQiNiuUploadToken().then(res => {
//   const data = res.data;
//   const key = md5(String(new Date().getTime() + Math.random()));
//   const putExtra = {
//     // fname: data.key, // 存储的文件名
//     fname: key, // 存储的文件名
//   };
//   const config = {
//     useCdnDomain: true, // 是否使用 cdn 加速域名
//   };
//   const observable = qiniu.upload(file, data.key, data.token, putExtra, config);
//   observable.subscribe({
//     next(res) {
//       // 上传中回调
//       // const percent = Math.round(res.total.percent);
//       // self.percent = percent;
//       if (type === 1) {
//         that.imgList[index].percent = Math.round(res.total.percent);
//       } else if (type === 2) {
//         that.videoInfo[index].percent = Math.round(res.total.percent);
//       }
//     },
//     error(err) {
//       //  错误回调
//       reject("上传失败");
//     },
//     complete(res) {
//       // 上传成功回调
//       resolve({
//         path: `${data.domain}${res.key}`,
//         index: index,
//       });
//     },
//   });
// });
// });
// }

/**
 * 微信网页分享
 *
 */
export function shareContent(that: any, data: any) {
  const wx = that.$API.require("wxPlus");
  wx.isInstalled((ret: any) => {
    if (ret.installed) {
      wx.shareWebpage({ ...data }, (ret: any, err: any) => {
        console.log(err);
        if (err.code === 0) {
          that.$toast("分享成功");
        } else {
          that.$toast("分享失败，请重试");
        }
      });
    } else {
      that.$toast("当前未安装微信");
    }
  });
}

/**
 * 微信图片分享
 *
 */
export function sharePoster(that: any, data: any) {
  const wx = that.$API.require("wxPlus");
  wx.isInstalled((ret: any) => {
    if (ret.installed) {
      wx.shareImage(
        {
          ...data,
        },
        (ret: any, err: any) => {
          console.log(err);
          if (err.code === 0) {
            that.$toast("分享成功");
          } else {
            that.$toast("分享失败，请重试");
          }
        },
      );
    } else {
      that.$toast("当前未安装微信");
    }
  });
}

/**
 * 微信调起登录
 *
 */
export function wxAutoLogin(that: any) {
  return new Promise((resolve, reject) => {
    if (!that.$API) {
      that.$toast("仅限App模式使用");
      reject();
      return;
    }
    const wx = that.$API.require("wxPlus");
    // 调用微信
    // 判断是否安装微信客户端
    wx.isInstalled((ret: any) => {
      if (ret.installed) {
        wx.auth({}, authFn);
      } else {
        that.$toast("无法使用，未安装微信客户端");
      }
    });

    // 登录授权回调
    function authFn(ret: any) {
      console.log(ret);
      if (ret.status) {
        const json = {
          code: ret.code,
        };
        wx.getToken(json, tokenFn);
      } else {
        that.$toast("授权失败");
      }
    }

    // 获取授权 accessToken 回调
    function tokenFn(ret: any) {
      if (ret.status) {
        const json = {
          accessToken: ret.accessToken,
          openId: ret.openId,
        };
        wx.getUserInfo(json, userInfoFn);
      } else {
        that.$toast("授权失败");
      }
    }

    // 获取用户信息回调
    function userInfoFn(ret: any, err: any) {
      if (ret.status) {
        const userInfo = {
          way: "weChat",
          openid: ret.openid,
          name: ret.nickname,
          headimg: ret.headimgurl,
        };
        resolve(userInfo);
      } else if (err.code === 1) {
        const json = {
          dynamicToken: ret.dynamicToken,
        };
        // token失效，重新获取
        wx.refreshToken(json, tokenFn);
      } else {
        that.$toast("获取用户信息失败");
      }
    }
  });
}

/**
 * 秒验验证
 *
 */
// export async function fastLoginAuth(that: any, exLogin: any) {
// const customParams: any = null;
// const is = true;
// const agree = await getAgree();
// const systemType = that.$API.systemType;
// if (is) {
//   // 隐私条款设置(切记,不可隐藏)
//   var customPrivacy = {};
//   if (systemType == "ios") {
//     customPrivacy = {
//       yjyzPrivacyTextColor: "#999999",
//       yjyzPrivacyTextFont: 12,
//       yjyzPrivacyTextAlignment: 0,
//       yjyzPrivacyAgreementColor: "#fd8727",
//       yjyzPrivacyAppName: "3氪烟",
//       yjyzPrivacyProtocolMarkArr: ["《", "》"],
//       yjyzPrivacyFirstTextArr: ["服务协议", agree.data.two.linkUrl, ""],
//       yjyzPrivacySecondTextArr: ["隐私政策", agree.data.one.linkUrl, ""],
//       yjyzPrivacyNormalTextFirst: "我已阅读并同意",
//       yjyzPrivacyNormalTextSecond: "并授权",
//       yjyzPrivacyNormalTextThird: "获取本机号码",
//       yjyzPrivacyPromptType: 0,
//       yjyzPrivacyPromptText: "请阅读并勾选服务协议和隐私政策",
//       yjyzPrivacyHidden: false,
//       isPrivacyOperatorsLast: true,
//       yjyzPortraitLayout: {
//         yjyzLayoutLeft: 40,
//         yjyzLayoutRight: -40,
//         yjyzLayoutTop: 340,
//       },
//     };
//   } else {
//     customPrivacy = {
//       yjyzPrivacyTextColor: "#999999",
//       yjyzPrivacyTextFont: 12,
//       yjyzPrivacyTextAlignment: 0,
//       yjyzPrivacyAgreementColor: "#fd8727",
//       yjyzPrivacyAppName: "3氪烟",
//       yjyzPrivacyProtocolMarkArr: ["《", "》"],
//       yjyzPrivacyFirstTextArr: ["《服务协议》", agree.data.two.linkUrl, "、"],
//       yjyzPrivacySecondTextArr: ["《隐私政策》", agree.data.one.linkUrl, "、"],
//       yjyzPrivacyNormalTextFirst: "我已阅读并同意",
//       yjyzPrivacyNormalTextSecond: "并授权",
//       yjyzPrivacyNormalTextThird: "获取本机号码",
//       yjyzPrivacyPromptType: 0,
//       yjyzPrivacyPromptText: "请阅读并勾选服务协议和隐私政策",
//       yjyzPrivacyHidden: false,
//       isPrivacyOperatorsLast: true,
//       yjyzPortraitLayout: {
//         yjyzLayoutLeft: 30,
//         yjyzLayoutRight: -30,
//         yjyzLayoutTop: 280,
//       },
//     };
//   }

//   const customSwitchNumber = {
//     yjyzSwitchHidden: true,
//   };

//   const customLoginBtn = {
//     yjyzLoginBtnBgColor: "#a4d2f9",
//     yjyzLoginBtnBgImgArr: ["#6eace0", "#6eace0", "#6eace0"],
//   };

//   const customCheckBox = {
//     yjyzCheckDefaultState: true,
//   };

//   customParams = {
//     customCheckBox,
//     customPrivacy,
//     customSwitchNumber,
//     customLoginBtn,
//   };
// }

// return new Promise((resolve, reject) => {
//   exLogin.yjyzAuthLogin(customParams, (ret: any, err: any) => {
//     if (ret.code != 3) {
//       if (!err) {
//         resolve(ret);
//       } else {
//         that.$toast("操作频繁，请稍后重试");
//       }
//     }
//   });
// });
// }

/**
 * 数据格式化
 *
 */
export function formatUnitNum(num: number | string) {
  if (num >= 100000000) {
    num = Math.round(Number(num) / 10000000) / 10 + "亿";
  } else if (num >= 10000) {
    num = Math.round(Number(num) / 1000) / 10 + "万";
  }
  return num;
}
