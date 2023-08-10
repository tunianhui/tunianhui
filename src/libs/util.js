import { Message } from 'element-ui'
import config from '@/config'

export const loop = _ => { }

/* String 方法开始 */

// 线转驼峰  foo-bar => fooBar
export const lineToHump = str =>
  str.replace(/(\-(\w))/g, (all, letter) => letter.toUpperCase())

// 驼峰转线  fooBar => foo-bar
export const humpToLine = str =>
  str && str.replace(/([A-Z])/g, '-$1').toLowerCase()

// 首字母大写
export const capitalize = str =>
  str && str.charAt(0).toUpperCase() + str.slice(1)

/**
 * [getLength 获得字符串实际长度，中文2，英文1]
 * @param  {[type]} str [要获得长度的字符串]
 * @return {[type]}     [description]
 */
export function getLength(str) {
  const len = str.length
  let realLength = 0
  let charCode = -1
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) realLength += 1
    else realLength += 2
  }
  return realLength
}

// 高亮关键字的颜色
export function highlightKeyword(val, keyword, options) {
  options = {
    // 忽略大小写
    ignore: true,
    class: 'highlight',
    style: 'color: #5858ff; font-weight: bold;',
    ...options
  }
  if (typeof val === 'undefined') return ''
  let normVal = val + '',
    normKeyword = keyword + ''
  if (options.ignore) {
    normVal = (val + '').toLowerCase()
    normKeyword = keyword.toLowerCase()
  }
  const index = normVal.indexOf(normKeyword)

  if (index !== -1 && keyword !== '') {
    const word = val.slice(index, index + keyword.length),
      reg = new RegExp(word, 'g')
    return val.replace(
      reg,
      `<span class="${options.class}" style="${options.style}">${word}</span>`
    )
  }
  return val
}

/**
 * 获取字符串中中英文（大小写）字母的个数
 * @param {String} str
 */
export function getLetterLength(str) {
  return str.split('').reduce(
    (prev, cur) => {
      if (/A-Z/.test(cur)) {
        prev.upper++
        return prev
      }
      if (/a-z/.test(cur)) {
        prev.lower++
        return prev
      }
      if (/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(cur)) {
        prev.chinese++
        return prev
      }
    },
    {
      upper: 0,
      lower: 0,
      chinese: 0
    }
  )
}

/**
 * 根据指定长度，以指定的分隔符分割 数据，主要用于分割数字 如果123456 =>  123,456
 * @param {Number | String} str 原字符串
 * @param {Number} length 每几位分割一次 default 3
 * @param {String} separator 分割符 default ,
 */
export function insertSeparator(str, length = 3, separator = ',') {
  if (!str) return ''
  let res = []
  str
    .toString()
    .split('')
    .reverse()
    .forEach((item, index) => {
      res.push(index % length === 0 && index !== 0 ? item + separator : item)
    })
  return res.reverse().join('')
}

/**
 * 截取字符串，中英文都能用
 * @param str：需要截取的字符串
 * @param len: 需要截取的长度
 */
export function cutstr(str, len) {
  const strLen = str.length
  let strLength = 0
  let strCut = ''

  // 如果给定字符串小于指定长度，则返回源字符串；
  for (let i = 0; i < strLen; i++) {
    const a = str.charAt(i)
    strLength++
    if (escape(a).length > 4) {
      // 中文字符的长度经编码之后大于4
      strLength++
    }
    strCut = strCut.concat(a)
    if (strLength >= len) {
      strCut = strCut.concat('...')
      return strCut
    }
  }
  if (strLength < len) {
    return str
  }
}

/**
 * 生成一个指定长度的uuid
 * @param {Number} len  字符串长度
 * @param {Number} radix 进制数[8 | 10 | 16] default 10
 */
export function uuid(len, radix = 10) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    ''
  )
  const uuid = []
  let i
  if (len) {
    for (i = 0; i < len; i++) {
      uuid[i] = chars[0 | (Math.random() * radix)]
    }
  } else {
    let r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

// base64编码  btoa
export function encodeBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode('0x' + p1)
    })
  )
}

