关于作者的一些编码习惯
架构(分文件夹)
 1.千万不要一个目录写完所有文件
 2.尽管只有一个文件，也要开一个目录，方便后期添加，而不是"改动"
 3.如果有子级目录请使用"children"
   3.1 比如说，子级数量庞大,一定要开子目录
   3.2 但是如果数量过少，就不必增加代码复杂度, goodsList和goodsDetails就不必分配子目录
 4.如果有子级组件请使用"components"

Vue单文件中,基于"单一职责"的设计原理
  1 api取名拿http最后一个单词,如果有重复的就使用最后两个单词拼接，小驼峰写法
  2 get前缀 表示获取api数据并处理
  3 handler前缀 表示需要调用api进行参数处理
  4 adapter后缀 表示适配器
    4.1 适配器用于分离前后端数据，避免因为后端数据格式不同而去"大改"前端代码
  5 所有调用接口的函数统一async
    5.1 看到async就知道这个函数需要调用接口
    5.2 同步代码可读性更高
    5.3 接口报错统一在http.js来处理，如果还需要继续处理报错则使用try.catch捕获

Vue-router
 1 App.vue写了前后顺序transtiton,务必path也要有先后顺序
   比如 "my" =>"my/coupons"
 2 keep-alive是通过route的name和meta.keep来判断的
   route name 必须要与组件名相同 大驼峰写法
 3 路由跳转推荐使用name 
   3.1 性能提升 
   3.2 path改变后不需要改组件内的router.push

文件夹架构是基于模块来区分，而不是页面跳转步骤
所有的身份验证逻辑都在permission.js中,userInfo在store中,localStorage只保留了token
api请求统一放在api.js，以模块分.js

组件统一使用大驼峰写法，在template中一定要有-进行分离,页面使用小驼峰写法