export default {
  state: {
    address: {},
    cart: [],
  },
  getters: {
    checkedCart({
      state
    }) {
      // 过滤后的购物车数组
      return state.cart.filter(v => v.checked)
    },
    totalPrice({
      state
    }) {
      const res = state.cart.filter(item => item.checked).reduce((res, cur) => res + cur.num * cur.goods_price, 0)
      return res
    },
    totalNum({
      state
    }) {
      return state.cart.filter(item => item.checked).reduce((res, cur) => res + cur.num, 0)
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
  },

}