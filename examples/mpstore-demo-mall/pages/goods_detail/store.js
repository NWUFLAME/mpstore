// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
export default {
  state: {
    goodsObj: {},
    // 商品是否被收藏
    isCollect:false
  },
  getters: {

  },
  actions: {

      // 获取商品详情数据
  async getGoodsDetail({
    state,
    commit
  }, {goods_id}) {
    const goodsObj = await request({ url: "/goods/detail", data: { goods_id } });
    commit('updateGoodsObj', {
      goods_id: goodsObj.goods_id,
      goods_name: goodsObj.goods_name,
      goods_price: goodsObj.goods_price,
      goods_small_logo: goodsObj.goods_small_logo,
      // iphone部分手机 不识别 webp图片格式 
      // 最好找到后台 让他进行修改 
      // 临时自己改 确保后台存在 1.webp => 1.jpg 
      goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
      pics: goodsObj.pics
    })

    // 1 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id == goods_id);
    commit('updateIsCollect', isCollect)

  },
  },
  mutations: {
    updateIsCollect(state, payload) {
      state.isCollect = payload
    },
    updateGoodsObj(state, payload) {
      state.goodsObj = payload
    },
  },
}