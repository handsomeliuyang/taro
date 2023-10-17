import * as taroize from '@tarojs/taroize'

import Convertor from '../src/index'

describe('parseAst', () => {
  test('wx:for问题修复,创建工具 引入工具函数', () => {
    const entryJSON = { 'pages': ['pages/index/index'] }
    const param = {
      json:'{}',
      path:'',
      rootPath:'',
      script:'',
      scriptPath:'',
      wxml:`<view wx:for="{{number}}">{{item}}:{{index}}</view>
      <view wx:for="{{string}}">{{item}}:{{index}}</view>
      <view wx:for="{{date}}">{{item}}:{{index}}</view>
      <view wx:for="{{regExp}}">{{item}}:{{index}}</view>`
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