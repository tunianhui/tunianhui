import fetch from '@/libs/fetch'

// 业务板块列表
export function getBusinessList(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusiness',
    method: 'post',
    data
  })
}
// 业务板块新建
export function addBusiness(data = {}) {
  return fetch({
    url: '/plan/planBusiness/saveBusiness',
    method: 'post',
    data
  })
}
// 业务板块修改
export function editBusiness(data = {}) {
  return fetch({
    url: '/plan/planBusiness/editBusiness',
    method: 'post',
    data
  })
}
// 业务板块删除
export function delBusiness(data = {}) {
  return fetch({
    url: '/plan/planBusiness/delBusiness',
    method: 'post',
    data
  })
}
// 获取业务板块参数
export function getBusinessInfo(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusinessInfo',
    method: 'post',
    data
  })
}
// 修改时间分区
export function editPartition(data = {}) {
  return fetch({
    url: '/plan/planBusiness/editParams',
    method: 'post',
    data
  })
}
// 业务日期参数值下拉框列表
export function getBizdateValueList(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listDateBusin',
    method: 'post',
    data
  })
}
// 修改业务日期
export function editBizdate(data = {}) {
  return fetch({
    url: '/plan/planBusiness/editDateBusin',
    method: 'post',
    data
  })
}
// 数据域列表
// export function getTableList(data = {}) {
//   return fetch({
//     url: '/plan/planBusiness/listDataField',
//     method: 'post',
//     data
//   })
// }

// 业务板块--数据域列表-多级
export function getTableList(data = {}) {
  return fetch({
    url: '/plan/planBusiness/dataFieldList',
    method: 'post',
    data
  })
}

// 业务板块--数据域树节点  ---> 主题域
export function getDataField(data = {}) {
  return fetch({
    url: '/plan/planBusiness/queryDataFieldTreeInfo',
    method: 'post',
    data
  })
}

// 数据域创建
export function addDataField(data = {}) {
  return fetch({
    url: '/plan/planBusiness/save',
    method: 'post',
    data
  })
}
// 打开数据域修改弹框获取表单信息
export function queryByDataId(data = {}) {
  return fetch({
    url: '/plan/planBusiness/queryById',
    method: 'post',
    data
  })
}
// 数据域修改
export function editDataField(data = {}) {
  return fetch({
    url: '/plan/planBusiness/edit',
    method: 'post',
    data
  })
}
// 数据域删除
export function delDataField(data = {}) {
  return fetch({
    url: '/plan/planBusiness/del',
    method: 'post',
    data
  })
}
// 相关项目
export function getBusiProject(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusiProject',
    method: 'post',
    data
  })
}
