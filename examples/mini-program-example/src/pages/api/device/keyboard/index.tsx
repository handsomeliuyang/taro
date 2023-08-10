import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, Input } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 设备-键盘
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'onKeyboardHeightChange',
        func: () => {
          TestConsole.consoleTest('Taro.onKeyboardHeightChange')
          Taro.onKeyboardHeightChange(this.boardHgiehtChaget)
        },
      },
      {
        id: 'offKeyboardHeightChange',
        func: () => {
          TestConsole.consoleTest('Taro.offKeyboardHeightChange ')
          Taro.offKeyboardHeightChange(this.boardHgiehtChaget)
        },
      },
      {
        id: 'offKeyboardHeightChange-nocallback',
        func: () => {
          TestConsole.consoleTest('Taro.offKeyboardHeightChange-nocallback')
          Taro.offKeyboardHeightChange()
        },
      },
      {
        id: 'hideKeyboard-callback',
        func: () => {
          TestConsole.consoleTest('Taro.hideKeyboard-callback')
          Taro.hideKeyboard({
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
        },
      },
      {
        id: 'hideKeyboard-promisse',
        func: () => {
          TestConsole.consoleTest('Taro.hideKeyboard-promisse')
          Taro.hideKeyboard().then(res => {
            TestConsole.consoleReturn(res)
          }).catch(err => {
            TestConsole.consoleFail(err)
          })
        },
      },
      {
        id: 'getSelectedTextRange-callback',
        func: () => {
          TestConsole.consoleTest('Taro.getSelectedTextRange-callback ')
          Taro.getSelectedTextRange({
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
        },
      },
      {
        id: 'getSelectedTextRange-promise',
        func: () => {
          TestConsole.consoleTest('Taro.getSelectedTextRange-promise ')
          Taro.getSelectedTextRange().then(res => {
            TestConsole.consoleReturn(res)
          }).catch(err => {
            TestConsole.consoleFail(err)
          })
        },
      },
    ],
  }

  boardHgiehtChaget = (res) => {
    TestConsole.consoleSuccess(JSON.stringify(res))
  }
  inputFocus = (e) => {
    // console.log(this.state.list[3])
    // this.state.list[3].func()
  }
  hideKeyboard = (e) => {
    let inputValue = e.detail.value + ''
    if (inputValue == 'hide') {
      this.state.list[2].func()
    }
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <View>点击输入框拉起键盘</View>
        <Input onFocus={this.inputFocus} onInput={this.hideKeyboard}></Input>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}