import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * 文件
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'saveFile',
        func: () => {
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: function (res) {
                  console.log('saveFile success ', res.savedFilePath, res.errMsg)
                },
                fail: function (res) {
                  console.log('saveFile fail ', res.errMsg)
                },
                complete: function (res) {
                  console.log('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'getSavedFileList',
        func: () => {
          Taro.getSavedFileList({
            success: function (res) {
              console.log('getSavedFileList success ', res.fileList, res.errMsg)
            },
            fail: function (res) {
              console.log('getSavedFileList fail', res.errMsg)
            },
            complete: function (res) {
              console.log('getSavedFileList complete ', res)
            },
          })
        },
      },
      {
        id: 'getSavedFileInfo',
        func: () => {
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: function (res) {
                  console.log('saveFile success ', res.savedFilePath, res.errMsg)
                  Taro.getSavedFileInfo({
                    filePath: res.savedFilePath,
                    success: function (res) {
                      console.log('getSavedFileInfo success', res.size, res.createTime)
                    },
                    fail: function (res) {
                      console.log('getSavedFileInfo fail', res.errMsg)
                    },
                    complete: function (res) {
                      console.log('getSavedFileInfo complete ', res)
                    },
                  })
                },
                fail: function (res) {
                  console.log('saveFile fail ', res.errMsg)
                },
              })
            },
          })
        },
      },
      {
        id: 'getFileInfo',
        func: () => {
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: function (res) {
                  console.log('saveFile success ', res.savedFilePath, res.errMsg)
                  Taro.getFileInfo({
                    filePath: res.savedFilePath,
                    digestAlgorithm: 'md5',
                    success: function (res) {
                      console.log('getFileInfo success', res.size, res.digest)
                    },
                    fail: function (res) {
                      console.log('getFileInfo fail', res.errMsg)
                    },
                    complete: function (res) {
                      console.log('getFileInfo complete ', res)
                    },
                  })
                },
                fail: function (res) {
                  console.log('saveFile fail ', res.errMsg)
                },
              })
            },
          })
        },
      },
      {
        id: 'removeSavedFile',
        func: () => {
          Taro.getSavedFileList({
            success: function (res) {
              console.log('getSavedFileList success ', res.fileList, res.errMsg)
              if (res.fileList.length > 0) {
                Taro.removeSavedFile({
                  filePath: res.fileList[0].filePath,
                  success: function (res) {
                    console.log('removeSavedFile success ', res.errMsg)
                  },
                  fail: function (res) {
                    console.log('removeSavedFile fail ', res.errMsg)
                  },
                  complete: function (res) {
                    console.log('removeSavedFile complete ', res)
                  },
                })
              }
            },
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
