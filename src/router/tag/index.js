/*
 * @Author: 大炸鹅
 * @Date: 2023-02-02 11:46:45
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-09 19:26:35
 * @FilePath: \数据智能构建\src\router\tag\index.js
 */
/*
 * @Author: 大炸鹅
 * @Date: 2023-02-02 11:32:25
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-02 11:44:14
 * @FilePath: \数据智能构建\src\router\tag.js
 */
import assetsMarket from "./assets-market"
import workbench from "./workbench"
const WrapperView = {render: c => c('router-view')}
export default {
  path: '/tag',
  name: 'tag',
  meta: {
    name: '标签',
    headMenu: true,
    icon: 'iconfont icon-yanfa'
  },
  redirect: '/tag/asset-market',
  component: WrapperView,
  children: [
    ...assetsMarket,
    ...workbench
  ]
}