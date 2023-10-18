/**
 * 该模块仅存放 convert 转换时用到的工具函数或变量
 */

export const cacheOptions = {
  cacheOptions: {},
  setOptionsToCache: function (options) {
    if (Object.keys(options).length !== 0) {
      this.cacheOptions = options
    }
  },
  getOptionsFromCache: function () {
    return this.cacheOptions
  }
}  

export const convertToArray = function (value, fn) {
  if (value instanceof Array) {
    return value.map(fn)
  } else if (typeof value === 'number') {
    return Array.from({
      length: value
    }, (_, index) => index).map(fn)
  } else if (typeof value === 'string') {
    return Array.from(value).map(fn)
  } else if (typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype) {
    const result = Object.keys(value).map((item) => {
      return fn(value[item], item)
    })
    return result
  }
}