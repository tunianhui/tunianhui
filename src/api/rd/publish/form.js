import fetch from '@/libs/fetch'

// 表单设计-保存
export function saveForm(data = {}) {
  return fetch({
    url: '/dynamicForm/save',
    method: 'post',
    data
  })
}

// 表单设计-修改
export function editForm(data = {}) {
  return fetch({
    url: '/dynamicForm/edit',
    method: 'post',
    data
  })
}

// 表单设计-删除
export function delForm(data = {}) {
  return fetch({
    url: '/dynamicForm/delete',
    method: 'post',
    data
  })
}

// 表单设计-列表
export function getFormList(data = {}) {
  return fetch({
    url: '/dynamicForm/list',
    method: 'post',
    data
  })
}

// 表单设计-获取表单模板  modelKey
export function getFormAll(data = {}) {
  return fetch({
    url: '/dynamicForm/getFormAll',
    method: 'post',
    data
  })
}

// 表单设计-id查询  id
export function getFormById(data = {}) {
  return fetch({
    url: '/dynamicForm/queryById',
    method: 'post',
    data
  })
}
