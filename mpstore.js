/*!
 *  MPStore v1.0.0 by yulan
 *  Github: https://github.com/NWUFLAME/mpstore
 *  MIT Licensed.
 */

import obaa from './obaa'
import {
  getPath,
  needUpdate,
  fixPath,
  getUsing
} from './path'


// function forEachValue(obj, callback) {
//   Object.keys(obj).forEach(key => callback(obj[key], key))
// }

// 全局store
let globalStore = null;
let gettersWM = new WeakMap();
let storeToIns = new WeakMap();


function mpstore(store, option, isGlobal) {
  // 全局store
  if (isGlobal) {
    option.getters = store.getters;
    // 初始化getters
    gettersWM.set(store, {})
    if (!store.instances) {
      store.instances = {}
    }

    if (!store.__changes_) {
      store.__changes_ = []
    }

    store.mutations = store.mutations || {};
    // forEachValue(store.mutations, (fn, key) => {
    //   store.mutations[key] = (payload) => {
    //     console.log('>>>>' ,payload, key);
    //     fn.call(store, store.state, payload)
    //   }
    // });
    option.commit = (type, payload) => {
      store.mutations[type](store.state, payload);
    }

    store.actions = store.actions || {};
    // forEachValue(store.actions, (fn, key) => {
    //   store.actions[key] = (payload) => fn.call(store, store, payload);
    // });
    option.dispatch = (type, payload) => {
      store.actions[type]({
        state: store.state,
        globalState: store.state,
        dispatch: option.dispatch,
        dispatchGlobal: option.dispatch,
        commit: option.commit,
        commitGlobal: option.commit,
        getters: gettersWM.get(globalStore),
        globalGetters: gettersWM.get(globalStore)
      }, payload);
    }


    const changes = store.__changes_
    if (!store.onChange) {
      // 订阅
      store.onChange = function (fn) {
        changes.push(fn)
      }
    }

    if (!store.offChange) {
      // 取消订阅
      store.offChange = function (fn) {
        for (let i = 0, len = changes.length; i < len; i++) {
          if (changes[i] === fn) {
            changes.splice(i, 1)
            break
          }
        }
      }
    }
    // getters里再次访问getters的实现
    store.gettersProxyObj = {}
    Object.keys(store.getters||{}).forEach(gettersName=>{
      Object.defineProperty(store.gettersProxyObj, gettersName, {
        enumerable: true,
        get: function () {
          return store.getters[gettersName]({
            globalState: globalStore.state,
            state: globalStore.state,
            getters: store.gettersProxyObj,
            globalGetters: store.gettersProxyObj,
          })
        },
        // getters禁止赋值
        set: function () {
          throw new Error('Illegal operation, getters are readonly.')
        }
      })
    })
    option.globalData = option.globalData || {}
    // const hasData = typeof option.data !== 'undefined'

    Object.assign(option.globalData, option.state)
    // let clone
    // if (option.data) {
    // 如果页面有data，为了不同名属性覆盖，将store的数据挂到$上
    // clone = JSON.parse(JSON.stringify(option.data))
    // option.data.$ = store.data
    // option.state = store.state

    // option.data.$globalState = store.state
    // } else {
    // 页面如果没有定义data，直接赋值store的data
    // option.data = store.data
    // }
    observeStore(store, true)
    const onLaunch = option.onLaunch
    // AOP 劫持原有onLaunch
    option.onLaunch = function (e) {
      this.store = store
      globalStore = store

      Object.defineProperty(this, 'state', {
        enumerable: true,
        get: function () {
          return this.store.state
        },
        // 由于store.data是响应式对象，禁止直接整个替换，避免失去响应性
        set: function () {
          throw new Error('You must not replace store.state directly, instead assign nest prop')
        }
      })
      Object.defineProperty(this, 'getters', {
        enumerable: true,
        get: function () {
          const res = gettersWM.get(globalStore)
          return res
        },
        // 由于store.data是响应式对象，禁止直接整个替换，避免失去响应性
        set: function () {
          throw new Error('getters are readonly')
        }
      })


      option.use && (this.__updatePath = getPath(option.use))
      this.__use = option.use
      // this.__hasData = hasData
      // if (hasData) {
      // Object.assign(option.data, JSON.parse(JSON.stringify(clone)))
      // }

      // this.getters = option.getters

      // this.setData(option.data)
      const using = getUsing(store.state, option.use)
      option.getters && compute(option.getters, store, using, this)
      // this.setData(using)

      onLaunch && onLaunch.call(this, e)
    }

    App(option)
  } // 页面
  else if (arguments.length === 2) {

    // 生成快照
    option.__initStateSnapShot__ = JSON.stringify(store.state);
    // 初始化getters
    gettersWM.set(store, {})
    if (!globalStore.instances) {
      globalStore.instances = {}
    }

    if (!store.__changes_) {
      store.__changes_ = []
    }

    store.mutations = store.mutations || {};
    // forEachValue(store.mutations, (fn, key) => {
    //   store.mutations[key] = (payload) => {
    //     console.log('>>>>' ,payload, key);
    //     fn.call(store, store.state, payload)
    //   }
    // });
    option.getters = store.getters;
    
    // getters里再次访问getters的实现
    store.gettersProxyObj = {}
    Object.keys(store.getters||{}).forEach(gettersName=>{
      Object.defineProperty(store.gettersProxyObj, gettersName, {
        enumerable: true,
        get: function () {
          return store.getters[gettersName]({
            globalState: globalStore.state,
            state: store === globalStore? globalStore.state : store.state,
            getters: store.gettersProxyObj,
            globalGetters: globalStore.gettersProxyObj,
          })
        },
        // getters禁止赋值
        set: function () {
          throw new Error('Illegal operation, getters are readonly.')
        }
      })
    })

    option.commitGlobal = (type, payload) => {
      globalStore.mutations[type](globalStore.state, payload);
    }
    option.commit = (type, payload) => {
      store.mutations[type](store.state, payload);
    }
    store.actions = store.actions || {};
    // forEachValue(store.actions, (fn, key) => {
    //   store.actions[key] = (payload) => fn.call(store, store, payload);
    // });
    option.dispatchGlobal = (type, payload) => {
      globalStore.actions[type]({
        state: globalStore.state,
        globalState: globalStore.state,
        dispatch: option.dispatchGlobal,
        dispatchGlobal: option.dispatchGlobal,
        commit: option.commitGlobal,
        commitGlobal: option.commitGlobal,
        getters: gettersWM.get(globalStore),
        globalGetters: gettersWM.get(globalStore)
      }, payload);
    }
    option.dispatch = (type, payload) => {
      store.actions[type]({
        state: store.state,
        globalState: globalStore.state,
        dispatch: option.dispatch,
        dispatchGlobal: option.dispatchGlobal,
        commit: option.commit,
        commitGlobal: option.commitGlobal,
        getters: gettersWM.get(store),
        globalGetters: gettersWM.get(globalStore)
      }, payload);
    }

    const changes = store.__changes_
    if (!store.onChange) {
      // 订阅
      store.onChange = function (fn) {
        changes.push(fn)
      }
    }

    if (!store.offChange) {
      // 取消订阅
      store.offChange = function (fn) {
        for (let i = 0, len = changes.length; i < len; i++) {
          if (changes[i] === fn) {
            changes.splice(i, 1)
            break
          }
        }
      }
    }
    option.data = option.data || {}
    // const hasData = typeof option.data !== 'undefined'
    Object.assign(option.data, store.state)
    // let clone
    // if (option.data) {
    // 如果页面有data，为了不同名属性覆盖，将store的数据挂到$上
    // clone = JSON.parse(JSON.stringify(option.data))
    // option.data.$ = store.data
    // option.state = store.state

    option.data.$globalState = globalStore.state
    option.data.$globalGetters = gettersWM.get(globalStore)
    // } else {
    // 页面如果没有定义data，直接赋值store的data
    // option.data = store.data
    // }
    observeStore(store)
    const onLoad = option.onLoad
    const onUnload = option.onUnload
    // AOP 劫持原有OnLoad
    option.onLoad = function (e) {
      // 设置Store和页面实例的映射关系
      storeToIns.set(store, this)
      this.store = store
      Object.defineProperty(this, 'state', {
        enumerable: true,
        get: function () {

          const res = this.store.state
          return res
        },
        // 由于store.data是响应式对象，禁止直接整个替换，避免失去响应性
        set: function () {
          throw new Error('You must not replace store.state directly, instead assign nest prop')
        }
      })
      Object.defineProperty(this, 'globalState', {
        enumerable: true,
        get: function () {

          const res = globalStore.state
          return res
        },
        // 由于store.data是响应式对象，禁止直接整个替换，避免失去响应性
        set: function () {
          throw new Error('You must not replace store.state directly, instead assign nest prop')
        }
      })
      Object.defineProperty(this, 'getters', {
        enumerable: true,
        get: function () {

          const res = gettersWM.get(this.store)
          return res
        },
        // 由于store.data是响应式对象，禁止直接整个替换，避免失去响应性
        set: function () {
          throw new Error('You must not replace store.state directly, instead assign nest prop')
        }
      })
      Object.defineProperty(this, 'globalGetters', {
        enumerable: true,
        get: function () {

          const res = gettersWM.get(globalStore)
          return res
        },
        // 由于store.data是响应式对象，禁止直接整个替换，避免失去响应性
        set: function () {
          throw new Error('You must not replace store.state directly, instead assign nest prop')
        }
      })

      option.use && (this.__updatePath = getPath(option.use))
      this.__use = option.use
      // this.__hasData = hasData
      // if (hasData) {
      // Object.assign(option.data, JSON.parse(JSON.stringify(clone)))
      // }

      // 当前路径作为key, 页面实例作为value保存
      globalStore.instances[this.route] = globalStore.instances[this.route] || []
      globalStore.instances[this.route].push(this)
      // this.getters = option.getters
      this.setData(option.data)
      const using = getUsing(store.state, option.use)

      option.getters && compute(option.getters, store, using, this)
      this.setData(using)

      onLoad && onLoad.call(this, e)
    }

    option.onUnload = function (e) {
      // 基于快照清除副作用
      const bak = JSON.parse(this.__initStateSnapShot__)
      Object.keys(bak).forEach(key => {
        store.state[key] = bak[key]
      })
      this.setData({
        ...bak
      })
      // 页面销毁时，删除kv
      globalStore.instances[this.route] = globalStore.instances[this.route].filter(ins => ins !== this)
      // 执行原有方法
      onUnload && onUnload.call(this, e)

    }

    Page(option)
  } else {
    // 组件
    store.lifetimes = store.lifetimes || {}
    const ready = store.lifetimes.ready || store.ready

    store.ready = store.lifetimes.ready = function () {
      const page = getCurrentPages()[getCurrentPages().length - 1]
      store.use && (this.__updatePath = getPath(store.use))
      this.store = page.store
      this.__use = store.use

      this.getters = store.getters
      store.state = this.store.state
      this.setData(store.state)
      const using = getUsing(this.store.state, store.use)
      store.getters && compute(store.getters, this.store, using, this)
      this.setData(using)

      page._mpsComponents = page._mpsComponents || []
      page._mpsComponents.push(this)
      ready && ready.call(this)
    }
    Component(store)
  }
}

