/*
 * @Autor: Gang
 * @LastEditors: 大炸鹅
 * @Date: 2020-05-28 10:00:04
 * @LastEditTime: 2023-07-17 17:47:10
 * @Description:
 */
import storage from '@/libs/storage'

export default {
  SET_SIDE_MENU (state, menu) {
    state.side_menu = menu
  },
  SET_PROJECT (state, project) {
    state.project = project
    storage.set('project', project)
  },
  SET_COLLAPSE(state, flag) {
    state.collapse = flag
    storage.set('collapse', flag)
  },
  SET_TITLE(state, title) {
    state.title = title
    // storage.set('title', title)
  },
  SET_PROJECT_LIST(state, list) {
    state.projectList = list
    // list.length === 1 && (state.project = list[0].value)
    list.length === 1 && (state.project = list[0])
    // storage.set('projectList', list)
  },
  SET_DICS_DATA(state, data) {
    // console.log(data)
    state.dics = data
    storage.set('dics', data)
  },
  SET_METADATA(state, data) {
    state.metadata = data
    storage.set('metadata', data)
  },
  SET_ACTIVE_TREE_ID(state, id) {
    state.activeTreeId = id
  },
  SET_ACTIVE_RD_EDIT_DIALOG (state, data) {
    state.activeRdEditDialog = data
    state.visibleRdEditDialog = true
  },
  SET_VISIBLE_RD_EDIT_DIALOG(state, flag) {
    state.visibleRdEditDialog = flag
  },
  SET_TAB_LIST(state, data) {
    let index = state.tabList.findIndex(e => e.name === data.name)
    if (index === -1) {
      state.tabList.push(data)
    }
    // state.tabList = data
    storage.set('tabList', state.tabList)
  },
  REMOVE_TAB(state, data) {
    state.tabList = data
    storage.set('tabList', data)
  },
  SET_ACTIVE_NAME(state, data) {
    state.tabName = data
    storage.set('tabName', data)
  },
  SET_MENU_AUTHS(state, data) {
    const menus = {}
    flatArrayToObject(data, menus)
    state.menuAuths = JSON.stringify(menus) === '{}' ? 'null' : menus
  },
  SET_BUTTON_AUTHS(state, data) {
    state.btnAuths = data
  },
  SET_CUBE_ID(state, data) {
    state.cube_id = data
    storage.set('cube_id', data)
  },
  SET_ASSET_BASIC_DATA(state, data) {
    state.asset_basic_data = data
    storage.set('asset_basic_data', data)
  },
  SET_INITIALIZED(state, initialized) {
    state.exreactInitialized = initialized
    storage.set('exreactInitialized', initialized)
  },
  SET_WELLCOME_VISIBLE(state, flag) {
    state.visibleWellcome = flag
  },
  SET_DBSCHEMA(state, payload) {
    state.dbSchema = payload
  },
  SET_TAGFLAG(state, data) {
    state.tagFlag = data
    storage.set('tagFlag', data)
  },
  SET_IS_SERVE_API(state, data) {
    state.isServeApi = data
    storage.set('isServeApi', data)
  }
}

// 扁平化菜单
function flatArrayToObject(source, target) {
  if (!source) {
    return
  }
  source.forEach(s => {
    if (s.menuCode) {
      target[s.menuCode] = s

      if (s.children) {
        flatArrayToObject(s.children, target)
      }
    }
  })
}
