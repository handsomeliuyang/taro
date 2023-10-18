import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text, ScrollView, LivePlayer } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import { TestConsole } from '@/util/util'
import './index.scss'

/**
 * 媒体-实时音视频
 * @returns
 */
let LivePlayerContext
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createLivePusherContext',
        func: null,
      },
      {
        id: 'createLivePlayerContext',
        func: (apiIndex) => {
          TestConsole.consoleTest('createLivePlayerContext')
          LivePlayerContext = Taro.createLivePlayerContext('LivePlayer')
          TestConsole.consoleNormal('createLivePlayerContext ', LivePlayerContext)
        },
      },
      {
        id: 'LivePlayer_mute',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_mute')
          LivePlayerContext.mute({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          
          TestConsole.consoleNormal('mute ')
        },
      },
      {
        id: 'LivePlayer_pause',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_pause')
          LivePlayerContext.pause({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          TestConsole.consoleNormal('pause')
        },
      },
      {
        id: 'LivePlayer_stop',
        func: (apiIndex) => {
          TestConsole.consoleTest('videoContext_stop')
          LivePlayerContext.stop({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          TestConsole.consoleNormal('stop')
        },
      },
      {
        id: 'LivePlayer_play',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayer_play')
          LivePlayerContext.play({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          TestConsole.consoleNormal('play')
        },
      },
      {
        id: 'LivePlayer_requestFullScreen',
        inputData: {
          direction: 0,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('LivePlayerContext_requestFullScreen')
          LivePlayerContext.requestFullScreen({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          setTimeout(() => {
            LivePlayerContext.exitFullScreen()
            TestConsole.consoleNormal('exitFullScreen')
          }, 8000)

          TestConsole.consoleNormal('requestFullScreen')
        },
      },
      {
        id: 'LivePlayer_resume',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_resume')
          LivePlayerContext.resume({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          
          TestConsole.consoleNormal('resume')
        },
      },
      {
        id: 'LivePlayer_snapshot',
        inputData: {
          quality: "raw",
          sourceType:'stream'
        },
        func: (apiIndex,data) => {
          TestConsole.consoleTest('LivePlayerContext_snapshot')
          LivePlayerContext.snapshot({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          TestConsole.consoleNormal('snapshot')
        },
      },
      {
        id: 'LivePlayer_requestPictureInPicture_H5暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_requestPictureInPicture')
          LivePlayerContext.requestPictureInPicture({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          TestConsole.consoleNormal('requestPictureInPicture')
        },
      },
      {
        id: 'LivePlayer_exitPictureInPicture_H5暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('LivePlayerContext_exitPictureInPicture')
          LivePlayerContext.exitPictureInPicture({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
              
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
          TestConsole.consoleNormal('exitPictureInPicture')
        },
      },

      {
        id: 'LivePusherContext',
        func: null,
      },
    ],
  }
  render () {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
        <LivePlayer id='LivePlayer' src='https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-480p.flv' isLive={true}
          cors={true} soundMode='ear'
          type='flv'  
        ></LivePlayer>
      </View>
    )
  }
}
