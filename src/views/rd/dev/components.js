/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:05
 * @LastEditTime: 2023-06-14 09:49:20
 * @Description:
 */
// 用于与tabs匹配组件
export default {
  Wellcome: _ =>
    import(/* webpackChunkName: "DevWellcome" */ './wellcome/index.vue'),
  DevObjectTable: _ =>
    import(/* webpackChunkName: "DevObejctTable" */ './object-table'),
  DimensionEdit: _ =>
    import(/* webpackChunkName: "DimensionEdit" */ './norm-modeling/norm-define/dimension/edit.vue'),
  DimensionAttr: _ =>
    import(/* webpackChunkName: "DimensionAttr" */ './norm-modeling/norm-define/dimension/attr.vue'),
  DimensionObjectTable: _ =>
    import(/* webpackChunkName: "DimensionObjectTable" */ './norm-modeling/norm-define/dimension/table.vue'),
  FactEdit: _ =>
    import(/* webpackChunkName: "FactEdit" */ './norm-modeling/norm-define/fact/edit.vue'),
  FactAttr: _ =>
    import(/* webpackChunkName: "FactAttr" */ './norm-modeling/norm-define/fact/attr.vue'),
  FactObjectTable: _ =>
    import(/* webpackChunkName: "FactObjectTable" */ './norm-modeling/norm-define/fact/table.vue'),
  LimitEdit: _ =>
    import(/* webpackChunkName: "LimitEdit" */ './norm-modeling/norm-define/limit/edit.vue'),
  LimitEditDialog: _ =>
    import(/* webpackChunkName: "LimitEdit" */ './norm-modeling/norm-define/limit/edit-dialog.vue'),
  LimitAttr: _ =>
    import(/* webpackChunkName: "LimitAttr" */ './norm-modeling/norm-define/limit/attr.vue'),
  LimitObjectTable: _ =>
    import(/* webpackChunkName: "LimitObjectTable" */ './norm-modeling/norm-define/limit/table.vue'),
  AtomEdit: _ =>
    import(/* webpackChunkName: "AtomEdit" */ './norm-modeling/norm-define/atom/edit.vue'),
  AtomEditDialog: _ =>
    import(/* webpackChunkName: "AtomEditDialog" */ './norm-modeling/norm-define/atom/edit-dialog.vue'),
  DeriveAtomEdit: _ =>
    import(/* webpackChunkName: "DeriveAtomEdit" */ './norm-modeling/norm-define/atom/derive-atom-edit.vue'),
  AtomAttr: _ =>
    import(/* webpackChunkName: "AtomAttr" */ './norm-modeling/norm-define/atom/attr.vue'),
  AtomObjectTable: _ =>
    import(/* webpackChunkName: "AtomObjectTable" */ './norm-modeling/norm-define/atom/table.vue'),
  DeriveEdit: _ =>
    import(/* webpackChunkName: "DeriveEdit" */ './norm-modeling/norm-define/derive/edit.vue'),
  DeriveEditDialog: _ =>
    import(/* webpackChunkName: "DeriveEditDialog" */ './norm-modeling/norm-define/derive/edit-dialog.vue'),
  DeriveAttr: _ =>
    import(/* webpackChunkName: "DeriveAttr" */ './norm-modeling/norm-define/derive/attr.vue'),
  DeriveObjectTable: _ =>
    import(/* webpackChunkName: "DeriveObjectTable" */ './norm-modeling/norm-define/derive/table.vue'),
  DimensionTableEdit: _ =>
    import(/* webpackChunkName: "DimensionTableEdit" */ './norm-modeling/modeling/dimension/edit.vue'),
  FactTableCreate: _ =>
    import(/* webpackChunkName: "FactTableCreate" */ './norm-modeling/modeling/fact/create.vue'),
  FactTableEdit: _ =>
    import(/* webpackChunkName: "FactTableEdit" */ './norm-modeling/modeling/fact/edit.vue'),
  PolymerTableCreate: _ =>
    import(/* webpackChunkName: "PolymerTableCreate" */ './norm-modeling/modeling/polymer/create.vue'),
  PolymerTableEdit: _ =>
    import(/* webpackChunkName: "PolymerTableEdit" */ './norm-modeling/modeling/polymer/edit.vue'),
  AdSearchEdit: _ =>
    import(/* webpackChunkName: "AdSearchEdit" */ './ad-search/edit.vue'),
  AdSearchNewFile: _ =>
    import(/* webpackChunkName: "AdSearchNewFile" */ './ad-search/new-file.vue'),
  SourceManageEdit: _ =>
    import(/* webpackChunkName: "SourceManageEdit" */ './data-process/source-manage/edit.vue'),
  FuncManageEdit: _ =>
    import(/* webpackChunkName: "FuncManageEdit" */ './data-process/func-manage/edit.vue'),
  FuncManageAttr: _ =>
    import(/* webpackChunkName: "FuncManageAttr" */ './data-process/func-manage/attr.vue'),
  CreateFolderManage: _ =>
    import(/* webpackChunkName: "CreateFolderManage" */ './data-process/func-manage/create-folder.vue'),
  ViewContent: _ =>
    import(/* webpackChunkName: "ViewContent" */ './data-process/source-manage/view-content.vue'),
  SourceManageAttr: _ =>
    import(/* webpackChunkName: "SourceManageAttr" */ './data-process/source-manage/attr.vue'),
  addFile: _ =>
    import(/* webpackChunkName: "addFile" */ './data-process/code-task/add-edit.vue'),
  CodeTaskEdit: _ =>
    import(/* webpackChunkName: "CodeTaskEdit" */ './data-process/code-task/edit.vue'),
  SyncTaskEdit: _ =>
    import(/* webpackChunkName: "SyncTaskEdit" */ './data-process/sync-task/edit.vue'),
  ComputingTaskEdit: _ =>
    import(/* webpackChunkName: "SyncTaskEdit" */ './data-process/computing-task/edit.vue'),
  BatchImport: _ =>
    import(/* webpackChunkName: "BatchImport" */ './data-process/table-manage/batch-import.vue'),
  BatchExport: _ =>
    import(/* webpackChunkName: "BatchExport" */ './data-process/table-manage/batch-export.vue'),
  CreatTable: _ =>
    import(/* webpackChunkName: "CreatTable" */ './data-process/table-manage/creat-table.vue'),
  EditTable: _ =>
    import(/* webpackChunkName: "EditTable" */ './data-process/table-manage/edit-table.vue'),
  ViewTable: _ =>
  import(/* webpackChunkName: "EditTable" */ './data-process/table-manage/view-table.vue'),
}
