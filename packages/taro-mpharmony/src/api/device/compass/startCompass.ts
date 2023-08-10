import Taro from '@tarojs/api'
import { MethodHandler } from 'src/utils/handler'

/**
 * 开始监听罗盘数据
 */
export const startCompass: typeof Taro.startCompass = ({ success, fail, complete } = {}) => {
  const handle = new MethodHandler({ name: 'startCompass', success, fail, complete })
  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.startCompass({
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (res: any) => {
        handle.fail(res, { resolve, reject })
      },
    })
  })
}