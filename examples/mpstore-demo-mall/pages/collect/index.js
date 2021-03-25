import mpstore from '../../utils/mpstore'
import store from './store'
mpstore.Page(store, {


  onShow(){
    const collect=wx.getStorageSync("collect")||[];
    this.commit('updateCollect', collect)
    
  },
  handleTabsItemChange(e) {
    // 1 获取被点击的标题索引
    const { index } = e.detail;
    this.commit('updateActiveTabsItem' , {index})
  }
})