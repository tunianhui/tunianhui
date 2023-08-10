import {
  Random
} from 'mockjs'
// import {
//   getRangeDates
// } from '@/libs/util'
import fetch from '@/libs/fetch'

const setData = data =>
  new Promise((resolve, reject) => {
    resolve(data)
  })

// const getTreeList = data =>
//   setData({
//     flag: true,
//     data: Array.from({
//       length: 3
//     }, d => ({
//       id: Random.id(),
//       name: JSON.stringify(data) !== '{}' ? Random.pick(data) : Random.pick(['标准类目', '地图类目', '目录类目']),
//       type: 0,
//       total: 4,
//       children: Array.from({
//         length: 4
//       }, d => ({
//         id: Random.id(),
//         name: Random.name(),
//         type: 0,
//         total: 4,
//         children: Array.from({
//           length: 4
//         }, d => ({
//           id: Random.id(),
//           name: Random.name(),
//           type: 1
//         }))
//       }))
//     }))
//   })

const getInfo = _ =>
  setData({
    flag: true,
    data: {
      name: Random.name()
      // number: Random.float(0, 100, 2, 2),
      // desc: Random.name(),
      // classifAttr: ''
      // tableCount: Random.integer(0, 10),
      // tableCountChange: Random.float(0, 100, 2, 2) + '%',
      // strongErrorCount: Random.integer(0, 10),
      // strongErrorCountChange: Random.float(0, 100, 2, 2) + '%',
      // weakErrorCount: Random.integer(0, 10),
      // weakErrorCountChange: Random.float(0, 100, 2, 2) + '%'
      // trend: Random.pick(['top', 'bottom']),
    }
  })

// 类目定义--树
export function getTreeData(data = {}) {
  return fetch({
    url: '/standardCatalogManagement/listTree',
    method: 'post',
    data
  })
}
// 类目定义--新增
export function addCatalog(data = {}) {
  return fetch({
    url: '/standardCatalogManagement/save',
    method: 'post',
    data
  })
}
// 类目定义--编辑
export function editCatalog(data = {}) {
  return fetch({
    url: '/standardCatalogManagement/edit',
    method: 'post',
    data
  })
}
// 类目定义--删除
export function delCatalog(data = {}) {
  return fetch({
    url: '/standardCatalogManagement/delete',
    method: 'post',
    data
  })
}
// 类目定义--全部
export function getAllCatalog(data = {}) {
  return fetch({
    url: '/standardCatalogManagement/listAll',
    method: 'post',
    data
  })
}

export function getAttrData(data = {}) {
  return getInfo(data)
}
