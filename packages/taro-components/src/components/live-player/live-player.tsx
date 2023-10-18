import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
  State,
} from '@stencil/core'
import flvjs from 'flv.js'

import { scene,screenFn } from './utils'

@Component({
  tag: 'taro-live-player-core',
  styleUrl: './style/live-player.scss',
})
export class LivePlayer implements ComponentInterface {
  private player: any
  private type = 'flv'
  private speakerID: string
  private earID: string
  private livePlayerRef: HTMLVideoElement
  private videoElement: any
  // private dlnacasts: any;
  // private pictureInPictureModePop: boolean = false;
  // private pictureInPictureModePush: boolean = false;

  @Element() el: Element

  /**
   * 要播放的资源地址
   */
  @Prop() src: string
  /**
   * 要播放的视频模式
   */
  @Prop() mode = 'live'
  /**
   * 是否自动播放
   */
  @Prop() autoplay = false
  /**
   * 是否静音播放
   */
  @Prop() muted = false
  /**
   * 画面方向默认竖直
   */
  @Prop() orientation = 'default'
  /**
   * 画面方向默认竖直
   */
  @Prop() soundMode = 'speaker'
  /**
   * 设置小窗模式字符串或者数组
   */
  @Prop() pictureInPictureMode: any = ''
  /**
   * 当跳转到本小程序的其他页面时，是否自动暂停本页面的实时音视频播放
   */
  @Prop() autoPauseIfNavigate = true
  /**
   * 填充模式
   */
  @Prop() objectFit = 'contain'
  /**
   * 最小缓冲区
   */
  @Prop() minCache = 1
  /**
   * 最大缓冲区
   */
  @Prop() maxCache = 3
  /**
   * id
   */
  @Prop() id = ''
  // 全屏状态时间戳
  @State() fullScreenTimestamp = new Date().getTime()
  // 全屏状态
  @State() isFullScreen = false
  
  @Event({
    eventName: 'onStateChange',
  })
    onStateChange: EventEmitter

  @Event({
    eventName: 'fullscreenchange',
  })
    onFullScreenChange: EventEmitter

  @Event({
    eventName: 'onAudioVolumeNotify',
  })
    onAudioVolumeNotify: EventEmitter

  @Event({
    eventName: 'onNetStatus',
  })
    onNetStatus: EventEmitter

  @Event({
    eventName: 'onError',
  })
    onError: EventEmitter

  @Event({
    eventName: 'onEnterPictureInPicture',
  })
    onEnterPictureInPicture: EventEmitter

  @Event({
    eventName: 'onLeavePictureInPicture',
  })
    onLeavePictureInPicture: EventEmitter

  async componentDidLoad () {
   
    try {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function () {
          // 用户已授权
        })
        .catch(function (err) {
          console.error('请求设备权限失败：', err)
        })
      const deviceInfos = await navigator.mediaDevices.enumerateDevices()
      this.findAudioDevices(deviceInfos)
    } catch (error) {
      console.error('获取设备列表失败: ', error)
    }

