import fetch from '@/libs/fetch'

// 公共标准集属性列表
export function getFuzzySearchList (data) {
  return fetch({
    url: `/datastandard/attribute/fuzzySearch`,
    method: 'get',
    params: data
  })
}

// 审批模板列表
export function getApprovaltemplateListFuzzySearch (data) {
  return fetch({
    url: `/datastandard/approvaltemplate/fuzzySearch`,
    method: 'get',
    params: data
  })
}