mpstore.Page = function (store, option) {
  mpstore(store, option)
}

mpstore.App = function (store, option) {
  mpstore(store, option, true)
}

mpstore.Component = function (store, option) {
  if (arguments.length === 2) {
    if (!globalStore.instances) {
      globalStore.instances = {}
    }

    if (!store.__changes_) {
      store.__changes_ = []
    }

    const changes = store.__changes_
    if (!store.onChange) {
      store.onChange = function (fn) {
        changes.push(fn)
      }
    }

    if (!store.offChange) {
      store.offChange = function (fn) {
        for (let i = 0, len = changes.length; i < len; i++) {
          if (changes[i] === fn) {
            changes.splice(i, 1)
            break
          }
        }
      }
    }
    const hasData = typeof option.data !== 'undefined'
    let clone
    if (option.data) {
      clone = JSON.parse(JSON.stringify(option.data))
      option.data.$ = store.state
    } else {
      option.data = store.state
    }
    observeStore(store)

    const detached = option.detached

    option.lifetimes = option.lifetimes || {}
    const created = option.lifetimes.created || option.created
    const ready = option.lifetimes.ready || option.ready

    option.created = option.lifetimes.created = function (e) {
      this.store = store

      option.use && (this.__updatePath = getPath(option.use))
      this.__use = option.use
      this.__hasData = hasData
      if (hasData) {
        Object.assign(option.data, JSON.parse(JSON.stringify(clone)))
      }

      created && created.call(this, e)
    }

    option.ready = option.lifetimes.ready = function (e) {
      const store = this.store
      globalStore.instances[this.is] = globalStore.instances[this.is] || []
      globalStore.instances[this.is].push(this)
      this.getters = option.getters
      this.setData(option.data)
      const using = getUsing(store.state, option.use)
      console.log('333', using);
      option.getters && compute(option.getters, store, using, this)
      this.setData(using)

      ready && ready.call(this, e)
    }

    option.lifetimes.detached = option.detached = function (e) {
      globalStore.instances[this.is] = (globalStore.instances[this.is] || []).filter(ins => ins !== this)
      detached && detached.call(this, e)
    }

    Component(option)
  } else {
    store.lifetimes = store.lifetimes || {}
    const ready = store.lifetimes.ready || store.ready

    store.ready = store.lifetimes.ready = function () {
      const page = getCurrentPages()[getCurrentPages().length - 1]
      store.use && (this.__updatePath = getPath(store.use))
      this.store = page.store
      this.__use = store.use
      this.getters = store.getters
      store.state = this.store.state
      this.setData(store.state)
      const using = getUsing(this.store.state, store.use)
      console.log('444', using);
      store.getters && compute(store.getters, this.store, using, this)
      this.setData(using)

      page._mpsComponents = page._mpsComponents || []
      page._mpsComponents.push(this)
      ready && ready.call(this)
    }
    Component(store)
  }
}

