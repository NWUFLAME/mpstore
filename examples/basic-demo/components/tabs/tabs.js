// components/tabs/tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array
    },
    currentTabIndex : {
      type:  Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTabsItemTap(e) {
      this.triggerEvent('tabclick',{index : e.currentTarget.dataset.index})
    }
  }
})
