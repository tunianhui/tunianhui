
import fetch from '@/libs/fetch'

// 字典列表
export function getDictListPage(data = {}) {
  return fetch({
    url: '/dataDictionary/listPage',
    method: 'post',
    data
  })
}

// 字典删除
export function deleteDict(data = {}) {
  return fetch({
    url: '/dataDictionary/delete',
    method: 'post',
    data
  })
}

// 字典批量删除
export function batchDeleteDict(data = {}) {
  return fetch({
    url: '/dataDictionary/batchDelete',
    method: 'post',
    data
  })
}

// 字典树结构
export function getTreeData(data = {}) {
  return fetch({
    url: '/dataDictionary/listTree',
    method: 'post',
    data
  })
}

// 字典保存
export function saveDict(data = {}) {
  return fetch({
    url: '/dataDictionary/save',
    method: 'post',
    data
  })
}

// 字典修改
export function editDict(data = {}) {
  return fetch({
    url: '/dataDictionary/edit',
    method: 'post',
    data
  })
}
