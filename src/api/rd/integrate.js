/*
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-01-13 09:13:53
 * @LastEditTime: 2023-07-17 15:31:56
 * @Description: 研发-集成-开发任务
 */
import fetch from '@/libs/fetch'

// 树列表
export function getTreeData(data = {}) {
  return fetch({
    url: '/developTask/ds/listFolder',
    method: 'post',
    data
  })
}

// 列表
export function getListAll(data = {}) {
  return fetch({
    url: '/developTask/ds/listAll',
    method: 'post',
    data
  })
}

// 获取流程数据
export function getFlowData(data = {}) {
  return fetch({
    url: '/developTask/ds/queryById',
    method: 'post',
    data
  })
}

// 保存
export function save(data = {}) {
  return fetch({
    url: '/developTask/ds/save',
    method: 'post',
    data
  })
}

// 获取worker
export function getWorkers(data = {}) {
  return fetch({
    url: '/developTask/ds/common/getWorkers',
    method: 'post',
    data
  })
}

// 获取环境
export function getEnvironments(data = {}) {
  return fetch({
    url: '/developTask/ds/common/getEnvironments',
    method: 'post',
    data
  })
}

// 获取任务组
export function getTaskGroups(data = {}) {
  return fetch({
    url: '/developTask/ds/common/getTaskGroups',
    method: 'post',
    data
  })
}

// 获取资源
export function getResources(data = {}) {
  return fetch({
    url: '/developTask/ds/common/getResources',
    method: 'post',
    data
  })
}

// 获取数据源实例
export function getDatasourceEntitys(data = {}) {
  return fetch({
    url: '/developTask/ds/common/getDatasourceEntitys',
    method: 'post',
    data
  })
}

// SUB_PROCESS 获取子任务节点
export function getWorkFlows(data = {}) {
  return fetch({
    url: '/developTask/ds/common/getWorkFlows',
    method: 'post',
    data
  })
}

// 获取主程序包
export function getMainJars(data = {}) {
  return fetch({
    url: '/developTask/ds/common/getMainJars',
    method: 'post',
    data
  })
}

// 根据流程获取任务下拉框
export function getTaskList(data = {}) {
  return fetch({
    url: '/developTask/ds/task/listAll',
    method: 'post',
    data
  })
}

// 获取租户
export function getTenants(data = {}) {
  return fetch({
    url: '/developTask/ds/common/getTenants',
    method: 'post',
    data
  })
}

// 新建文件夹
export function saveFolder(data = {}) {
  return fetch({
    url: '/developTask/ds/saveFolder',
    method: 'post',
    data
  })
}

// 文件移动
export function moveFileOrFolder(data = {}) {
  return fetch({
    url: '/developTask/ds/moveFileOrFolder',
    method: 'post',
    data
  })
}

// 文件重命名
export function renameFileOrFolder(data = {}) {
  return fetch({
    url: '/developTask/ds/renameFileOrFolder',
    method: 'post',
    data
  })
}

// 文件删除
export function deleteFileOrFolder(data = {}) {
  return fetch({
    url: '/developTask/ds/deleteFileOrFolder',
    method: 'post',
    data
  })
}

// 调度配置-获取调度配置 dsId 开发任务id
export function getDispatch(data = {}) {
  return fetch({
    url: '/developTask/ds/dispatch/queryById',
    method: 'post',
    data
  })
}

// 调度配置-保存
export function editDispatch(data = {}) {
  return fetch({
    url: '/developTask/ds/dispatch/edit',
    method: 'post',
    data
  })
}

// 提交
export function publish(data = {}) {
  return fetch({
    url: '/developTask/ds/publish',
    method: 'post',
    data
  })
}

// 运行
export function startProcessInstance(data = {}) {
  return fetch({
    url: '/developTask/ds/startProcessInstance',
    method: 'post',
    data
  })
}

// 获取运行日志
export function getLogs(data = {}) {
  return fetch({
    url: '/developTask/ds/logs',
    method: 'post',
    data
  })
}

