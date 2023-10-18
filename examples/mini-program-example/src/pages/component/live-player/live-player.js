import './live-player.scss'
import React from 'react'
import { View, LivePlayer,Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {
  demo(){
    Taro.navigateTo({
      url: '/pages/component/image/image',
      events: {
        data: 'test',
      },
      success: (res) => {
        // TestConsole.consoleSuccess.call(this, res, apiIndex)
      },
      fail: (res) => {
        // TestConsole.consoleFail.call(this, res, apiIndex)
      },
      complete: (res) => {
        // TestConsole.consoleComplete.call(this, res, apiIndex)
      },
    }).then((res) => {
      // TestConsole.consoleReturn.call(this, res, apiIndex)
    })
  }
  render() {
    
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='lvie-player'></Header>
          <ComponentState platform='H5' rate='10'>
            {' '}
          </ComponentState>
        </View>
        <View className='components-page__body' style={{ marginTop: '100px' }}>
          <View className='components-page__body-example example'>
            <View className='example-body'>
              <LivePlayer
                style={{ height: '300px', marginTop: '100px' }} 
                src='https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-480p.flv'
                isLive={true}
                cors={true}
                autoplay={true}
                muted={false}
                orientation='horizontal'
                type='flv'
                id='LivePlayer'
                soundMode='speaker'
                autoPauseIfNavigate={false}
                pictureInPictureMode={["pop","push"]}
              />
            </View>
            
          {/* <Button onClick={this.demo}>跳转</Button> */}
          </View>
        </View>
      </View>
    )
  }
}
