import * as t from '@babel/types'
import { promoteRelativePath } from '@tarojs/helper'
import * as path from 'path'

import { errors, resetGlobals, THIRD_PARTY_COMPONENTS } from './global'
import { parseScript } from './script'
import { setting } from './utils'
import { parseVue } from './vue'
import { parseWXML } from './wxml'

interface Option {
  json?: string
  script?: string
  scriptPath?: string
  wxml?: string
  path: string
  rootPath: string
  framework: 'react' | 'vue'
  isApp?: boolean
}

export function parse (option: Option) {
  resetGlobals()
  setting.rootPath = option.rootPath
  if (option.json) {
    const config = JSON.parse(option.json)
    const usingComponents = config.usingComponents
    if (usingComponents) {
      for (const key in usingComponents) {
        if (usingComponents.hasOwnProperty(key)) {
          THIRD_PARTY_COMPONENTS.add(key)
        }
      }
    }
  }

  if (option.framework === 'vue') {
    const result = parseVue(option.path, option.wxml || '', option.script)
    return {
      ...result,
      errors,
    }
  }

  const { wxml, wxses, imports, refIds } = parseWXML(option.path, option.wxml)
  setting.sourceCode = option.script!
  const ast = parseScript(option.script, option.scriptPath, wxml as t.Expression, wxses, refIds, option.isApp)

  // 添加 cacheOptions 引入语句
  if ( option.scriptPath ) {
    const currentPath = option.scriptPath || ''
    const cacheOptionsPath = path.resolve(option.rootPath, 'utils', '_cacheOptions.js')
    const importCacheOptionsUrl = promoteRelativePath(path.relative(currentPath, cacheOptionsPath))
    const importCacheOptionsAst = t.importDeclaration([
      t.importSpecifier(t.identifier('cacheOptions'), t.identifier('cacheOptions'))
    ], t.stringLiteral(importCacheOptionsUrl))
    ast.program.body.unshift(importCacheOptionsAst)
  }

  return {
    ast,
    imports,
    errors,
  }
}
