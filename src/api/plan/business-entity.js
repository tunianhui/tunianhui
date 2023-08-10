import fetch from '@/libs/fetch'

// 列表
export function getQueryEntityList(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityList',
    method: 'post',
    data
  })
}


// 关系图
export function getQueryEntityRelDiagramt(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityRelDiagram',
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
// 上线
export function entityPublish(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/entityPublish',
    method: 'post',
    data
  })
}
// 下线
export function entityOffLine(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/entityOffLine',
    method: 'post',
    data
  })
}

// 
// 批量上线
export function entityBatchPublish(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/entityBatchPublish',
    method: 'post',
    data
  })
}
// 批量下线
export function entityBatchOffLine(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/entityBatchOffLine',
    method: 'post',
    data
  })
}
// 批量下线
export function delBatchEntity(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/delBatchEntity',
    method: 'post',
    data
  })
}
// 下线并删除
export function delEntity(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/delEntity',
    method: 'post',
    data
  })
}
//弹窗选择
export function queryEntityRel(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityRel',
    method: 'post',
    data
  })
}

//实体类型
export function queryEntityTypeList(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityTypeList',
    method: 'post',
    data
  })
}
// 业务实体新增
export function saveEntity(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/saveEntity',
    method: 'post',
    data
  })
}
//实体编辑
export function editEntity(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/editEntity',
    method: 'post',
    data
  })
}
//负责人
export function queryUserList(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryUserList',
    method: 'post',
    data
  })
}
//主题域树节点
export function queryDataFieldTreeInfo(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryDataFieldTreeInfo',
    method: 'post',
    data
  })
}

//数据回显

export function queryEntityById(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityById',
    method: 'post',
    data
  })
}


// 版本信息

export function queryEntityVersionList(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityVersionList',
    method: 'post',
    data
  })
}

// 版本详情

export function queryEntityVersionDetail(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityVersionDetail',
    method: 'post',
    data
  })
}

// 版本号

export function queryEntityVersionNum(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryEntityVersionNum',
    method: 'post',
    data
  })
}

// 项目关联

export function queryProject(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryProject',
    method: 'post',
    data
  })
}

// 相关逻辑表
export function queryRelLogicTable(data = {}) {
  return fetch({
    url: '/plan/planDataArchitecture/queryRelLogicTable',
    method: 'post',
    data
  })
}
