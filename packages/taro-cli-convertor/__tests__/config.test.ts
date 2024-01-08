import Convertor from '../src'
import { clearMockFiles, getResMapFile, normalizePath, resFileMap, setMockFiles } from './__mocks__/fs-extra'
import { DEMO_JS_FILE_INFO, root } from './data/fileData'
import { changeBackslashesSerializer } from './util'

expect.addSnapshotSerializer(changeBackslashesSerializer)

const pathSystem = require('path')

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs')
  return {
    ...originalModule,
    promises: {
      ...originalModule.promises,
      writeFile: jest.fn((path, data) => {
        let resPath = ''
        if (pathSystem.isAbsolute(path)) {
          const resArr = normalizePath(path).split(root)
          if (resArr.length === 0) {
            resPath = normalizePath(path).split(root)[0]
          } else {
            resPath = normalizePath(path).split(root)[1]
          }
        }
        if (Buffer.isBuffer(data)) {
          data = Buffer.from(data).toString('utf8')
        }
        resFileMap.set(root + resPath, data)
      }),
      stat: jest.fn(() => {
        return {
          isDirectory: () => true,
        }
      }),
    },
  }
})

describe('小程序转换生成配置文件', () => {
  beforeAll(() => {
    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
  })

  afterEach(() => {
    // 清空文件信息
    clearMockFiles()
    jest.restoreAllMocks()
  })

  test('配置文件生成', (done) => {
    setMockFiles(root, DEMO_JS_FILE_INFO)
    const convertor = new Convertor(root, false)
    convertor.framework = 'react'
    convertor.generateConfigFiles()
    setTimeout(() => {
      expect(resFileMap).toMatchSnapshot()
      done()
    }, 4500)
  })
})

describe('日志', () => {
  beforeAll(() => {
    // mock报告生成
    jest.spyOn(Convertor.prototype, 'generateReport').mockImplementation(() => {})

    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('生成日志', () => {
    setMockFiles(root, DEMO_JS_FILE_INFO)
    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()
    expect(resFileMap.get('/wxProject/taroConvert/.convert/convert.log')).toMatchSnapshot()
  })
})

describe('转换报告', () => {
  beforeAll(() => {
    // 配置文件生成
    jest.spyOn(Convertor.prototype, 'generateConfigFiles').mockImplementation(() => {})
  })

  afterEach(() => {
    // 清空文件信息
    clearMockFiles()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  test('生成转换报告文件', () => {
    const REPORT_DEMO = {
      '/pages': {
        '/index': {
          '/index.js': `
            const app = getApp()
            Page({
              data: {
                motto: 'Hello World',
              },
              onLoad() {}
            })
          `,
          '/index.json': `
            {
              "usingComponents": {}
            }
          `,
          '/index.wxml': `
            <view>
              <text>{{motto}}</text>
            </view>
          `,
          '/index.wxss': '',
        },
      },
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
    }
    setMockFiles(root, REPORT_DEMO)
    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('图片路径不存在', () => {
    const REPORT_DEMO = {
      '/pages': {
        '/index': {
          '/index.js': `
            const app = getApp()
            Page({
              data: {
                motto: 'Hello World',
              },
              onLoad() {}
            })
          `,
          '/index.json': `
            {
              "usingComponents": {}
            }
          `,
          '/index.wxml': `
            <view>
              <text>{{motto}}</text>
            </view>
            <image src="/images/tutu.jpg" mode=""/>
          `,
          '/index.wxss': '',
        },
      },
      '/images': {},
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
      '/app.json': `
        {
          "pages":[
            "pages/index/index"
          ]
        }
      `,
    }
    setMockFiles(root, REPORT_DEMO)
    const convertor = new Convertor(root, false)
    convertor.run()
    const resFileMap = getResMapFile()

    expect(resFileMap.has('/wxProject/taroConvert/report')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/js')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/css')).toBeTruthy()
    expect(resFileMap.has('/wxProject/taroConvert/report/static/media')).toBeTruthy()
  })

  test('app.json不存在', () => {
    const REPORT_DEMO = {
      '/pages': {
        '/index': {
          '/index.js': `
            const app = getApp()
            Page({
              data: {
                motto: 'Hello World',
              },
              onLoad() {}
            })
          `,
          '/index.json': `
            {
              "usingComponents": {}
            }
          `,
          '/index.wxml': `
            <view>
              <text>{{motto}}</text>
            </view>
            <image src="/images/tutu.jpg" mode=""/>
          `,
          '/index.wxss': '',
        },
      },
      '/images': {},
      '/project.config.json': `{}`,
      '/app.js': `App({})`,
    }
    setMockFiles(root, REPORT_DEMO)
    jest.spyOn(process, 'exit').mockImplementation()
    const spy = jest.spyOn(console, 'log')
    const convert = new Convertor(root, false)
    expect(spy).toHaveBeenCalledTimes(3)
    convert.run()
  })
})
