import Taro from '@tarojs/taro'
import { MethodHandler } from 'src/utils/handler'

export const hideKeyboard: typeof Taro.hideKeyboard = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'hideKeyboard', success, fail, complete })
  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.hideKeyboard({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
