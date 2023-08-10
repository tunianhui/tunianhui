import fetch from '@/libs/fetch'

// 左侧的树
export function getTreeData(data = {}) {
  return fetch({
    url: '/developTask/developModel/list',
    method: 'post',
    data
  })
}

// 删除文件夹
export function removeDir(data = {}) {
  return fetch({
    url: '/dev/norm-modeling/removeDir',
    method: 'post',
    data
  })
}

// 删除文件
export function removeFile(data = {}) {
  return fetch({
    url: '/dev/norm-modeling/removeFile',
    method: 'post',
    data
  })
}

// 获取项目列表
export function getProjectList(data = {}) {
  return fetch({
    url: '/plan/commonDict/getBusinessProject',
    method: 'post',
    data
  })
}

// 获取事实来源表
export function getMetaFactLogicBasesCode(data = {}) {
  return fetch({
    url: '/plan/commonDict/getMetaFactLogicBasesCode',
    method: 'post',
    data
  })
}

// 获取来源主表
export function getMetaCubes(data = {}) {
  return fetch({
    url: '/plan/commonDict/getMetaCubes',
    method: 'post',
    data
  })
}

// 获取业务过程
export function getMetaBusinessProcess(data = {}) {
  return fetch({
    url: '/plan/commonDict/getMetaBusinessProcess',
    method: 'post',
    data
  })
}
