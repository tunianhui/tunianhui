/*
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-19 09:53:43
 * @LastEditTime: 2022-08-26 14:40:31
 * @Description:
 */
export default {
  Wellcome: _ => import(/* webpackChunkName: "Wellcome" */ './layout/blank'),

  PowerManage: _ =>
    import(/* webpackChunkName: "PowerManage" */ './my-power-table.js'),
  MYManage: _ =>
    import(/* webpackChunkName: "MYManage" */ './my-manage-table.js'),
  MYBelong: _ =>
    import(/* webpackChunkName: "MYBelong" */ './my-belong-table.js'),
  Audit: _ => import(/* webpackChunkName: "MYAudit" */ './my-audit-table.js'),

  LogicTable: _ =>
    import(
      /* webpackChunkName: "LogicTable" */ './power-manage/my-power/logic/index.vue'
    ),
  PhysiceTable: _ =>
    import(
      /* webpackChunkName: "PhysiceTable" */ './power-manage/my-power/physice/index.vue'
    ),
  DataSource: _ =>
    import(
      /* webpackChunkName: "DataSource" */ './power-manage/my-power/datasource/index.vue'
    ),
  API: _ =>
    import(
      /* webpackChunkName: "API" */ './power-manage/my-power/api/index.vue'
    ),
  FunctionPower: _ =>
    import(
      /* webpackChunkName: "FunctionPower" */ './power-manage/my-power/function/index.vue'
    ),

  BusinessPower: _ =>
    import(
      /* webpackChunkName: "BusinessPower" */ './power-manage/my-manage/business/index.vue'
    ),
  ProjectPower: _ =>
    import(
      /* webpackChunkName: "ProjectPower" */ './power-manage/my-manage/project/index.vue'
    ),
  DataSourceManage: _ =>
    import(
      /* webpackChunkName: "DataSourceManage" */ './power-manage/my-manage/datasource/index.vue'
    ),
  FunctionManage: _ =>
    import(
      /* webpackChunkName: "FunctionManage" */ './power-manage/my-manage/function/index.vue'
    ),
  FunctionSetting: _ =>
    import(
      /* webpackChunkName: "FunctionSetting" */ './power-manage/my-belong/fun-setting/index.vue'
    ),

  AssetPermissions: _ =>
    import(
      /* webpackChunkName: "AssetPermissions" */ './power-manage/audit/asset-permissions/index.vue'
    ),

  PermissionsOperation: _ =>
    import(
      /* webpackChunkName: "PermissionsOperation" */ './power-manage/audit/permissions-operation/index.vue'
    ),

  ApplyLogic: _ =>
    import(
      /* webpackChunkName: "ApplyLogic" */ './power-manage/my-power/apply/logic/index.vue'
    ),
  ApplyDatasource: _ =>
    import(
      /* webpackChunkName: "ApplyDatasource" */ './power-manage/my-power/apply/datasource/index.vue'
    ),

  LogicTableDetail: _ =>
    import(
      /* webpackChunkName: "LogicTableDetail" */ './power-manage/my-power/detail/index.vue'
    )
}
