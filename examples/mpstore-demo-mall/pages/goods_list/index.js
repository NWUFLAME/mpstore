/* 
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1 找到滚动条触底事件  微信小程序官方开发文档寻找
  2 判断还有没有下一页数据
    1 获取到总页数  只有总条数
      总页数 = Math.ceil(总条数 /  页容量  pagesize)
      总页数     = Math.ceil( 23 / 10 ) = 3
    2 获取到当前的页码  pagenum
    3 判断一下 当前的页码是否大于等于 总页数 
      表示 没有下一页数据

  3 假如没有下一页数据 弹出一个提示
  4 假如还有下一页数据 来加载下一页数据
    1 当前的页码 ++
    2 重新发送请求
    3 数据请求回来  要对data中的数组 进行 拼接 而不是全部替换！！！
2 下拉刷新页面
  1 触发下拉刷新事件 需要在页面的json文件中开启一个配置项
    找到 触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动的关闭 等待效果

 */
import mpstore from '../../utils/mpstore'
import store from './store'
mpstore.Page(store, {

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.commit('updateParams', {
      cid: options.cid || '',
      query: options.query || ''
    })

    this.dispatch('getGoodsList')
  },


  // 标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {

    // 1 获取被点击的标题索引
    const {
      index
    } = e.detail;
    this.commit('updateActiveTabsItem', {
      index
    })
  },
  // 页面上滑 滚动条触底事件
  onReachBottom() {
    //  1 判断还有没有下一页数据
    if (this.data.params.pagenum > this.data.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据'
      })

    } else {
      this.dispatch('getGoodsList');
    }
  },
  // 下拉刷新事件 
  onPullDownRefresh() {
    this.commit('updateGoodsList', [])
    this.commit('updateParams', {
      pagenum: 1
    })
    this.dispatch('getGoodsList')
  }
})