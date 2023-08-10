import fetch from '@/libs/fetch'

// 数据节点列表
export function getTreeDataList(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/list',
    method: 'post',
    data
  })
}

// 文件查询
export function getFileInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/queryById',
    method: 'post',
    data
  })
}

// 移动文件
export function moveFileOrFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/moveFileOrFolder',
    method: 'post',
    data
  })
}

// 重命名
export function getRename(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/renameFileOrFolder',
    method: 'post',
    data
  })
}

// 新建文件夹
export function getNewSaveFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/saveFolder',
    method: 'post',
    data
  })
}

// 新建文件
export function getNewSaveFile(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/saveFile',
    method: 'post',
    data
  })
}

// 删除文件、文件夹
export function getDeleleFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/deleteFileOrFolder',
    method: 'post',
    data
  })
}

// 执行
export function getCodeExecute(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/codeExec',
    method: 'post',
    data
  })
}

// 预编译
export function getCodeCheck(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/codeCheck',
    method: 'post',
    data
  })
}

// 保存文件内容
export function getEditFile(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/editFile',
    method: 'post',
    data
  })
}

// 编辑调度配置
export function getDispatchEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/dispatchEdit',
    method: 'post',
    data
  })
}

// 下线
export function getOffline(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/offLine',
    method: 'post',
    data
  })
}

// 发布
export function getSubmit(data = {}) {
  return fetch({
    url: '/developTask/developModelCodeTask/submit',
    method: 'post',
    data
  })
}
