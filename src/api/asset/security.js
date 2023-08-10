/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-27 08:56:10
 * @LastEditTime: 2023-08-04 15:21:25
 * @Description:
 */

import fetch from '@/libs/fetch'

// 项目安全策略-项目列表查询
export function getPagedProject (data) {
  return fetch({
    url: `/umbrella/strategy/queryPagedProject`,
    method: 'get',
    params: data
  })
}

// 项目安全策略-详情/编辑查询
export function getByProjectId (data) {
  return fetch({
    url: `/umbrella/strategy/queryByProjectId`,
    method: 'get',
    params: data
  })
}

// 项目安全策略-安装/更新/重装
export function securityPolicyInstall (data) {
  return fetch({
    url: `/umbrella/strategy/securityPolicyInstall`,
    method: 'POST',
    need: true,
    data
  })
}

// 项目安全策略-编辑保存
export function saveStrategy (data) {
  return fetch({
    url: `/umbrella/strategy/save`,
    method: 'POST',
    need: true,
    data
  })
}

// 数据分级-列表查询
export function getDataLevel (data) {
  return fetch({
    url: `/umbrella/level/queryPagedLevels`,
    method: 'get',
    params: data
  })
}

// 分级下拉项
export function getLevelItems () {
  return fetch({
    url: `/umbrella/level/queryLevelItems`,
    method: 'get'
  })
}

// 数据分级-新增/编辑
export function saveLevel (data) {
  return fetch({
    url: '/umbrella/level/save',
    method: 'POST',
    need: true,
    data
  })
}

// 数据分级-删除
export function deleteLevel (data) {
  return fetch({
    url: '/umbrella/level/deleteLevel',
    method: 'POST',
    need: true,
    data
  })
}

// --------------------------------------------
// 数据分类-列表查询
export function getDataClassify (data) {
  return fetch({
    url: `/umbrella/classify/queryPagedClassifys`,
    method: 'get',
    params: data
  })
}

// 数据分类-新增/编辑
export function saveClassify (data) {
  return fetch({
    url: '/umbrella/classify/save',
    method: 'POST',
    need: true,
    data
  })
}

// 数据分类-删除
export function deleteClassify (data) {
  return fetch({
    url: '/umbrella/classify/deleteClassify',
    method: 'POST',
    need: true,
    data
  })
}

// ------------------
// 识别规则-列表查询
export function getPagedIdentifyRule (data) {
  return fetch({
    url: '/umbrella/identify/rule/queryPagedIdentifyRule',
    method: 'get',
    params: data
  })
}

// 识别规则-新增
export function saveIdentifyRule (data) {
  return fetch({
    url: '/umbrella/identify/rule/save',
    method: 'POST',
    need: true,
    data
  })
}

// 识别规则-查看详情/编辑查看/复制查看
export function getIdentifyRule (data) {
  return fetch({
    url: '/umbrella/identify/rule/getIdentifyRule',
    method: 'get',
    params: data
  })
}

// 识别规则-状态修改
export function updateRuleStatus (data) {
  return fetch({
    url: '/umbrella/identify/rule/status',
    method: 'POST',
    need: true,
    data
  })
}

// 识别规则-识别规则转交
export function updateIdentifyRuleOwner (data) {
  return fetch({
    url: '/umbrella/identify/rule/owner',
    method: 'POST',
    need: true,
    data
  })
}

// 识别规则-删除
export function deleteIdentifyRule (data) {
  return fetch({
    url: '/umbrella/identify/rule/deleteIdentifyRule',
    method: 'POST',
    params: data
  })
}

// 识别规则-识别特征列表查询
export function getIdentifyData (data) {
  return fetch({
    url: '/umbrella/feature/queryPagedFeatures',
    method: 'get',
    params: data
  })
}

// 识别规则-手动任务扫描
export function triggerTenantIdentifyTask (data) {
  return fetch({
    url: '/umbrella/identify/rule/triggerTenantIdentifyTask',
    method: 'POST',
    need: true,
    data
  })
}

// 识别规则-调度任务配置
export function getScheduleSettings (data) {
  return fetch({
    url: '/umbrella/identify/rule/getScheduleSettings',
    method: 'POST',
    need: true,
    data
  })
}

// 识别规则-调度任务配置保存
export function saveScheduleSettings (data) {
  return fetch({
    url: '/umbrella/identify/rule/saveScheduleSettings',
    method: 'POST',
    need: true,
    data
  })
}

// ----------------------------------------------------------------
// 识别记录-列表查看
export function getIdentifyRecordData (data) {
  return fetch({
    url: '/umbrella/identify/record/queryPagedIdentifyLabels',
    method: 'get',
    params: data
  })
}

