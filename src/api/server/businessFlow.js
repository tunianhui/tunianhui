/** 业务流程  */
import fetch from '@/libs/fetch'

// 树列表 -- 业务流程
export function getTreeData(data = {}) {
  return fetch({
    url: '/businessFlow/listTree',
    method: 'post',
    data
  })
}

// 业务流程 --- 保存
export function saveBusinessFlow(data = {}) {
  return fetch({
    url: '/businessFlow/save',
    method: 'post',
    data
  })
}

// 业务流程 --- 修改
export function editBusinessFlow(data = {}) {
  return fetch({
    url: '/businessFlow/edit',
    method: 'post',
    data
  })
}

// 业务流程 --- 删除
export function deleteBusinessFlow(data = {}) {
  return fetch({
    url: '/businessFlow/delete',
    method: 'post',
    data
  })
}
