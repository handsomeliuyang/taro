import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
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
                    Taro.openAppAuthorizeSetting({
                        success (res) {
                            console.log('Taro.openAppAuthorizeSetting success-----', res);
                        },
                        fail (res) {
                            console.log('fail-----', res);
                        },
                        complete (res) {
                            console.log('complete-----', res);
                        }
                    })
                },
            }, 
            {
                id: 'getWindowInfo',
                func: ()=>{
                    // @ts-ignore
                    Taro.getWindowInfo({
                        success:(res)=>{
                            console.log('Taro.getWindowInfo success ', res)
                        },
                        fail:(err=>{
                            console.log('Taro getWindowInfo fail ', err)
                        })
                        
                    });
                },
            }, 
            {
                id: 'getSystemSetting',
                func: () => {
                    const systemSetting = Taro.getSystemSetting()
                    Taro.showToast({
                        title: 'success'
                    })
                    console.log('Taro.getSystemSetting success', systemSetting);
                },
            }, 
            {
                id: 'getSystemInfoSync',
                func: ()=>{
                    const info = Taro.getSystemInfoSync()
                    console.log('Taro.getSystemInfoAsync success', info);
                },
            },
            {
                id: 'getSystemInfoAsync',
                func: ()=>{
                    Taro.getSystemInfoAsync({
                        success (res) {
                            console.log('Taro.getSystemInfoAsync success', res); 
                        },
                        fail (err) {
                            console.log('Taro.getSystemInfoAsync fail', err); 
                        },
                        complete (res) {
                            console.log('Taro.getSystemInfoAsync success', res); 
                        },
                    })
                    
                },
            }, 
            {
                id: 'getSystemInfo',
                func: () => {
                    Taro.getSystemInfo({
                        success: function (res) {
                            console.log('Taro.getSystemInfo success', res);
                          },
                          fail: function (err) {
                            console.log('Taro.getSystemInfo fail', err);
                          }
                    })
                },
            }, 
            {
                id: 'getDeviceInfo',
                func: ()=>{
                    const deviceInfo = Taro.getDeviceInfo()
                    console.log('Taro.getDeviceInfo success ',deviceInfo)
                },
            }, 
            {
                id: 'getAppBaseInfo',
                func: ()=>{
                    // @ts-ignore
                    Taro.getAppBaseInfo({
                        success: function (res) {
                        console.log('Taro.getAppBaseInfo success ', res)
                        },
                        fail: function (err) {
                            console.log('Taro.getAppBaseInfo fail ', err)
                        }
                    })
                },
            }, 
            {
                id: 'getAppAuthorizeSetting',
                func: ()=>{
                   // @ts-ignore
                    let info = Taro.getAppAuthorizeSetting({
                        success: function (res) {
                            console.log('Taro.getAppAuthorizeSetting success ', res)
                          },
                          fail: function (err) {
                              console.log('Taro.getAppAuthorizeSetting fail ', err)
                          }
                    })
                },
            }, 
        ], 
    }
    render () {
        return (
            <View className='api-page'>
                {
                    this.state.list.map((item) => {
                        return (
                            <Button
                                className='api-page-btn'
                                type='primary'
                                onClick={item.func == null ? () => {} : item.func}
                            >
                                {item.id}
                                {
                                    item.func == null && (<Text className='navigator-state tag'>未创建Demo</Text>)
                                }
                            </Button>
                        )
                    })
                }
            </View>
        )
    }
}

