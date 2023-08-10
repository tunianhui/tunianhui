/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-26 10:57:59
 * @LastEditTime: 2023-07-20 16:46:03
 * @Description: 研发-集成
 */
import fetch from '@/libs/fetch'

// ---------------- 任务管理 ----------------
// 任务新增
export function addTask(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/newtask',
    method: 'post',
    need: true,
    data
  })
}

// 任务重命名
export function renameTask(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/renametask',
    method: 'post',
    need: true,
    data
  })
}

// 任务移动
export function moveTask(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/movetask',
    method: 'post',
    need: true,
    data
  })
}

// 任务克隆
export function cloneTask(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/clonetask',
    method: 'post',
    need: true,
    data
  })
}

// 任务删除
export function deleteTask(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/deletetask',
    method: 'post',
    need: true,
    data
  })
}

// 任务信息查询
export function getTaskinfo(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/gettaskinfo',
    method: 'post',
    need: true,
    data
  })
}

// 任务保存
export function saveTask(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/savetask',
    method: 'post',
    need: true,
    data
  })
}

// 任务运行
export function runTask(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/runtask',
    method: 'post',
    need: true,
    data
  })
}

// 任务提交
export function submitTask(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/submittask',
    method: 'post',
    need: true,
    data
  })
}

// ------------- 任务版本 -------------
// 版本列表
export function taskversionList(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/taskversionlist',
    method: 'post',
    need: true,
    data
  })
}

// 版本查询
export function getTasktVersion(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/gettasktversion',
    method: 'post',
    need: true,
    data
  })
}

// 版本回退
export function taskVersionrollBack(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/taskversionrollback',
    method: 'post',
    need: true,
    data
  })
}

// 版本删除
export function taskVersionDelete(data = {}) {
  return fetch({
    url: '/datacollection/taskmgt/taskversiondelete',
    method: 'post',
    need: true,
    data
  })
}

// -------- Schema ----------
// Schema信息列表查询
export function getSchemaList(data = {}) {
  return fetch({
    url: '/datacollection/schemamgt/getschemalist',
    method: 'post',
    need: true,
    data
  })
}

// 查询Schema字段列表信息
export function getSchemaFieldList(data = {}) {
  return fetch({
    url: '/datacollection/schemamgt/getschemafieldlist',
    method: 'post',
    need: true,
    data
  })
}

// --------------- 数据源 ------------------
// 数据源列表查询
export function getDatasourceList(data = {}) {
  return fetch({
    url: '/datacollection/datasourcemgt/getdatasourcelist',
    method: 'post',
    need: true,
    data
  })
}

// 数据源表列表查询
export function getdstablelist(data = {}) {
  return fetch({
    url: '/datacollection/datasourcemgt/getdstablelist',
    method: 'post',
    need: true,
    data
  })
}

// 数据源表字段列表查询
export function getdstablefieldlist(data = {}) {
  return fetch({
    url: '/datacollection/datasourcemgt/getdstablefieldlist',
    method: 'post',
    need: true,
    data
  })
}

// 数据源配置参数查询
export function getdsparam(data = {}) {
  return fetch({
    url: '/datacollection/datasourcemgt/getdsparam',
    method: 'post',
    need: true,
    data
  })
}

// ------------ 公共服务接口 --------------------
// 公共字典列表查询
export function getdictitemlist(data = {}) {
  return fetch({
    url: '/datacollection/common/getdictitemlist',
    method: 'post',
    need: true,
    data
  })
}

// 查询组件配置列表
export function getcomponentlist(data = {}) {
  return fetch({
    url: '/datacollection/common/getcomponentlist',
    method: 'post',
    need: true,
    data
  })
}

// 查询函数配置列表
export function getfunctionlist(data = {}) {
  return fetch({
    url: '/datacollection/common/getfunctionlist',
    method: 'post',
    need: true,
    data
  })
}

// ------------- 加密 ---------------
// 加密算法列表查询
export function getencryptionAlgorithmlist(data = {}) {
  return fetch({
    url: '/datacollection/dataumb/getencryptalgorithmlist',
    method: 'post',
    need: true,
    data
  })
}

// 加密算法列表查询
export function getsecretkeylist(data = {}) {
  return fetch({
    url: '/datacollection/dataumb/getsecretkeylist',
    method: 'post',
    need: true,
    data
  })
}

// 脱敏规则列表查询
export function getdatamaskrulelist(data = {}) {
  return fetch({
    url: '/datacollection/dataumb/getdatamaskrulelist',
    method: 'post',
    need: true,
    data
  })
}

// 数据源ES索引列表查询接口
export function getesindexlist(data = {}) {
  return fetch({
    url: '/datacollection/datasourcemgt/getesindexlist',
    method: 'post',
    need: true,
    data
  })
}

// 数据源ES索引类型列表查询接口
export function getesindextypelist(data = {}) {
  return fetch({
    url: '/datacollection/datasourcemgt/getesindextypelist',
    method: 'post',
    need: true,
    data
  })
}

// 数据源索引字段列表查询接口
export function getesindexfieldlist(data = {}) {
  return fetch({
    url: '/datacollection/datasourcemgt/getesindexfieldlist',
    method: 'post',
    need: true,
    data
  })
}