function compute(getters, store, using, scope) {
  // 排除自带的webviewID, 以及全局状态，只留下页面状态
  // const { __webviewId__, $globalState, $globalGetters, ...state } = scope.data
  const getterCache = gettersWM.get(store)
  for (let key in getters) {
    // using[key] = getters[key].call(store.data, scope)
    getterCache[key] = using[key] = getters[key]({
      globalState: globalStore.state,
      // state: store === globalStore? globalStore.state : state,
      state: store.state,
      getters: store.gettersProxyObj,
      globalGetters: globalStore.gettersProxyObj,
    })
  }
}
// 使store变为响应式
function observeStore(store, isGlobal) {
  const oba = obaa(store.state, (prop, value, old, path) => {
    // 计算JSON Diff
    let patch = {}
    if (prop.indexOf('Array-push') === 0) {
      let dl = value.length - old.length
      for (let i = 0; i < dl; i++) {
        patch[fixPath(path + '-' + (old.length + i))] = value[(old.length + i)]
      }
    } else if (prop.indexOf('Array-') === 0) {
      patch[fixPath(path)] = value
    } else {
      patch[fixPath(path + '-' + prop)] = value
    }

    _update(patch, store, isGlobal)


  })

  if (!store.set) {
    // 类似Vue.set
    store.set = function (obj, prop, val) {
      obaa.set(obj, prop, val, oba)
    }
  }

  const backer = store.state
  Object.defineProperty(store, 'state', {
    enumerable: true,
    get: function () {
      return backer
    },
    // 由于store.data是响应式对象，禁止直接整个替换，避免失去响应性
    set: function () {
      throw new Error('You must not replace store.state directly, instead assign nest prop')
    }
  })
}