// 识别记录-字段覆盖策略
export function batchCleanCustomLabels (data, labelId) {
  return fetch({
    url: `/umbrella/identify/record/batchModifyCustomLabels?labelIdList=${labelId}`,
    method: 'POST',
    need: true,
    data
  })
}

// 识别记录-状态变更
export function updateRecordStatus (data) {
  return fetch({
    url: '/umbrella/identify/record/status',
    method: 'POST',
    need: true,
    data
  })
}

// -----------------------------------------
// 识别任务-列表查看
export function getPagedScanTasks (data) {
  return fetch({
    url: '/umbrella/identify/task/queryPagedScanTasks',
    method: 'get',
    params: data
  })
}

// 识别任务-扫描详情
export function getTaskDetail (data) {
  return fetch({
    url: '/umbrella/identify/task/taskDetail',
    method: 'get',
    params: data
  })
}

// 识别任务-任务取消
export function taskCancel (data) {
  return fetch({
    url: '/umbrella/identify/task/taskCancel',
    method: 'POST',
    need: true,
    data
  })
}

// -----------------------------------
// 手动添加-列表查看
export function getPagedManualData (data) {
  return fetch({
    url: '/umbrella/identify/manual/queryPagedManualCols',
    method: 'get',
    params: data
  })
}

// 手动添加-拷贝查询
export function getManualDetail (data) {
  return fetch({
    url: '/umbrella/identify/manual/queryById',
    method: 'POST',
    need: true,
    data
  })
}

// 手动添加-保存
export function saveManual (data) {
  return fetch({
    url: '/umbrella/identify/manual/save',
    method: 'POST',
    need: true,
    data
  })
}

// 手动添加-编辑保存
export function updateManual (data) {
  return fetch({
    url: '/umbrella/identify/manual/update',
    method: 'POST',
    need: true,
    data
  })
}

// 手动添加-删除
export function deleteManual (data) {
  return fetch({
    url: '/umbrella/identify/manual/delete',
    method: 'POST',
    need: true,
    data
  })
}

// 手动添加-状态修改
export function updateManualStatus (data) {
  return fetch({
    url: '/umbrella/identify/manual/status',
    method: 'POST',
    need: true,
    data
  })
}

// ------------------------------------------
// 秘钥管理-列表查询
export function getSecretKeysData (data) {
  return fetch({
    url: '/umbrella/secret/queryPagedSecretKeys',
    method: 'get',
    params: data
  })
}

// 秘钥管理-算法参数列表
export function getSecretParam (data) {
  return fetch({
    url: '/umbrella/secret/getSecretParam',
    method: 'get',
    params: data
  })
}

// 秘钥管理-编辑查询
export function getSecretKeyById (data) {
  return fetch({
    url: '/umbrella/secret/querySecretKeyById',
    method: 'get',
    params: data
  })
}

// 秘钥管理-注册秘钥/编辑保存
export function saveSecretKey (data) {
  return fetch({
    url: '/umbrella/secret/saveSecretKey',
    method: 'POST',
    need: true,
    data
  })
}

// 秘钥管理-查看秘钥值
export function watchSecretKey (data) {
  return fetch({
    url: '/umbrella/secret/watchSecretKey',
    method: 'POST',
    need: true,
    data
  })
}

// 秘钥管理-查看秘钥引用
export function getTaskReferences (data) {
  return fetch({
    url: '/umbrella/secret/queryTaskReferences',
    method: 'get',
    params: data
  })
}

// 秘钥管理-转交责任人
export function updateSecretKeyOwner (data) {
  return fetch({
    url: '/umbrella/secret/owner',
    method: 'POST',
    need: true,
    data
  })
}

// 秘钥管理-删除秘钥
export function delSecretKey (data) {
  return fetch({
    url: '/umbrella/secret/delSecretKey',
    method: 'POST',
    need: true,
    data
  })
}

// 秘钥管理-权限管理-秘钥授权
export function permissionAuth (data) {
  return fetch({
    url: '/umbrella/permission/secret/auth',
    method: 'POST',
    need: true,
    data
  })
}

// 秘钥管理-权限管理-权限详情查询
export function getPermissionDetail (data) {
  return fetch({
    url: '/umbrella/permission/secret/queryPagedPermissionDetails',
    method: 'get',
    params: data
  })
}

// 秘钥管理-权限管理-权限回收
export function permissionRecycling (data) {
  return fetch({
    url: '/umbrella/permission/secret/permissionRecycling',
    method: 'POST',
    need: true,
    data
  })
}

// 秘钥管理-权限申请-续期
export function permissionRenewal (data) {
  return fetch({
    url: '/umbrella/permission/secret/renewal',
    method: 'POST',
    need: true,
    data
  })
}

