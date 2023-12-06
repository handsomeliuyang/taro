export const root = '/wxProject'

// js小程序demo
export const DEMO_JS_FILE_INFO = {
  '/project.config.json': `
    {}
  `,
  '/app.js': `App({})`,
  '/app.json': `
    {
      "pages":[
        "pages/index/index"
      ]
    }
  `,
  '/pages/index/index.js': `
    const app = getApp()
      Page({
      data: {
        motto: 'Hello World',
      },
      onLoad() {}
    })
  `,
  '/pages/index/index.json': `
    {
      "usingComponents": {}
    }
  `,
  '/pages/index/index.wxml': `
    <view>
      <text>{{motto}}</text>
    </view>
  `,
  '/pages/index/index.wxss': ``,
}

// js小程序demo（配置miniprogramRoot）
export const DEMO_JS_FILE_INFO_MINIPROGRANROOT = {
  '/project.config.json': `
    {
      "miniprogramRoot": "miniprogram/"
    }
  `,
  '/miniprogram/app.js': `App({})`,
  '/miniprogram/app.json': `
    {
      "pages":[
        "pages/index/index"
      ]
    }
  `,
  '/miniprogram/pages/index/index.js': `
    const app = getApp()
      Page({
      data: {
        motto: 'Hello World',
      },
      onLoad() {}
    })
  `,
  '/miniprogram/pages/index/index.json': `
    {
      "usingComponents": {}
    }
  `,
  '/miniprogram/pages/index/index.wxml': `
    <view>
      <text>{{motto}}</text>
    </view>
  `,
  '/miniprogram/pages/index/index.wxss': ``,
}

// js小程序demo（配置miniprogramRoot）
export const CONVERT_CONFIG_DATA = {
  '/convert.config.json': `
    {
      "external": ["./mps/*"]
    }
  `,
  '/app.js': `
    import { data } from './mps/index/index.js'
  `,
  '/mps/index/index.js': `const a = 1`,
}

// js小程序插件
export const PLUGIN_FILE_DATA = {
  '/project.config.json': `
    {
      "miniprogramRoot": "miniprogram/",
      "pluginRoot": "plugin/",
      "compileType": "plugin"
    }
  `,
  '/miniprogram/app.json': `
    {
      "pages": [
        "pages/index/index"
      ],
      "plugins": {
        "hello-plugin": {
          "version": "dev",
          "provider": "wx9e5d25b6307be4bc"
        }
      }
    }
  `,
  '/miniprogram/pages/index/index.js': `
    var plugin = requirePlugin("hello-plugin")
    Page({
      data: {
        items: ['hello', 'world']
      },
      onLoad: function () {
        plugin.sayHello()
      },
      goToPlugin: function () {
        wx.navigateTo({
          url: 'plugin://hello-plugin/hello-page?param1=value'
        })
      }
    })
  `,
  '/miniprogram/pages/index/index.json': `
    {
      "usingComponents": {
        "hello-component": "plugin://hello-plugin/hello-component"
      }
    }
  `,
  '/miniprogram/pages/index/index.wxml': `
    <button id="goToPlugin" bindtap="goToPlugin">navigateTo接口跳转插件</button>

    <hello-component items="{{ items }}" />
  `,
  '/miniprogram/pages/index/index.wxss': `
    #nav {
      text-align: center;
      background: #eeeeee;
      margin: 1em;
      padding: 1em;
      border-radius: 5px;
    }

    #goToPlugin {
      margin: 1em;
    }
  `,
  '/plugin/plugin.json': `
    {
      "publicComponents": {
        "hello-component": "components/hello-component"
      },
      "pages": {
        "hello-page": "pages/hello-page",
        "index": "pages/index/index"
      },
      "main": "index.js"
    }
  `,
  '/plugin/index.js': `
    module.exports = {
      sayHello: function () {
        console.log('Hello plugin!')
      }
    }
  `,
  '/plugin/pages/hello-page.js': `
    const miniprogramPageUrl = '/pages/index/index'
    const pluginPageUrl = './index/index'
    Page({
      data: {
        items: ['hello', 'world']
      },
      onLoad: function (data) {
        console.log('This is a plugin page!')
        console.log(data)
      },
      goToMiniprogramPage: function () {
        wx.navigateTo({
          url: miniprogramPageUrl
        });
      },
      goToPluginPage: function () {
        wx.navigateTo({
          url: pluginPageUrl
        });
      }
    })
  `,
  '/plugin/pages/hello-page.json': `
    {
      "usingComponents": {
        "component1": "../components/component1/component1"
      }
    }
  `,
  '/plugin/pages/hello-page.wxml': `
    <text>
      This is a plugin page!
    </text>
    <button bindtap="goToMiniprogramPage">跳转到小程序页面</button>
    <button bindtap="goToPluginPage">跳转到插件页面</button>
    <component1>nn</component1>
  `,
  '/plugin/pages/index/index.js': `
    Page({
      data: {}
    })
  `,
  '/plugin/pages/index/index.json': `
    {
      "usingComponents": {
      }
    }
  `,
  '/plugin/pages/index/index.wxml': `
    <text>这是插件index页面</text>
  `,
  '/plugin/components/hello-component.js': `
    Component({
      properties: {
        items: {
          type: Array,
          value: []
        }
      },

      data: {},
    })
  `,
  '/plugin/components/hello-component.json': `
    {
      "component": true,
      "usingComponents": {}
    }
  `,
  '/plugin/components/hello-component.wxml': `
    <view class="container">
      <view>这是插件组件hello-component</view>
      <text class="item" wx:key="{{ items }}" wx:for="{{ items }}">{{ item }}</text>
    </view>
  `,
  '/plugin/components/hello-component.wxss': `
    .container {
      margin: 1em;
    }
    .item {
      display: block;
    }
  `,
  '/plugin/components/component1/component1.js': `
    Component({})
  `,
  '/plugin/components/component1/component1.json': `
    {
      "component": true,
      "usingComponents": {}
    }
  `,
  '/plugin/components/component1/component1.wxml': `
    <text>这是插件组件component1</text>
  `,
}

