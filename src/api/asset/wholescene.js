/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:03
 * @LastEditTime: 2023-06-19 17:44:55
 * @Description:
 */
import fetch from '@/libs/fetch'

export function getData(data = {}) {
  return fetch({
    url: '/asset/wholescene/getData',
    method: 'post',
    data
  })
}

// 获取全局数据
export function getGlobalData(data = {}) {
  return fetch({
    url: '/asset/wholescene/getGlobalData',
    method: 'post',
    data
  })
}

// 全景--全景总览接口
export function getPanoramicOverviewInfo(data = {}) {
  return fetch({
    url: '/asset/assetPanorama/getPanoramicOverviewInfo',
    method: 'post',
    data
  })
}

// 全景--业务版块视图接口
export function getBusinessPlateViewInfo(data = {}) {
  return fetch({
    url: '/asset/assetPanorama/getBusinessPlateViewInfo',
    method: 'post',
    data
  })
}

// 获取流动数据
export function getFlowData(data = {}) {
  return fetch({
    url: '/asset/wholescene/getFlowData',
    method: 'post',
    data
  })
}

// 全景--流动总表数接口
export function getFlowTablesNumber(data = {}) {
  return fetch({
    url: '/asset/assetPanorama/getFlowTablesNumber',
    method: 'post',
    data
  })
}

// 全景--数据接入进度
export function getDataAccess(data = {}) {
  return fetch({
    url: '/asset/assetPanorama/getDataAccess',
    method: 'post',
    data
  })
}

// 全景--流动数据接入Top5
export function getDataAccessTop5(data = {}) {
  return fetch({
    url: '/asset/assetPanorama/getDataAccessTop5',
    method: 'post',
    data
  })
}

// 全景--流动数据接入Least5
export function getDataAccessLeast5(data = {}) {
  return fetch({
    url: '/asset/assetPanorama/getDataAccessLeast5',
    method: 'post',
    data
  })
}

// 全景--流动数据接入Least5
export function getAssetServiceInfo(data = {}) {
  return fetch({
    url: '/asset/assetPanorama/getAssetServiceInfo',
    method: 'post',
    data
  })
}

// 获取结构列表
export function getStructureList(data = {}) {
  return fetch({
    url: '/asset/wholescene/getStructureList',
    method: 'post',
    data
  })
}

// 获取结构图形数据
export function getStructureGraphicData(data = {}) {
  return fetch({
    url: '/asset/wholescene/getStructureGraphicData',
    method: 'post',
    data
  })
}
