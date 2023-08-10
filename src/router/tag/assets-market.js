/*
 * @Author: 大炸鹅
 * @Date: 2023-02-02 11:47:30
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-06 10:06:38
 * @FilePath: \数据智能构建\src\router\tag\assets-market.js
 */
/*
 * @Author: 大炸鹅
 * @Date: 2023-02-02 11:47:30
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-06 09:26:08
 * @FilePath: \数据智能构建\src\router\tag\assets-market.js
 */
const AssetMarket = _ =>
  import(
    /* webpackChunkName: "sidemenu-layout" */ '@/views/tag/asset-market/index.vue'
  )

const WrapperView = {render: c => c('router-view')}
export default [
  {
    path: '/tag/asset-market',
    name: 'asset-market',
    meta: {
      name: '资产市场',
      sideMenu: true,
      // href: '/tag/asset-market'
    },
    redirect: '/tag/asset-market/asset-market',
    component: WrapperView,
    children: [
      {
        path: '/tag/asset-market/asset-market',
        name: 'public-market',
        meta: {
          name: '公共市场',
          icon: 'iconfont icon-daifabu'
        },
        component: AssetMarket
      },
      // {
      //   path: '/tag/asset-market/quota-dict',
      //   name: 'quota-dict',
      //   meta: {
      //     name: '指标字典',
      //     icon: 'iconfont icon-zidian'
      //   },
      //   component: QuotaDict
      // }
    ]
  }
]