import React from 'react'
import Taro, { useReady } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 画布
 * @returns
 */
let context
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createCanvasContext',
        func: (apiIndex) => {
          context = Taro.createCanvasContext('canvas')
          context.setStrokeStyle('#00ff00')
          context.lineWidth = 5
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
          console.log('Taro.createCanvasContext success ', context)
        },
      },
      {
        id: 'canvasToTempFilePath',
        func: (apiIndex) => {
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
              console.log('Taro.canvasToTempFilePath success', res)
            },
            fail: function (res) {
              console.log('Taro.canvasToTempFilePath fail', res)
            },
            complete: function (res) {
              console.log('Taro.canvasToTempFilePath complete', res)
            },
          })
        },
      },
      {
        id: 'CanvasContext',
        func: (apiIndex) => {
          // Draw coordinates
          context.arc(100, 75, 50, 0, 2 * Math.PI)
          context.setFillStyle('#EEEEEE')
          context.fill()
          context.beginPath()
          context.moveTo(40, 75)
          context.lineTo(160, 75)
          context.moveTo(100, 15)
          context.lineTo(100, 135)
          context.setStrokeStyle('#AAAAAA')
          context.stroke()
          context.setFontSize(12)
          context.setFillStyle('black')
          context.fillText('0', 165, 78)
          context.fillText('0.5*PI', 83, 145)
          context.fillText('1*PI', 15, 78)
          context.fillText('1.5*PI', 83, 10)
          // Draw points
          context.beginPath()
          context.arc(100, 75, 2, 0, 2 * Math.PI)
          context.setFillStyle('lightgreen')
          context.fill()
          context.beginPath()
          context.arc(100, 25, 2, 0, 2 * Math.PI)
          context.setFillStyle('blue')
          context.fill()
          context.beginPath()
          context.arc(150, 75, 2, 0, 2 * Math.PI)
          context.setFillStyle('red')
          context.fill()
          // Draw arc
          context.beginPath()
          context.arc(100, 75, 50, 0, 1.5 * Math.PI)
          context.setStrokeStyle('#333333')
          context.stroke()
          context.draw()
        },
      },
      {
        id: 'CanvasContext-attribute',
        func: (apiIndex) => {
          context.shadowBlur = 10
          context.shadowOffsetX = 20
          context.shadowOffsetY = 5
          context.shadowColor = 'black'
          context.fillStyle = 'red'
          context.fillRect(20, 20, 100, 80)
          context.stroke()
          context.draw()
        },
      },
      {
        id: 'arcTo',
        inputData: {
          x1: 150,
          y1: 20,
          x2: 150,
          y2: 70,
          radius: 50
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('arcTo')
          context.beginPath()
          context.setFillStyle('black')
          context.fillStyle = 'black'
          context.strokeStyle = 'black'
          context.moveTo(20, 20)           // 创建开始点
          context.lineTo(100, 20)          // 创建水平线
          context.arcTo(...Object.values(data))
          context.lineTo(150, 120)         // 创建垂直线
          context.stroke()
          context.draw()
          TestConsole.consoleSuccess.call(this, 'success', apiIndex)
        }
      },
      {
        id: 'bezierCurveTo',
        inputData: {
          cp1x: 20,
          cp1y: 100,
          cp2x: 200,
          cp2y: 100,
          x: 200,
          y: 20
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('arcTo')
          context.beginPath()
          context.setFillStyle('white')
          context.moveTo(20, 20)           // 创建开始点
          context.lineTo(100, 20)          // 创建水平线
          context.bezierCurveTo(...Object.values(data))
          context.lineTo(150, 120)         // 创建垂直线
          context.stroke()
          context.draw()
          TestConsole.consoleSuccess.call(this, 'success', apiIndex)
        }
      },
      {
        id: 'clip',
        func: (apiIndex) => {
          TestConsole.consoleTest('clip')
          context.rect(50, 20, 200, 120)
          context.stroke()
          context.clip()
          context.fillRect(0, 0, 150, 100)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'closePath',
        func: (apiIndex, data) => {
          TestConsole.consoleTest('closePath')
          context.beginPath()
          context.setFillStyle('white')
          context.moveTo(20, 20)           // 创建开始点
          context.lineTo(100, 20)          // 创建水平线
          context.arcTo(150, 20, 150, 70, 50)
          context.lineTo(150, 120)         // 创建垂直线
          context.closePath()
          context.stroke()
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'createCircularGradient',
        inputData: {
          x: 75,
          y: 50,
          r: 50
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('createCircularGradient')
          const grd = context.createCircularGradient(...Object.values(data))
          grd.addColorStop(0, 'red')
          grd.addColorStop(1, 'white')
          context.setFillStyle(grd)
          context.fillRect(10, 10, 150, 80)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'createLinearGradient',
        inputData: {
          x0: 0,
          y0: 0,
          x1: 200,
          y1: 0
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('createLinearGradient')
          const grd = context.createLinearGradient(...Object.values(data))
          grd.addColorStop(0, 'red')
          grd.addColorStop(1, 'white')
          context.setFillStyle(grd)
          context.fillRect(10, 10, 150, 80)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'createPattern',
        inputData: {
          repetition: 'repeat-x'
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('createPattern')
          try {
            const pattern = context.createPattern("/assets/component/logo.png", ...Object.values(data))
            console.log(pattern)
            context.fillStyle = pattern
            context.fillRect(0, 0, 300, 150)
            context.draw()
            TestConsole.consoleSuccess(context)
          } catch (err) {
            TestConsole.consoleFail(err)
          }
        
        }
      },
      {
        id: 'drawImage',
        inputData: {
          sx: 0,
          sy: 0,
          sWidth: 150,
          sHeight: 100,
          dx: 0,
          dy: 0,
          dWidth: 150,
          dHeight: 100
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('drawImage')
          Taro.chooseImage({
            success: function (res) {
              context.drawImage(res.tempFilePaths[0], ...Object.values(data))
              context.draw()
              TestConsole.consoleSuccess(context)
            }
          })
        }
      },
      {
        id: 'fillRect',
        inputData: {
          x: 10,
          y: 10,
          Width: 150,
          Height: 75
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('fillRect')
          context.setFillStyle('red')
          context.fillRect(...Object.values(data))
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'measureText',
        inputData: {
          text: 'Hello World'
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('measureText')
          context.font = 'italic bold 20px cursive'
          const metrics = context.measureText(...Object.values(data))
          TestConsole.consoleSuccess(metrics)
        }
      },
      {
        id: 'quadraticCurveTo',
        inputData: {
          cpx: 20,
          cpy: 100,
          x: 200,
          y: 20
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('fillRect')
          // Draw points
          context.beginPath()
          context.arc(20, 20, 2, 0, 2 * Math.PI)
          context.setFillStyle('red')
          context.fill()

          context.beginPath()
          context.arc(200, 20, 2, 0, 2 * Math.PI)
          context.setFillStyle('lightgreen')
          context.fill()

          context.beginPath()
          context.arc(20, 100, 2, 0, 2 * Math.PI)
          context.setFillStyle('blue')
          context.fill()

          context.setFillStyle('black')
          context.setFontSize(12)

          // Draw guides
          context.beginPath()
          context.moveTo(20, 20)
          context.lineTo(20, 100)
          context.lineTo(200, 20)
          context.setStrokeStyle('#AAAAAA')
          context.stroke()

          // Draw quadratic curve
          context.beginPath()
          context.moveTo(20, 20)
          context.quadraticCurveTo(20, 100, 200, 20)
          context.setStrokeStyle('black')
          context.stroke()

          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'save/restore',
        func: (apiIndex, data) => {
          TestConsole.consoleTest('save/restore')
          context.save()
          context.setFillStyle('red')
          context.fillRect(10, 10, 150, 100)
          context.restore()
          context.fillRect(50, 50, 150, 100)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'rotate',
        inputData: {
          rotate: 20 * Math.PI / 180,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('rotate')
          context.rotate(...Object.values(data))
          context.strokeRect(100, 10, 150, 100)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'scale',
        inputData: {
          scaleWidth: 2,
          scaleHeight: 2
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('scale')
          context.scale(...Object.values(data))
          context.strokeRect(10, 10, 25, 15)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setGlobalAlpha',
        inputData: {
          alpha: 0.2
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setGlobalAlpha')
          context.setFillStyle('red')
          context.fillRect(10, 10, 150, 100)
          context.setGlobalAlpha(...Object.values(data))
          context.setFillStyle('blue')
          context.fillRect(50, 50, 150, 100)
          context.setFillStyle('yellow')
          context.fillRect(100, 100, 150, 100)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setLineCap',
        func: (apiIndex) => {
          TestConsole.consoleTest('setLineCap')
          context.beginPath()
          context.fillStyle = '#ffffff'
          context.fillRect(0, 0, 500, 500)
          context.moveTo(10, 10)
          context.lineTo(150, 10)
          context.stroke()
          context.beginPath()
          context.setLineCap('butt')
          context.setLineWidth(10)
          context.moveTo(10, 30)
          context.lineTo(150, 30)
          context.stroke()
          context.beginPath()
          context.setLineCap('round')
          context.setLineWidth(10)
          context.moveTo(10, 50)
          context.lineTo(150, 50)
          context.stroke()
          context.beginPath()
          context.setLineCap('square')
          context.setLineWidth(10)
          context.moveTo(10, 70)
          context.lineTo(150, 70)
          context.stroke()
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setLineDash',
        inputData: {
          pattern: [10, 20],
          offset: 5
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setLineDash')
          context.lineDashOffset = data.offset
          context.setLineDash(...Object.values(data))
          context.moveTo(0, 100)
          context.lineTo(400, 100)
          context.stroke()
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setLineJoin',
        func: (apiIndex) => {
          TestConsole.consoleTest('setLineJoin')
          context.beginPath()
          context.moveTo(10, 10)
          context.lineTo(100, 50)
          context.lineTo(10, 90)
          context.stroke()
          context.beginPath()
          context.setLineJoin('bevel')
          context.setLineWidth(10)
          context.moveTo(50, 10)
          context.lineTo(140, 50)
          context.lineTo(50, 90)
          context.stroke()
          context.beginPath()
          context.setLineJoin('round')
          context.setLineWidth(10)
          context.moveTo(90, 10)
          context.lineTo(180, 50)
          context.lineTo(90, 90)
          context.stroke()
          context.beginPath()
          context.setLineJoin('miter')
          context.setLineWidth(10)
          context.moveTo(130, 10)
          context.lineTo(220, 50)
          context.lineTo(130, 90)
          context.stroke()
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setMiterLimit',
        func: (apiIndex) => {
          TestConsole.consoleTest('setMiterLimit')
          context.beginPath()
          context.setLineWidth(10)
          context.setLineJoin('miter')
          context.setMiterLimit(1)
          context.moveTo(10, 10)
          context.lineTo(100, 50)
          context.lineTo(10, 90)
          context.stroke()
          context.beginPath()
          context.setLineWidth(10)
          context.setLineJoin('miter')
          context.setMiterLimit(2)
          context.moveTo(50, 10)
          context.lineTo(140, 50)
          context.lineTo(50, 90)
          context.stroke()
          context.beginPath()
          context.setLineWidth(10)
          context.setLineJoin('miter')
          context.setMiterLimit(3)
          context.moveTo(90, 10)
          context.lineTo(180, 50)
          context.lineTo(90, 90)
          context.stroke()
          context.beginPath()
          context.setLineWidth(10)
          context.setLineJoin('miter')
          context.setMiterLimit(4)
          context.moveTo(130, 10)
          context.lineTo(220, 50)
          context.lineTo(130, 90)
          context.stroke()
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setShadow',
        inputData: {
          offsetX: 10,
          offsetY: 50,
          blur: 50,
          color: 'blue'
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setShadow')
          context.setFillStyle('red')
          context.setShadow(...Object.values(data))
          context.fillRect(10, 10, 150, 75)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setTextAlign',
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setTextAlign')
          context.setStrokeStyle('red')
          context.moveTo(150, 20)
          context.lineTo(150, 170)
          context.stroke()
          context.setFontSize(15)
          context.setTextAlign('left')
          context.fillText('textAlign=left', 150, 60)
          context.setTextAlign('center')
          context.fillText('textAlign=center', 150, 80)
          context.setTextAlign('right')
          context.fillText('textAlign=right', 150, 100)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setTextBaseline',
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setTextBaseline')
          context.setStrokeStyle('red')
          context.moveTo(5, 75)
          context.lineTo(295, 75)
          context.stroke()
          context.setFontSize(20)
          context.setTextBaseline('top')
          context.fillText('top', 5, 75)
          context.setTextBaseline('middle')
          context.fillText('middle', 50, 75)
          context.setTextBaseline('bottom')
          context.fillText('bottom', 120, 75)
          context.setTextBaseline('normal')
          context.fillText('normal', 200, 75)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'setTransform',
        inputData: {
          scaleX: 1,
          scaleY: 0.5,
          skewX: -0.5,
          skewY: 1,
          translateX: 30,
          translateY: 10
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('setTransform')
          context.setTransform(...Object.values(data))
          context.fillStyle = 'yellow'
          context.fillRect(0, 0, 250, 100)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'strokeText',
        inputData: {
          text: 'Hello World!',
          x: 10,
          y: 90
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('strokeText')
          context.font = '20px Georgia'
          context.strokeText(...Object.values(data))
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'transform',
        inputData: {
          scaleX: 1,
          scaleY: 0.5,
          skewX: -0.5,
          skewY: 1,
          translateX: 30,
          translateY: 10
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('transform')
          context.transform(...Object.values(data))
          context.fillStyle = 'red'
          context.fillRect(0, 0, 250, 100)
          context.draw()
          TestConsole.consoleSuccess(context)
        }
      },
      {
        id: 'translate',
        inputData: {
          x: 20,
          y: 20
        },
        func: (apiIndex, data) => {
          context.strokeRect(10, 10, 150, 100)
          context.translate(...Object.values(data))
          context.strokeRect(10, 10, 150, 100)
          context.translate(...Object.values(data))
          context.strokeRect(10, 10, 150, 100)
          context.draw()
        }
      },
      {
        id: 'createOffscreenCanvas',
        func: null,
      },
      {
        id: 'canvasPutImageData',
        func: null,
      },
      {
        id: 'canvasGetImageData',
        func: null,
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
        <View className='api-content'>
          <View className='canvas-content'>
            <Canvas canvasId='canvas'></Canvas>
          </View>
          <ButtonList buttonList={list} />
        </View>
      </View>
    )
  }
}
