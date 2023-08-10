import fetch from '@/libs/fetch'

// 获取计算设置列表
export function getComputList(data = {}) {
  return fetch({
    url: '/engineSetting/listPage',
    method: 'post',
    data
  })
}

// 获取计算引擎类型
export function getEngineType(data = {}) {
  return fetch({
    url: '/plan/commonDict/getDictParams',
    method: 'post',
    data
  })
}

// 读取配置信息
export function getInfos(data = {}) {
  return fetch({
    url: '/plan/engineSetting/getInfos',
    method: 'post',
    data
  })
}

// 校验
export function getCheck(data = {}) {
  return fetch({
    url: '/engineSetting/check',
    method: 'post',
    data
  })
}

// 新增计算引擎
export function getAddEngine(data = {}) {
  return fetch({
    url: '/engineSetting/save',
    method: 'post',
    data
  })
}

// 删除引擎
export function deleteEngine(data = {}) {
  return fetch({
    url: '/engineSetting/del',
    method: 'post',
    data
  })
}
