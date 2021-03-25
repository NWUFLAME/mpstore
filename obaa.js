/* obaa 1.0.0
 * By dntzhang
 * Github: https://github.com/Tencent/omi
 * MIT Licensed.
 */

export default function obaa(target, arr, callback) {
  var _observe = function (target, arr, callback) {
    //if (!target.$observer) target.$observer = this
    var $observer = this
    var eventPropArr = []
    // 如果目标是个数组
    if (obaa.isArray(target)) {
      if (target.length === 0) {
        $observer.track(target)
      }
      // 对数组进行hack处理，弥补Object.defineProperty对数组支持的不足
      $observer.mock(target)
    }
    // 如果目标是个空对象
    if (target && typeof target === 'object' && Object.keys(target).length === 0) {
      $observer.track(target)
    }
    for (var prop in target) {
      if (target.hasOwnProperty(prop)) {
        // comment by yulan
        if (callback) {
          if (obaa.isArray(arr) && obaa.isInArray(arr, prop)) {
            eventPropArr.push(prop)
            $observer.watch(target, prop)
          } else if (obaa.isString(arr) && prop == arr) {
            eventPropArr.push(prop)
            $observer.watch(target, prop)
          }
        } else {
        eventPropArr.push(prop)
        // 浅层监视每个target属性
        $observer.watch(target, prop)
        }
      }
    }
    $observer.target = target
    if (!$observer.propertyChangedHandler)
      $observer.propertyChangedHandler = []
    var propChanged = callback ? callback : arr
    $observer.propertyChangedHandler.push({
      all: !callback, //true
      propChanged: propChanged, // 第二个参数arr
      eventPropArr: eventPropArr // target所有属性
    })
  }
  _observe.prototype = {
    onPropertyChanged: function (prop, value, oldValue, target, path) {
      if (value !== oldValue && (!(nan(value) && nan(oldValue))) && this.propertyChangedHandler) {
        var rootName = obaa._getRootName(prop, path)
        for (
          var i = 0, len = this.propertyChangedHandler.length; i < len; i++
        ) {
          var handler = this.propertyChangedHandler[i]
          if (
            handler.all ||
            obaa.isInArray(handler.eventPropArr, rootName) ||
            rootName.indexOf('Array-') === 0
          ) {
            handler.propChanged.call(this.target, prop, value, oldValue, path)
          }
        }
      }
      if (prop.indexOf('Array-') !== 0 && typeof value === 'object') {
        this.watch(target, prop, target.$observeProps.$observerPath)
      }
    },
    mock: function (target) {
      var self = this
      obaa.methods.forEach(function (item) {
        target[item] = function () {
          // 修改之前的数组
          var old = Array.prototype.slice.call(this, 0)
          var result = Array.prototype[item].apply(
            this,
            Array.prototype.slice.call(arguments)
          )
          // 判断是否修改数组
          if (new RegExp('\\b' + item + '\\b').test(obaa.triggerStr)) {
            // 监听数组每个元素
            Object.keys(this).forEach(cprop => {
              if (!obaa.isFunction(this[cprop])) {
                self.watch(this, cprop, this.$observeProps.$observerPath)
              }
            })
            // for (var cprop in this) {
            //   if (
            //     this.hasOwnProperty(cprop) &&
            //     !obaa.isFunction(this[cprop])
            //   ) {
            //     self.watch(this, cprop, this.$observeProps.$observerPath)
            //   }
            // }
            //todo
            self.onPropertyChanged(
              'Array-' + item,
              this,
              old,
              this,
              this.$observeProps.$observerPath
            )
          }
          return result
        }
        // pure方法，不引起视图更新
        target[
          'pure' + item.substring(0, 1).toUpperCase() + item.substring(1)
        ] = function () {
          return Array.prototype[item].apply(
            this,
            // 伪数组转数组。可以用Array.from
            Array.prototype.slice.call(arguments)
          )
        }
      })
    },
    watch: function (target, prop, path) {
      if (prop === '$observeProps' || prop === '$observer') return
      if (obaa.isFunction(target[prop])) return
      if (!target.$observeProps) {
        Object.defineProperty(target, '$observeProps', {
          configurable: true,
          enumerable: false,
          writable: true,
          value: {}
        })
      }
      if (path !== undefined) {
        target.$observeProps.$observerPath = path
      } else {
        target.$observeProps.$observerPath = '#'
      }
      var self = this
      var currentValue = (target.$observeProps[prop] = target[prop])
      Object.defineProperty(target, prop, {
        configurable: true,
        get: function () {
          return this.$observeProps[prop]
        },
        // 劫持修改
        set: function (value) {
          var old = this.$observeProps[prop]
          this.$observeProps[prop] = value
          self.onPropertyChanged(
            prop,
            value,
            old,
            this,
            target.$observeProps.$observerPath
          )
        }
      })
      if (typeof currentValue == 'object' && currentValue !== null) {
        if (obaa.isArray(currentValue)) {
          this.mock(currentValue)
          //为0，就不会进下面的 for 循环，就不会执行里面的 watch，就不会有 $observeProps 属性
          if (currentValue.length === 0) {
            this.track(currentValue, prop, path)
          }
        }
        if (currentValue && Object.keys(currentValue).length === 0) {
          this.track(currentValue, prop, path)
        }
        // for (var cprop in currentValue) {
        //   if (currentValue.hasOwnProperty(cprop)) {
        //     this.watch(
        //       currentValue,
        //       cprop,
        //       target.$observeProps.$observerPath + '-' + prop
        //     )
        //   }
        // }
        Object.keys(currentValue).forEach(cprop => {
          this.watch(
            currentValue,
            cprop,
            target.$observeProps.$observerPath + '-' + prop
          )
        })
      }
    },
    track: function (obj, prop, path) {
      if (obj.$observeProps) {
        return
      }
      Object.defineProperty(obj, '$observeProps', {
        configurable: true,
        enumerable: false,
        writable: true,
        value: {}
      })
      if (path !== undefined && path !== null) {
        obj.$observeProps.$observerPath = path + '-' + prop
      } else {
        if (prop !== undefined && prop !== null) {
          obj.$observeProps.$observerPath = '#' + '-' + prop
        } else {
          obj.$observeProps.$observerPath = '#'
        }
      }
    }
  }
  return new _observe(target, arr, callback)
}

