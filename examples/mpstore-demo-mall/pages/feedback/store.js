// 0 引入 用来发送请求的 方法 一定要把路径补全
import {
  request
} from "../../request/index.js";
export default {
  state: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    
    // 文本域的内容
    textVal: ""
  },
  getters: {

  },
  actions: {


  },
  mutations: {
    updateTextVal(state, payload) {
      state.textVal = payload
    },
    updateChooseImgs(state, payload) {
      state.chooseImgs = payload
    },
    deleteChooseImg(state,{index}) {
      state.chooseImgs.splice(index, 1);
    },
    updateActiveTabsItem(state, {
      index
    }) {
      state.tabs = state.tabs.map((v, i) => ({...v, isActive: i == index ?  true : false}))
    },

  },

}