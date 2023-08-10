/*
 * @Author: 大炸鹅
 * @Date: 2023-02-08 17:46:18
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-28 16:34:00
 * @FilePath: \智能数据构建\src\api\rd\exreact\mapping-id.js
 */
import fetch from '@/libs/fetch'

// id中心tree
export function getIdCnterListAll(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/listAll',
    method: 'post',
    data
  })
}

// id映射表
export function getIdMapping(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/getIdMapping',
    method: 'post',
    data
  })
}

// id映射表调度节点
export function getJobs(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/getJobs',
    method: 'post',
    data
  })
}

// 新增
export function insertJobs(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/insert',
    method: 'post',
    data
  })
}

// 编辑
export function editJobs(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/update',
    method: 'post',
    data
  })
}

// 删除
export function delJobs(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/delete',
    method: 'post',
    data
  })
}

// table
export function getJobsListPage(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/listPage',
    method: 'post',
    data
  })
}

// 开启关闭
export function getJobsOpen(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/open',
    method: 'post',
    data
  })
}

// 获取attr详情
export function getQueryByMappingId(data = {}) {
  return fetch({
    url: '/label/TLabelIdMapping/queryById',
    method: 'post',
    data
  })
}