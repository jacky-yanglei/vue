import zh from '@/assets/i18n/zh'

let getCodeMsgFn = function (code) {
  let codeStr = 'CODE_' + code
  return zh.ERROR_CODE.hasOwnProperty(codeStr) ? codeStr : 'CODE_DEFAULT'
}

export default getCodeMsgFn
