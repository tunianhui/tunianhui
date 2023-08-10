import fetch from '@/libs/fetch'

// 词根列表
export function getWordrootList (data) {
  return fetch({
    url: `/datastandard/wordroot/query`,
    method: 'get',
    params: data
  })
}