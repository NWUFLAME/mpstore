import mpstore from '../../utils/mpstore'
import store from './store'
mpstore.Page(store, {

  onLoad: function (options) {
    this.dispatch('getSwiperList');
    this.dispatch('getCateList');
    this.dispatch('getFloorList');
      
  },
})

