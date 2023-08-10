import fetch from '@/libs/fetch'

// template
export function post(data = {}) {
  return fetch({
    url: '/post/url',
    method: 'post',
    data
  })
}
// template
export function get(data) {
  return fetch({
    url: '/get/url',
    method: 'get',
    params: data
  })
}
// 数据架构-数据板块-列表
export function queryBussinessList(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryBussinessList',
    method: 'post',
    data
  })
}
// 数据架构-数据板块-明细查询
export function queryBussinessById(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryBussinessById',
    method: 'post',
    data
  })
}
// 数据架构-主题域-列表
export function queryDataFieldList(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryDataFieldList',
    method: 'post',
    data
  })
}

// 数据架构-实体-关系图
export function queryEntityRelDiagram(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityRelDiagram',
    method: 'post',
    data
  })
}

// 数据架构-主题域-关系图
export function queryDataFieldRelDiagram(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryDataFieldRelDiagram',
    method: 'post',
    data
  })
}
// 删除
export function deleteplanDataArchitecture(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/delDataField',
    method: 'post',
    data
  })
}
// 板块删除
export function delBussiness(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/delBussiness',
    method: 'post',
    data
  })
}
// 主题域树节点
export function getDataField(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryDataFieldTreeInfo',
    method: 'post',
    data
  })
}
export function saveDataField(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/saveDataField',
    method: 'post',
    data
  })
}
export function editDataField(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/editDataField',
    method: 'post',
    data
  })
}
// 删除
export function delBatchDataField(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/delBatchDataField',
    method: 'post',
    data
  })
}
// 业务板块-新建
export function saveBussiness(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/saveBussiness',
    method: 'post',
    data,
  })
}
// 业务板块-编辑
export function editBussiness(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/editBussiness',
    method: 'post',
    data
  })
}
// 业务板块-用户信息
export function queryUserList(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryUserList',
    method: 'post',
    data
  })
}
//研发规范-天/小时/分钟 业务日期查询
export function queryBizPartition(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryBizPartition',
    method: 'post',
    data
  })
}
//研发规范-数据类型查询
export function queryDataTypeList(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryDataTypeList',
    method: 'post',
    data
  })
}
//研发规范-业务日期格式查询
export function queryBusinessDate(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryBusinessDate',
    method: 'post',
    data
  })
}
//研发规范-天/小时/分钟 业务日期编辑
export function editBizPartiton(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/editBizPartiton',
    method: 'post',
    data
  })
}
//研发规范-表命名规则查询
export function queryTableNameRule(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryTableNameRule',
    method: 'post',
    data
  })
}
//研发规范-表命名规则编辑
export function editTableNameRule(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/editTableNameRule',
    method: 'post',
    data
  })
}
//研发规范-流程管控查询
export function queryProcessControl(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryProcessControl',
    method: 'post',
    data
  })
}
//研发规范-流程管控编辑
export function editProcessControl(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/editProcessControl',
    method: 'post',
    data
  })
}