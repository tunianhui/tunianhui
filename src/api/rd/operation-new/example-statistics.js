import fetch from '@/libs/fetch'

// 实例统计
export function getExampleStatistics(data = {}) {
  return fetch({
    url: '/developTask/operations/instanceStatis',
    method: 'post',
    data
  })
}