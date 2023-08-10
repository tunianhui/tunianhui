import fetch from '@/libs/fetch'

// 标签类目--tree
export function getTabCategoryList(data) {
  return fetch({
    url: '/label/TLabelLcCategory/list',
    method: 'post',
    data
  })
}

// 标签类目--新增
export function addCategory(data) {
  return fetch({
    url: '/label/TLabelLcCategory/insert',
    method: 'post',
    data
  })
}

// 标签类目--编辑
export function editCategory(data) {
  return fetch({
    url: '/label/TLabelLcCategory/update',
    method: 'post',
    data
  })
}

// 标签类目--删除
export function deleteCategory(data) {
  return fetch({
    url: '/label/TLabelLcCategory/delete',
    method: 'post',
    data
  })
}

// 工厂标签--详情
export function queryLabelConfigurationPreview(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/queryLabelConfigurationPreview',
    method: 'post',
    data
  })
}

// 数据来源--行为筛选
export function getBcFieldInfo(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/getBcFieldInfo',
    method: 'post',
    data
  })
}

// 动作对象|行为属性筛选
export function getBcActAndAttrInfo(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/getBcActAndAttrInfo',
    method: 'post',
    data
  })
}

// 共有属性对象筛选
export function getSameObjectAttr(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/getSameObjectAttr',
    method: 'post',
    data
  })
}

// 共有属性映射规则
export function getMappingRules(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/getMappingRules',
    method: 'post',
    data
  })
}

// 时间跨度
export function getSpanDay(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/getSpanDay',
    method: 'post',
    data
  })
}

// 第二权重信息
export function getSameBehaviorAttr(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/getSameBehaviorAttr',
    method: 'post',
    data
  })
}

// step1确定 || 标签生成规则配置
export function labelConfiguration(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/labelConfiguration',
    method: 'post',
    data
  })
}

// 编辑规则配置
export function queryLabelRuleConfigurationBySource(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/queryLabelRuleConfigurationBySource',
    method: 'post',
    data
  })
}

// step2保存
export function labelGenerationRuleConfigSubmit(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/labelGenerationRuleConfigSubmit',
    method: 'post',
    data
  })
}

// 删除配置
export function deleteLabelRuleConfigBySource(data) {
  return fetch({
    url: '/label/TLabelRuleConfiguration/deleteLabelRuleConfigBySource',
    method: 'post',
    data
  })
}

// 配置提交
export function publish(data) {
  return fetch({
    url: '/label/TLabelLcBase/publish',
    method: 'post',
    data
  })
}

// 工厂标签下线
export function offLine(data) {
  return fetch({
    url: '/label/TLabelLcBase/offLine',
    method: 'post',
    data
  })
}

// 工厂标签删除
export function deleteTag(data) {
  return fetch({
    url: '/label/TLabelLcBase/delete',
    method: 'post',
    data
  })
}

// 工厂标签--树
export function getFactoryLabelList(data) {
  return fetch({
    url: '/label/TLabelLcBase/list',
    method: 'post',
    data
  })
}

// 工厂标签--修改
export function update(data) {
  return fetch({
    url: '/label/TLabelLcBase/update',
    method: 'post',
    data
  })
}

// 工厂标签--新增
export function insert(data) {
  return fetch({
    url: '/label/TLabelLcBase/insert',
    method: 'post',
    data
  })
}

// 标签逻辑表--树
export function getTreeData(data) {
  return fetch({
    url: '/label/TLabelLcLogic/list',
    method: 'post',
    data
  })
}

//  标签类目列表
export function queryCategory(data) {
  return fetch({
    url: '/label/TLabelLcCategory/queryCategory',
    method: 'post',
    data
  })
}

//  工厂标签列表
export function queryFactoryList(data) {
  return fetch({
    url: '/label/TLabelLcLogic/queryById',
    method: 'post',
    data
  })
}

//  手工标签列表
export function queryManualList(data) {
  return fetch({
    url: '/label/TLabelLcManual/queryById',
    method: 'post',
    data
  })
}

//  来源物理表列表
export function queryListSrcTab(data) {
  return fetch({
    url: '/label/TLabelLcManual/listSrcTab',
    method: 'post',
    data
  })
}

//  编辑手工标签
export function editManual(data) {
  return fetch({
    url: '/label/TLabelLcManual/mod',
    method: 'post',
    data
  })
}

//  删除手工标签
export function delManual(data) {
  return fetch({
    url: '/label/TLabelLcManual/del',
    method: 'post',
    data
  })
}

//  根据类目查询标签
export function queryLabelByCategoryId(data) {
  return fetch({
    url: '/label/TLabelLcCategory/queryLabelByCategoryId',
    method: 'post',
    data
  })
}

//  标签批量隐藏/公开
export function authStatusOper(data) {
  return fetch({
    url: '/label/TLabelLcCategory/authStatusOper',
    method: 'post',
    data
  })
}

//  标签分类
export function classifyOper(data) {
  return fetch({
    url: '/label/TLabelLcCategory/classifyOper',
    method: 'post',
    data
  })
}

//  来源表字段
export function getTabCol(data) {
  return fetch({
    url: '/label/TLabelLcManual/getTabCol',
    method: 'post',
    data
  })
}

//  校验新增手工标签名称是否存在
export function isLabelExists(data) {
  return fetch({
    url: '/label/TLabelLcManual/isLabelExists',
    method: 'post',
    data
  })
}

// 新增手工标签
export function addManual(data) {
  return fetch({
    url: '/label/TLabelLcManual/add',
    method: 'post',
    data
  })
}

// 新增手工标签历史已添加列表
export function getHistroyList(data) {
  return fetch({
    url: '/label/TLabelLcManual/listHisLabel',
    method: 'post',
    data
  })
}

// IDtype 
export function getIdType(data) {
  return fetch({
    url: '/label/TLabelLcManual/getIdType',
    method: 'post',
    data
  })
}