// base64解码 atob
export function decodeBase64(str) {
  return decodeURIComponent(
    atob(str)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
}

// 将对象转成url参数字符串，并base64编码与encodeURIComponent
export function encodeBase64ObjectToURLParam(obj) {
  var urlParam = []
  for (var key in obj) {
    urlParam.push(
      encodeURIComponent(encodeBase64(key)) +
      '=' +
      encodeURIComponent(encodeBase64(obj[key]))
    )
  }
  return urlParam.join('&')
}

// 将decodeURIComponent与base64编码的url参数字符串转成对象
export function decodeBase64URLParamToObj(str) {
  var arr = str.split('&')
  var obj = {}
  arr.forEach(item => {
    var l = item.split('=')
    var key = decodeBase64(decodeURIComponent(l[0]))
    var value = decodeBase64(decodeURIComponent(l[1]))
    obj[key] = value
  })
  return obj
}

export function getType(data) {
  const type = Object.prototype.toString.call(data)
  return type.substring(8, type.length - 1)
}

// 字节单位转换
export function convertByte(bytes) {
  if (isNaN(bytes)) {
    return '0'
  }
  const symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let exp = Math.floor(Math.log(bytes) / Math.log(2))
  if (exp < 1) {
    exp = 0
  }
  const i = Math.floor(exp / 10)
  bytes = bytes / Math.pow(2, 10 * i)

  if (bytes.toString().length > bytes.toFixed(2).toString().length) {
    bytes = bytes.toFixed(2)
  }
  return bytes + ' ' + symbols[i]
}

export function getByteUnit(bytes) {
  if (isNaN(bytes)) {
    return ''
  }
  const symbols = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let exp = Math.floor(Math.log(bytes) / Math.log(2))
  if (exp < 1) {
    exp = 0
  }
  const i = Math.floor(exp / 10)

  return symbols[i]
}

export function convertCompute(num) {
  let str = ''
  const cu = 24 * 60
  if (num < 60) {
    str = `${num}core/s`
  } else if (num >= 60 && num < cu) {
    str = (num / 60).toFixed(2) + 'CM'
  } else if (num >= cu && num < cu * 1000) {
    str = (num / cu).toFixed(2) + 'CU'
  } else if (num >= cu * 1000 && num < cu * 1000000) {
    str = (num / cu / 1000).toFixed(2) + 'KCU'
  }

  return str
}

export function getComputeUnit(num) {
  let str = ''
  const cu = 24 * 60
  if (num < 60) {
    str = `core/s`
  } else if (num >= 60 && num < cu) {
    str = 'CM'
  } else if (num >= cu && num < cu * 1000) {
    str = 'CU'
  } else if (num >= cu * 1000 && num < cu * 1000000) {
    str = 'KCU'
  }
  return str
}

/* String 方法结束 */

/* Date 方法开始 */

export function isDate(date) {
  if (date === null || date === undefined) return false
  if (isNaN(new Date(date).getTime())) return false
  if (Array.isArray(date)) return false // deal with `new Date([ new Date() ]) -> new Date()`
  return true
}

/**
 * 根据日期获取 星期几
 * @param {date} src
 */
export function getWeekNumber(src) {
  if (!isDate(src)) return null
  const date = new Date(src.getTime())
  date.setHours(0, 0, 0, 0)
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  // January 4 is always in week 1.
  const week = new Date(date.getFullYear(), 0, 4)
  // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
  // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
  return (
    1 +
    Math.round(
      ((date.getTime() - week.getTime()) / 86400000 -
        3 +
        ((week.getDay() + 6) % 7)) /
      7
    )
  )
}

/**
 * 格式化时间
 * @param {Date} date
 * @param {String} fmt
 */
export function dateFormat(date, fmt = 'YYYY-MM-dd') {
  const o = {
    'YYYY+': date.getFullYear(), // 月份
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// 格式化一个时间戳的时间段
export function formateTimeGap(start, end) {
  const timestamp = new Date(end).getTime() - new Date(start).getTime(),
    day = parseInt(timestamp / (24 * 60 * 60 * 1000)),
    hour = parseInt(timestamp / (60 * 60 * 1000)),
    minute = parseInt((timestamp / (60 * 1000)) % 60),
    second = parseInt((timestamp / 1000) % 60)
  let str = ''
  if (day > 0) {
    str += `${day}天`
  }
  if (hour > 0 || str) {
    str += `${hour}时`
  }
  if (minute > 0 || str) {
    str += `${minute}分`
  }
  str += `${second}秒`
  return str
}

/**
 * 获取从num开始的一个星期的时间
 * @param {Number} num
 * @param {String} format 时间格式
 */
export function get7Days(num, format) {
  num = num || 0
  if (typeof num === 'string') {
    format = num
    num = 0
  } else {
    format = format || 'yyyy/MM/dd'
  }

  const arr = []
  for (let i = num * 7 + 1; i < (num + 1) * 7 + 1; i++) {
    const currDate = new Date()
    arr.push(
      dateFormat(new Date(currDate.getTime() - i * 1000 * 60 * 60 * 24), format)
    )
  }
  arr.reverse()
  return arr
}

/**
 * 获取从time时间开始前num天的时间
 * @param {Number} num
 * @param {String} format 时间格式
 */
export function get30Days(time, num, format) {
  num = num || 30
  if (typeof num === 'string') {
    format = num
    num = 30
  } else {
    format = format || 'yyyy-MM-dd'
  }
  time = time || new Date()
  const arr = []
  for (let i = num; i > 0; i--) {
    const currDate = new Date(time)
    arr.push(
      dateFormat(
        new Date(currDate.getTime() - (i - 1) * 1000 * 60 * 60 * 24),
        format
      )
    )
  }
  // arr.reverse()
  return arr
}

// startDate: 计划开始时间； endDate：计划结束时间；dayLength：每隔几天，0-代表每天，1-代表日期间隔一天
export function getRangeDates(startDate, endDate, dayLength) {
  const dates = [dateFormat(new Date(startDate))]
  for (let i = 0; ; i++) {
    let day = getTargetDate(startDate, dayLength)
    startDate = day
    if (new Date(day).getTime() <= new Date(endDate).getTime()) {
      dates.push(day)
    } else {
      break
    }
  }
  return dates
}

// startDate: 开始时间；dayLength：每隔几天，0-代表获取每天，1-代表日期间隔一天
export function getTargetDate(date, dayLength = 0) {
  dayLength = dayLength + 1
  const tempDate = new Date(date)
  tempDate.setDate(tempDate.getDate() + dayLength)
  return dateFormat(tempDate)
}
/* Date 方法结束 */

/* Number 方法开始 */

export function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

/* Number 方法结束 */

/* Array | Object 方法开始 */

export const pickOne = data => {
  return data[Math.floor(Math.random() * data.length)]
}

export function copyArray(source, array) {
  let index = -1
  const length = source.length

  array || (array = new Array(length))
  while (++index < length) {
    array[index] = source[index]
  }
  return array
}

// 合并相同索引的数组
export function mergeEqualIndexArray(arr) {
  const result = []
  arr.forEach(item => {
    item.forEach((d, i) => {
      const a = (result[i] = result[i] || [])
      a.push(d)
    })
  })
  return result
}

// 相同索引的数组相加
export function equalIndexValueSum(arr) {
  const result = []
  arr.forEach(item => {
    item.forEach((d, i) => {
      result[i] = result[i] ? result[i] + d : d
    })
  })
  return result
}

// 随机排列
export function shuffle(array) {
  const length = array == null ? 0 : array.length
  if (!length) {
    return []
  }
  let index = -1
  const lastIndex = length - 1
  const result = copyArray(array)
  while (++index < length) {
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
    const value = result[rand]
    result[rand] = result[index]
    result[index] = value
  }
  return result
}

/*
  管道函数，返回一个函数
  pipe(fn1, fn2, fn3)(args)从左至右执行
  args作为参数传给fn1函数，先执行fn1,fn1执行的结果作为fn2的参数，依次类推
*/
export function pipe(...fns) {
  return function (...x) {
    return fns.reduce((args, fn) => fn(args), x)
  }
}

/*
  组合函数，返回一个函数
  compose(fn1, fn2, fn3)(args)从右至左执行
  args作为参数传给fn3函数，先执行fn3,fn3执行的结果作为fn2的参数，依次类推
*/
export function compose(...fns) {
  return function (...x) {
    return fns.reduceRight((args, fn) => fn(args), x)
  }
}

// https://juejin.im/post/5d2299faf265da1bb67a3b65
// https://juejin.im/post/5b8350246fb9a019c372d26d
// 函数柯里化指的是将能够接收多个参数的函数转化为接收单一参数的函数，并且返回接收余下参数且返回结果的新函数的技术
export function curry(fn, ...args) {
  // 获取函数形参的个数
  const length = fn.length
  return function (...params) {
    const newArgs = [...args, ...params]
    if (newArgs.length >= length) {
      return fn.apply(this, newArgs)
    } else {
      return curry.call(this, fn, ...newArgs)
    }
  }
}

/**
 * 深度克隆
 * @param {Array | Object} source
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}

/**
 * [getLabelByValue 将字典对应的code转换成name]
 * @param  {[Array]}            list  [字典]
 * @param  {[String / Array]}   value [对应的code]
 * @return {[String]}           [description]
 */
export function getLabelByValue(list, value) {
  let label

  if (value instanceof Array) {
    label = []
    list.forEach(item => {
      value.forEach(v => {
        if (item.options) {
          item.options.some(option => {
            if (v === option.value) {
              label.push(option.label)
              return true
            }
          })
        } else if (v === item.value) {
          label.push(item.label)
        }
      })
    })
    label = label.join('，')
  } else {
    list.some(item => {
      if (item.options) {
        item.options.some(option => {
          if (value === option.value) {
            label = option.label
            return true
          }
        })
      } else if (value === item.value) {
        label = item.label
        return true
      }
    })
  }
  return label
}

// 将数组对象的key转换为label 与 value的select类型的label与value对象
export function reverseDataToSelectList(list, labelKey, valueKey) {
  const l = []
  list.forEach(item => {
    l.push({
      label: item[labelKey],
      value: valueKey ? item[valueKey] : item[labelKey]
    })
  })
  return l
}

// 将数组中的值赋值，
// 如source = {a: 1, b: 2} target = [{value: '', label: 'A', key: 'a'}, {value: '', label: 'B', key: 'b'}]
//  => [{value: 1, label: 'A', key: 'a'}, {value: 2, label: 'B', key: 'b'}]
export function addValueToList(source, target) {
  const _target = [...target]
  for (const key in source) {
    _target.some(item => {
      if (item.key === key) {
        item.value = source[key]
        return true
      }
    })
  }
  return _target
}

/* Array | Object 方法结束 */

/* Function 扩展 开始 */

/**
 * async/await catch 错误
 * @param {Promise} promise
 * @param {String} errTxt
 * @return {Promise}
 */
export function asyncTo(promise, errTxt) {
  return promise
    .then(data => [null, data])
    .catch(err => {
      err = errTxt || '请求失败'
      return [err, undefined]
    })
}

export function simpleAsyncTo(promise, errTxt) {
  return promise
    .then(data => {
      // 如果没有
      // const { key, success } = config.markStatus
      // if (data[key] === success) {
      //   return data
      // } else {
      //   if (data.name) {
      //     errCb(data.msg || errTxt)
      //     setTimeout(() => {
      //       errCb(data.name || errTxt)
      //     }, 1000)
      //   } else {
      //     errCb(data.msg || errTxt)
      //   }
      //   return null
      // }
      // 有flag和status和code三种方法判断是否连接正确
      if (data.flag) {
        const { key, success } = config.markStatus
        if (data[key] === success) {
          return data
        } else {
          if (data.name) {
            errCb(data.msg || errTxt)
            setTimeout(() => {
              errCb(data.name || errTxt)
            }, 1000)
          } else {
            errCb(data.msg || errTxt)
          }
          return null
        }
      } else if (data.status) {
        const markStatus = {
          key: 'status',
          success: '0000',
          error: '0001'
        }
        const { key, success } = markStatus
        if (data[key] === success) {
          return data
        } else {
          if (data.name) {
            errCb(data.message || errTxt)
            setTimeout(() => {
              errCb(data.name || errTxt)
            }, 1000)
          } else {
            errCb(data.message || errTxt)
          }
          return null
        }
      } else  {
        const markStatus = {
          key: 'code',
          success: 0,
          error: '0001'
        }
        const { key, success } = markStatus
        if (data[key] === success) {
          return data
        } else {
          if (data.name) {
            errCb(data.msg|| errTxt)
            setTimeout(() => {
              errCb(data.name || errTxt)
            }, 1000)
          } else {
            errCb(data.msg || errTxt)
          }
          return null
        }
      }
    })
    .catch(err => {
      process.env.NODE_ENV === 'development' && console.error(err)
      errCb(err.msg || '服务不可访问，请联系管理员！')
      return null
    })
}
/**
 * 睡眠函数
 * @param {number} time
 */
export const sleep = time => new Promise(resolve => setTimeout(resolve, time))

/**
 * 处理报错
 * @param {string} msg
 */
export const errCb = msg => {
  process.env.NODE_ENV === 'development' && console.error(msg)
  Message.error({
    showClose: true,
    message: msg
  })
}

// 防抖函数
// 当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始延时
export function debounce(fn, delay = 1000) {
  let timer = null
  return function () {
    if (timer !== null) {
      clearTimeout(timer)
    }
    const context = this
    timer = setTimeout(_ => {
      fn.apply(context, arguments)
    }, delay)
  }
}

// 节流函数：当持续触发事件时，保证一定时间段内只调用一次事件处理函数
export function throttle(fn, delay = 1000) {
  let timer = null
  let start = Date.now()
  return function () {
    const cur = Date.now()
    const wait = delay - (cur - start)
    const context = this
    clearTimeout(timer)
    if (wait <= 0) {
      fn.aplly(context, arguments)
      start = Date.now()
    } else {
      timer = setTimeout(_ => {
        fn.apply(context, arguments)
      }, delay)
    }
  }
}

/**
 * @export
 * @param {*} formName el-form的 ref 与 v-model 此处为要保证一致
 * @param {*} arr 属性组成的数组, 默认为空数组
 * @param {*} flag true 表示清空表单中arr里面的属性， false 清空arr之外的其他表单属性
 * 如果只传formName 则相当于清空表单的功能
 */
export function resetOtherFields(formName, arr = [], flag) {
  const $filter = this.$refs[formName]
  const clearFilters = []
  for (const key in this[formName]) {
    if (flag) {
      if (arr.includes(key)) {
        this[formName][key] = ''
        clearFilters.push(key)
      }
    } else if (!arr.includes(key)) {
      this[formName][key] = ''
      clearFilters.push(key)
    }
  }
  setTimeout(_ => {
    $filter && $filter.clearValidate(clearFilters)
  }, 10)
}

export function getMiddleValue(max, min, value) {
  return value > max ? max : value < min ? min : value
}

/* Function 扩展 结束 */

/* Mock 数据方法开始 */
export function sortData(length) {
  return Array.from(
    {
      length
    },
    item => randomInRange(500, 6000)
  ).sort((a, b) => {
    return a > b
  })
}

export function genData(length) {
  return Array.from(
    {
      length
    },
    item => randomInRange(500, 6000)
  )
}

export function seriesData(arrData) {
  const arr = []
  arrData.forEach((item, index) => {
    arr.push({
      name: item,
      value: randomInRange(500, 6000)
    })
  })
  return arr
}

export function randomDateDate(size = 7) {
  const data = []
  const prefix = '2017-' + randomInRange(1, 12) + '-'
  const num = randomInRange(1, 10)

  for (let i = 0; i < size; i++) {
    data.push({
      date: prefix + (num + i),
      value: randomInRange(1000, 10000)
    })
  }
  return data
}
/* Mock 数据方法结束 */

/* Math 常用算法 开始 */
/**
 * 获取椭圆上的点，亦可获取圆上的点，圆上的点弧长是等分的，椭圆的点不是等分的
 * @param {Number} rx x轴半径
 * @param {Number} ry y轴半径
 * @param {Number} cx 圆心x
 * @param {Number} cy 圆心y
 * @param {Number} count 等分的数量
 * @param {Object} options
 * counterclockwise: true 返回的数据是顺时针还是逆时针 true 逆时针
 * startAngle: 0 起始角度，从正下方开始计算
 */
export function getEllipsePoints(rx, ry, cx, cy, count, options) {
  options = {
    startAngle: 0,
    counterclockwise: true,
    ...options
  }

  const radian = Math.PI / 180,
    radians = radian * Math.round(360 / count), // 弧度
    { counterclockwise, startAngle } = options,
    startRadians = !counterclockwise
      ? -(radian * startAngle - radians)
      : radian * startAngle,
    points = []
  for (let i = 0; i < count; i++) {
    const x = cx + rx * Math.sin(radians * i + startRadians),
      y = cy + ry * Math.cos(radians * i + startRadians)
    if (!counterclockwise) {
      points.unshift({ x, y }) // 顺时针
    } else {
      points.push({ x, y }) // 逆时针
    }
  }
  return points
}

export function getCircleDividePoints(radius, cx, cy, count, options = {}) {
  return getEllipsePoints(radius, radius, cx, cy, count, options)
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
/**
 * 计算椭圆上N个等分点的坐标
 * @param {Number} radius 半径
 * @param {Number} cx 圆心x
 * @param {Number} cy 圆心y
 * @param {Number} count 等分的数量
 * @param {Object} options
 * counterclockwise: true 返回的数据是顺时针还是逆时针 true为逆时针
 * startAngle: 0 起始角度，从正下方开始计算
 * precision：0.001 精度，值越小算出来等分点的长度越接近，但也会消耗更多的性能
 */
export function getEllipseDividePoints(rx, ry, cx, cy, count, options) {
  options = {
    precision: 0.001, // 值越小算出来等分点的长度越接近，但也会消耗更多的性能
    counterclockwise: true,
    startAngle: 0,
    ...options
  }
  const q = rx + ry,
    h = ((rx - ry) / (rx + ry)) ** 2,
    m = 22 / (7 * Math.PI) - 1,
    n = Math.pow((rx - ry) / rx, 33.697),
    // 椭圆周长
    l = Math.PI * q * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h))) * (1 + m * n),
    points = [],
    onelength = l / count,
    radian = Math.PI / 180,
    { precision, counterclockwise, startAngle } = options,
    startRadians = !counterclockwise
      ? -radian * startAngle
      : radian * startAngle

  let angle = 0,
    x0 = rx,
    y0 = 0
  for (let i = 0; i < count; i++) {
    let dist = 0,
      x = 0,
      y = 0
    while (dist < onelength) {
      angle += precision
      x = rx * Math.sin(radian * angle + startRadians)
      y = ry * Math.cos(radian * angle + startRadians)
      dist += distance(x0, y0, x, y)
      x0 = x
      y0 = y
    }
    const p = { x: x + cx, y: y + cy }
    if (!counterclockwise) {
      points.unshift(p) // 顺时针
    } else {
      points.push(p) // 逆时针
    }
  }
  if (!counterclockwise) {
    points.unshift(points.pop())
  }
  return points
}

/* Math 常用算法 结束 */

export function getLevel(score) {
  const obj = Object.create(null)
  if (score < 60) {
    obj.level = '低'
    obj.desc = '尚未及格，抓紧提高分数！'
    obj.icon = 'iconfont icon-jinggao1 error'
    obj.color = '#ca435b'
  } else if (score >= 60 && score < 85) {
    obj.level = '中'
    obj.desc = '刚及格，请继续改进！'
    obj.icon = 'iconfont icon-jinggao2 warning'
    obj.color = '#e6a23c'
  } else if (score >= 85) {
    obj.level = '高'
    obj.desc = '状况不错，保持住哦！'
    obj.icon = 'iconfont icon-yuanxingxuanzhong-fill-copy success'
    obj.color = '#2BC048'
  }
  return obj
}

export function dateFormat2(date) {
  const o = {
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
  }
  let timelist = []
  for (const k in o) {
    o[k] = o[k] < 10 ? '0'+o[k] : o[k]
    // timelist = o[k]
    timelist.push(o[k])

  }
  const ftt = timelist.join(':')
  return ftt
}

export function getcolor(score) {
  const obj = Object.create(null)
  if (score < 60) {
    obj.icon = 'iconfont icon-jinggao1 error'
    obj.color = '#ca435b'
  } else if (score >= 60 && score < 85) {
    obj.icon = 'iconfont icon-jinggao2 warning'
    obj.color = '#e6a23c'
  } else if (score >= 85) {
    obj.icon = 'iconfont icon-yuanxingxuanzhong-fill-copy success'
    obj.color = '#2BC048'
  }
  return obj
}

export function rgbArray (data) {
  // var self = this
  if (!getHslArray(data).length) return [];

  var rgbA = getHslArray(data).map(function (item) {
    return hslToRgb.apply(this, item);
  });

  return rgbA.map(function (item) {
    return {
      background: 'rgb(' + item.toString() + ')'
      // value: item,
      // style: { background: 'rgb(' + item.toString() + ')' }
    }
  });
}

// 回退7天
export function setback(date, sTime) {
  const day = date.getDate()
  const M = date.getMonth() + 1
  const Y = date.getFullYear()
  const data = day - 7
  if (data === 0) {
    sTime = `${Y}-${M > 10 ? M : '0'+M}-01`
  } else if (data < 0) {
    if (Y%4 === 0 && M === 3) {
      sTime = `${Y}-0${M-1}-${29+data+1}`
    } else {
      if (M === 1) {
        sTime = `${Y-1}-${12}-${31+data+1}`
      } else if (M === 3) {
        sTime = `${Y}-0${M-1}-${28+data+1}`
      } else if ((M%2 !== 0 && M < 8 && M > 3) || (M > 9 && M%2 === 0)) {
        sTime = `${Y}-${M-1 >= 10 ? M - 1 : '0'+ (M - 1)}-${30+data+1}`
      } else if ((M > 3 && M < 9 && M%2 === 0) || (M > 8 && M%2 !== 0)) {
        sTime = `${Y}-${M-1 >= 10 ? M -1 : '0'+ (M -1)}-${31+data+1}`
      }
      // else if (M%2 === 0) {
      //   sTime = `${Y}-${M-1 > 10 ? M -1 : '0'+ (M -1)}-${31+data+1}`
      // } else if (M !== 1 && M%2 !== 0 && M !== 3) {
      //   sTime = `${Y}-${M-1 > 10 ? M - 1 : '0'+ (M - 1)}-${30+data+1}`
      // }
    }
  } else {
    if (data < 9) {
      sTime = `${Y}-${M >= 10 ? M : '0'+M}-0${data+1}`
    } else {
      sTime = `${Y}-${M >= 10 ? M : '0'+M}-${data+1}`
    }
  }
  return sTime
}

/**
 *
 * @param {String} str #ffffff
 * @returns
 */
export function set16ToRgb(str, opacity = 1) {
  var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  if (!reg.test(str)) {
    return
  }
  let newStr = str.toLowerCase().replace(/\#/g, '')
  let len = newStr.length
  if (len == 3) {
    let t = ''
    for (var i = 0; i < len; i++) {
      t += newStr.slice(i, i + 1).concat(newStr.slice(i, i + 1))
    }
    newStr = t
  }
  let arr = [] //将字符串分隔，两个两个的分隔
  for (var i = 0; i < 6; i = i + 2) {
    let s = newStr.slice(i, i + 2)
    arr.push(parseInt('0x' + s))
  }
  return 'rgba(' + arr.join(',') + ',' + opacity + ')'
}


/**
 * rbg颜色转rgba，16进制转rgba
 * @param {String} color #ffffff | rgb(255,255,255)
 * @param {String | Number} alp 1 | '1'
 */

export function rgbToRgba(color, alp = 1) {
  var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  if (reg.test(color)) {
    color = set16ToRgb(color)
  }
  let rgbaAttr = color.match(/[\d.]+/g)
  if (rgbaAttr.length >= 3) {
    let r, g, b
    r = rgbaAttr[0]
    g = rgbaAttr[1]
    b = rgbaAttr[2]
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alp + ')'
  }
}

/**
 *
 * @param {String} color rgba(0,0,0,1) => #000000
 * @returns
 */
export function getHexColor(color) {
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',')
  var a = parseFloat(values[3] || 1),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
  return (
    '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2)
  )
}
