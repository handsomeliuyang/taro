import Taro from '@tarojs/taro'

export class LivePlayerContext implements Taro.LivePlayerContext {
  LivePlayer: any
  constructor (LivePlayer) {
    this.LivePlayer = LivePlayer
  }

  exitCasting (_option?: Taro.LivePlayerContext.ExitCastingOption | undefined): void {
    throw new Error('Method not implemented.')
  }

  exitFullScreen (_option?: Taro.LivePlayerContext.ExitFullScreenOption | undefined): void {
    const result = this.LivePlayer.toggleFullScreen(false)
    if (result.errMsg === 'ok') {
      _option?.success?.(result)
    } else {
      _option?.fail?.(result)
    }
    _option?.complete?.({ errMsg: result })
  }

  exitPictureInPicture (_option?: Taro.LivePlayerContext.ExitPictureInPictureOption | undefined): void {
    this.LivePlayer._exitPictureInPicture()
      .then((result) => {
        _option?.success?.(result)
      })
      .catch((err) => {
        _option?.fail?.(err)
      })
      .finally(() => {
        _option?.complete?.({ errMsg: `ok` })
      })
  }

  mute (_option?: Taro.LivePlayerContext.MuteOption | undefined): void {
    const result = this.LivePlayer._mute()
    if (result.errMsg === 'ok') {
      _option?.success?.(result)
    } else {
      _option?.fail?.(result)
    }
    _option?.complete?.({ errMsg: result })
  }

  pause (_option?: Taro.LivePlayerContext.PauseOption | undefined): void {
    const result = this.LivePlayer._pause()
    if (result.errMsg === 'ok') {
      _option?.success?.(result)
    } else {
      _option?.fail?.(result)
    }
    _option?.complete?.({ errMsg: result })
  }

  play (_option?: Taro.LivePlayerContext.PlayOption | undefined): void {
    const result = this.LivePlayer._play()
    if (result.errMsg === 'ok') {
      _option?.success?.(result)
    } else {
      _option?.fail?.(result)
    }
    _option?.complete?.({ errMsg: result })
  }

  reconnectCasting (_option?: Taro.LivePlayerContext.ReconnectCastingOption | undefined): void {
    throw new Error('Method not implemented.')
  }

  requestFullScreen (_option: Taro.LivePlayerContext.RequestFullScreenOption): void {
    const result = this.LivePlayer.toggleFullScreen(true)
    if (result.errMsg === 'ok') {
      _option?.success?.(result)
    } else {
      _option?.fail?.(result)
    }
    _option?.complete?.({ errMsg: result })
  }

  requestPictureInPicture (_option: Taro.LivePlayerContext.RequestPictureInPictureOption): void {
    this.LivePlayer._enterPictureInPicture()
      .then((result) => {
        _option?.success?.(result)
      })
      .catch((err) => {
        _option?.fail?.(err)
      })
      .finally(() => {
        _option?.complete?.({ errMsg: `ok` })
      })
  }

  resume (_option?: Taro.LivePlayerContext.ResumeOption | undefined): void {
    const result = this.LivePlayer._resume()
    if (result.errMsg === 'ok') {
      _option?.success?.(result)
    } else {
      _option?.fail?.(result)
    }
    _option?.complete?.({ errMsg: result })
  }

  snapshot (_option?: Taro.LivePlayerContext.SnapshotOption | undefined): void {
    this.LivePlayer._snapshot(_option)
      .then((result) => {
        _option?.success?.(result)
      })
      .catch((err) => {
        _option?.fail?.(err)
      })
      .finally(() => {
        _option?.complete?.({ errMsg: `ok` })
      })
  }

  startCasting (_option?: Taro.LivePlayerContext.StartCastingOption | undefined): void {
    throw new Error('Method not implemented.')
  }

  stop (_option?: Taro.LivePlayerContext.StopOption | undefined): void {
    const result = this.LivePlayer._stop()
    if (result.errMsg === 'ok') {
      _option?.success?.(result)
    } else {
      _option?.fail?.(result)
    }
    _option?.complete?.({ errMsg: result })
  }

  switchCasting (_option?: Taro.LivePlayerContext.SwitchCastingOption | undefined): void {
    throw new Error('Method not implemented.')
  }
}
