/*
 * @Author: 大炸鹅
 * @Date: 2023-02-13 14:59:04
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-05 09:53:36
 * @FilePath: \dataphin\src\api\asset\map.js
 */
/*
 * @Author: 大炸鹅
 * @Date: 2023-02-13 14:59:04
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-27 09:28:48
 * @FilePath: \数据智能构建\src\api\asset\map.js
 */
import fetch from '@/libs/fetch'

// 首页-欢迎信息
export function getWelcomeInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueHome/getWelcomeInfo',
    method: 'post',
    data
  })
}

// 首页-全局搜索
export function getGobalSerachList(data = {}) {
  return fetch({
    url: '/asset/catalogueHome/getGobalSerachList',
    method: 'post',
    data
  })
}

// 首页-全局搜索-new
export function getGobalSerachListNew(data = {}) {
  return fetch({
    url: '/asset/catalogueHome/fullSearch',
    method: 'post',
    data
  })
}

// 用户搜索历史
export function getUserSearchHistory(data = {}) {
  return fetch({
    url: '/assetMap/getSerachHisByUser',
    method: 'post',
    data
  })
}

// 检索关键字
export function getRelated(data = {}) {
  return fetch({
    url: '/assetMap/related',
    method: 'post',
    data
  })
}

// 全局搜索历史
export function getGlobalRelated(data = {}) {
  return fetch({
    url: '/assetMap/getSerachHisByGlobal',
    method: 'post',
    data
  })
}

// 清空搜索历史
export function getClearHistory(data = {}) {
  return fetch({
    url: '/assetMap/delHisByGlobal',
    method: 'post',
    data
  })
}

// 获取业务板块列表
export function getListBusiness(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusiness',
    method: 'post',
    data
  })
}

export function getListBusinessNew(data = {}) {
  return fetch({
    url: '/asset/catalogueHome/listBusiness',
    method: 'post',
    data
  })
}

// 获取数据域
export function getMetaDataField(data = {}) {
  return fetch({
    url: '/assetMap/getMetaDataField',
    method: 'post',
    data
  })
}

// 获取维度
export function getMetaDimension(data = {}) {
  return fetch({
    url: '/assetMap/getMetaDimension',
    method: 'post',
    data
  })
}

// 获取业务过程
export function getMetaBusinessProcess(data = {}) {
  return fetch({
    url: '/assetMap/getMetaBusinessProcess',
    method: 'post',
    data
  })
}

// 获取足迹列表
export function getListTrail(data = {}) {
  return fetch({
    url: '/asset/catalogueHome/listTrail',
    method: 'post',
    data
  })
}

// 获取收藏列表
export function getListCollect(data = {}) {
  return fetch({
    url: '/asset/catalogueHome/listCollect',
    method: 'post',
    data
  })
}

// 设置收藏
export function setCollect(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/setCollect',
    method: 'post',
    data
  })
}

// 获取热门
export function getListHot(data = {}) {
  return fetch({
    url: '/asset/catalogueHome/listHot',
    method: 'post',
    data
  })
}

// 左侧检索条件
export function getSearchParams(data = {}) {
  return fetch({
    url: '/assetMap/listParams',
    method: 'post',
    data
  })
}

// 获取搜索结果
export function getSearchResult(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/listPage',
    method: 'post',
    data
  })
}

// 获取搜索结果历史保存
export function getSearchResultSave(data = {}) {
  return fetch({
    url: '/assetMap/saveSerachHis',
    method: 'post',
    data
  })
}

// 详细信息
export function getDetails(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/queryById',
    method: 'post',
    data
  })
}

// 血缘关系
export function getConsanguinity(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/consanguinity',
    method: 'post',
    data
  })
}

// 血缘关系下游
export function getNextConsanguinity(data = {}) {
  return fetch({
    url: '/assetMap/nextConsanguinity',
    method: 'post',
    data
  })
}

// 分区信息
export function getPartitionInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/getPartitionInfo',
    method: 'post',
    data
  })
}

// 产出信息
export function getOutputInfo(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/getOutputInfo',
    method: 'post',
    data
  })
}

// 数据预览
export function getPreviewData(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/previewData',
    method: 'post',
    data
  })
}

// 存储类型
export function getSourceType(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/getSourceType',
    method: 'post',
    data
  })
}

// 数据表影响
export function queryTableEffectList(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/queryTableEffectList',
    method: 'post',
    data
  })
}

// 集成同步影响
export function queryCorpusSyncEffectList(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/queryCorpusSyncEffectList',
    method: 'post',
    data
  })
}

// 新增使用说明
export function saveUseDesc(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/saveUseDesc',
    method: 'post',
    data
  })
}

// 使用说明列表
export function queryByCubeId(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/queryByCubeId',
    method: 'post',
    data
  })
}

// 使用说明列表
export function editUseDesc(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/editUseDesc',
    method: 'post',
    data
  })
}

// 使用说明删除
export function deleteUseDesc(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/deleteUseDesc',
    method: 'post',
    data
  })
}

// 数据表类型
export function queryObjectType(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/queryObjectType',
    method: 'post',
    data
  })
}

// 数据表名称
export function queryMetaTable(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/queryMetaTable',
    method: 'post',
    data
  })
}

// 数据表同步
export function saveMetaSync(data = {}) {
  return fetch({
    url: '/asset/catalogueDataTable/metaSync',
    method: 'post',
    data
  })
}