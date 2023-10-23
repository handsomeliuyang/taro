import * as taroize from '@tarojs/taroize'

import Convertor from '../src/index'

describe('parseAst', () => {
  test('wx:for可遍历数字、字符串、对象，测试wx:for是否转为工具函数convertToArray', () => {
    const entryJSON = { 'pages': ['pages/index/index'] }
    // json：index.json的内容  path：index的根目录（文件路径）  rootPath：小程序的根目录（文件路径）   
    // script：index.js的内容   scriptPath：index.js的绝对路径  wxml：index.html的内容
    const param = {
      json:'{}',
      path:'',
      rootPath:'',
      script:'',
      scriptPath:'',
      wxml:`<view wx:for="{{number}}">数字：{{item}}:{{index}}</view>
            <view wx:for="{{string}}">字符串：{{item}}:{{index}}</view>
            <view wx:for="{{object}}">对象：{{item}}:{{index}}</view>
          `
    }
    // new Convertot后会直接执行 init()，为确保 init() 在测试中通过采用 spyOn 去模拟
    jest.spyOn(Convertor.prototype, 'getApp').mockImplementation(() => {
      Convertor.prototype.entryJSON = entryJSON
    })
    jest.spyOn(Convertor.prototype, 'getPages').mockImplementation(() => {
      Convertor.prototype.pages = new Set(entryJSON.pages)
    })
    const convert = new Convertor('', false)
    convert.pages = Convertor.prototype.pages
    const taroizeResult = taroize({
      ...param,
      framework:'react'
    })
    // sourceFilePath：需要转换的文件路径   outputFilePath：转换输出路径   importStylePath：style的文件路径
    const { ast } = convert.parseAst({
      ast:taroizeResult.ast,
      sourceFilePath:'',
      outputFilePath:'',
      importStylePath:'',
      depComponents: new Set(),
      imports:[]
    })
    expect(ast).toMatchSnapshot()
  })
})