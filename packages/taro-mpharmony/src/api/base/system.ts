import Taro from '@tarojs/api'

import { shouldBeObject, temporarilyNotSupport } from '../../utils'
import { MethodHandler } from '../../utils/handler'

/** 跳转系统蓝牙设置页 */
export const openSystemBluetoothSetting = /* @__PURE__ */ temporarilyNotSupport('openSystemBluetoothSetting')

/** 跳转系统微信授权管理页 */
export const openAppAuthorizeSetting: typeof Taro.openAppAuthorizeSetting = (options) => {
  const name = 'openAppAuthorizeSetting'
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  // @ts-ignore
  const ret = native.openAppAuthorizeSetting({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}


interface getWindowInfoOption {
  /** 接口调用成功的回调函数 */
  success?: (res: typeof  Taro.getWindowInfo) => void
  /** 接口调用失败的回调函数 */
  fail?: (res: TaroGeneral.CallbackResult) => void
  /** 接口调用结束的回调函数（调用成功、失败都会执行） */
  complete?: (res: TaroGeneral.CallbackResult | typeof  Taro.getWindowInfo) => void
}

/** 获取窗口信息 */
// @ts-ignore
export const getWindowInfo: typeof Taro.getWindowInfo = (options:getWindowInfoOption) => {
  const name = 'getWindowInfo'
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail })

  // @ts-ignore
  native.getWindowInfo({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
}


/** 获取设备设置 */
export const getSystemSetting: typeof Taro.getSystemSetting = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getSystemSetting()))

  return info
}

/** 获取设备信息 */
export const getDeviceInfo: typeof Taro.getDeviceInfo = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getDeviceInfo()))

  return info
}

/** 获取鸿蒙APP基础信息 */
// @ts-ignore
export const getAppBaseInfo: typeof Taro.getAppBaseInfo = (options = {}) => {
  // @ts-ignore
  const { success, fail } = options
  const handle = new MethodHandler({ name: 'getAppBaseInfo', success, fail })
  // @ts-ignore
  native.getAppBaseInfo({
    success:(res)=>{
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
}


interface getAppAuthorizeSettingOption {
  /** 接口调用成功的回调函数 */
  success?: (res: typeof Taro.getAppAuthorizeSetting) => void
  /** 接口调用失败的回调函数 */
  fail?: (res: TaroGeneral.CallbackResult) => void
}
/** 获取鸿蒙授权设置 */
// @ts-ignore
export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = (options:getAppAuthorizeSettingOption) => {   
  const name = 'getAppAuthorizeSetting'
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail
  } = options as Exclude<typeof options, undefined>
  
  // @ts-ignore
  const handle = new MethodHandler({ name, success, fail })

  // @ts-ignore
  native.getAppAuthorizeSetting({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
}

/** 获取系统信息 */
export const getSystemInfoAsync: typeof Taro.getSystemInfoAsync = (options:Taro.getSystemInfoAsync.Option) => {
  const name = 'getSystemInfoAsync'
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail,
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail,complete })
  try {
    // @ts-ignore
    const info = JSON.parse(JSON.stringify(native.getSystemInfoSync()))
    return handle.success(info)
  } catch (error) {
    return handle.fail({
      errMsg: error
    })
  }
}


/** 获取系统信息 */
export const getSystemInfoSync: typeof Taro.getSystemInfoSync = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getSystemInfoSync()))
  return info
}

/** 获取系统信息 */
// @ts-ignore
export const getSystemInfo: typeof Taro.getSystemInfo = (options = {}) => {
  const name = 'getSystemInfo'
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }
  const {
    success,
    fail
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail })

  // @ts-ignore
  native.getSystemInfo({
    success: (res: any) => {
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
}