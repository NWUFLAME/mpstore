import mpstore from '../../utils/mpstore.js'
import store from './store'

mpstore.Page(store, {
  use: [
    'userInfo',
  ],
  onLoad () {
    this.dispatchGlobal('getUserInfo')
  },
  getUserInfo (e) {
    this.commitGlobal('updateUserInfo', e.detail.userInfo)
  },
  onTabClick(e) {
    const index = e.detail.index
    this.commit('updateActiveTab', {
      index,
    });
  },
  /**
   * 输入事件
   * @param {*} e
   */
  bindKeyInput(e) {
    const inputValue = e.detail.value.trim();
    this.commit('updateInputValue', inputValue);
  },

  /**
   * 添加条目并清空输入框
   */
  addItem() {
    const {
      inputValue
    } = this.state;
    if (!inputValue) {
      return wx.showModal({
        title: '任务名称不能为空',
        confirmText: '我知道了',
        showCancel: false
      });
    }

    this.dispatch('addItem', {
      inputValue
    });
    this.commit('updateInputValue', '');
  },
    /**
   * 切换条目状态
   * @param {*} key
   */
  toggleFinished(e) {
    const key = e.detail.key
    this.dispatch('setItemStatus', { key });
  },
    /**
   * 删除条目
   * @param {*} key
   */
  removeItem(e) {
    const key = e.detail.key
    this.dispatch('removeItem', { key });
  },

})