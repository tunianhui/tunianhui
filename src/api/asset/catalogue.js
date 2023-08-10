/*
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-07-20 13:37:29
 * @LastEditTime: 2021-07-30 16:31:14
 * @Description:
 */
import fetch from '@/libs/fetch'

// 所属类目
export function getCategoryList(data = {}) {
  return fetch({
    url: '/catalogManagement/listAll',
    method: 'post',
    data
  })
}

// 数据表管理列表
export function getDataTableList(data = {}) {
  return fetch({
    url: '/tableManagement/listPage',
    method: 'post',
    data
  })
}

// 数据表管理 - 修改
export function editDataTable(data = {}) {
  return fetch({
    url: '/tableManagement/edit',
    method: 'post',
    data
  })
}

// 文件管理列表
export function getFileList(data = {}) {
  return fetch({
    url: '/fileManagement/listPage',
    method: 'post',
    data
  })
}

// 文件管理 - 上传文件
export function importFile(data = {}) {
  return fetch({
    url: '/fileManagement/importFile',
    method: 'post',
    data,
    type: 'upload'
  })
}

// 文件管理 - 修改
export function editFile(data = {}) {
  return fetch({
    url: '/fileManagement/edit',
    method: 'post',
    data
  })
}

// 文件管理 - 删除
export function deleteFile(data = {}) {
  return fetch({
    url: '/fileManagement/delete',
    method: 'post',
    data
  })
}

// 文件管理 - 下载
export function downFile(data = {}) {
  return fetch({
    url: '/fileManagement/downFile',
    method: 'get',
    data
  })
}

// API管理 - 列表
export function getApiList(data = {}) {
  return fetch({
    url: '/apiManagement/listPage',
    method: 'post',
    data
  })
}
// API管理 - 修改
export function editApi(data = {}) {
  return fetch({
    url: '/apiManagement/edit',
    method: 'post',
    data
  })
}

// 类目管理-tree
export function getCatalogList(data = {}) {
  return fetch({
    url: '/catalogManagement/listTree',
    method: 'post',
    data
  })
}

// 类目管理-新增
export function saveCatalog(data = {}) {
  return fetch({
    url: '/catalogManagement/save',
    method: 'post',
    data
  })
}

// 类目管理-修改
export function editCatalog(data = {}) {
  return fetch({
    url: '/catalogManagement/edit',
    method: 'post',
    data
  })
}

// 类目管理-删除
export function deleteCatalog(data = {}) {
  return fetch({
    url: '/catalogManagement/delete',
    method: 'post',
    data
  })
}

// 类目管理-数据表列表
export function tableListPageByCatalog(data = {}) {
  return fetch({
    url: '/tableManagement/listPageByCatalog',
    method: 'post',
    data
  })
}

// 类目管理-数据表修改类目
export function tableEditCatalog(data = {}) {
  return fetch({
    url: '/tableManagement/editCatalog',
    method: 'post',
    data
  })
}

// 类目管理-数据表-加入数据表列表
export function tableListPageNoCatalog(data = {}) {
  return fetch({
    url: '/tableManagement/listPageNoCatalog',
    method: 'post',
    data
  })
}

// 类目管理-数据表-加入数据表保存
export function tableBatchSaveByCatalog(data = {}) {
  return fetch({
    url: '/tableManagement/batchSaveByCatalog',
    method: 'post',
    data
  })
}

// 类目管理-文件列表
export function fileListPageByCatalog(data = {}) {
  return fetch({
    url: '/fileManagement/listPageByCatalog',
    method: 'post',
    data
  })
}

// 类目管理-文件修改类目
export function fileEditCatalog(data = {}) {
  return fetch({
    url: '/fileManagement/editCatalog',
    method: 'post',
    data
  })
}

// 类目管理-文件-加入文件列表
export function fileListPageNoCatalog(data = {}) {
  return fetch({
    url: '/fileManagement/listPageNoCatalog',
    method: 'post',
    data
  })
}

// 类目管理-文件-加入文件保存
export function fileBatchSaveByCatalog(data = {}) {
  return fetch({
    url: '/fileManagement/batchSaveByCatalog',
    method: 'post',
    data
  })
}

// 类目管理-api列表
export function apiListPageByCatalog(data = {}) {
  return fetch({
    url: '/apiManagement/listPageByCatalog',
    method: 'post',
    data
  })
}

// 类目管理-api修改类目
export function apiEditCatalog(data = {}) {
  return fetch({
    url: '/apiManagement/editCatalog',
    method: 'post',
    data
  })
}

// 类目管理-api_加入api列表
export function apiListPageNoCatalog(data = {}) {
  return fetch({
    url: '/apiManagement/listPageNoCatalog',
    method: 'post',
    data
  })
}

// 类目管理-api-加入api保存
export function apiBatchSaveByCatalog(data = {}) {
  return fetch({
    url: '/apiManagement/batchSaveByCatalog',
    method: 'post',
    data
  })
}