obaa.methods = [
  'concat',
  'copyWithin',
  'entries',
  'every',
  'fill',
  'filter',
  'find',
  'findIndex',
  'forEach',
  'includes',
  'indexOf',
  'join',
  'keys',
  'lastIndexOf',
  'map',
  'pop',
  'push',
  'reduce',
  'reduceRight',
  'reverse',
  'shift',
  'slice',
  'some',
  'sort',
  'splice',
  'toLocaleString',
  'toString',
  'unshift',
  'values',
  'size'
]
obaa.triggerStr = [
  'concat',
  'copyWithin',
  'fill',
  'pop',
  'push',
  'reverse',
  'shift',
  'sort',
  'splice',
  'unshift',
  'size'
].join(',')

obaa.isArray = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

obaa.isString = function (obj) {
  return typeof obj === 'string'
}

obaa.isInArray = function (arr, item) {
  for (var i = arr.length; --i > -1;) {
    if (item === arr[i]) return true
  }
  return false
}

obaa.isFunction = function (obj) {
  return Object.prototype.toString.call(obj) == '[object Function]'
}

obaa._getRootName = function (prop, path) {
  if (path === '#') {
    return prop
  }
  return path.split('-')[1]
}

obaa.add = function (obj, prop) {
  var $observer = obj.$observer
  $observer.watch(obj, prop)
}

obaa.set = function (obj, prop, value, oba) {
  // if (exec) {
  //   obj[prop] = value
  // }
  if (obj[prop] === undefined) {
    var $observer = obj.$observer || oba
    $observer.watch(obj, prop, obj.$observeProps.$observerPath)
  }
  //if (!exec) {
  obj[prop] = value
  //}
}

Array.prototype.size = function (length) {
  this.length = length
}

function nan(value) {
  return typeof value === "number" && isNaN(value)
}