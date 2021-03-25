// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
import {
  chooseAddress
} from "../../utils/asyncWx.js";
export default {
  state: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  getters: {
    allChecked({
      state
    }) {
      return state.cart.length ? state.cart.every(item => item.checked):false
    },
    totalPrice({
      state
    }) {

      const res = state.cart.filter(item=>item.checked).reduce((res, cur) =>  res + cur.num * cur.goods_price , 0)
      return res
    },
    totalNum({
      state
    }) {
      return state.cart.filter(item=>item.checked).reduce((res, cur) => res + cur.num, 0)
    }
  },
  actions: {


  },
  mutations: {
    updateAddress(state, payload) {
      state.address = payload
    },
    updateCart(state, payload) {
      state.cart = payload
    },
    deleteCartItem(state, {goods_id}) {
      const index = state.cart.findIndex(v => v.goods_id === goods_id)
      state.cart.splice(index, 1)
    },
    updateItemNum(state, {
      goods_id,
      num
    }) {
      // 3 找到被修改的商品对象
      const item = state.cart.find(v => v.goods_id === goods_id);
      item.num += num
    },
    updateItemChoose(state, {
      goods_id
    }) {
      // 3 找到被修改的商品对象
      const item = state.cart.find(v => v.goods_id === goods_id);
      // 4 选中状态取反
      item.checked = !item.checked;
    }

  },
}