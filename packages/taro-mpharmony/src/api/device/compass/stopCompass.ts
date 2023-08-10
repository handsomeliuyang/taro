import Taro from '@tarojs/api'
import { MethodHandler } from 'src/utils/handler'

/**
 * 停止监听罗盘数据
 */
export const stopCompass: typeof Taro.stopCompass = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'stopCompass', success, fail, complete })
  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.stopCompass({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}