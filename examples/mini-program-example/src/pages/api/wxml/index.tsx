import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'
import './index.scss'

/**
 * WXML
 * @returns
 */

export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'createSelectorQuery',
        func: () => {
          console.log('createSelectorQuery success ', Taro.createSelectorQuery())
        },
      },
      {
        id: 'NodesRef',
        func: () => {
          TestConsole.consoleTest('Taro.NodesRef')
          Taro.createSelectorQuery()
            .select('#the-id')
            .boundingClientRect(function (rect) {
              // rect.id      // 节点的ID
              // rect.dataset // 节点的dataset
              // rect.left    // 节点的左边界坐标
              // rect.right   // 节点的右边界坐标
              // rect.top     // 节点的上边界坐标
              // rect.bottom  // 节点的下边界坐标
              // rect.width   // 节点的宽度
              // rect.height  // 节点的高度
              TestConsole.consoleTest('Taro.NodesRef boundingClientRect' + JSON.stringify(rect))
            })
            .exec()
          Taro.createSelectorQuery()
            .select('.the-video-class')
            .context(function (res) {
              console.log('context ', res.context) // 节点对应的 Context 对象。如：选中的节点是 <video> 组件，那么此处即返回 VideoContext 对象
              TestConsole.consoleTest('Taro.NodesRef context' + JSON.stringify(res.context))
            })
            .exec()
          Taro.createSelectorQuery()
            .select('#the-id')
            .fields(
              {
                dataset: true,
                size: true,
                scrollOffset: true,
                properties: ['scrollX', 'scrollY'],
                computedStyle: ['margin', 'backgroundColor'],
                context: true,
              },
              function (res) {
                res.dataset // 节点的dataset
                res.width // 节点的宽度
                res.height // 节点的高度
                res.scrollLeft // 节点的水平滚动位置
                res.scrollTop // 节点的竖直滚动位置
                res.scrollX // 节点 scroll-x 属性的当前值
                res.scrollY // 节点 scroll-y 属性的当前值
                // 此处返回指定要返回的样式名
                res.margin
                res.backgroundColor
                res.context // 节点对应的 Context 对象
                console.log('fields ', res)
                Taro.createSelectorQuery()
                  .select('.canvas')
                  .node(function (res) {
                    console.log('node', res.node) // 节点对应的 Canvas 实例。
                    TestConsole.consoleTest('Taro.NodesRef node' + JSON.stringify(res.node))
                  })
                  .exec()
                Taro.createSelectorQuery()
                  .selectViewport()
                  .scrollOffset(function (res) {
                    res.id // 节点的ID
                    res.dataset // 节点的dataset
                    res.scrollLeft // 节点的水平滚动位置
                    res.scrollTop // 节点的竖直滚动位置
                    console.log('scrollOffset ', res)
                    TestConsole.consoleTest('Taro.NodesRef scrollOffset' + JSON.stringify(res))
                  })
                  .exec()
              }
            )
            .exec()
        },
      },
      {
        id: 'SelectorQuery',
        func: () => {
          TestConsole.consoleTest('Taro.SelectorQuery')
          const query = Taro.createSelectorQuery().in(this)
          TestConsole.consoleSuccess('Taro.SelectorQuery in' + JSON.stringify(query))

          Taro.createSelectorQuery()
            .select('#the-id')
            .fields(
              {
                dataset: true,
                size: true,
                scrollOffset: true,
                properties: ['scrollX', 'scrollY'],
              },
              function (res) {
                res.dataset // 节点的dataset
                res.width // 节点的宽度
                res.height // 节点的高度
                res.scrollLeft // 节点的水平滚动位置
                res.scrollTop // 节点的竖直滚动位置
                res.scrollX // 节点 scroll-x 属性的当前值
                res.scrollY // 节点 scroll-x 属性的当前值
                TestConsole.consoleSuccess('Taro.SelectorQuery select' + JSON.stringify(res))
              }
            )
            .exec()
          Taro.createSelectorQuery()
            .selectViewport()
            .scrollOffset(function (res) {
              res.id // 节点的ID
              res.dataset // 节点的dataset
              res.scrollLeft // 节点的水平滚动位置
              res.scrollTop // 节点的竖直滚动位置
              TestConsole.consoleSuccess('Taro.SelectorQuery selectViewport' + JSON.stringify(res))
            })
            .exec()
        },
      },
      {
        id: 'createIntersectionObserver',
        func: () => {
          TestConsole.consoleTest('Taro.createIntersectionObserver')
          const observer = Taro.createIntersectionObserver(this, { thresholds: [0], observeAll: true })
          TestConsole.consoleSuccess(observer)
        }
      },
      {
        id: 'IntersectionObserver',
        func: () => {
          TestConsole.consoleTest('Taro.createIntersectionObserver IntersectionObserver')
          this.state._observer.relativeTo('.scrollview').observe('.ball', (res) => {
            TestConsole.consoleSuccess(res)
          })
        }
      },
      {
        id: 'IntersectionObserver - disconnect',
        func: () => {
          TestConsole.consoleTest('Taro.createIntersectionObserver IntersectionObserver')
          this.state._observer.disconnect()
          TestConsole.consoleSuccess('disconnect:ok')
        }
      }
    ],
    _observer: Taro.createIntersectionObserver(this)
  }
  render () {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
        <View className='text'>测试 IntersectionObserver，请先点击按钮，然后滚动下面内容让小球出现 </View>
        <View className='page-section'>
          <ScrollView className='scroll-view' scrollY>
            <View className='scroll-area'>
              <Text className='notice'>向下滚动让小球出现</Text>
              <View className='filling'></View>
              <View className='ball'>ball</View>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
