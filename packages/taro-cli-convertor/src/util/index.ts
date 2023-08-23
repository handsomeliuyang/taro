import {
  fs,
  printLog,
  processTypeEnum,
  promoteRelativePath,
  REG_SCRIPT,
  REG_TYPESCRIPT,
  resolveScriptPath,
} from '@tarojs/helper'
import * as path from 'path'

import type * as t from '@babel/types'

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

function getRelativePath (rootPath: string, sourceFilePath: string, oriPath: string) {
  // 处理以/开头的绝对路径，比如 /a/b
  if (path.isAbsolute(oriPath)) {
    if (oriPath.indexOf('/') !== 0) {
      return ''
    }
    const vpath = path.resolve(rootPath, oriPath.substr(1))
    if (!fs.existsSync(vpath)) {
      return ''
    }
    let relativePath = path.relative(path.dirname(sourceFilePath), vpath)
    relativePath = promoteRelativePath(relativePath)
    if (relativePath.indexOf('.') !== 0) {
      return './' + relativePath
    }
    return relativePath
  }
  // 处理非正常路径，比如 a/b
  if (oriPath.indexOf('.') !== 0) {
    const vpath = path.resolve(sourceFilePath, '..', oriPath)
    if (fs.existsSync(vpath)) {
      return './' + oriPath
    }
    const testParts = oriPath.split('/')
    const testindex = path.join(rootPath, `node_modules/${testParts[0]}`) // 判断三方件是否在node_modules中
    if (!fs.existsSync(testindex)) {
      if (
        oriPath.indexOf('/') !== -1 &&
        oriPath.indexOf('@') === -1 &&
        oriPath.lastIndexOf('.js') !== oriPath.length - 3
      ) {
        oriPath = oriPath + '.js' // 不在这里返回    utils/auth -> utils/auth.js
      }
      if (fs.existsSync(oriPath)) {
        oriPath = './' + oriPath
      }
    }
  }
  return oriPath
}

function copyFileToTaro (from: string, to: string, options?: fs.CopyOptionsSync) {
  const filename = path.basename(from)
  if (fs.statSync(from).isFile() && !path.extname(to)) {
    fs.ensureDir(to)
    return fs.copySync(from, path.join(to, filename), options)
  }
  fs.ensureDir(path.dirname(to))
  return fs.copySync(from, to, options)
}

export function analyzeImportUrl (
  rootPath: string,
  sourceFilePath: string,
  scriptFiles: Set<string>,
  source: t.StringLiteral,
  value: string,
  external:string[],
  miniprogramRoot: string,
  convertDir: string,
  isTsProject?: boolean
) {
  const valueAbs:string = path.resolve(sourceFilePath, '..' ,value)
  if (external){
    for (const iExternal of external){
      // value绝对路径包含json内绝对路径的dirname,就符合条件,直接copy文件过去
      if(valueAbs.indexOf(path.dirname(iExternal))=== 0){
        const outputFilePath = valueAbs.replace(isTsProject ? miniprogramRoot : rootPath, convertDir)
        copyFileToTaro(valueAbs, outputFilePath)
        // 直接return,不让此文件加入到scriptFiles里后续被转换
        return
      }
    }
  }  
  const valueExtname = path.extname(value)
  const rpath = getRelativePath(rootPath, sourceFilePath, value)
  if (!rpath) {
    printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
    return
  }
  if (rpath !== value) {
    value = rpath
    source.value = rpath
  }
  if (value.indexOf('.') === 0) {
    if (REG_SCRIPT.test(valueExtname) || REG_TYPESCRIPT.test(valueExtname)) {
      const vpath = path.resolve(sourceFilePath, '..', value)
      let fPath = value
      if (fs.existsSync(vpath)) {
        fPath = vpath
      } else {
        printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
      }
      scriptFiles.add(fPath)
    } else {
      let vpath = resolveScriptPath(path.resolve(sourceFilePath, '..', value))
      if (vpath) {
        if (!fs.existsSync(vpath)) {
          printLog(processTypeEnum.ERROR, '引用文件', `文件 ${sourceFilePath} 中引用 ${value} 不存在！`)
        } else {
          if (fs.lstatSync(vpath).isDirectory()) {
            if (fs.existsSync(path.join(vpath, 'index.js'))) {
              vpath = path.join(vpath, 'index.js')
            } else {
              printLog(processTypeEnum.ERROR, '引用目录', `文件 ${sourceFilePath} 中引用了目录 ${value}！`)
              return
            }
          }
          let relativePath = path.relative(sourceFilePath, vpath)
          const relativePathExtname = path.extname(relativePath)
          scriptFiles.add(vpath)
          relativePath = promoteRelativePath(relativePath)
          if (/\.wxs/.test(relativePathExtname)) {
            relativePath += '.js'
          } else if (!isTsProject) {
            relativePath = relativePath.replace(relativePathExtname, '.js')
          }
          source.value = relativePath
        }
      }
    }
  } else {
    if (value.startsWith('/') || value.startsWith('@tarojs')) {
      return
    }
    scriptFiles.add(value)
  }
}

export const incrementId = () => {
  let n = 0
  return () => (n++).toString()
}