import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 媒体-相机
 * @returns
 */
let cameraContext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createCameraContext',
        func: () => {
          TestConsole.consoleTest('createCameraContext')
          cameraContext = Taro.createCameraContext()
          TestConsole.consoleNormal('createCameraContext success')
        },
      },
      {
        id: 'createCameraContext_onCameraFrame_暂不支持',
        func: () => {
          TestConsole.consoleTest('onCameraFrame')
          cameraContext.onCameraFrame((frame) => {
            TestConsole.consoleNormal('onCameraFrame callback :', frame)
          })
        },
      },
      {
        id: 'createCameraContext_setZoom_暂不支持',
        func: () => {
          TestConsole.consoleTest('setZoom')
          cameraContext
            .setZoom({
              zoom: 70,
              complete: (res) => {
                TestConsole.consoleComplete(res)
              },
              fail: (res) => {
                TestConsole.consoleFail(res)
              },
              success: (res) => {
                TestConsole.consoleSuccess(res)
              },
            })
            .then((res) => {
              TestConsole.consoleReturn(res)
            })
        },
      },
      {
        id: 'createCameraContext_startRecord',
        func: () => {
          TestConsole.consoleTest('startRecord')
          cameraContext
            .startRecord({
              success: (res) => {
                TestConsole.consoleSuccess(res)
              },
              fail: (res) => {
                TestConsole.consoleFail(res)
              },
              complete: (res) => {
                TestConsole.consoleComplete(res)
              },
              timeoutCallback: (res) => {
                TestConsole.consoleNormal('startRecord callback :', res)
              },
            })
            .then((res) => {
              TestConsole.consoleReturn(res)
            })
        },
      },
      {
        id: 'createCameraContext_stopRecord',
        func: () => {
          TestConsole.consoleTest('stopRecord')
          cameraContext
            .stopRecord({
              success: (res) => {
                TestConsole.consoleSuccess(res)
              },
              fail: (res) => {
                TestConsole.consoleFail(res)
              },
              complete: (res) => {
                TestConsole.consoleComplete(res)
              },
            })
            .then((res) => {
              TestConsole.consoleReturn(res)
            })
        },
      },
      {
        id: 'createCameraContext_takePhoto',
        func: () => {
          TestConsole.consoleTest('takePhoto')
          cameraContext
            .takePhoto({
              quality: 'normal',
              success: (res) => {
                TestConsole.consoleSuccess(res)
              },
              fail: (res) => {
                TestConsole.consoleFail(res)
              },
              complete: (res) => {
                TestConsole.consoleComplete(res)
              },
            })
            .then((res) => {
              TestConsole.consoleReturn(res)
            })
        },
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
