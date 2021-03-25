// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
export default {
  state: {
    cates: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  getters: {
    leftMenuList({
      globalState,
      state
    }) {
      return state.cates.map(v => v.cat_name);
    },
    rightContent({
      globalState,
      state
    }) {
      return state.cates[state.currentIndex]?.children || [];
    },
  },
  actions: {

    // 获取分类数据
    async getCates({
      commit
    }, payload) {
      const res = await request({
        url: "/categories"
      }) 
      commit('updateCates', res)
      // 把接口的数据存入到本地存储中
      wx.setStorageSync("cates", {
        time: Date.now(),
        data: res
      });
    },

  },
  mutations: {
    updateCates(state, payload) {
      state.cates = payload
    },
    updateCurrentIndex(state, payload) {
      state.currentIndex = payload
    },
    resetScrollTop(state) {

      state.scrollTop = state.scrollTop -1
    }
  },

}