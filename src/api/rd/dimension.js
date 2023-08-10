/*
 * @Author: 大炸鹅
 * @Date: 2022-12-21 16:52:27
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 10:33:27
 * @FilePath: \数据智能构建\src\api\rd\dimension.js
 */
import fetch from '@/libs/fetch'

// 左侧的树-维度列表
export function getTreeData(data = {}) {
  return fetch({
    url: '/developTask/developModel/list',
    method: 'post',
    data
  })
}
// 获取主键类型
export function getPkTypeList(data = {}) {
  return fetch({
    url: '/plan/commonDict/getDictParams',
    method: 'post',
    data
  })
}
// 普通维度规范性校验
export function sqlVerification(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/sqlVerification',
    method: 'post',
    data
  })
}
// 普通维度创建
export function addGeneralDim(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/generalSave',
    method: 'post',
    data
  })
}
// 枚举维度创建
export function addEnumDim(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/enumSave',
    method: 'post',
    data
  })
}
// 普通维度-更新
export function editGeneralDim(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/generalEdit',
    method: 'post',
    data
  })
}
// 枚举维度-更新
export function editEnumDim(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/enumEdit',
    method: 'post',
    data
  })
}
// 维度-删除
export function delDim(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/del',
    method: 'post',
    data
  })
}
// 维度-下线
export function offLine(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/offLine',
    method: 'post',
    data
  })
}
// 普通维度-查询
export function queryGeneral(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/queryGeneralById',
    method: 'post',
    data
  })
}
// 枚举维度-查询
export function queryEnum(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/queryEnumById',
    method: 'post',
    data
  })
}
// 维度-提交
export function dimPublish(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/dimPublish',
    method: 'post',
    data
  })
}
// 维度-计算逻辑sql回填
export function sqlBackFill(data = {}) {
  return fetch({
    url: '/developTask/developModelDim/sqlBackFill',
    method: 'post',
    data
  })
}
