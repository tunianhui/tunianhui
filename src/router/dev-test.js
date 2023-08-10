/*
 * @Autor: Gang
 * @LastEditors: Gang
 * @Date: 2020-07-31 10:18:28
 * @LastEditTime: 2020-07-31 10:21:16
 * @Description:
 */
export function getList(source, target) {
  source.forEach(item => {
    const temp = {
      menuCode: item.name,
      menuName: item.meta.name,
      btns: '1|2|3|4|5|6',
      tabs: ''
    }
    if (item.children) {
      temp.children = []
      getList(item.children, temp.children)
    }
    target.push(temp)
  })
}

export function getRouteKey(routes, res = []) {
  routes.forEach(r => {
    res.push(r.menuCode)
    if (r.children) {
      getRouteKey(r.children, res)
    }
  })
  return res
}
