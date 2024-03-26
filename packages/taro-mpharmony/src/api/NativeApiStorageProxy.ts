import { NativeApi } from './NativeApi'

export interface Status {
  done: boolean
  data: string
  errorMsg: string
}

export class CacheStorageProxy {
  private cacheMap: Map<any, any>
  private readonly nativeApi: NativeApi
  private readonly asyncToSyncProxy: any

  constructor (nativeApi: NativeApi) {
    this.nativeApi = nativeApi
    this.cacheMap = new Map<string, any>()
    this.asyncToSyncProxy = new Proxy(nativeApi, new AsyncToSyncProxy(this.nativeApi))
  }

  // @ts-ignore
  get (target: { [x: string]: any }, prop: string) {
    if (prop === 'getStorageSync') {
      return (...args: any[]) => {
        const key = args[0].key
        if (this.cacheMap.has(key)) {
          return this.cacheMap.get(key)
        } else {
          const status = this.asyncToSyncProxy.getStorageSync({ key })
          if (status.done && status.errMsg === '') {
            this.cacheMap.set(key, status)
          }
          return status
        }
      }
    }
    if (prop === 'setStorageSync') {
      return (...args: any[]) => {
        const { key, data } = args[0]
        const status = this.asyncToSyncProxy.setStorageSync({ key, data })
        if (status.done && status.errMsg === '') {
          this.cacheMap.set(key, status)
        }
        return status
      }
    }
    return (...args: any[]) => {
      return this.asyncToSyncProxy[prop](...args)
    }
  }
}

class AsyncToSyncProxy {
  private readonly nativeApi: NativeApi
  private readonly STATUS: Status = { done: false, data: '', errorMsg: `search timeout` }
  private methods =
    [
      'setStorageSync',
      'removeStorageSync',
      'getStorageSync',
      'getStorageInfoSync',
      'clearStorageSync'
    ]

  constructor (nativeApi: NativeApi) {
    this.nativeApi = nativeApi
  }

  // @ts-ignore
  get (target: { [x: string]: any }, prop: string) {
    if (this.methods.includes(prop)) {
      return (...args: any[]) => {
        const asyncFunc = prop.substring(0, prop.length - 'Sync'.length)

        // @ts-ignore
        this.nativeApi[asyncFunc](...args)

        let count = 0
        while (count < 20000) {
          count++
          if (count % 2000 === 0) {
            const status = this.nativeApi.getExecStatus({ method: prop, key: args[0].key })
            if (status.done || status.errorMsg) {
              return status
            }
          }
        }
        return this.STATUS
      }
    }
    return target[prop]
  }
}
