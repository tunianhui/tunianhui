
export const types = {
  // 开发
  APICREATE: 'apiCreate',
  REGISTER: 'register',
  FUNC: 'func',
  ARRANGE: 'arrange',
  FLOW: 'flow',
  APIMARKET: 'apiMarket',
  APISERVER: 'apiServer',
  OBJECTTABLE: 'objectTable'
}

export const iconMap = {
  // API生成
  [types.APICREATE]: {
    icon: 'iconfont icon-APIshengcheng2',
    color: ''
  },

  // API注册
  [types.REGISTER]: {
    icon: 'iconfont icon-APIzhuce2',
    color: ''
  },

  // 函数
  [types.FUNC]: {
    icon: 'iconfont icon-hanshu3',
    color: ''
  },

  // 服务编排
  [types.ARRANGE]: {
    icon: 'iconfont icon-fuwubianpai1',
    color: ''
  },

  // 业务流程
  [types.FLOW]: {
    icon: 'iconfont icon-yewuliucheng',
    color: ''
  }
}

// 页面获取树的数据的type
export const treeTypes = {
  // Api生成
  [types.APICREATE]: 10,
  // Api注册
  [types.REGISTER]: 11,
  // 函数
  [types.FUNC]: 12,
  // 服务编排
  [types.ARRANGE]: 13,
  // 业务流程
  [types.FLOW]: 14
}

// 是否累加
export const cumulTags = { 0: '是', 1: '否' }
