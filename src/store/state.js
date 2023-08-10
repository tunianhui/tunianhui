/*
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-05-28 10:00:04
 * @LastEditTime: 2023-04-14 14:26:21
 * @Description:
 */
import storage from '@/libs/storage'

export default {
  // 全局搜索的内容
  // gs_value: '',
  num: storage.get('num'),
  side_menu: [],
  project: storage.get('project') || Object.create(null),
  // project: '',
  collapse: storage.get('collapse') || false,
  dics: storage.get('dics') || Object.create(null),
  metadata: storage.get('metadata') || [],
  projectList: [],
  activeTreeId: '',
  activeRdEditDialog: Object.create(null),
  visibleRdEditDialog: false,
  tabList: storage.get('tabList') || [],
  tabName: storage.get('tabName'),
  auths: {},
  menuAuths: Object.create(null),
  btnAuths: Object.create(null),
  title: '',
  cube_id: storage.get('cube_id') || '',
  asset_basic_data: storage.get('asset_basic_data') || {},
  exreactInitialized: storage.get('exreactInitialized') || true,
  visibleWellcome: false,
  dbSchema: {},
  tagFlag: storage.get('tagFlag') || {flag: 'home', data: {}},
  isServeApi: storage.get('isServeApi') || false
}
