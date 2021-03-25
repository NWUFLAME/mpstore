// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
export default {
  state: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: [],
    params: {
      cid: '',
      query: '',
      pagenum: 1,
      pagesize: 10,
    },
    totalPages: -1,
  },
  getters: {

  },
  actions: {


    // 获取商品列表数据
    async getGoodsList({
      state,
      commit
    }, payload) {
      const res = await request({
        url: "/goods/search",
        data: state.params
      });

      // 计算总页数
      commit('updateTotalPages', Math.ceil(res.total / state.params.pagesize) )
      commit('updateGoodsList', [...state.goodsList, ...res.goods])
      commit('updateParams', {
        pagenum: state.params.pagenum + 1
      })
      // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
      wx.stopPullDownRefresh()
    },

  },
  mutations: {
    updateGoodsList(state, payload) {
      state.goodsList = payload
    },
    updateActiveTabsItem(state, {
      index
    }) {
      state.tabs = state.tabs.map((v, i) => ({...v, isActive: i == index ?  true : false}))
    },
    updateParams(state, payload) {
      state.params = {...state.params, ...payload}
    },
    updateTotalPages(state, payload) {
      state.totalPages = payload
    }

  },

}