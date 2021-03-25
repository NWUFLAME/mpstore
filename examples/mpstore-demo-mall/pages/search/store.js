// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
export default {
  state: {
    goods:[],
    // 输入框的值
    inpValue:""
  },
  getters: {
    isFocus({
      state
    }) {
      return !!state.inpValue
    }
  },
  actions: {
  // 发送请求获取搜索建议 数据
  async qsearch({
    commit
  }, {query}){
    const res=await request({url:"/goods/qsearch",data:{query}});
    commit('updateGoods', res)
  },
  },
  mutations: {
    updateInpValue(state, payload) {
      state.inpValue = payload
    },
    updateGoods(state, payload) {
      state.goods = payload
    },
    updateIsFocus(state, payload) {
      state.isFocus = payload
    },
  },

}