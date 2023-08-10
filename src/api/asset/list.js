import fetch from '@/libs/fetch'

// 指标列表
export function getDeriveList(data = {}) {
  return fetch({
    url: '/asset/catalogueDerivateIndex/queryDeriveList',
    method: 'post',
    data
  })
}
// 项目下拉
export function getProjectInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueDerivateIndex/queryProjectInfo',
    method: 'post',
    data
  })
}

// 维度下拉
export function getDimInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueDerivateIndex/queryDimInfo',
    method: 'post',
    data
  })
}
// 原子指标下拉
export function getAtomicInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueDerivateIndex/queryAtomicInfo',
    method: 'post',
    data
  })
}
// 事实逻辑表下拉
export function getFactLogicInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueDerivateIndex/queryFactLogicInfo',
    method: 'post',
    data
  })
}
// 汇总逻辑表下拉
export function getSumLogicInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueDerivateIndex/querySumLogicInfo',
    method: 'post',
    data
  })
}

// 指标-产出信息列表
export function getOutputInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueDerivateIndex/queryTaskList',
    method: 'post',
    data
  })
}

// 字段-列表
export function getFieldList(data = {}) {
  return fetch({
    url: '/asset/catalogueField/queryFieldList',
    method: 'post',
    data
  })
}
// 字段-表名
export function getCubeInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueField/queryCubeInfo',
    method: 'post',
    data
  })
}

// 函数-函数类型
export function getFuncClassify(data = {}) {
  return fetch({
    url: '/asset/catalogueFunc/queryFuncClassify',
    method: 'post',
    data
  })
}
// 函数-列表
export function getFuncList(data = {}) {
  return fetch({
    url: '/asset/catalogueFunc/queryFuncList',
    method: 'post',
    data
  })
}
// 项目-业务板块
export function getBusinessFieldInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueProject/queryBusinessFieldInfo',
    method: 'post',
    data
  })
}
// 项目-空间类型
export function getSpaceTypeInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueProject/querySpaceTypeInfo',
    method: 'post',
    data
  })
}
// 项目-列表
export function getProjectList(data = {}) {
  return fetch({
    url: '/asset/catalogueProject/queryProjectList',
    method: 'post',
    data
  })
}
// 项目-数据表列表
export function getDataTableList(data = {}) {
  return fetch({
    url: '/asset/catalogueProject/queryTableList',
    method: 'post',
    data
  })
}

// 数据源-数据源列表
export function getDataSourceList(data = {}) {
  return fetch({
    url: '/asset/catalogueDataSource/queryDataSourceList',
    method: 'post',
    data
  })
}

// 数据源-明细
export function getDataSourceDetail(data = {}) {
  return fetch({
    url: '/asset/catalogueDataSource/queryDataSourceDetail',
    method: 'post',
    data
  })
}

// 服务-服务列表
export function getServerList(data = {}) {
  return fetch({
    url: '/asset/catalogueServices/queryServieList',
    method: 'post',
    data
  })
}

// 服务-服务分组
export function getGroupList(data = {}) {
  return fetch({
    url: '/asset/catalogueServices/queryGroupInfo',
    method: 'post',
    data
  })
}

// 服务-服务详情
export function getServerDetail(data = {}) {
  return fetch({
    url: '/asset/catalogueServices/queryServieDetail',
    method: 'post',
    data
  })
}

// 数据源-存储类型
export function getDataSourceType(data = {}) {
  return fetch({
    url: '/asset/catalogueDataSource/getDataSourceType',
    method: 'post',
    data
  })
}

// 函数-详情
export function getFuncDetail(data = {}) {
  return fetch({
    url: '/asset/catalogueFunc/queryFuncDetail',
    method: 'post',
    data
  })
}