    if (document.addEventListener) {
      document.addEventListener(screenFn.fullscreenchange, this.handleFullScreenChange)
    }
    if (this.livePlayerRef && scene === 'iOS') {
      // NOTE: iOS 场景下 fullscreenchange 并不会在退出全屏状态下触发，仅 webkitpresentationmodechanged 与 webkitendfullscreen 可替代
      this.livePlayerRef.addEventListener('webkitendfullscreen', this.handleFullScreenChange)
    }
    if (flvjs.isSupported()) {
      let modeType: number = 1024 * 1024
      if (this.mode == 'live') {
        modeType = 1024 * 1024
      } else {
        modeType = 1024 * 256
      }
      this.minCache = Math.floor((1024 * 1024 * modeType) / 8)
      this.maxCache = Math.floor((1024 * 1024 * modeType) / 8)

      this.videoElement = this.el.querySelector('video')
      this.livePlayerRef.addEventListener('volumechange', () => {
        this.onAudioVolumeNotify.emit({})
      })

      // 监听播放器播放结束
      this.livePlayerRef.addEventListener('ended', () => {
        this.onStateChange.emit({
          code: 500,
          message: 'Playback ended',
        })
      })
      // 静音属性
      if (this.muted && this.videoElement) {
        this.videoElement.muted = this.muted
        this.videoElement.volume = 0
      }
      // 画面方向
      if (this.orientation == 'vertical' && this.videoElement) {
        this.videoElement.style.transform = "rotate(90deg)"
        this.videoElement.style.height = 'hidden'
      } else if (this.orientation == 'horizontal' && this.videoElement) {
        this.videoElement.style.width = '100%'
      } else if (this.orientation == 'default' && this.videoElement) {
        this.videoElement.style.width = '100%'
      }
      // 画面填充方式
      if (this.objectFit == 'contain' && this.videoElement) {
        this.videoElement.style.objectFit = 'contain'
      } else if (this.objectFit == 'fillCrop' && this.videoElement) {
        this.videoElement.style.objectFit = 'cover'
      }
      // 创建播放器
      this.createPlayers()
      // 声音传输方式
      if (this.soundMode === 'speaker') {
        this.switchToSpeaker()
      } else {
        this.switchToHeadphones()
      }
      this.videoElement.addEventListener('fullscreenchange',  (event)=> {
        event.stopPropagation()
        let fullScreenTimestamp= new Date().getTime()
        if(fullScreenTimestamp-this.fullScreenTimestamp<100){ 
          return;
        }
        this.onFullScreenChange.emit({
          fullScreen: this.isFullScreen,
          direction: 0,
        })
        
      })
    }
  }

  // 获取当前设备的声音传输设备的ID
  findAudioDevices (deviceInfos) {
    deviceInfos.forEach((deviceInfo) => {
      if (deviceInfo.kind === 'audiooutput') {
        // 处理扬声器设备
        this.speakerID = deviceInfo.deviceId
      }
      if (deviceInfo.kind === 'audioinput' && deviceInfo.label.toLowerCase().includes('ear')) {
        // 处理听筒设备 (根据设备标签中包含 "ear" 来判断)
        this.earID = deviceInfo.deviceId
      }
    })
  }
  // 创建播放器
  createPlayers () {
    const config = {
      type: this.type,
      url: this.src,
      enableStashBuffer: true,
      stashInitialSize: this.minCache,
      stashBufferSize: this.maxCache,
    }
    this.player = flvjs.createPlayer(config)
    // 创建异常监听
    this.player.on(flvjs.ErrorDetails.NETWORK_EXCEPTION, function (type, message, data) {
      this.onStateChange.emit({
        code: 400,
        message: 'Error occurred',
      })
      if (type === flvjs.Events.ERROR && data === flvjs.ErrorDetails.NETWORK_EXCEPTION) {
        this.onNetStatus.emit({
          message: message,
          info: data,
          ts: new Date().getTime(),
        })
        this.onError.emit({
          detail: {
            code: -2305,
            message: '视频下载过程中网络断开或连接超时',
          },
        })
        // 处理网络异常的逻辑
      } else {
        // 处理其他错误的逻辑
      }
    })
    this.player.attachMediaElement(this.videoElement)
    this.onStateChange.emit({ code: 210 })
    this.player.load()
    this.onStateChange.emit({
      code: 200,
      message: 'Ready to play',
    })
    if (this.autoplay) {
      this.onStateChange.emit({
        code: 300,
        message: 'Rendering video',
      })
      this.player.play()
      this.onStateChange.emit({
        code: 310,
        message: 'Playing video',
      })
    }
    // 创建错误监听
    this.player.on(flvjs.Events.ERROR, function (message) {
      const regVideo = /Unable to load manifest/i
      if (regVideo.test(message)) {
        this.onError.emit({
          detail: {
            code: -2301,
            message: '获取不到视频流，请稍后再试',
          },
        })
        return
      }
      const regDecode = /Unsupported codec in video frame/i
      if (regDecode.test(message)) {
        this.onError.emit({
          detail: {
            code: -2302,
            message: '解码错误，请稍后再试',
          },
        })
        return
      }
      this.onError.emit({
        detail: {
          code: -2308,
          message: '播放器内部错误，请稍后再试',
        },
      })
    })
  }

  // 切换到扬声器
  switchToSpeaker () {
    const speakerDeviceId = this.speakerID // 将此处替换为实际的扬声器设备ID
    if (typeof this.videoElement.setSinkId !== 'undefined') {
      this.videoElement
        .setSinkId(speakerDeviceId)
        .then(function () {
          console.log('已切换到扬声器')
        })
        .catch(function (error) {
          console.error('切换到扬声器失败: ', error)
        })
    } else {
      console.warn('该浏览器不支持 HTMLMediaElement 元素的 setSinkId 方法')
    }
  }

  // 切换到听筒
  switchToHeadphones () {
    const headphonesDeviceId = this.earID // 将此处替换为实际的听筒设备ID
    if (typeof this.videoElement.setSinkId !== 'undefined') {
      this.videoElement
        .setSinkId(headphonesDeviceId)
        .then(function () {
          console.log('已切换到听筒')
        })
        .catch(function (error) {
          console.error('切换到听筒失败: ', error)
        })
    } else {
      console.warn('该浏览器不支持 HTMLMediaElement 元素的 setSinkId 方法')
    }
  }

  // 捕获全屏事件
  handleFullScreenChange = (e) => {
    // 全屏后，"退出"走的是浏览器事件，在此同步状态
    const timestamp = new Date().getTime()
    if (
      !e.detail &&
      this.isFullScreen &&
      !document[screenFn.fullscreenElement] &&
      timestamp - this.fullScreenTimestamp > 100
    ) {
      this.toggleFullScreen(false)
    }
  }

  /** 静音视频 */
  _mute = () => {
    try {
      this.livePlayerRef.muted = true
      return { errMsg: `ok`, message: 'success.' }
    } catch (e) {
      return { errMsg: `err`, message: e }
    }
  }

  /** 暂停视频 */
  _pause = () => {
    try {
      this.player.pause()
      this.onStateChange.emit({
        code: 320,
        message: 'Paused',
      })
      return { errMsg: `ok`, message: 'success.' }
    } catch (e) {
      return { errMsg: `err`, message: e }
    }
  }

  /** 播放视频 */
  _play = () => {
    try {
      this.player.play()
      this.onStateChange.emit({
        code: 310,
        message: 'Playing video',
      })
      return { errMsg: `ok`, message: 'success.' }
    } catch (e) {
      return { errMsg: `err`, message: e }
    }
  }
  /** 停止视频 */
  // @Method()
  // async stop () {
  //   this._stop()
  // }

  _stop = () => {
    try {
      this.player.pause()
      this.player.unload()
      this.player.detachMediaElement()
      this.player.destroy()
      this.onStateChange.emit({
        code: 500,
        message: 'Playback ended',
      })
      return { errMsg: `ok`, message: 'success.' }
    } catch (e) {
      return { errMsg: `err`, message: e }
    }
  }
  /** 恢复视频 */
  // @Method()
  _resume = () => {
    try {
      this.createPlayers()
      this.onStateChange.emit({
        code: 500,
        message: 'Playback ended',
      })
      return { errMsg: `ok`, message: 'success.' }
    } catch (e) {
      return { errMsg: `err`, message: e }
    }
  }

  /** 退出全屏事件 */

  toggleFullScreen = (isFullScreen = !this.isFullScreen) => {
    this.isFullScreen = isFullScreen
    
    this.fullScreenTimestamp = new Date().getTime()
    this.onFullScreenChange.emit({
      fullScreen: this.isFullScreen,
      direction: 0,
    })
    if (this.isFullScreen && !document[screenFn.fullscreenElement]) {
      try {
        setTimeout(() => {
          this.livePlayerRef[screenFn.requestFullscreen]({ navigationUI: 'auto' })
        }, 0)
        return { errMsg: `ok`, message: 'Full screen success.' }
      } catch (e) {
        return { errMsg: `err`, message: e }
      }
    } else {
      try {
        document[screenFn.exitFullscreen]()
        return { errMsg: `ok`, message: 'The full-screen exit succeeded.' }
      } catch (e) {
        return { errMsg: `err`, message: e }
      }
    }
  }
  /** 截屏 */
  _snapshot (data) {
    return new Promise((resolve, reject) => {
      const canvasElement = document.createElement('canvas')
      let imgwidth
      let imgheight

      // 原图
      if (data.quality == 'raw') {
        imgwidth = this.livePlayerRef.videoWidth
        imgheight = this.livePlayerRef.videoHeight
      }
      // 压缩图
      if (data.quality == 'compressed') {
        imgwidth = this.livePlayerRef.videoWidth * 0.5
        imgheight = this.livePlayerRef.videoHeight * 0.5
      }
      canvasElement.width = imgwidth
      canvasElement.height = imgheight
      const context = canvasElement.getContext('2d')
      context?.drawImage(this.livePlayerRef, 0, 0, imgwidth, imgheight)
      try {
        const dataURL = canvasElement.toDataURL()
        const Path = this.dataURLtoBlob(dataURL)
        const tempPath = URL.createObjectURL(Path)
        const result = {
          tempImagePath: tempPath,
          width: imgwidth,
          height: imgheight,
        }
        resolve(result)
      } catch (error) {
        console.error(error)
        const mssage = { err: error, mssage: '生成 Blob 失败' }
        reject(mssage)
      }
    })
  }
  dataURLtoBlob (dataurl) {
    const arr = dataurl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }
  // 画中画
  async _enterPictureInPicture () {
    return new Promise((resolve, reject) => {
      if (this.livePlayerRef && typeof this.livePlayerRef.requestPictureInPicture === 'function') {
        this.livePlayerRef
          .requestPictureInPicture()
          .then((res) => {
            // 进入画中画成功
            this.onEnterPictureInPicture.emit({
              detail: res,
            })
            resolve({ errMsg: `success`, message: res })
          })
          .catch((error) => {
            // 进入画中画失败
            this.onEnterPictureInPicture.emit({
              detail: error,
            })
            reject({ errMsg: `error`, message: error })
          })
      } else {
        // 浏览器不支持画中画或无法找到视频元素
        reject({ errMsg: `error`, message: '该设备不支持小窗' })
        
      }
    })
  }

  // 退出画中画
  _exitPictureInPicture () {
    return new Promise((resolve, reject) => {
      if (document.pictureInPictureEnabled && document.pictureInPictureElement) {
        document
          .exitPictureInPicture()
          .then((res) => {
            // 进入画中画成功
            this.onLeavePictureInPicture.emit({
              detail: res,
            })
            resolve({ errMsg: `success`, message: res })
          })
          .catch((error) => {
            // 进入画中画失败
            this.onLeavePictureInPicture.emit({
              detail: error,
            })
            reject({ errMsg: `error`, message: error })
          })
      } else {
        // 浏览器不支持画中画或无法找到视频元素
        reject({ errMsg: `error`, message: '该设备不支持小窗或者没有正在打开的小窗' })
      }
    })
  }

  // 处理横屏状态
  handleOrientationChange () {
    if (window.screen.orientation.angle === 90 || window.screen.orientation.angle === -90) {
      // 横屏状态
      this.toggleFullScreen(true)
    } else {
      // 竖屏状态
      this.toggleFullScreen(false)
    }
  }

  // 监听横屏
  @Listen('orientationchange', { target: 'window' })
  orientationchangeHandler () {
    this.handleOrientationChange()
  }
 
  @Listen('onhashchange', { target: 'window' })
  handleonhashchange () {
    console.log("URL的哈希值发生变化", window.location.hash);
  }
  @Listen('onpopstate', { target: 'window' })
  handleonhashchanges () {
    console.log("路由发生变化", window.location.hash);
  }
  componentDidHide () {
    if (this.player) {
      if (this.autoPauseIfNavigate) {
        this.player.pause()
      }
    }
    if (document.removeEventListener) {
      document.removeEventListener(screenFn.fullscreenchange, this.handleFullScreenChange)
    }
    if (this.livePlayerRef && scene === 'iOS') {
      this.livePlayerRef.removeEventListener('webkitendfullscreen', this.handleFullScreenChange)
    }
  }

  render () {
    return (
      <Host>
        <div>
          <video
            id={this.id}
            class="taro-live-player"
            ref={(dom) => {
              if (dom) {
                this.livePlayerRef = dom as HTMLVideoElement
              }
            }}
            controls
          ></video>
        </div>
      </Host>
    )
  }
}
