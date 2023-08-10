import fetch from '@/libs/fetch'

// 获取成员列表
export function getUserList(data = {}) {
  return fetch({
    url: '/plan/roleUser/listPage',
    method: 'post',
    data
  })
}

// 添加成员
export function getAddUser(data = {}) {
  return fetch({
    url: '/plan/roleUser/save',
    method: 'post',
    data
  })
}

// 删除成员
export function getDeleteuser(data = {}) {
  return fetch({
    url: '/plan/roleUser/del',
    method: 'post',
    data
  })
}

// 批量删除
export function getBatchDel(data = {}) {
  return fetch({
    url: '/plan/roleUser/batchDel',
    method: 'post',
    data
  })
}

// 获取角色类型
export function getDictParams(data = {}) {
  return fetch({
    url: '/plan/commonDict/getDictParams',
    method: 'post',
    data
  })
}

// 获取所有用户
export function getAllUser(data = {}) {
  return fetch({
    url: '/plan/roleUser/getAllUser',
    method: 'post',
    data
  })
}
