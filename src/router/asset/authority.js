const Layout = _ =>
  import(/* webpackChunkName: "Layout" */ '@/views/layout/sidemenu-layout.vue')
const List = _ =>
  import(
    /* webpackChunkName: "asset-authority-list" */ '@/views/asset/authority/list/index.vue'
  )
const Apply = _ =>
  import(
    /* webpackChunkName: "asset-authority-apply" */ '@/views/asset/authority/apply/index.vue'
  )
const Self = _ =>
  import(
    /* webpackChunkName: "asset-authority-self" */ '@/views/asset/authority/self/index.vue'
  )

export default {
  path: '/asset/authority',
  name: 'asset-authority',
  meta: {
    name: '权限',
    sideMenu: true
  },
  component: Layout,
  redirect: '/asset/authority/list',
  children: [
    {
      path: '/asset/authority/list',
      name: 'authority-list',
      meta: {
        name: '权限列表'
      },
      component: List
    },
    {
      path: '/asset/authority/apply',
      name: 'authority-apply',
      meta: {
        name: '权限申请'
      },
      component: Apply
    },
    {
      path: '/asset/authority/self',
      name: 'authority-self',
      meta: {
        name: '我的权限'
      },
      component: Self
    }
  ]
}
