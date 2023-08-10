/*
 * @Autor: Gang
 * @LastEditors: cxm
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2021-08-10 17:35:13
 * @Description: component
 */

// 用于与tabs匹配组件
export default {
  Wellcome: _ =>
    import(/* webpackChunkName: "StandardWellcome" */ './wellcome/index.vue'),
  StandardObjectTable: _ =>
    import(/* webpackChunkName: "DevObejctTable" */ './object-table'),
  CriterionAttr: _ =>
    import(/* webpackChunkName: "CriterionAttr" */ './manage/define/criterion/attr.vue'),
  CriterionEdit: _ =>
    import(/* webpackChunkName: "CriterionEdit" */ './manage/define/criterion/edit.vue'),
  CriterionEditDialog: _ =>
    import(/* webpackChunkName: "CriterionEditDialog" */ './manage/define/criterion/edit-dialog.vue'),
  CriterionTable: _ =>
    import(/* webpackChunkName: "CriterionObjectTable" */ './manage/define/criterion/table.vue'),
  CategoryAttr: _ =>
    import(/* webpackChunkName: "CategoryAttr" */ './manage/define/category/attr.vue'),
  CategoryEditDialog: _ =>
    import(/* webpackChunkName: "CategoryEditDialig" */ './manage/define/category/edit-dialog.vue'),
  ReleaseWaiting: _ =>
    import(/* webpackChunkName: "release-waiting" */ './edition/release/waiting/index.vue'),
  ReleasePublish: _ =>
    import(/* webpackChunkName: "release-publish" */ './edition/release/publish/index.vue'),
  ManageCurrent: _ =>
    import(/* webpackChunkName: "manage-current" */ './edition/manage/current/index.vue'),
  ManageHistory: _ =>
    import(/* webpackChunkName: "manage-history" */ './edition/manage/history/index.vue'),
  DictTable: _ =>
    import(/* webpackChunkName: "DictTable" */ './manage/define/dict/table.vue'),
  DictEditDialig: _ =>
    import(/* webpackChunkName: "DictEditDialig" */ './manage/define/dict/edit-dialog.vue'),
  DictAttr: _ =>
    import(/* webpackChunkName: "DictAttr" */ './manage/define/dict/attr.vue')
}
