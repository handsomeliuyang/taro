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
  return new Promise<TaroGeneral.CallbackResult>((resolve, reject) => {
    // @ts-ignore
    native.openAppAuthorizeSetting({
      success: (res: any) => {
        return handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        return handle.fail(err, { resolve, reject })
      }
    })
  })
}

/** 获取窗口信息 */
export const getWindowInfo: typeof Taro.getWindowInfo = () => {

  // @ts-ignore
  const info = native.getWindowInfo()
  const res: Taro.getWindowInfo.Result = {
    pixelRatio: info.pixelRatio,
    screenWidth: info.pixelRatio,
    screenHeight: info.screenHeight,
    windowWidth: info.windowWidth,
    windowHeight: info.windowHeight,
    statusBarHeight: info.statusBarHeight,
    safeArea: info.safeArea || {
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 0
    }
  }
  return res
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

  return {
    ...info,
    platform: 'harmony'
  }
}

/** 获取微信APP基础信息 */
export const getAppBaseInfo: typeof Taro.getAppBaseInfo = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getAppBaseInfo()))
  return {
    ...info,
    version: info.appVersion,
    language: info.appLanguage
  }
}

/** 获取微信APP授权设置 */
export const getAppAuthorizeSetting: typeof Taro.getAppAuthorizeSetting = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getAppAuthorizeSetting()))
  return {
    ...info,
    locationReducedAccuracy: info.locationAccuracy
  }
}

/** 获取设备设置 */
export const getSystemInfoSync: typeof Taro.getSystemInfoSync = () => {
  // @ts-ignore
  const info = JSON.parse(JSON.stringify(native.getSystemInfoSync()))
  const windowInfo = getWindowInfo()
  const systemSetting = getSystemSetting()
  const deviceInfo = getDeviceInfo()
  const appBaseInfo = getAppBaseInfo()
  const appAuthorizeSetting = getAppAuthorizeSetting()
  return {
    ...info,
    ...windowInfo,
    ...systemSetting,
    ...deviceInfo,
    ...appBaseInfo,
    ...appAuthorizeSetting
  }
}

/** 获取系统信息 */
export const getSystemInfoAsync: typeof Taro.getSystemInfoAsync = async (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'getSystemInfoAsync', success, fail, complete })

  try {
    const info = await getSystemInfoSync()
    return handle.success(info)
  } catch (error) {
    return handle.fail({
      errMsg: error
    })
  }
}

/** 获取系统信息 */
export const getSystemInfo: typeof Taro.getSystemInfo = async (options = {}) => {
  const { success, fail, complete } = options
  const handle = new MethodHandler({ name: 'getSystemInfo', success, fail, complete })

  try {
    const info = await getSystemInfoSync()
    return handle.success(info)
  } catch (error) {
    return handle.fail({
      errMsg: error
    })
  }
}
