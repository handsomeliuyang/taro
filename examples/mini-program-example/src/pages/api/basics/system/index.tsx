import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'
/**
 * 基础-系统
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'openSystemBluetoothSetting',
        func: null,
      },
      {
        id: 'openAppAuthorizeSetting',
        func: () => {
          TestConsole.consoleTest('Taro.openAppAuthorizeSetting')
          Taro.openAppAuthorizeSetting({
            success (res) {
              TestConsole.consoleSuccess(res)
            },
            fail (res) {
              TestConsole.consoleFail(res)
            },
            complete (res) {
              TestConsole.consoleComplete(res)
            },
          }).then(res => {
            TestConsole.consoleReturn(res)
          })
        },
      },
      {
        id: 'getWindowInfo',
        func: () => {
          TestConsole.consoleTest('Taro.getWindowInfo')
          const res = Taro.getWindowInfo()
          TestConsole.consoleSuccess(res)
        },
      },
      {
        id: 'getSystemSetting',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemSetting')
          const res = Taro.getSystemSetting()
          TestConsole.consoleSuccess(res)
        },
      },
      {
        id: 'getSystemInfoSync',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemInfoSync')
          try {
            const res = Taro.getSystemInfoSync()
            TestConsole.consoleSuccess(res)
          } catch (e) {
            TestConsole.consoleFail(e)
          }
        },
      },
      {
        id: 'getSystemInfoAsync-callback',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemInfoAsync')
          Taro.getSystemInfoAsync({
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
        },
      },
      {
        id: 'getSystemInfoAsync-promise',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemInfoAsync-promise')
          Taro.getSystemInfoAsync().then(res => {
            TestConsole.consoleReturn(res)
          }).catch(err => {
            TestConsole.consoleFail(err)
          })
        },
      },
      {
        id: 'getSystemInfo-callback',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemInfo')
          Taro.getSystemInfo({
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
        },
      },
      {
        id: 'getSystemInfo-promise',
        func: () => {
          TestConsole.consoleTest('Taro.getSystemInfo-promise')
          Taro.getSystemInfo().then(res => {
            TestConsole.consoleReturn(res)
          }).catch(err => {
            TestConsole.consoleFail(err)
          })
        },
      },
      {
        id: 'getDeviceInfo',
        func: () => {
          TestConsole.consoleTest('Taro.getDeviceInfo')
          let res = Taro.getDeviceInfo()
          TestConsole.consoleSuccess(res)
        },
      },
      {
        id: 'getAppBaseInfo',
        func: () => {
          TestConsole.consoleTest('Taro.getAppBaseInfo')
          let res = Taro.getAppBaseInfo()
          TestConsole.consoleSuccess(res)
        },
      },
      {
        id: 'getAppAuthorizeSetting',
        func: () => {
          TestConsole.consoleTest('Taro.getAppAuthorizeSetting')
          let res = Taro.getAppAuthorizeSetting()
          TestConsole.consoleSuccess(res)
        },
      },
    ],
  }
  render () {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
