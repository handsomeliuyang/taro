import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-罗盘
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'stopCompass-callback',
        func: () => {
          TestConsole.consoleTest('Taro.stopCompass')
          Taro.stopCompass({
            success (res) {
              TestConsole.consoleSuccess(res)
            },
            fail (res) {
              TestConsole.consoleFail(res)
            }, complete (res) {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'stopCompass-promise',
        func: () => {
          TestConsole.consoleTest('Taro.stopCompass-promise')
          Taro.stopCompass().then(res => {
            TestConsole.consoleReturn(res)
          }).catch(err => {
            TestConsole.consoleFail(err)
          })
        },
      },
      {
        id: 'startCompass-callback',
        func: () => {
          TestConsole.consoleTest('Taro.startCompass-callback')
          Taro.startCompass({
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
        id: 'startCompass-promise',
        func: () => {
          TestConsole.consoleTest('Taro.startCompass-promise')
          Taro.startCompass().then(res => {
            TestConsole.consoleReturn(res)
          }).catch(err => {
            TestConsole.consoleFail(err)
          })
        },
      },
      {
        id: 'onCompassChange',
        func: () => {
          TestConsole.consoleTest('Taro.onCompassChange')
          Taro.onCompassChange(this.callback)
        },
      },
      {
        id: 'offCompassChange',
        func: () => {
          TestConsole.consoleTest('Taro.offCompassChange')
          Taro.offCompassChange(this.callback)
        },
      },
    ],
  }

  callback = (res) => {
    console.log(res)
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