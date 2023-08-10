import fetch from '@/libs/fetch'

// 树列表
export function getDirectoryList(data = {}) {
  return fetch({
    url: '/datastandard/standardset/directory',
    method: 'get',
    params: data
  })
}

// 数据标准列表
export function getStandardFuzzySearchList(data = {}) {
  return fetch({
    url: '/datastandard/standard/fuzzySearch',
    method: 'get',
    params: data
  })
}