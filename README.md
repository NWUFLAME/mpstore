## 原生小程序状态框架 mpstore 

[详细文档](https://nwuflame.github.io/mpstore/)	

[文档国内镜像](http://nwuflame.gitee.io/mpstore/)	

[代码仓库国内镜像](https://gitee.com/nwuflame/mpstore)	

## 简介

小程序工程越来越复杂，数据共享和通信成为开发的一大难题，像Mpvue, Taro, Uni-App等虽然可以使用Vuex/Redux管理状态，但是对于小程序项目是侵入式的，必须要将整个项目接入框架，使用Vue/React语言进行开发。但其实如果我们只想开发微信小程序，完全不需要这些框架。原生小程序无论是开发体验和运行时性能都是要优于框架的。

然鹅，原生小程序只提供了getInstance().globalData用于全局数据管理，比较鸡肋。而有了mpstore，即可一行代码接入，享受类Vuex/Redux的开发体验啦，妈妈再也不用担心我的状态管理~



## 特性

* 原生小程序全局状态管理
* 对小程序无侵入，一行代码接入，无需脚手架、Webpack监听编译等额外操作 
* 类VueX/Redux API，Vue/React开发者直接上手
* 响应式视图，修改状态无需手动setData，页面自动刷新(数据响应式部分参考了腾讯开源项目omix的实现)
* 支持计算属性getters，大大简化开发(如购物车场景等) 
* 经过性能调优，大型项目依然纵享丝滑



# 快速上手

1. **引入mpstore库(请在dist文件夹下获取mpstore)**
2. **创建全局store(必须创建)**
3. **创建页面store(按需创建，不使用状态管理的页面可以不创建)**
4. **在wxml或js中使用**

## 运行示例

**Also，也为大家准备了一个简单的Demo项目和一个相对比较复杂的商城项目，请到examples文件夹下查看，可以导入到微信开发者工具中运行体验哦~**