export const DEMO_JS_FILES = {
  '/app.json': `
    {
      "pages":[
        "pages/index/index",
        "pages/index/other"
      ]
    }
  `,
  '/pages/index/index.js': `
    const app = getApp()
      Page({
      data: {
        info: 'this is index page',
      },
      onLoad() {}
    })
  `,
  '/pages/index/index.wxml': `
    <view>
      <text>{{info}}</text>
    </view>
  `,
  '/pages/index/other.js': `
    const app = getApp()
      Page({
      data: {
        message: 'this is other page',
      },
      onLoad() {}
    })
  `,
  '/pages/index/other.wxml': `
    <view>
      <text>{{message}}</text>
    </view>
  `,
}

// 小程序组件
export const USINGCOMPONENTS_FILE_DATA = {
  /**
   * 构造一个引用组件的三级目录
   * app.json里设置公共组测组件cpt
   * cpt2调用cpt组件，cpt3调用cpt2组件
   * 因为cpt2和cpt3为非公共组件，所以需在page/index.json里面需要引用这两个子组件
   * cpt3嵌套cpt2，也需要在其json里引用cpt2
   */

  '/app.json': `
      {
        "pages":[
          "pages/index/index"
        ],
        "usingComponents": {
          "cpt": "/components/cpt/cpt"
        }
      }
    `,
  '/app.js':`
      app({})
    `,
  '/package.config.json': `{}`,
  '/pages/index/index.js':`Page({})`,
  '/pages/index/index.json':`
      {
        "usingComponents": {
          "cpt2": "/components/cpt2/cpt2",
          "cpt3": "/components/cpt3/cpt3"
        }
      }
    `,
  '/pages/index/index.wxml':`
      <view>
        <cpt2></cpt2>
        <cpt3></cpt3>
      </view>
    `,
  '/components/cpt/cpt.js':`
      Component({
        properties: {
          text: {
            type: String,
            value: 'cpt'
          },
          buttonText: {
            type: String,
            value: 'Click Me!'
          }
        }
      })
    `,
  '/components/cpt/cpt.json':`
    {
      "component": true,
      "usingComponents": {}
    }
    `,
  '/components/cpt/cpt.wxml':`
      <view>cpt</view>
    `,
  '/components/cpt2/cpt2.js':`
      Component({
        properties: {
          text: {
            type: String,
            value: 'cpt2'
          },
          buttonText: {
            type: String,
            value: 'Click Me!'
          }
        }
      })
    `,
  '/components/cpt2/cpt2.json':`
    {
      "component": true,
      "usingComponents": {
      }
    }
    `,
  '/components/cpt2/cpt2.wxml':`
      <view>
        <cpt></cpt>
        cpt2
      </view>
    `,
  '/components/cpt3/cpt3.js':`
      Component({
        properties: {
          text: {
            type: String,
            value: 'cpt3'
          },
          buttonText: {
            type: String,
            value: 'Click Me!'
          }
        }
      })
    `,
  '/components/cpt3/cpt3.json':`
    {
      "component": true,
      "usingComponents": {
        "cpt2": "/components/cpt2/cpt2"
      }
    }
    `,
  '/components/cpt3/cpt3.wxml':`
      <view>
        <cpt2></cpt2>
        cpt3
      </view>
    `
}

