import fetch from '@/libs/fetch'

// 查询接口
export function queryById(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/queryById',
    method: 'post',
    data
  })
}

// 逻辑维度属性删除接口
export function delElement(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/delElement',
    method: 'post',
    data
  })
}

// 获取维度表信息列表
export function getAllDimensionInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/getAllDimensionInfo',
    method: 'post',
    data
  })
}

// 获取表的字段列表
export function getElementByDimId(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/getElementByDimId',
    method: 'post',
    data
  })
}

// 保存
export function save(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/save',
    method: 'post',
    data
  })
}

// 发布
export function publishSql(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/publishSql',
    method: 'post',
    data
  })
}

// 提交
export function submit(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/dimLogicPublish',
    method: 'post',
    data
  })
}

// 下线
export function offLine(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/offLine',
    method: 'post',
    data
  })
}

// 获取关联维度数据
export function getRelDimInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/getRelDimInfo',
    method: 'post',
    data
  })
}

// 调度配置查询接口
export function queryDispatchById(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/queryDispatchById',
    method: 'post',
    data
  })
}

// 调度配置编辑接口
export function dispatchEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/dispatchEdit',
    method: 'post',
    data
  })
}

// sql验证
export function sqlVerification(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/sqlVerification',
    method: 'post',
    data
  })
}

// 物理化配置查询接口
export function queryNoPhysics(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/queryNoPhysics',
    method: 'post',
    data
  })
}

// 物理化配置编辑接口
export function physicsEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/physicsEdit',
    method: 'post',
    data
  })
}

// 字段编辑接口
export function elementEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/elementEdit',
    method: 'post',
    data
  })
}

// 试跑
export function getDolphinsFlowTestDim(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/dolphinsFlowTest',
    method: 'post',
    data
  })
}

// 试跑日志
export function getDolphinsTestLogDim(data = {}) {
  return fetch({
    url: '/developTask/developModelDimLogic/dolphinsTestLog',
    method: 'post',
    data
  })
}
