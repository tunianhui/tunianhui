/*
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2023-06-26 15:15:54
 * @Description:
 */
// 用于与tabs匹配组件
export default {
  Wellcome: _ =>
    import(/* webpackChunkName: "DevWellcome" */ './wellcome/index.vue'),
  SyncTaskEdit: _ =>
    import(
      /* webpackChunkName: "SyncTaskEdit" */ './sync-task/edit.vue'
    )
}
