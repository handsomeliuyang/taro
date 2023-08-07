import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 设备-陀螺仪
 * @returns
 */
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopGyroscope',
        func: () => {
          TestConsole.consoleTest('stopGyroscope')
          Taro.stopGyroscope({
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            },
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'startGyroscope',
        func: () => {
          TestConsole.consoleTest('startGyroscope')
          Taro.startGyroscope({
            interval: 'normal',
            success: (res) => {
              TestConsole.consoleSuccess(res)
            },
            fail: (res) => {
              TestConsole.consoleFail(res)
            },
            complete: (res) => {
              TestConsole.consoleComplete(res)
            }
          }).then((ret) => {
            TestConsole.consoleReturn(ret)
          })
        },
      },
      {
        id: 'onGyroscopeChange',
        func: () => {
          Taro.onGyroscopeChange((res) => {
            TestConsole.consoleNormal('on gyroscope change: ', res)
          })
        },
      },
      {
        id: 'offGyroscopeChange_暂不支持',
        func: () => {
          Taro.offGyroscopeChange((res) => {
            TestConsole.consoleNormal('off gyroscope change: ', res)
          })
        },
      },
    ],
  }
  render () {
    return (
      <View className='api-page'>
        {this.state.list.map((item) => {
          return (
            <View key={item.id} className='api-page-btn' onClick={item.func == null ? () => { } : item.func}>
              {item.id}
              {item.func == null && <Text className='navigator-state tag'>未创建Demo</Text>}
            </View>
          )
        })}
      </View>
    )
  }
}
