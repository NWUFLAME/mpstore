export default {
  state: {
    userInfo: {
      nickName: 'mpstore',
      avatarUrl: '',
    },

  },
  getters: {
    userNameLen({
      state
    }) {
      return state.userInfo.nickName.length
    },
  },
  actions: {
    getUserInfo({ commit }) {
      wx.getUserInfo({
        success: res => {
          console.log('success', res);
          commit('updateUserInfo', res.userInfo)
        },
        fail: e=>console.log(e)
      })
    },

  },
  mutations: {
    updateUserInfo(state, payload) {
      Object.assign(state.userInfo, payload);
    },

  },
  //无脑全部更新，组件或页面不需要声明 use
  updateAll: false,
  logger: false
}