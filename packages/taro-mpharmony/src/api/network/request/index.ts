import Taro from '@tarojs/api'
import { isFunction } from '@tarojs/shared'
import { getParameterError, shouldBeObject } from 'src/utils'

const axios = require('axios').default

const CancelToken = axios.CancelToken
const source = CancelToken.source()


const errMsgMap = new Map([
  [401, 'Parameter error'],
  [201, 'Permission denied'],
  [3, 'URL using bad/illegal format or missing URL'],
  [7, "Couldn't connect to server"],
  [23, 'Failed writing received data to disk/application'],
  [25, 'Upload failed'],
  [26, 'Failed to open/read local data from file/application'],
  [28, 'Timeout was reached'],
  [73, 'Remote file already exists'],
  [78, 'Remote file not found'],
  [999, 'Unknown Other Error']
])

export const _request = (options) => {
  const name = 'request'

  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    return Promise.reject(res)
  }

  const { url, success, fail, complete, method, ...otherOptions } = options as Exclude<typeof options, undefined>
  if (typeof url !== 'string') {
    const res = {
      errMsg: getParameterError({
        para: 'url',
        correct: 'string',
        wrong: url,
      }),
    }
    isFunction(fail) && fail(res)
    isFunction(complete) && complete(res)
    return Promise.reject(res)
  }

  let task
  const result: ReturnType<typeof Taro.request> = new Promise((resolve, reject) => {
    const upperMethod = method ? method.toUpperCase() : method
    task = nativeRequest({
      url,
      method: upperMethod,
      ...otherOptions,
      success: (res: any) => {
        isFunction(success) && success(res)
        isFunction(complete) && complete(res)
        resolve(res)
      },
      fail: (res: any) => {
        isFunction(fail) && fail(res)
        isFunction(complete) && complete(res)
        reject(res)
      },
    })
  }) as any


  result.onHeadersReceived = task.onHeadersReceived.bind(task)
  result.offHeadersReceived = task.offHeadersReceived.bind(task)
  result.abort = task.abort.bind(task)
  return result
}

function taroInterceptor (chain) {
  return _request(chain.requestParams)
}


function nativeRequest (...args) {
  const obj = args.pop()
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(obj),'nativeRequest nativeRequest')
  return new RequestTask(obj)
}

// @ts-ignore
const { Link } = Taro
const link = new Link(taroInterceptor)

/**
 * 发起 HTTPS 网络请求
 *
 * @canUse request
 * @__object [url, data, header, timeout, method[OPTIONS, GET, HEAD, POST, PUT, PATCH, DELETE, TRACE, CONNECT], dataType[text, json, arraybuffer, base64], responseType[text, arraybuffer], enableCache]
 * @__success [data, header, statusCode, cookies]
 */
export function request (options) {
  const result = link.request.bind(link)(options) // promise
  result.catch(() => {})
  return result
}

/**
 * 网络请求任务对象
 *
 * @canUse RequestTask
 * @__class [abort, onHeadersReceived, offHeadersReceived]
 */

/**
 * 使用拦截器
 *
 * @canNotUse addInterceptor
 */
export const addInterceptor = link.addInterceptor.bind(link)

/**
 * 清除所有拦截器
 *
 * @canNotUse cleanInterceptors
 */
export const cleanInterceptors = link.cleanInterceptors.bind(link)

class RequestTask {
  public abortFlag
  public fail
  public complete
  public httpRequest
  public headersCallback
  public result
  public res
  constructor (object) {
    const { url, header, method = 'GET', timeout, responseType, enableCache, dataType } = object || {}
    let { data } = object || {}
    const { success, fail, complete } = object || {}

    this.abortFlag = false
    this.fail = fail
    this.complete = complete
    this.headersCallback = new Set()
    // 使用axios.create来创建axios实例
    this.httpRequest = axios.create({
      responseType: responseType || 'text',
      headers: header,
      timeout: timeout || 2000
    })

    // 请求拦截器
    this.httpRequest.interceptors.request.use((config) => {
      if (config.enableCache === false) {
        return config
      }
      // 处理缓存
      const cacheData = localStorage.getItem(config.url)
      if (cacheData !== null) {
        let result = cacheData
        if (dataType === 'json') {
          result = JSON.parse(cacheData)
        }
        source.cancel('cache has useful data!!')
        return Promise.resolve({ result })
      }
      return config
    }, error => {
      console.error('error: ', error)
    })

    // 响应拦截器
    this.httpRequest.interceptors.response.use((response) => {
      // 缓存数据
      if (response.config.enableCache === false) {
        localStorage.setItem(response.config.url, JSON.stringify(response.data))
      }
      return response
    }, error => {
      console.error('error: ', error)
    })

    if (!object) {
      console.error('[AdvancedAPI] request error: params illegal')
      return
    }

    let isFormUrlEncoded = false
    for (const key in header) {
      if (key.toLowerCase() === 'content-type') {
        if (header[key].toLowerCase().includes('application/x-www-form-urlencoded')) {
          isFormUrlEncoded = true
        }
        break
      }
    }

    // data为Object类型时，属性的值类型如果是number, request请求时信息会丢失. 故将data转成string类型进行规避
    if (data && (isFormUrlEncoded || ['GET', 'OPTIONS', 'DELETE', 'TRACE', 'CONNECT'].includes(method))) {
      const dataArray = []
      for (const key in data) {
        // @ts-ignore
        dataArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      }
      data = dataArray.join('&')
    }
    // header的属性的值类型如果是number, request请求时信息会丢失. 故将各个属性转成string类型
    if (header) {
      for (const key in header) {
        header[key] = `${header[key]}`
      }
    }

    this.httpRequest({
      method: method,
      url: url,
      CancelToken: source.token,
      enableCache: enableCache || false
    })
      .then((response) => {
        if (success && !this.abortFlag) {
          let result = response.result
          if (response.config.responseType === 'text') {
            if (dataType === 'text') {
              result = response.data
            } else if (dataType === 'json') {
              result = JSON.parse(response.data)
            } else if (dataType === 'base64') {
              const encodeData = encodeURIComponent(response.data)
              result = btoa(encodeData)
            } else if (dataType === 'arraybuffer') {
              result = new TextEncoder().encode(response.data).buffer
            } else {
              console.error('Unsupported dataType!!')
            }
          } else if (response.config.responseType === 'arraybuffer') {
            result = response.data
          } else {
            console.error('Unsupported dataType!!: ', response.config.responseType)
          }
          const res = {
            data: result,
            statusCode: response.responseCode,
            header: response.headers,
            cookies: response.cookies ? [response.cookies] : [],
            errMsg: 'request:ok'
          }
          this.result = res
          success(res)
        }
      })
      .catch((err) => {
        console.error('[AdvancedAPI] request error: ' + JSON.stringify(err))
        if (fail && !this.abortFlag) {
          // eslint-disable-next-line no-console
          const res = { errMsg: errMsgMap.has(err.code) ? errMsgMap.get(err.code) : `${JSON.stringify(err)}` }
          this.result = res
          fail(res)
        }
      })
      .finally(() => {
        if (complete && !this.abortFlag) {
          complete(this.result)
        }
        if (this.httpRequest) {
          source.cancel('requestTask cancelled by the user!')
        }
      })
  }

  abort () {
    this.abortFlag = true
    if (this.httpRequest) {
      source.cancel('requestTask cancelled by the user!')
      this.res = { errMsg: 'request:fail abort' }
      this.fail && this.fail(this.res)
      this.complete && this.complete(this.res)
    }
  }
}
