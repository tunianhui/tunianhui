/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:45
 * @LastEditTime: 2023-06-26 15:16:12
 * @Description:
 */
import {iconMap, types} from '@/config/rd-config'

const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(/* webpackChunkName: "DevLayout" */ '@/views/rd/integrate/index.js')

const SyncTask = _ =>
  import(
    /* webpackChunkName: "data-process-sync-task" */ '@/views/rd/integrate/sync-task/index.vue'
  )

export default {
  path: '/rd/integrate',
  name: 'integrate',
  meta: {
    name: '集成',
    href: '/rd/integrate',
    sideMenu: true
  },
  component: Layout,
  redirect: '/rd/integrate/data-process',
  children: [
    {
      path: '/rd/integrate/data-process',
      name: 'data-process',
      meta: {
        name: '数据处理'
      },
      component: WrapperView,
      redirect: '/rd/integrate/sync-task',
      children: [
        {
          path: '/rd/integrate/sync-task',
          name: types.SYNCTASK,
          meta: {
            name: '离线管道',
            ...iconMap[types.SYNCTASK]
          },
          component: SyncTask
        }
      ]
    }
  ]
}
