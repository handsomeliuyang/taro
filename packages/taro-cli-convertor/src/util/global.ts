import { ErrCodeMsg } from './index'

interface Globals {
  logFilePath: string
  errCodeMsgs: ErrCodeMsg[]
  currentParseFile: string
}

export const globals: Globals = {
  logFilePath: '',
  errCodeMsgs: [],
  currentParseFile: ''
}