// 秘钥管理-权限申请-交还
export function permissionReturn (data) {
  return fetch({
    url: '/umbrella/permission/secret/return',
    method: 'POST',
    need: true,
    data
  })
}

// 秘钥管理-权限申请-申请
export function permissionApply (data) {
  return fetch({
    url: '/umbrella/permission/secret/apply',
    method: 'POST',
    need: true,
    data
  })
}

// -------------------------------------------
// 脱敏算法-脱敏列表查询
export function getPagedAlgorithm (data) {
  return fetch({
    url: '/umbrella/algorithm/queryPagedAlgorithm',
    method: 'get',
    params: data
  })
}

// 脱敏算法-脱敏测试
export function algorithmTest (data) {
  return fetch({
    url: '/umbrella/algorithm/test',
    method: 'POST',
    need: true,
    data
  })
}

// 脱敏算法-自定义替换脱敏类型列表
export function replaceMaskType (data) {
  return fetch({
    url: '/umbrella/common/replaceMaskType',
    method: 'get',
    params: data
  })
}

// 动态脱敏规则-动态脱敏规则列表查询
export function getPagedDesensitizeRule (data) {
  return fetch({
    url: '/umbrella/desensitization/queryPagedDesensitizeRule',
    method: 'get',
    params: data
  })
}

// 动态脱敏规则-新建
export function saveDesensitizeRule (data) {
  return fetch({
    url: '/umbrella/desensitization/saveDesensitizeRule',
    method: 'POST',
    need: true,
    data
  })
}

// 动态脱敏规则-动态脱敏规则-编辑查看
export function getDesensitizeRule (data) {
  return fetch({
    url: '/umbrella/desensitization/getDesensitizeRule',
    method: 'get',
    params: data
  })
}

// 动态脱敏规则-状态修改
export function desensitizeRuleStatus (data) {
  return fetch({
    url: '/umbrella/desensitization/desensitizeRuleStatus',
    method: 'POST',
    need: true,
    data
  })
}

// 动态脱敏规则-删除
export function deleteDesensitizeRule (data) {
  return fetch({
    url: '/umbrella/desensitization/deleteDesensitizeRule',
    method: 'POST',
    need: true,
    data
  })
}

// 白名单-白名单列表查询
export function getPagedDesensitizeWhite (data) {
  return fetch({
    url: '/umbrella/maskWhite/queryPagedDesensitizeWhiteListRule',
    method: 'get',
    params: data
  })
}

// 白名单-保存
export function saveDesensitizeWhiteListRule (data) {
  return fetch({
    url: '/umbrella/maskWhite/saveDesensitizeWhiteListRule',
    method: 'POST',
    need: true,
    data
  })
}

// 白名单-编辑查看
export function getDesensitizeWhiteListRule (data) {
  return fetch({
    url: '/umbrella/maskWhite/getDesensitizeWhiteListRule',
    method: 'get',
    params: data
  })
}

// 白名单-生效状态修改
export function desensitizeWhiteStatus (data) {
  return fetch({
    url: '/umbrella/maskWhite/desensitizeWhiteStatus',
    method: 'POST',
    need: true,
    data
  })
}

// 白名单-删除
export function deleteDesensitizeWhiteListRule (data) {
  return fetch({
    url: '/umbrella/maskWhite/deleteDesensitizeWhiteListRule',
    method: 'POST',
    need: true,
    data
  })
}

// --------------------------------------------
// 公共接口-板块列表查询
export function getBizunit (data) {
  return fetch({
    url: '/umbrella/planning/bizunit/allList',
    method: 'get',
    params: data
  })
}

// 公共接口-板块列表_新
export function getBusinList (data) {
  return fetch({
    url: '/umbrella/common/businList',
    method: 'get',
    params: data
  })
}

// 公共接口-项目列表查询
export function getProject (data) {
  return fetch({
    url: '/umbrella/project',
    method: 'POST',
    need: true,
    data
  })
}

// 公共接口-项目列表查询
export function getProjectList (data) {
  return fetch({
    url: '/umbrella/common/projectList',
    method: 'get',
    params: data
  })
}

// 公共接口-秘钥类型列表查询
export function getSecretTypeData (data) {
  return fetch({
    url: '/umbrella/common/querySecretType',
    method: 'get',
    params: data
  })
}

// 公共接口-加解密算法列表
export function getEncryptAlgorithmInfo (data) {
  return fetch({
    url: '/umbrella/common/queryEncryptAlgorithmInfo',
    method: 'get',
    params: data
  })
}

