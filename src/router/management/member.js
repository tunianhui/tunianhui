/*
 * @Author: 大炸鹅
 * @Date: 2023-07-27 15:19:14
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-28 09:36:02
 * @FilePath: \智能数据构建\src\router\management\member.js
 */

const WrapperView = {render: c => c('router-view')}
const Layout = _ =>
  import(/* webpackChunkName: "Layout" */ '@/views/management/layout/index')

const User = _ =>
  import(/* webpackChunkName: "User" */ '@/views/management/member/user/index.vue')

const Role = _ =>
  import(/* webpackChunkName: "Role" */ '@/views/management/member/role/index.vue')
export default {
  path: '/management/member',
  name: 'member',
  meta: {
    name: '成员管理',
    icon: 'iconfont icon-chengyuanguanli',
    sideMenu: true
  },
  redirect: '/management/member/account',
  component: Layout,
  children: [
    {
      path: '/management/member/account',
      name: 'account',
      meta: {
        name: '账号管理',
        jump: false
      },
      redirect: '/management/member/account/user',
      component: WrapperView,
      children: [
        {
          path: '/management/member/account/user',
          name: 'usermanage',
          meta: {
            name: '成员管理',
            icon: 'iconfont icon-guanliyuan1'
          },
          component: User
        },
        {
          path: '/management/member/account/role',
          name: 'role',
          meta: {
            name: '角色管理',
            icon: 'iconfont icon-jiaoseguanli'
          },
          component: Role
        }
      ]
    },
  ]
}