/*
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-05-28 10:00:04
 * @LastEditTime: 2023-04-23 18:51:12
 * @Description:
 */
export default {
  // gs_value: state => state.gs_value,
  side_menu: state => state.side_menu,
  project: state => state.project,
  // 开发页面的右侧菜单是否折叠
  collapse: state => state.collapse,
  projectList: state => state.projectList,
  dics: state => state.dics,
  activeTreeId: state => state.activeTreeId,
  activeRdEditDialog: state => state.activeRdEditDialog,
  visibleRdEditDialog: state => state.visibleRdEditDialog,
  metadata: state => state.metadata,
  tabList: state => state.tabList,
  tabName: state => state.tabName,
  auths: state => state.auths,
  menuAuths: state => state.menuAuths,
  btnAuths: state => state.btnAuths,
  cube_id: state => state.cube_id,
  asset_basic_data: state => state.asset_basic_data,
  title: state => state.title,
  exreactInitialized: state => state.exreactInitialized,
  visibleWellcome: state => state.visibleWellcome,
  dbSchema: state => state.dbSchema,
  tagFlag: state => state.tagFlag,
  isServeApi: state => state.isServeApi
}
