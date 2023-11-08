import * as taroize from '@tarojs/taroize'

import Convertor from '../src/index'
import { copyFileToTaro, getMatchUnconvertDir, transRelToAbsPath } from '../src/util'
import { generateMinimalEscapeCode } from './util'

const fs = require('fs')
const path = require('path')

let tempFilePath  // 模拟Node路径

beforeAll(() => {
  // 创建临时的 JSON 文件,用于模拟project.config.json文件
  const tempData = {
    // 模拟project.config.json对象，其中含有miniprogramRoot字段
    projectConfigJson: {
      'description': '项目配置文件',
      'miniprogramRoot': 'miniprogram/',
      'babelSetting': {
        'ignore': [],
        'disablePlugins': [],
        'outputPath': ''
      },
      'srcMiniprogramRoot': 'miniprogram/'
    }
  }

  tempFilePath = path.join(__dirname, 'tempData.json')
  fs.writeFileSync(tempFilePath, JSON.stringify(tempData))
})
afterAll(() => {
  // 清理临时文件
  fs.unlinkSync(tempFilePath)
})

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

interface ITaroizeOptions {
  json?: string
  script?: string
  wxml?: string
  path?: string
  rootPath?: string
  scriptPath?: string
  logFilePath?: string
}

describe('语法转换', () => {
  let convert
  let param: ITaroizeOptions
  beforeAll(() => {
    /**
     * json：index.json的内容
     * path：index的根目录（文件路径)
     * rootPath：小程序的根目录（文件路径）
     * script：index.js的内容
     * scriptPath：index.js的绝对路径
     * wxml：index.html的内容
     * logFilePath：convert.log的文件路径
     */
    param = {
      json: '{}',
      path: '',
      rootPath: '',
      script: '',
      scriptPath: '',
      wxml: '',
      logFilePath: ''
    }
    
    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
    convert = new Convertor('', false)
  })

  test('使用新建的setData替换组件中this.data.xx，实现this.data.xx的转换', () => {
    param.script = 'this.data.intData = 1024'
    const taroizeResult = taroize({
      ...param,
      framework: 'react'
    })

    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: []
    })

    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('组件的动态名称转换', () => {
    param.wxml = `<view wx:for="{{infoList}}" wx:key="infoId">
              <template is="info-{{item.tempName}}" data="{{item}}"></template>
            </view>`
    const taroizeResult = taroize({
      ...param,
      framework:'react'
    })

    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: []
    })
    
    // 将ast转换为代码
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })

  test('css中字母+数字+pX会转换成px', async () => {
    const { css } = await convert.styleUnitTransform('', 'background-image: url("data:image/png;base64,TB0pX/TB0PX/TB0rpX/TB0RPX");')
    expect(css).toBe('background-image: url("data:image/png;base64,TB0pX/TB0PX/TB0rpX/TB0RPX");')
  })
})

