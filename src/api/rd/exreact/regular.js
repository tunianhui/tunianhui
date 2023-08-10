/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-07-31 15:20:18
 * @LastEditTime: 2023-07-28 16:36:43
 * @Description:
 */
import fetch from '@/libs/fetch'

// 行为规则tree
export function getRegularTree(data) {
  return fetch({
    url: '/label/TLabelBcBase/listTree',
    method: 'post',
    data
  })
}

// 获取筛选条件
export function getFiltersList(data) {
  return fetch({
    url: '/label/filter',
    method: 'post',
    data
  })
}

// 行为规则列表
export function getRegularList(data) {
  return fetch({
    url: '/label/TLabelBcBase/listAll',
    method: 'post',
    data
  })
}

// 添加行为规则
export function add(data) {
  return fetch({
    url: '/label/TLabelBcBase/insert',
    method: 'post',
    data
  })
}

// 补数据
export function addData(data) {
  return fetch({
    url: '/exreact/regular/addData',
    method: 'post',
    data
  })
}

// 下线
export function offLine(data) {
  return fetch({
    url: '/exreact/regular/offLine',
    method: 'post',
    data
  })
}

// 下线并删除
export function remove(data) {
  return fetch({
    url: '/exreact/regular/remove',
    method: 'post',
    data
  })
}

// 调度配置查询接口
export function queryDispatchById(data = {}) {
  return fetch({
    url: '/label/TLabelBcBase/queryDispatchById',
    method: 'post',
    data
  })
}

// 调度配置编辑接口
export function dispatchEdit(data = {}) {
  return fetch({
    url: '/TLabelBcBase/dispatchSave',
    method: 'post',
    data
  })
}

// ID类型列表全部
export function getIdTypeList(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/listAll',
    method: 'post',
    data
  })
}

// ID类型列表删除
export function delIdType(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/delete',
    method: 'post',
    data
  })
}

// ID类型列表删除-new
export function deleteIdTypeNew(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/relation/delete',
    method: 'post',
    data
  })
}

// ID类型列表新增
export function addIdType(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/insert',
    method: 'post',
    data
  })
}

// ID类型列表新增-new
export function asveIdTypeNew(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/relation/save',
    method: 'post',
    data
  })
}


// ID归一化配置--新增
export function addIdNormalizeConfig(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/insert',
    method: 'post',
    data
  })
}

// ID归一化配置列表--全部
export function getIdNormalizeConfigList(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/listAll',
    method: 'post',
    data
  })
}

// 表字段
export function getFidleList(data = {}) {
  return fetch({
    url: '/plan/commonDict/getField',
    method: 'post',
    data
  })
}

// 获取规则配置
export function getrulesinfo(data = {}) {
  return fetch({
    url: '/label/TLabelBcBase/listRules',
    method: 'post',
    data
  })
}

// 保存规则
export function saveRules(data = {}) {
  return fetch({
    url: '/label/TLabelBcBase/insertRules',
    method: 'post',
    data
  })
}

// 行为规则删除
export function delRules(data = {}) {
  return fetch({
    url: '/label/TLabelBcBase/delete',
    method: 'post',
    data
  })
}

// 来源主表
export function getSourceCubes(data = {}) {
  return fetch({
    url: '/plan/commonDict/getSourceCubes',
    method: 'post',
    data
  })
}

// 倒排表来源主表
export function getIDCubes(data = {}) {
  return fetch({
    url: '/plan/commonDict/getIDCubes',
    method: 'post',
    data
  })
}

// 根据id查规则信息
export function queryByIdRulesInfo(data = {}) {
  return fetch({
    url: '/label/TLabelBcBase/queryById',
    method: 'post',
    data
  })
}

// 规则发布
export function publish(data = {}) {
  return fetch({
    url: '/label/TLabelBcBase/publish',
    method: 'post',
    data
  })
}

// 规则属性信息
export function getAttrInfos(data = {}) {
  return fetch({
    url: '/label/TLabelBcBase/infos',
    method: 'post',
    data
  })
}

// ID类型列表
export function getListAll(data = {}) {
  return fetch({
    url: '/label/TLabelIdInfo/relation/listAll',
    method: 'post',
    data
  })
}
