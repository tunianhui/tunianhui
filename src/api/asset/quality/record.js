/*
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-08-12 11:02:56
 * @LastEditTime: 2023-07-10 09:35:49
 * @Description
 */
import fetch from '@/libs/fetch'
// 质量 - 校验记录 - 负责人
export function getOfficerList(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/getOfficerList',
    method: 'post',
    data
  })
}

// 质量 - 校验记录 - 页面列表
export function getVerifyTableList(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/getVerifyTableList',
    method: 'post',
    data
  })
}

// 质量 - 校验记录 - 校验规则详情
export function getVerifyRuleDetailList(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/getVerifyRuleDetailList',
    method: 'post',
    data
  })
}

// 质量 - 校验记录 - 质量报告概览
export function getVerifyReportInfo(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/getVerifyReportInfo',
    method: 'post',
    data
  })
}
// 质量 - 校验记录 - 规则校验值趋势图
export function getRuleVerifySpend(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/getRuleVerifySpend',
    method: 'post',
    data
  })
}
// 质量 - 校验记录 - 各分区规则校验报告详情
export function getVerifyReportDetail(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/getVerifyReportDetail',
    method: 'post',
    data
  })
}
// 质量 - 校验记录 - 报告详情
export function getRuleReportDetail(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/ruleReportDetail',
    method: 'post',
    data
  })
}
// 质量 - 校验记录 - 规则运行实例
export function getVerifyInstance(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/getVerifyInstance',
    method: 'post',
    data
  })
}
// 质量 - 校验记录 - 规则运行实例 - 日志
export function getVerifyInstancelog(data = {}) {
  return fetch({
    url: '/audit/verifyRecord/getVerifyInstancelog',
    method: 'post',
    data
  })
}
