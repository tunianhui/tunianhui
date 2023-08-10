/*
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-08-16 11:42:44
 * @LastEditTime: 2023-07-10 09:32:45
 * @Description:
 */
import fetch from '@/libs/fetch'
// 质量 - 全局概况 - 异常规则
export function queryAlarmRuleSt(data = {}) {
  return fetch({
    url: '/audit/auditGlobalSurvey/queryAlarmRuleSt',
    method: 'post',
    data
  })
}
// 质量 - 全局概况 - 详情统计
export function queryApplicationSt(data = {}) {
  return fetch({
    url: '/audit/auditGlobalSurvey/queryApplicationSt',
    method: 'post',
    data
  })
}
// 质量 - 全局概况 - 详情-数据表趋势
export function queryApplicationTableRuleTrend(data = {}) {
  return fetch({
    url: '/audit/auditGlobalSurvey/queryApplicationTableRuleTrend',
    method: 'post',
    data
  })
}
// 质量 - 全局概况 - 详情-应用规则
export function queryApplicationRuleTrend(data = {}) {
  return fetch({
    url: '/audit/auditGlobalSurvey/queryApplicationRuleTrend',
    method: 'post',
    data
  })
}
