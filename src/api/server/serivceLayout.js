
/** 服务编排 */
import fetch from '@/libs/fetch'

// 树列表 -- 服务编排
export function getTreeData(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/listApiTree',
    method: 'post',
    data
  })
}

// 服务编排 -- 保存
export function saveLayout(data = {}) {
  return fetch({
    url: '/serivceLayout/saveLayout',
    method: 'post',
    data
  })
}

// 服务编排 -- 更新
export function updateLayout(data = {}) {
  return fetch({
    url: '/serivceLayout/updateLayout',
    method: 'post',
    data
  })
}

// 服务编排 -- 删除
export function deleteLayout(data = {}) {
  return fetch({
    url: '/serivceLayout/deleteLayout',
    method: 'post',
    data
  })
}

// 服务编排 -- 流程图
export function listLayout(data = {}) {
  return fetch({
    url: '/serivceLayout/listLayout',
    method: 'post',
    data
  })
}