function _update(kv, store, isGlobal) {
  // 遍历所有页面
  if(isGlobal) {
    for (let key in globalStore.instances) {
      globalStore.instances[key].forEach(ins => {
        _updateOne(kv, store, ins, isGlobal)
        if (ins._mpsComponents) {
          ins._mpsComponents.forEach(compIns => {
            _updateOne(kv, store, compIns, isGlobal)
          })
        }
      })
    }
  } else {
    // 页面级store只需更新当前页面
    const ins = storeToIns.get(store)
    _updateOne(kv, store, ins, isGlobal)
  }
  // 通知所有的subscribers
  store.__changes_.forEach(change => {
    change(kv)
  })
  store.logger && storeChangeLogger(store, kv)
}
// 更新单个页面
function _updateOne(kv, store, ins, isGlobal) {
  if (!isGlobal) {
    return _updateImpl(kv, store, ins, isGlobal)
  }
  if (!(store.updateAll || ins.__updatePath && needUpdate(kv, ins.__updatePath))) {
    return
  }
  // if (!ins.__hasData) {
  //   return _updateImpl(kv, store, ins, isGlobal)
  // }
  // const patch = Object.assign({}, kv)
  // 如果本身有data，说明store的data在$上，自动加上$.前缀
  // for (let pk in patch) {
  //   if (!/\$\./.test(pk)) {
  //     patch['$globalState.' + pk] = kv[pk]
  //     delete patch[pk]
  //   }
  // }
  _updateImpl(kv, store, ins, isGlobal)
  // _updateImpl(patch, store, ins, isGlobal)
}

