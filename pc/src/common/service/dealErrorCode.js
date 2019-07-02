export default function dealErrorCode(code) {
  if (code) {
    return 'i18n.ERROR_CODE_' + code
  } else {
    return ''
  }
}
