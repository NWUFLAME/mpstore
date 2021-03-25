export default {
  state: {
    /**
     * todo-list
     */
    list: [{
      content: '臭豆腐',
      finished: true,
      key: 0
    }, {
      content: '俘虏',
      finished: true,
      key: 1
    }, {
      content: '柠檬',
      finished: false,
      key: 2
    }, {
      content: '小汉堡',
      finished: false,
      key: 3
    }],

    /**
     * 输入的todo
     */
    inputValue: '',

    /**
     * tab index
     */
    activeTab: 0,
    tabs: ['全部', '待完成', '已完成']
  },
  getters: {
    isShowList({
      globalState,
      state
    }) {
      if (state.activeTab === 0) return true;
      const status = !(state.activeTab === 1);
      return state.list.length && state.activeTab === 0 || state.list.some(item => item.finished === status);
    },

    dataSource({
      globalState,
      state,
      getters,
      globalGetters
    }) {
      if (state.activeTab === 0) return state.list;
      const status = !(state.activeTab === 1);
      return state.list.filter(item => item.finished === status);
    },
  },
  actions: {
    /**
     * 增加todo
     * @param {*} param0
     * @param {*} payload
     */
    addItem({ commit }, payload) {
      commit('addListItem', payload);
    },

    /**
     * 删除todo
     * @param {*} param0
     * @param {*} payload
     */
    removeItem({ commit }, payload) {
      commit('removeListItem', payload);
    },

    /**
     * 更新todo状态
     * @param {*} param0
     * @param {*} payload
     */
    setItemStatus({ commit }, payload) {
      commit('updateItemStatus', payload);
    }

  },
  mutations: {
    /**
     * 更改输入
     * @param {*} state
     * @param {*} payload
     */
    updateInputValue(state, payload) {
      state.inputValue = payload;
    },
    /**
     * 更改tab的index
     * @param {*} state
     * @param {*} payload
     */
    updateActiveTab(state, payload) {
      const { index } = payload;
      state.activeTab = index;
    },
    /**
     * 增加todo
     * @param {*} state
     * @param {*} payload
     */
    addListItem(state, payload) {
      const { inputValue: content } = payload;
      state.list.push({
        content,
        finished: false,
        key: state.list.length,
      });
    },
    /**
     * 删除todo
     * @param {*} state
     * @param {*} payload
     */
    removeListItem(state, { key }) {
      const index = state.list.findIndex(item => item.key === key);
      state.list.splice(index, 1);
    },
    /**
     * 更新todo
     * @param {*} state
     * @param {*} payload
     */
    updateItemStatus(state, { key }) {
      const index = state.list.findIndex(item => item.key === key);
      state.list[index].finished = !state.list[index].finished;
    },
  },
}