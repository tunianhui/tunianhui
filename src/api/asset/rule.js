import fetch from '@/libs/fetch'

// 标准代码列表
export function getStandardruleFuzzySearchList (data) {
  return fetch({
    url: `/datastandard/standardrule/fuzzySearch`,
    method: 'get',
    params: data
  })
}