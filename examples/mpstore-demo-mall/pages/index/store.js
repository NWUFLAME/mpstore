// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
export default {
  state: {

    // 轮播图数组
    swiperList: [],
    // 导航 数组
    catesList: [],
    // 楼层数据
    floorList: []


  },
  actions: {

    async getSwiperList({
      commit
    }, payload) {
      const result = await request({
        url: "/home/swiperdata"
      })
      result.forEach(item=>item.navigator_url = item.navigator_url.replace('main', 'index'))
      commit('updateSwiperList', result);
    },
    // 获取 分类导航数据
    async getCateList({
      commit
    }, payload) {
      const result = await request({
        url: "/home/catitems"
      })
      commit('updateCateList', result);
    },
    
  // 获取 楼层数据
  async getFloorList({
    commit
  }, payload){
    const result = await request({
      url: "/home/floordata"
    })
    result.forEach(item=>item.product_list.forEach(item2=>item2.navigator_url=item2.navigator_url.replace('goods_list', 'goods_list/index')))
    commit('updateFloorList', result);
  },


  },
  mutations: {

    updateSwiperList(state, payload) {
      state.swiperList = payload;
    },
    updateCateList(state, payload) {
      state.catesList = payload;
    },
    updateFloorList(state, payload) {
      state.floorList = payload;
    },

  },

}