import Taro from '@tarojs/taro'
import { MethodHandler } from 'src/utils/handler'

export const getSelectedTextRange: typeof Taro.getSelectedTextRange = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'getSelectedTextRange', success, fail, complete })
  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.getSelectedTextRange({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}
