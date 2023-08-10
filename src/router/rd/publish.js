/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:45
 * @LastEditTime: 2022-08-22 16:00:19
 * @Description:
 */
// const WrapperView = { render: c => c('router-view') }
const Layout = _ =>
  import(/* webpackChunkName: "Layout" */ '@/views/layout/sidemenu-layout.vue')

const ToIssue = _ =>
  import(
    /* webpackChunkName: "publish-to-issue" */ '@/views/rd/publish/to-issue/index.vue'
  )
const RecodeIssue = _ =>
  import(
    /* webpackChunkName: "publish-recode-issue" */ '@/views/rd/publish/recode-issue/index.vue'
  )

const Form = _ =>
  import(
    /* webpackChunkName: "publish-form" */ '@/views/rd/publish/form/index.vue'
  )
const FormList = _ =>
  import(
    /* webpackChunkName: "publish-form-list" */ '@/views/rd/publish/formList/index.vue'
  )

export default {
  path: '/rd/publish',
  name: 'publish',
  meta: {
    name: '发布',
    href: '/rd/publish',
    sideMenu: true
  },
  component: Layout,
  redirect: '/rd/publish/to-issue',
  children: [
    {
      path: '/rd/publish/to-issue',
      name: 'to-issue',
      meta: {
        name: '待发布对象',
        icon: 'iconfont icon-daifabu'
      },
      component: ToIssue
    },
    {
      path: '/rd/publish/recode-issue',
      name: 'recode-issue',
      meta: {
        name: '发布记录',
        icon: 'iconfont icon-fabujilu'
      },
      component: RecodeIssue
    },
    {
      path: '/rd/publish/formlist',
      name: 'form-list',
      meta: {
        name: '表单列表',
        icon: 'iconfont icon-fabujilu'
      },
      component: FormList
    },
    {
      path: '/rd/publish/form',
      name: 'form-design',
      meta: {
        name: '表单设计器',
        icon: 'iconfont icon-fabujilu'
      },
      component: Form
    }
  ]
}
