import Taro from '@tarojs/taro'
import { MethodHandler } from 'src/utils/handler'

export const getScreenBrightness: typeof Taro.getScreenBrightness = ({ success, fail, complete } = {}) => {
  return new Promise((resolve, reject) => {
    const handle = new MethodHandler({ name: 'getScreenBrightness', success, fail, complete })
    // @ts-ignore
    native.getScreenBrightness({
      success: (res: any) => {
        return handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        return handle.fail(res, { resolve, reject })
      }
    })
  })
}
