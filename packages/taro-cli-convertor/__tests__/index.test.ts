import * as taroize from '@tarojs/taroize'

import Convertor from '../src/index'

describe('parseAst', () => {
  test('当使用wx:for时引入工具函数 convertToArray', () => {
    const entryJSON = { 'pages': ['pages/index/index'] }
    // json：index.json的内容  path：index的根目录（文件路径）  rootPath：小程序的根目录（文件路径）   
    // script：index.js的内容   scriptPath：index.js的绝对路径  wxml：index.html的内容
    const param = {
      json:'{}',
      path:'',
      rootPath:'',
      script:`
        Page({
          data:{
            data1:6,
            data2:'Hello Word!',
            data3:{name:'xixi',age:12}
          }
        })
      `,
      scriptPath:'',
      wxml:`
        <view wx:for="{{data1}}">当遍历数字：{{item}}:{{index}}</view>
        <view wx:for="{{data2}}">当遍历字符串：{{item}}:{{index}}</view>
        <view wx:for="{{data3}}">当遍历对象：{{item}}:{{index}}</view>
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