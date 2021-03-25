import mpstore from '../../utils/mpstore'
import store from './store'
mpstore.Page(store, {



  onLoad: function (options) {
    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates || Date.now() - Cates.time > 1000 * 10) {
      this.dispatch('getCates');
    } else {
      this.commit('updateCates', Cates.data)
    }

  },

  // 左侧菜单的点击事件
  handleItemTap(e) {

    const {
      index
    } = e.currentTarget.dataset;
    this.commit('updateCurrentIndex', index)
    this.commit('resetScrollTop')
  }
})