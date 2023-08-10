import React from 'react'
import Taro, { useReady } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 画布
 * @returns
 */

export default class Index extends React.Component {
  state = {
    node: 'canvas',
    list: [
      {
        id: 'createCanvasContext',
        func: () => {
          TestConsole.consoleTest('Taro.createCanvasContext')
          const context = Taro.createCanvasContext(this.state.node)
          context.setStrokeStyle('#00ff00')
          context.setLineWidth(5)
          context.rect(0, 0, 200, 200)
          context.stroke()
          context.setStrokeStyle('#ff0000')
          context.setLineWidth(2)
          context.moveTo(160, 100)
          context.arc(100, 100, 60, 0, 2 * Math.PI, true)
          context.moveTo(140, 100)
          context.arc(100, 100, 40, 0, Math.PI, false)
          context.moveTo(85, 80)
          context.arc(80, 80, 5, 0, 2 * Math.PI, true)
          context.moveTo(125, 80)
          context.arc(120, 80, 5, 0, 2 * Math.PI, true)
          context.stroke()
          context.draw()
          TestConsole.consoleSuccess(context)
        },
      },
      {
        id: 'canvasToTempFilePath',
        func: () => {
          TestConsole.consoleTest('Taro.canvasToTempFilePath')
          const context = Taro.createCanvasContext(this.state.node)
          context.setStrokeStyle('#00ff00')
          context.setLineWidth(5)
          context.rect(0, 0, 200, 200)
          context.stroke()
          context.setStrokeStyle('#ff0000')
          context.setLineWidth(2)
          context.moveTo(160, 100)
          context.arc(100, 100, 60, 0, 2 * Math.PI, true)
          context.moveTo(140, 100)
          context.arc(100, 100, 40, 0, Math.PI, false)
          context.moveTo(85, 80)
          context.arc(80, 80, 5, 0, 2 * Math.PI, true)
          context.moveTo(125, 80)
          context.arc(120, 80, 5, 0, 2 * Math.PI, true)
          context.stroke()
          context.draw(true, () => {
            Taro.canvasToTempFilePath({
              x: 100,
              y: 200,
              width: 50,
              height: 50,
              destWidth: 100,
              destHeight: 100,
              quality: 1,
              fileType: 'png',
              canvasId: 'canvas',
              success: function (res) {
                TestConsole.consoleSuccess(res)
              },
              fail: function (res) {
                TestConsole.consoleFail(res)
              },
              complete: function (res) {
                TestConsole.consoleComplete(res)
              },
            })
          })
        },
      },
      {
        id: 'CanvasContext',
        func: () => {
          TestConsole.consoleTest('Taro.CanvasContext')
          const ctx = Taro.createCanvasContext(this.state.node)
          // Draw coordinates
          ctx.arc(100, 75, 50, 0, 2 * Math.PI)
          ctx.setFillStyle('#EEEEEE')
          ctx.fill()
          ctx.beginPath()
          ctx.moveTo(40, 75)
          ctx.lineTo(160, 75)
          ctx.moveTo(100, 15)
          ctx.lineTo(100, 135)
          ctx.setStrokeStyle('#AAAAAA')
          ctx.stroke()
          ctx.setFontSize(12)
          ctx.setFillStyle('black')
          ctx.fillText('0', 165, 78)
          ctx.fillText('0.5*PI', 83, 145)
          ctx.fillText('1*PI', 15, 78)
          ctx.fillText('1.5*PI', 83, 10)
          // Draw points
          ctx.beginPath()
          ctx.arc(100, 75, 2, 0, 2 * Math.PI)
          ctx.setFillStyle('lightgreen')
          ctx.fill()
          ctx.beginPath()
          ctx.arc(100, 25, 2, 0, 2 * Math.PI)
          ctx.setFillStyle('blue')
          ctx.fill()
          ctx.beginPath()
          ctx.arc(150, 75, 2, 0, 2 * Math.PI)
          ctx.setFillStyle('red')
          ctx.fill()
          // Draw arc
          ctx.beginPath()
          ctx.arc(100, 75, 50, 0, 1.5 * Math.PI)
          ctx.setStrokeStyle('#333333')
          ctx.stroke()
          ctx.draw()
          TestConsole.consoleSuccess(ctx)
        },
      },
      {
        id: 'createOffscreenCanvas',
        func: null,
      },
      {
        id: 'canvasPutImageData-calback',
        func: () => {
          TestConsole.consoleTest('Taro.canvasPutImageData-calback')
          const data = new Uint8ClampedArray([255, 0, 0, 1])
          Taro.canvasPutImageData({
            canvasId: this.state.node,
            x: 0,
            y: 0,
            width: 1,
            height: 1,
            data: data,
            success (res) {
              TestConsole.consoleSuccess(res)
            },
            fail (res) {
              console.error(res)
              TestConsole.consoleFail(res)
            },
            complete (res) {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'canvasPutImageData-promise',
        func: () => {
          TestConsole.consoleTest('Taro.canvasPutImageData-promise')
          let that = this
          Taro.canvasGetImageData({
            canvasId: that.state.node,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            success (res) {
              const data =  res.data
              Taro.canvasPutImageData({
                canvasId: that.state.node,
                x: 0,
                y: 0,
                width: 1,
                height: 1,
                data: data
              }).then(res => {
                TestConsole.consoleSuccess(res)
              }).catch(res => {
                TestConsole.consoleFail(res)
              })
            },
          })

          
        },
      },
      {
        id: 'canvasGetImageData-callback',
        func: () => {
          TestConsole.consoleTest('Taro.canvasGetImageData-callback')
          Taro.canvasGetImageData({
            canvasId: this.state.node,
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            success (res) {
              TestConsole.consoleSuccess(res)
            },
            fail (res) {
              TestConsole.consoleFail(res)
            },
            complete (res) {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'canvasGetImageData-promise',
        func: () => {
          TestConsole.consoleTest('Taro.canvasGetImageData-promise')
          Taro.canvasGetImageData({
            canvasId: this.state.node,
            x: 0,
            y: 0,
            width: 1,
            height: 1
          }).then(res => {
            console.log(res.data)
            TestConsole.consoleSuccess(res)
          }).catch(res => {
            TestConsole.consoleFail(res)
          })
        },
      },
      {
        id: 'Canvas',
        func: null,
      },
      {
        id: 'CanvasGradient',
        func: null,
      },
      {
        id: 'Color',
        func: null,
      },
      {
        id: 'Image',
        func: null,
      },
      {
        id: 'ImageData',
        func: null,
      },
      {
        id: 'OffscreenCanvas',
        func: null,
      },
      {
        id: 'Path2D',
        func: null,
      },
      {
        id: 'RenderingContext',
        func: null,
      },
    ],
  }
  render () {
    const { list } = this.state
    return (
      <View className='api-page'>
        <Canvas canvasId='canvas' className='canvas'></Canvas>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
