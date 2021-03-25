import {
  chooseAddress,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
import mpstore from '../../utils/mpstore'
import store from './store'
mpstore.Page(store, {

  onShow() {
    // 1 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 1 获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];
    this.commit('updateAddress', address);
    this.commit('updateCart', cart);

  },
  // 点击 收货地址
  async handleChooseAddress() {
    try {
      // 4 调用获取收货地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 5 存入到缓存中
      wx.setStorageSync("address", address)
    } catch (error) {
      console.log(error);
    }
  },
  // 商品的选中
  handeItemChange(e) {
    // 1 获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;

    this.commit('updateItemChoose', {
      goods_id
    })

    wx.setStorageSync("cart", this.data.cart);

  },

  // 商品全选功能
  handleItemAllCheck() {
    // 1 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    // 2 修改值
    allChecked = !allChecked;
    // 3 循环修改cart数组 中的商品选中状态
    cart.forEach(v => v.checked = allChecked)
    // 4 把修改后的值 填充回data或者缓存中
    this.commit('updateCart', cart)
    wx.setStorageSync("cart", cart)
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {


    // 1 获取传递过来的参数 
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    // 2 获取购物车数组
    let {
      cart
    } = this.data;
    // 3 找到需要修改的商品的索引
    const item = cart.find(v => v.goods_id === id);
    // 4 判断是否要执行删除
    if (item.num === 1 && operation === -1) {
      // 4.1 弹窗提示
      const res = await showModal({
        content: "您是否要删除？"
      });
      if (res.confirm) {
        this.commit('deleteCartItem', {
          goods_id: id
        })
      } else {
        return;
      }
    } else {
      // 4  进行修改数量
      this.commit('updateItemNum', {
        num: operation,
        goods_id: id
      })

    }
    // 5 设置回缓存和data中
    wx.setStorageSync("cart", this.data.cart);
  },
  // 点击 结算 
  async handlePay() {
    // 1 判断收货地址
    const {
      address,
      totalNum
    } = this.data;
    if (!address.userName) {
      await showToast({
        title: "您还没有选择收货地址"
      });
      return;
    }
    // 2 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({
        title: "您还没有选购商品"
      });
      return;
    }
    // 3 跳转到 支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });

  }
})