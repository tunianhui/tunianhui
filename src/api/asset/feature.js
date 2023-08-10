/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-20 17:23:18
 * @LastEditTime: 2023-05-04 11:03:33
 * @Description:
 */

import fetch from '@/libs/fetch'

// 公共接口
export function getDictList (data = {dict_type: 'umb_recognize_type'}) {
  return fetch({
    url: '/umbrella/common/getDictList',
    method: 'post',
    data
  })
}

// --------- 识别特征 ----------
// 获取识别特征列表
export function getIdentifyList (data = {}) {
  return fetch({
    url: '/umbrella/identify/queryPagedIdentifys',
    method: 'post',
    data
  })
}

// 添加识别特征
export function saveIdentify (data = {}) {
  return fetch({
    url: '/umbrella/identify/save',
    method: 'post',
    data
  })
}

// 获取识别特征
export function getIdentify (data = {}) {
  return fetch({
    url: '/umbrella/identify/queryById',
    method: 'get',
    data
  })
}

// 删除识别特征
export function delIdentify (data = {}) {
  return fetch({
    url: '/umbrella/identify/deleteById',
    method: 'post',
    data
  })
}

// --------- 模板管理 ----------
// 获取模板列表
export function getTemplateConfs (data = {}) {
  return fetch({
    url: '/umbrella/templateConf/queryTemplateConfs',
    method: 'post',
    data
  })
}

// 主用 设置主模板
export function masterTemplate (data = {}) {
  return fetch({
    url: '/umbrella/templateConf/master',
    method: 'post',
    data
  })
}

// 获取详情
export function getTemplateDetail (data = {}) {
  return fetch({
    url: '/umbrella/templateDetail/queryClassifyTree',
    method: 'post',
    data
  })
}

// 复制
export function copyTemplate (data = {}) {
  return fetch({
    url: '/umbrella/templateConf/copy',
    method: 'post',
    data
  })
}
