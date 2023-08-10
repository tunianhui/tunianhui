import fetch from '@/libs/fetch'

// --------------  服务开发 -----------

// 树列表 -- 服务
export function getTreeData(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/listApiTree', // type 生成  注册  函数  编排
    method: 'post',
    data
  })
}

// --------------  服务开发 -----------
// api列表
export function getApiList(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/listApi',
    method: 'post',
    data
  })
}

// api删除
export function getDelApi(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/delApi',
    method: 'post',
    data
  })
}

// api下线
export function getOffline(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/offline',
    method: 'post',
    data
  })
}

// api分组列表
export function getApiGroup(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/listGroup',
    method: 'post',
    data
  })
}

// api分组新建
export function getSaveGroupp(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/saveGroup',
    method: 'post',
    data
  })
}

// api分组修改
export function getEditGroupp(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/editGroup',
    method: 'post',
    data
  })
}

// api分组删除
export function getDelGroup(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/delGroup',
    method: 'post',
    data
  })
}

// 数据源类型
// export function getDataSource(data = {}) {
//   return fetch({
//     url: '/plan/planDatasource/list',
//     method: 'post',
//     data
//   })
// }

// 数据源
export function getDataSource(data = {}) {
  return fetch({
    url: '/plan/planDatasource/listByProject',
    method: 'post',
    data
  })
}

// 保存
export function getSaveApi(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/saveOrUpdateApi',
    method: 'post',
    data
  })
}

// 生成参数
export function getGenerateParams(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/generateParams',
    method: 'post',
    data
  })
}

// 获取返回数据
export function getRelease(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/release',
    method: 'post',
    data
  })
}

// api测试
export function getTestApi(data = {}) {
  return fetch({
    url: '/dataservice/serivceDevelop/testApi',
    method: 'post',
    data
  })
}

// 应用分组
export function getAppGroup(data = {}) {
  return fetch({
    url: '/dataservice/platformManager/group/appgrouplist',
    method: 'post',
    data
  })
}

// 新建应用分组
export function getAddAppGroup(data = {}) {
  return fetch({
    url: '/dataservice/platformManager/group/saveappgroup',
    method: 'post',
    data
  })
}

// 编辑应用分组
export function getEditAppGroup(data = {}) {
  return fetch({
    url: '/dataservice/platformManager/group/editappgroup',
    method: 'post',
    data
  })
}

// 删除应用分组
export function getDeleteAppGroup(data = {}) {
  return fetch({
    url: '/dataservice/platformManager/group/delappgroup',
    method: 'post',
    data
  })
}

// app应用列表
export function getAppList(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/applist',
    method: 'post',
    data
  })
}

// app应用编辑
export function editApp(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/editapp',
    method: 'post',
    data
  })
}

// app应用新建
export function newCreatedApp(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/addapp',
    method: 'post',
    data
  })
}

// app应用删除
export function delApp(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/delapp',
    method: 'post',
    data
  })
}

// 成员管理批量删除
export function deleteBatchUser(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appuser/batchDelUser',
    method: 'post',
    data
  })
}

// 成员管理删除
export function deleteUser(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appuser/deluser',
    method: 'post',
    data
  })
}

// 添加成员
export function addUser(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appuser/adduser',
    method: 'post',
    data
  })
}

// 修改成员
export function editUser(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appuser/edituser',
    method: 'post',
    data
  })
}

// 成员管理列表
export function getUserList(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appuser/appUserlist',
    method: 'post',
    data
  })
}

// 成员管理删除
export function delUser(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appuser/deluser',
    method: 'post',
    data
  })
}

// 所有成员
export function getAllUserList(data = {}) {
  return fetch({
    url: '/dataservice/platformManager/user/getAllUser',
    method: 'post',
    data
  })
}

// 所有成员角色
export function getAllRole(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appuser/getAllAppUsers',
    method: 'post',
    data
  })
}

// 监控运维列表
export function getSerivceMonitorList(data = {}) {
  return fetch({
    url: '/dataservice/serivceMonitor/list',
    method: 'post',
    data
  })
}

// 监控运维近1小时情况
export function getExceptionRate(data = {}) {
  return fetch({
    url: '/dataservice/serivceMonitor/detail',
    method: 'post',
    data
  })
}

// API授权列表
export function getApiGrantList(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/list',
    method: 'post',
    data
  })
}

// API授权删除
export function delApiGrant(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/del',
    method: 'post',
    data
  })
}

// API权限字段列表
export function getGrantFieldList(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/getApiReturnFields',
    method: 'post',
    data
  })
}

// API权限申请
export function getSubmit(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/applyApi',
    method: 'post',
    data
  })
}

// API权限申请编辑-申请数据
export function getApplyApiData(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/getApplyApiData',
    method: 'post',
    data
  })
}

// API权限编辑
export function editApply(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/edit',
    method: 'post',
    data
  })
}

// API市场列表
export function getApimarketList(data = {}) {
  return fetch({
    url: '/dataservice/apimarket/apilist',
    method: 'post',
    data
  })
}

// API文档信息
export function getApiDocumentInfo(data = {}) {
  return fetch({
    url: '/dataservice/apimarket/apidoc',
    method: 'post',
    data
  })
}

// 申请API-应用列表
export function getApplyAppList(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/getAppList',
    method: 'post',
    data
  })
}

// 申请API-Api列表
export function getApplyApList(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/getApiListOnline',
    method: 'post',
    data
  })
}

// API调试数据
export function getApiByIdInfo(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/getApiById',
    method: 'post',
    data
  })
}

// API调试结果
export function getApiDebug(data = {}) {
  return fetch({
    url: '/dataservice/personConsole/appCenter/appApi/debug',
    method: 'post',
    data
  })
}

// 监控运维-限流数据
export function getBolckInfo(data = {}) {
  return fetch({
    url: '/dataservice/serivceMonitor/getBolckInfo',
    method: 'post',
    data
  })
}

// 监控运维-限流数据保存
export function saveBolckInfo(data = {}) {
  return fetch({
    url: '/dataservice/serivceMonitor/saveBlockRule',
    method: 'post',
    data
  })
}
