// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
export default {
  state: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ]
  },
  getters: {

  },
  actions: {

  // 获取订单列表的方法
  async getOrders({
    state,
    commit
  }, {type}) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    commit('updateOrders', res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())})))
  }


  },
  mutations: {
    updateOrders(state, payload) {
      state.orders = payload
    },
    updateActiveTabsItem(state, {
      index
    }) {
      state.tabs = state.tabs.map((v, i) => ({...v, isActive: i == index ?  true : false}))
    },

  },

}