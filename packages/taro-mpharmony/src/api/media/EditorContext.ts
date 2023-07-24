import Taro from '@tarojs/api'

// import { temporarilyNotSupport } from '../../utils'

// 富文本
export class EditorContext implements Taro.EditorContext {
  // blur = temporarilyNotSupport('EditorContext.blur')

  blur (option?: Taro.EditorContext.BlurOption | undefined): void {
    option?.fail?.({ errMsg: `not support blur.` })
  }

  getContext (): Taro.EditorContext {
    return this as Taro.EditorContext
  }

  activeEditor (): any {
    // @ts-ignore
    return tinymce.activeEditor
  }

  scrollIntoView (): void {
    this.activeEditor()?.selection.scrollIntoView()
  }

  getSelectionText (option?: Taro.EditorContext.getSelectionText.Option | undefined): void {
    try {
      const selection = this.activeEditor()?.selection
      if (selection) {
        const selectionText = selection.getContent({ format: 'text' })
        option?.success?.({ errMsg: '', text: selectionText })
      }
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  clear (option?: Taro.EditorContext.ClearOption | undefined): void {
    try {
      this.activeEditor()?.setContent('')
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  format (name: string, value?: string | undefined): void {
    // 微信: https://developers.weixin.qq.com/miniprogram/dev/api/media/editor/EditorContext.format.html
    // tinymce: https://www.tiny.cloud/docs/tinymce/6/content-formatting/#formats
    // NOT SUPPORT
    // 1. ins
    // 2. list check

    const editor = this.activeEditor()
    if (!editor) {
      console.error(`Editor fail get activeEditor in format.`)
      return
    }

    if (name ===  'bold' || name ===  'italic' || name ===  'underline') {
      editor.formatter.toggle(name)

    } else if (name ===  'strike') {
      editor.formatter.toggle('strikethrough')

    } else if (name ===  'ins') {
      console.error(`Editor not support format ins`)

    }

    value = value || ''
    if (value.length < 1) {
      console.error(`Editor format ${name} value must be not empty.`)
      return
    }

    if (name ===  'script') {
      // value = sub / super
      if (value ===  'sub') {
        editor.formatter.toggle('subscript')

      } else if (value ===  'super') {
        editor.formatter.toggle('superscript')

      }

    } else if (name ===  'header') {
      // value = H1 / H2 / h3 / H4 / h5 / H6
      const levelMap: Map<string, string> = new Map<string, string>(Object.entries({
        // H1 / H2 / h3 / H4 / h5 / H6
        h1: 'h1', 1: 'h1',
        h2: 'h2', 2: 'h2',
        h3: 'h3', 3: 'h3',
        h4: 'h4', 4: 'h4',
        h5: 'h5', 5: 'h5',
        h6: 'h6', 6: 'h6',
      }))

      const formatName = levelMap.get(value)
      if (formatName) {
        editor.formatter.toggle(formatName)
      }

    } else if (name ===  'align') {
      // value = left / center / right / justify
      const formatNameMap: Map<string, string> = new Map<string, string>(Object.entries({
        // left / center / right / justify
        left: 'alignleft',
        center: 'aligncenter',
        right: 'alignright',
        justify: 'alignjustify',
      }))

      const formatName = formatNameMap.get(name + value.toLocaleLowerCase())
      if (formatName) {
        editor.formatter.toggle(formatName)
      }

    } else if (name ===  'direction') {
      // value = rtl / ltf
      if (value ===  'ltr' || value ===  'rtl') {
        editor.getBody().dir = value
      }

    } else if (name ===  'indent') {
      // value = -1 / +1
      const num = Number(value)
      if (num ===  1) {
        editor.execCommand('Indent')

      } else if (num ===  -1) {
        editor.execCommand('Outdent')

      }

    } else if (name ===  'list') {
      // value = ordered / bullet / check
      // ordered = num list
      // bullet = dot list
      // check = checkbox list
      // https://www.tiny.cloud/docs/plugins/opensource/lists/

      const type = value.toLocaleLowerCase()
      if (type ===  'ordered') {
        editor.execCommand('InsertOrderedList', false, {
          'list-style-type': 'decimal'
        })

      } else if (type ===  'bullet') {
        editor.execCommand('InsertUnorderedList', false, {
          'list-style-type': 'disc'
        })

      } else if (type ===  'check') {
        // https://www.tiny.cloud/docs/plugins/premium/checklist/
        console.error(`Editor not support format list with check`)

      } else {
        // 删除list
        // editor.execCommand('RemoveList');
      }

    } else if (name ===  'color') {
      editor.formatter.apply('forecolor', { value: value })

    } else if (name ===  'backgroundColor') {
      editor.formatter.apply('hilitecolor', { value: value })

    } else {
      editor.formatter.apply(name, { value: value })

    }
  }

  getContents (option?: Taro.EditorContext.GetContents.Option | undefined): void {
    try {
      const editor = this.activeEditor()
      if (editor) {
        option?.success?.({
          errMsg: '',
          html: editor.getContent({ format: 'html' }),
          text: editor.getContent({ format: 'text' }),
          delta: editor.getContent({ format: 'tree' }),
        })
      }
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }

    option?.complete?.({ errMsg: `` })
  }

  insertDivider (option?: Taro.EditorContext.InsertDividerOption | undefined): void {
    try {
      option?.fail?.({ errMsg: 'not support EditorContext.insertDivider api.' })
    } finally {
      option?.complete?.({ errMsg: '' })
    }
  }

  insertImage (option: Taro.EditorContext.InsertImageOption): void {
    try {
      const data = (option.data || {}) as Record<string, any>
      let dataCustom = ''
      for (const key in data) {
        dataCustom = dataCustom + `${key}=${data[key]};`
      }

      this.activeEditor()?.insertContent(`<img class="${option.extClass}" data-custom="${dataCustom}" alt="${option.alt}" height="${option.height}" width="${option.width}" src="${option.src}" />`)
      const nowrap = option.nowrap || false
      if (nowrap === false) {
        this.activeEditor()?.insertContent(`<br/>`)
      }
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  insertText (option: Taro.EditorContext.InsertTextOption): void {
    try {
      const text = option.text || ''
      if (text.length > 0) {
        this.activeEditor()?.insertContent(text)
      }
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  removeFormat (option?: Taro.EditorContext.RemoveFormatOption | undefined): void {
    try {
      // https://www.tiny.cloud/docs/tinymce/6/editor-command-identifiers/#supported-browser-native-commands
      this.activeEditor()?.execCommand('RemoveFormat')
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  setContents (option: Taro.EditorContext.SetContentsOption): void {
    try {
      const delta = option && option.delta
      const html = option && option.html
      const editor = this.activeEditor()
      if (delta) {
        try {
          editor?.setContent(delta, { format: 'tree' })
        } catch (e) {
          if (html) {
            editor?.setContent(html, { format: 'html' })
          }
        }
      } else {
        if (html) {
          editor?.setContent(html, { format: 'html' })
        }
      }

      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  redo (option?: Taro.EditorContext.RedoOption | undefined): void {
    try {
      this.activeEditor()?.undoManager.redo()
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

  undo (option?: Taro.EditorContext.UndoOption | undefined): void {
    try {
      this.activeEditor()?.undoManager.undo()
      option?.success?.({ errMsg: `` })
    } catch (e) {
      option?.fail?.({ errMsg: `${e}` })
    } finally {
      option?.complete?.({ errMsg: `` })
    }
  }

}