// 公共接口-生成方式列表
export function getGenerationType (data) {
  return fetch({
    url: '/umbrella/common/generationTypeList',
    method: 'get',
    params: data
  })
}

// 公共接口-转交责任人用户列表
export function securityRoleUsers (data) {
  return fetch({
    url: '/umbrella/common/securityRoleUsers',
    method: 'get',
    params: data
  })
}

// 公共接口-授权用户列表
export function getRelationUsers (data) {
  return fetch({
    url: '/umbrella/common/loginUserRelationUsers',
    method: 'get',
    params: data
  })
}

// 公共接口-负责人列表
export function getMembers (data) {
  return fetch({
    url: '/umbrella/members',
    method: 'get',
    params: data
  })
}

// 公共接口-任务类型
export function getTaskTypeData (data) {
  return fetch({
    url: '/umbrella/common/taskType',
    method: 'get',
    params: data
  })
}

// 公共接口-操作类型
export function getOperationTypeData (data) {
  return fetch({
    url: '/umbrella/common/operationType',
    method: 'get',
    params: data
  })
}

// 公共接口-权限类型
export function getPermissionTypeData (data) {
  return fetch({
    // url: '/umbrella/permission/secret/permissionType',
    url: '/umbrella/common/permissionType',
    method: 'get',
    params: data
  })
}

// 公共接口-秘钥权限-有效期至下拉框
export function getValidUntilData (data) {
  return fetch({
    // url: '/umbrella/permission/secret/validUntil',
    url: '/umbrella/common/validUntil',
    method: 'get',
    params: data
  })
}

// 公共接口-脱敏算法类型列表
export function getAlgorithmTypes (data) {
  return fetch({
    url: '/umbrella/common/queryAlgorithmTypes',
    method: 'get',
    params: data
  })
}

// 公共接口-脱敏算法下拉列表（树状结构）
export function getAlgorithmTypeTree (data) {
  return fetch({
    url: '/umbrella/common/queryAlgorithmTypeTree',
    method: 'get',
    params: data
  })
}

// 公共接口-资产安全策略类型列表
export function getStrategyStatus (data) {
  return fetch({
    url: '/umbrella/common/strategyStatus',
    method: 'get',
    params: data
  })
}

// 公共接口-识别特征的识别类型列表
export function getFeatureRecognizeType (data) {
  return fetch({
    url: '/umbrella/common/featureRecognizeType',
    method: 'get',
    params: data
  })
}

// 公共接口-识别特征的来源类型列表
export function getFeatureForm (data) {
  return fetch({
    url: '/umbrella/common/featureFrom',
    method: 'get',
    params: data
  })
}

// 失效原因
export function invalidityReasonType(data = {}) {
  return fetch({
    url: '/umbrella/common/invalidityReasonType',
    method: 'get',
    params: data
  })
}

// 锁定识别
export function getLock(data) {
  return fetch({
    url: `/umbrella/identify/record/lock?labelIdList=${data}`,
    method: 'POST'
  })
}

// 解锁识别
export function getUnLock(data) {
  return fetch({
    url: `/umbrella/identify/record/unLock?labelIdList=${data}`,
    method: 'POST'
  })
}

// 字段识别记录
export function getDetailsList(data = {}) {
  return fetch({
    url: '/umbrella/identify/record/queryPagedRecognizeDetails',
    method: 'get',
    params: data
  })
}

// 表列表
export function getTableList(data = {}) {
  return fetch({
    url: '/umbrella/common/tableList',
    method: 'get',
    params: data
  })
}

// 表字段
export function getColumnList(data = {}) {
  return fetch({
    url: '/umbrella/common/columnList',
    method: 'get',
    params: data
  })
}

// 按表添加
export function getManualSave(data = {}) {
  return fetch({
    url: '/umbrella/identify/record/manualSave',
    method: 'POST',
    params: data
  })
}

export function getManualUpload(data = {}) {
  return fetch({
    url: '/umbrella/identify/record/manualUpload',
    method: 'POST',
    need: true,
    data
  })
}

// 去重策略列表
export function getDedupStrategyType(data = {}) {
  return fetch({
    url: '/umbrella/common/dedupStrategyType',
    method: 'get',
    params: data
  })
}

// 上传历史
export function getuploadHistory(data = {}) {
  return fetch({
    url: '/umbrella/identify/record/queryUploadHistory',
    method: 'get',
    params: data
  })
}

// 扫描状态
export function getScanStatusType(data = {}) {
  return fetch({
    url: '/umbrella/common/scanStatusType',
    method: 'get',
    params: data
  })
}

// 表详情
export function getTableDetail(data = {}) {
  return fetch({
    url: '/umbrella/identify/task/tableDetail',
    method: 'get',
    params: data
  })
}