describe('文件转换', () => {
  let convert
  beforeAll(() => {
    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})
    convert = new Convertor('', false)
  })

  test('拷贝tsconfig.json文件到转换后的工程', () => {
    const selfDefinedConfig: any = []

    // 目前只有tsconfig.json，还有的话继续加到array里
    selfDefinedConfig[0] = `tsconfig${convert.fileTypes.CONFIG}`
    for (const tempConfig of selfDefinedConfig) {
      const tempConfigPath = path.join(convert.root, tempConfig)
      if (fs.existsSync(tempConfig)) {
        const outputFilePath = path.join(convert.convertRoot, tempConfig)
        copyFileToTaro(tempConfigPath, outputFilePath)
        expect(fs.existsSync(outputFilePath)).toBe(true)
      }
    }
  })

  test('适配convert.config.json，对符合json内路径的文件，在其被导入时不做转换', () => {
    const root = transRelToAbsPath('', ['./taro-cli-convertor'])[0].replace(/\\/g, '/')
    
    // 处理convert.config.json，并存储到convertConfig中
    const convertJsonPath: string = path.join(root, `convert.config${convert.fileTypes.CONFIG}`)
    const convertJson = { 'external': ['./taroConvert/'] }
    const convertConfig = { ...convertJson }
    convertConfig.external = transRelToAbsPath(convertJsonPath, convertConfig.external)
    
    // 处理不转换的目录，可在convert.config.json中external字段配置
    const filePath = transRelToAbsPath(convertJsonPath, [`./taroConvert/tsconfig${convert.fileTypes.CONFIG}`])
    const matchUnconvertDir: string | null = getMatchUnconvertDir(filePath[0], convertConfig?.external)
    
    if (matchUnconvertDir !== null) {
      // 支持用户在convert.config.json中配置不转换的目录
      const outputFilePath = 'src/taroConvert'
      if (!fs.existsSync(outputFilePath)) {
        copyFileToTaro(matchUnconvertDir, outputFilePath)
      }
      expect(fs.existsSync(outputFilePath)).toBe(true)
    }
  })

  test('在project.config.json中添加配置miniprogramRoot后，查找miniprogramRoot字段', () => {
    // rootPath：小程序的根目录（文件路径）
    const rootPath = './Project/taro' // 虚拟路径

    // new Convertor后先直接执行 init()里面的initConvert()和getConvertConfig()
    jest.spyOn(Convertor.prototype, 'initConvert').mockImplementation(() => {
      Convertor.prototype.convertRoot = rootPath
    })
    const convertJsonPath = { 'convertJsonPath': ['miniprogramRoot'] }
    jest.spyOn(Convertor.prototype, 'getConvertConfig').mockImplementation(() => {
      Convertor.prototype.pages = new Set(convertJsonPath.convertJsonPath)
    })
    // 模拟convert.config.json文件,，其中配置了miniprogramRoot字段

    // 使用 require 加载模拟的project.config.json文件
    const fileContent = require(tempFilePath)
    expect(fileContent.projectConfigJson.miniprogramRoot).toBe('miniprogram/')

  })
})

describe('page页面转换', () => {
  let convert
  let param: ITaroizeOptions
  const entryJSON = { pages: ['pages/index/index'] }
  beforeAll(() => {
  /**
     * json：index.json的内容
     * path：index的根目录（文件路径)
     * rootPath：小程序的根目录（文件路径）
     * script：index.js的内容
     * scriptPath：index.js的绝对路径
     * wxml：index.html的内容
     * logFilePath：convert.log的文件路径
     */
    param = {
      json: '{}',
      path: '',
      rootPath: '',
      script: '',
      scriptPath: '',
      wxml: '',
      logFilePath: ''
    }

    jest.spyOn(Convertor.prototype, 'init').mockImplementation(() => {})

    // new Convertot后会直接执行 init()，为确保 init() 在测试中通过采用 spyOn 去模拟
    jest.spyOn(Convertor.prototype, 'getApp').mockImplementation(() => {
      Convertor.prototype.entryJSON = entryJSON
    })
    jest.spyOn(Convertor.prototype, 'getPages').mockImplementation(() => {
      Convertor.prototype.pages = new Set(entryJSON.pages)
    })
    convert = new Convertor('', false)
    convert.pages = Convertor.prototype.pages
  })
  
  test('template组件名转换', () => {
    param.wxml = `
      <!-- template的name值为全小写 -->
      <template name="ash"></template>
      <template is="ash"/>
      <!-- template的name值为首字母大写且单个单词 -->
      <template name="Aol"></template>
      <template is="Aol"/>
      <!-- template的name值为首字母大写且多个单词 -->
      <template name="AshMer"></template>
      <template is="AshMer"/>
      <!-- template的name值为单字母 -->
      <template name="a"></template>
      <template is="a"/>
      <!-- template的name值为小驼峰 -->
      <template name="anFish"></template>
      <template is="anFish"/>
      `
    param.path = 'import_template'

    // 模拟writeFileToTaro文件写入方法，避免imports文件夹写入到taro工程
    jest.spyOn(Convertor.prototype,'writeFileToTaro').mockImplementation(() => {})

    const taroizeResult = taroize({
      ...param,
      framework:'react'
    })

    /**
     * sourceFilePath：需要转换的文件路径
     * outputFilePath：转换输出路径
     * importStylePath：style的文件路径
     */
    const { ast } = convert.parseAst({
      ast: taroizeResult.ast,
      sourceFilePath: '',
      outputFilePath: '',
      importStylePath: '',
      depComponents: new Set(),
      imports: taroizeResult.imports
    })
  
    const jsCode = generateMinimalEscapeCode(ast)
    expect(jsCode).toMatchSnapshot()
  })
})