/*
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-08-12 11:04:43
 * @LastEditTime: 2023-07-10 09:35:08
 * @Description:
 */
import fetch from '@/libs/fetch'
// 数据表规则列表
export function getAuditTableBaseList(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/auditTableBaseList',
    method: 'post',
    data
  })
}
// 数据表规则-新增
export function insertAuditTableBase(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/insertAuditTableBase',
    method: 'post',
    data
  })
}
// 数据表规则-开关校验
export function auditTableBaseVerification(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/auditTableBaseVerification',
    method: 'post',
    data
  })
}
// 数据表规则-删除
export function deleteAuditTableBase(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/deleteAuditTableBase',
    method: 'post',
    data
  })
}
// 数据表规则-所属项目列表
export function queryProject(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryProject',
    method: 'post',
    data
  })
}
// 数据表规则-项目对应数据表
export function queryTableByProject(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryTableByProject',
    method: 'post',
    data
  })
}
// 数据表规则-查询
export function queryAuditTableBaseById(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryAuditTableBaseById',
    method: 'post',
    data
  })
}
// 分区表达式-查询
export function queryAuditTablePartExprByBaseId(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryAuditTablePartExprByBaseId',
    method: 'post',
    data
  })
}
// 分区表达式-新增
export function insertAuditTablePartExpr(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/insertAuditTablePartExpr',
    method: 'post',
    data
  })
}
// 分区表达式-编辑
export function updateAuditTablePartExpr(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/updateAuditTablePartExpr',
    method: 'post',
    data
  })
}
// 分区表达式-删除
export function deleteAuditTablePartExpr(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/deleteAuditTablePartExpr',
    method: 'post',
    data
  })
}
// 质量规则列表
export function auditTableRuleList(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/auditTableRuleList',
    method: 'post',
    data
  })
}
// 质量规则-新增
export function insertAuditTableRule(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/insertAuditTableRule',
    method: 'post',
    data
  })
}
// 质量规则-编辑
export function updateAuditTableRule(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/updateAuditTableRule',
    method: 'post',
    data
  })
}
// 质量规则-校验开关
export function auditTableRuleVerification(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/auditTableRuleVerification',
    method: 'post',
    data
  })
}
// 质量规则-删除
export function deleteAuditTableRule(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/deleteAuditTableRule',
    method: 'post',
    data
  })
}
// 质量规则-查询
export function queryAuditTableRuleInfo(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryAuditTableRuleInfo',
    method: 'post',
    data
  })
}
// 质量规则-对象查询
export function queryObjectInfo(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryObjectInfo',
    method: 'post',
    data
  })
}
// 质量规则-模板类型
export function queryTemplateType(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryTemplateType',
    method: 'post',
    data
  })
}
// 质量规则-模板规则趋势与核查类型
export function queryTrendAndCheckInfo(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryTrendAndCheckInfo',
    method: 'post',
    data
  })
}
// 质量规则-自定义规则检测类型
export function queryQualityCheckType(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryQualityCheckType',
    method: 'post',
    data
  })
}
// 质量规则-自定义规则趋势
export function queryQualityTrend(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryQualityTrend',
    method: 'post',
    data
  })
}
// 质量规则-自定义对比规则
export function queryQualityOperator(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryQualityOperator',
    method: 'post',
    data
  })
}
// 质量规则-规则试跑
export function auditRuleTrailRun(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/auditRuleTrailRun',
    method: 'post',
    data
  })
}
// 质量规则-根据分区表达式ID查询规则
export function queryTableRuleByPartId(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryTableRuleByPartId',
    method: 'post',
    data
  })
}
// 质量规则-告警信息查询
export function queryAlarmInstanceByBaseId(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryAlarmInstanceByBaseId',
    method: 'post',
    data
  })
}
// 质量规则-质量规则-告警设置下拉框
export function queryAlarmPersonList(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryAlarmPersonList',
    method: 'post',
    data
  })
}
// 质量规则-告警信息编辑
export function editAlarmInstance(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/editAlarmInstance',
    method: 'post',
    data
  })
}
// 质量规则-数据表调度查询接口
export function queryDispatchById(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/queryDispatchById',
    method: 'post',
    data
  })
}
// 质量规则-数据表调度编辑
export function dispatchEdit(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/dispatchEdit',
    method: 'post',
    data
  })
}
// 质量规则-数据表批量删除
export function deleteAuditTableBaseBatch(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/deleteAuditTableBaseBatch',
    method: 'post',
    data
  })
}
// 质量规则-数据表批量开启
export function auditTableBaseVerificationBatch(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/auditTableBaseVerificationBatch',
    method: 'post',
    data
  })
}
// 质量规则-自定义模板规范性校验
export function sqlVerification(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/sqlVerification',
    method: 'post',
    data
  })
}
// 质量规则-分区表达式日期动态显示
export function auditTablePartExprFormat(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/auditTablePartExprFormat',
    method: 'post',
    data
  })
}

// 质量规则-分区表达式x小时动态显示
export function auditTableHourPartExprFormat(data = {}) {
  return fetch({
    url: '/audit/auditTableBase/auditTableHourPartExprFormat',
    method: 'post',
    data
  })
}
