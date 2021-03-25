/* 
1 输入框绑定 值改变事件 input事件
  1 获取到输入框的值
  2 合法性判断 
  3 检验通过 把输入框的值 发送到后台
  4 返回的数据打印到页面上
2 防抖 （防止抖动） 定时器  节流 
  0 防抖 一般 输入框中 防止重复输入 重复发送请求
  1 节流 一般是用在页面下拉和上拉 
  1 定义全局的定时器id
 */
import mpstore from '../../utils/mpstore'
import store from './store'
mpstore.Page(store, {

  TimeId:-1,
  // 输入框的值改变 就会触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value}=e.detail;
    this.commit('updateInpValue', e.detail.value)
    // 2 检测合法性
    if(!value.trim()){
      clearTimeout(this.TimeId);
      this.commit('updateGoods', [])
      // 值不合法
      return;
    }
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.dispatch('qsearch', {query:value});
    }, 1000);
  },

  // 点击 取消按钮
  handleCancel(){
    this.commit('updateInpValue', '')
    this.commit('updateGoods', [])
  }
})