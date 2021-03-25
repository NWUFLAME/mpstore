// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
export default {
  state: {
    collect:[],
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false
      },
      {
        id: 3,
        value: "浏览器足迹",
        isActive: false
      }
    ]
  },
  getters: {

  },
  actions: {

  },
  mutations: {
    updateCollect(state, payload) {
      state.collect = payload
    },
    updateActiveTabsItem(state, {
      index
    }) {
      state.tabs = state.tabs.map((v, i) => ({...v, isActive: i == index ?  true : false}))
    },

  },

}