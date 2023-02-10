/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const defaultSettings = require("./src/settings.ts");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const name = defaultSettings.title || "...";
module.exports = {
  // 基本 URL
  publicPath: "./",
  // 打包文件夹
  outputDir: "dist",
  // 静态内容文件夹
  assetsDir: "static",
  // 删除打包的map文件
  productionSourceMap: false,
  lintOnSave: process.env.NODE_ENV === "development",
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@views": resolve("src/views"),
        "@utils": resolve("src/utils"),
        "@ass": resolve("src/assets"),
        "@com": resolve("src/components"),
        "@api": resolve("src/api"),
        "@images": resolve("src/assets/images"),
        "@mixin": resolve("src/mixin"),
      },
    },
  },
  chainWebpack: config => {
    // svg-sprite-loader
    // svg规则已经对svg文件使用url-loader了,这里要exculde
    config.module.rule("svg").exclude.add(resolve("src/assets")).end();
    // 再创建一条新rule  专门对src/assets进行处理
    config.module
      .rule("assets")
      .test(/\.svg$/)
      .include.add(resolve("src/assets"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        prependData: `@import"~@/assets/styles/variables.scss";`,
      },
    },
  },
  // devServer: {
  //   open: true,
  //   host: "0.0.0.0",
  //   port: 8080,
  //   proxy: {
  //     "/adminapi": {
  //       target: "www.americandianshang.xchlwkj.com", // 域名
  //       changOrigin: true // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
  //     }
  //   }
  // },
  // 第三方插件配置
  pluginOptions: {
    // ...
  },
};