// 获取节点code 拖拽节点生成一个唯一标识 传给服务端
export function getTaskCode(data = {}) {
  return fetch({
    url: '/developTask/ds/genTaskCodes',
    method: 'post',
    data
  })
}

// 业务流程-获取配置
export function getFlow(data = {}) {
  return fetch({
    url: '/developTask/bf/queryById',
    method: 'post',
    data
  })
}

// 业务流程-保存/修改
export function saveFlow(data = {}) {
  return fetch({
    url: '/developTask/bf/save',
    method: 'post',
    data
  })
}

// 业务流程-删除
export function deleteFlow(data = {}) {
  return fetch({
    url: '/developTask/bf/delete',
    method: 'post',
    data
  })
}

// 任务节点-保存/修改
export function saveTask(data = {}) {
  return fetch({
    url: '/developTask/bf/task/save',
    method: 'post',
    data
  })
}

// 任务节点-删除
export function deleteTask(data = {}) {
  return fetch({
    url: '/developTask/bf/task/delete',
    method: 'post',
    data
  })
}

// 任务节点-获取配置
export function getTask(data = {}) {
  return fetch({
    url: '/developTask/bf/task/queryById',
    method: 'post',
    data
  })
}

// 任务节点-发布
export function publishTask(data = {}) {
  return fetch({
    url: '/developTask/bf/task/publish',
    method: 'post',
    data
  })
}

// 任务节点-运行
export function runTask(data = {}) {
  return fetch({
    url: '/developTask/bf/task/run',
    method: 'post',
    data
  })
}

// 获取项目列表
export function getProjectList(data = {}) {
  return fetch({
    url: '/plan/commonDict/getBusinessProject',
    method: 'post',
    data
  })
}

// ------ 公共接口 ----
// 代码表查询
export function getDictParams(data = {}) {
  return fetch({
    url: '/plan/commonDict/getDictParams',
    method: 'post',
    data
  })
}

// 查询周期表达式
export function getDictParamsByParent(data = {}) {
  return fetch({
    url: '/plan/commonDict/getDictParamsByParent',
    method: 'post',
    data
  })
}

// 历史信息-版本信息-列表
export function versionHistory(data = {}) {
  return fetch({
    url: '/developTask/bf/history/version/list',
    method: 'post',
    data
  })
}

// 历史信息-版本信息-详细详情
export function versionInfo(data = {}) {
  return fetch({
    url: '/developTask/bf/history/version/info',
    method: 'post',
    data
  })
}

// 历史信息-版本信息-版本回滚
export function versionRollBack(data = {}) {
  return fetch({
    url: '/developTask/bf/history/version',
    method: 'post',
    data
  })
}

// 历史信息-执行信息-列表
export function runInfoList(data = {}) {
  return fetch({
    url: '/developTask/bf/history/runInfo/list',
    method: 'post',
    data
  })
}

// 历史信息-执行信息-查看日志
export function runInfoLogs(data = {}) {
  return fetch({
    url: '/developTask/bf/history/runInfo/logs',
    method: 'post',
    data
  })
}

// 计算任务--属性配置--获取数据源
export function getAttrConfigById(data = {}) {
  return fetch({
    url: '/developTask/bf/task/queryById',
    method: 'post',
    data
  })
}

// 计算任务--属性配置--保存
export function saveAttrConfig(data = {}) {
  return fetch({
    url: '/developTask/bf/task/config',
    method: 'post',
    data
  })
}

// 计算任务--属性配置--血缘配置
export function getLineageConfig(data = {}) {
  return fetch({
    url: '/developTask/bf/blood/list',
    method: 'post',
    data
  })
}

// 计算任务--属性配置--血缘配置--表列表
export function getLineageTableList(data = {}) {
  return fetch({
    url: '/developTask/bf/blood/listTables',
    method: 'post',
    data
  })
}

// 计算任务--属性配置--血缘配置--字段列表
export function getLineageFieldList(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/queryById',
    method: 'post',
    data
  })
}

// 计算任务--属性配置--血缘配置--保存
export function saveBlood(data = {}) {
  return fetch({
    url: '/developTask/bf/blood/save',
    method: 'post',
    data
  })
}