function _updateImpl(data, store, ins, isGlobal) {
  
  // 兼容处理
  if (!wx.nextTick) {
    return _doUpdate(data, store, ins, isGlobal)
  }
  if (ins._mpsDataBuffer === undefined) {
    // 数据缓冲区，暂存没有被commit的json diff patch
    ins._mpsDataBuffer = {}
  }
  Object.assign(ins._mpsDataBuffer, data)
  // 借鉴React，利用开关批量更新
  if (!ins._mpsTickScheduled) {
    // 更新入队
    wx.nextTick(function () {
      _doUpdate(ins._mpsDataBuffer, store, ins, isGlobal)
      // 清空缓冲区
      ins._mpsDataBuffer = {}
      // 打开开关
      ins._mpsTickScheduled = false
    })
    // 关闭开关
    ins._mpsTickScheduled = true
  }
}

function _doUpdate(data, store, ins, isGlobal) {
  // store = isGlobal? globalStore:store;
  // diff为空对象直接返回
  if (Object.keys(data).length === 0) {
    return
  }
  if (isGlobal) {
    // 处理全局对象
    for (let pk in data) {
      data['$globalState.' + pk] = data[pk]
      delete data[pk]
    }
  }
  if (ins && ins.setData) {
    ins.setData.call(ins, data)
  }
  const using = getUsing(store.state, ins.__use)
  // 如果有计算属性，重新执行
  // ins.getters && compute(isGlobal ? globalStore.getters : ins.getters, store, using, ins)
  ins.getters && compute(store.getters, store, using, ins)
  if (isGlobal) {
    // 如果是全局状态更新，则store不是页面store，再次计算页面store的getters
    ins.getters && compute(ins.store.getters, ins.store, using, ins)
    // 处理全局对象
    for (let pk in using) {
      if(Object.keys(globalStore.getters||{}).indexOf(pk)>-1) {
        using['$globalGetters.' + pk] = using[pk]
        delete using[pk]
      }
    }
  }
  
  if (ins && ins.setData) {
    ins.setData.call(ins, using)
  }
}
// 记录日志，类似redux-dev-tools
function storeChangeLogger(store, diffResult) {
  try {
    const preState = wx.getStorageSync(`CurrentState`) || {}
    const title = `Data Changed`
    console.groupCollapsed(`%c  ${title} %c ${Object.keys(diffResult)}`, 'color:#e0c184; font-weight: bold', 'color:#f0a139; font-weight: bold')
    console.log(`%c    Pre Data`, 'color:#ff65af; font-weight: bold', preState)
    console.log(`%c Change Data`, 'color:#3d91cf; font-weight: bold', diffResult)
    console.log(`%c   Next Data`, 'color:#2c9f67; font-weight: bold', store.state)
    console.groupEnd()
    wx.setStorageSync(`CurrentState`, store.state)
  } catch (e) {
    console.log(e)
  }
}



mpstore.obaa = obaa


export default mpstore