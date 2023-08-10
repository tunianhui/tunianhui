import fetch from '@/libs/fetch'

// 查询接口
export function queryById(data = {}) {
  return fetch({
    url: '/developModelFactLogic/queryById',
    method: 'post',
    data
  })
}

// 查询接口
export function queryByIdMulti(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryById',
    method: 'post',
    data
  })
}

// 删除表
export function del(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/del',
    method: 'post',
    data
  })
}

// 逻辑维度属性删除接口
export function delElement(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/delElement',
    method: 'post',
    data
  })
}

// 获取维度表信息列表
export function getAllDimensionInfo(data = {}) {
  return fetch({
    url: '/plan/commonDict/getMetaDimension',
    method: 'post',
    data
  })
}

// 获取表的字段列表
export function getElementByDimId(data = {}) {
  return fetch({
    url: '/developModelFactLogic/getElementByDimId',
    method: 'post',
    data
  })
}

// 新建
export function save(data = {}) {
  return fetch({
    url: '/developModelFactLogic/save',
    method: 'post',
    data
  })
}

// 新建-new
export function saveNew(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/save',
    method: 'post',
    data
  })
}

// 编辑接口
export function edit(data = {}) {
  return fetch({
    url: '/developModelFactLogic/edit',
    method: 'post',
    data
  })
}

// 发布
export function publishSql(data = {}) {
  return fetch({
    url: '/developModelFactLogic/publishSql',
    method: 'post',
    data
  })
}

// 提交
export function submit(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/factLogicPublish',
    method: 'post',
    data
  })
}

// 下线
export function offLine(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/offLine',
    method: 'post',
    data
  })
}

// 规范性校验接口
export function sqlVerification(data = {}) {
  return fetch({
    url: '/developModelFactLogic/sqlVerification',
    method: 'post',
    data
  })
}

// 规范性校验接口--引入字段
export function sqlVerificationMulti(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/sqlVerification',
    method: 'post',
    data
  })
}

// 规范性校验接口--自定义sql
export function sqlVerificationMultiSql(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/customFieldsSqlVerification',
    method: 'post',
    data
  })
}

// 调度配置查询接口
export function queryDispatchById(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryDispatchById',
    method: 'post',
    data
  })
}

// 调度配置编辑接口
export function dispatchEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/dispatchEdit',
    method: 'post',
    data
  })
}

// 物理化配置查询接口
export function queryNoPhysics(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryNoPhysics',
    method: 'post',
    data
  })
}

// 物理化配置编辑接口
export function physicsEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/physicsEdit',
    method: 'post',
    data
  })
}

// 数据预览
export function dataPreview(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/dataPreview',
    method: 'post',
    data
  })
}

// 关联字段信息
export function queryTableRelInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryTableRelInfo',
    method: 'post',
    data
  })
}

// 查询来源表
export function getLastOperSourceTable(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/getLastOperSourceTable',
    method: 'post',
    data
  })
}

// 新建字段保存
export function factLogicElementSaves(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/factLogicElementSave',
    method: 'post',
    data
  })
}

// 查询过滤条件来源表
export function queryFactConditionTable(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryFactConditionTable',
    method: 'post',
    data
  })
}

// 查询过滤条件
export function queryFactCondition(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryFactCondition',
    method: 'post',
    data
  })
}

// 查询过滤条件来源表字段信息
export function queryConditionTableElement(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryConditionTableElement',
    method: 'post',
    data
  })
}

// 查询过滤条件来源表字段信息
export function queryCondition(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryCondition',
    method: 'post',
    data
  })
}

// 过滤条件保存
export function factConditionSave(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/factConditionSave',
    method: 'post',
    data
  })
}

// 字段关联关系信息--编辑字段关联关系使用内容回填
export function queryElementInfoByLogicId(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/queryElementInfoByLogicId',
    method: 'post',
    data
  })
}

// 字段关联关系编辑--点击图标时保存
export function factLogicElementRelEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/factLogicElementRelEdit',
    method: 'post',
    data
  })
}

// 编辑模型关系--关联维度使用
export function factLogicRelDimEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/factLogicRelDimEdit',
    method: 'post',
    data
  })
}

// 事实逻辑与来源表ER图
export function sourceCubeRelation(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/sourceCubeRelation',
    method: 'post',
    data
  })
}

// 编辑字段--保存
export function factElementEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/factElementEdit',
    method: 'post',
    data
  })
}


// 聚合
export function getMeasureInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/getMeasureInfo',
    method: 'post',
    data
  })
}

// 保存聚合
export function saveAggregationOper(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/aggregationOper',
    method: 'post',
    data
  })
}

// 试跑
export function getDolphinsFlowTest(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/dolphinsFlowTest',
    method: 'post',
    data
  })
}

// 试跑日志
export function getDolphinsTestLog(data = {}) {
  return fetch({
    url: '/developTask/developModelFactLogicMulti/dolphinsTestLog',
    method: 'post',
    data
  })
}
