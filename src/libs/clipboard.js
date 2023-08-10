import Clipboard from 'clipboard'
import {
  Message
} from 'element-ui'

export function successCb(e, type, value) {
  const message = type === 'code' ? '代码复制成功' : `${value}   已经复制到剪贴板`
  Message.success({
    showClose: true,
    message: message,
    customClass: 'customClassMessage'
  })
}

export function errorCb() {
  Message.error({
    showClose: true,
    message: '复制失败'
  })
}

export function preprocess(options) {
  if (!options.value) {
    Message.error({
      message: '请传入要复制的值！！！'
    })
    return false
  }

  return {
    type: 'text',
    success: successCb,
    error: errorCb,
    ...options
  }
}

export function init(el, {
  value,
  type,
  success,
  error
}, eventtype) {
  el.__success_callback__ = success || successCb
  el.__error_callback__ = error || errorCb
  el.__clipboard__ = new Clipboard(el, {
    text: _ => value
  })

  el.__clipboard__.on('success', e => {
    el.__success_callback__(e, type, el.__clipboard__.text())
    eventtype === 'mouseenter' && destory(el)
  })
  el.__clipboard__.on('error', e => {
    el.__error_callback__(e)
    eventtype === 'mouseenter' && destory(el)
  })
}

export function destory(el) {
  delete el.__success_callback__
  delete el.__error_callback__
  el.__clipboard__ && el.__clipboard__.destroy()
  delete el.__clipboard__
}

/**
 * 复制到剪切板
 * 解决点击两次才能复制的问题，在dom元素上添加mouseenter事件，提前初始化
 * jsx 中使用 <comp {...{on: {click: e => clipboard(e, {value})}, {mouseenter: e => clipboard(e, {value})}}}></comp>
 * @param {MouseEvent} event
 * @param {Object} options
 */
export default function (event, options = {}) {
  event.stopPropagation()
  const el = event.target
  options.value = options.value || el.textContent
  options = preprocess(options)
  if (!options) return
  if (el.__clipboard__) return
  init(el, options, event.type)
}
