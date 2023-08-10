/*
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-05-28 10:00:04
 * @LastEditTime: 2023-08-02 17:34:13
 * @Description:
 */
import {getProjectList} from '@/api/rd/dev'
import {
  getDictParams,
  getMetaDataField,
  getMenuAuths,
  getBtnAuths,
  getTitle
} from '@/api/home'
import {automaticPromptInfo} from '@/api/rd/ad-search'
import {Loading} from 'element-ui'
// eslint-disable-next-line
import {simpleAsyncTo, throttle, parseUrl} from '@/libs/util'
let gettingDicsData = false,
  gettingMetadata = false
export default {
  async getMenuAuths({commit, dispatch, state}, payload) {
    const instance = Loading.service({
      fullscreen: true
    })
    const res = await simpleAsyncTo(getMenuAuths({
      payload,
      cookie: document.cookie
    }), '获取菜单权限失败')
    if (res) {
      const {data} = res
      commit('SET_MENU_AUTHS', data)
    } else {
      commit('SET_MENU_AUTHS', null)
    }
    instance.close()
  },
  async getDBSchema({commit, dispatch, state}, payload) {
    const instance = Loading.service({
      fullscreen: true
    })
    const res = await simpleAsyncTo(
      automaticPromptInfo(payload),
      '获取SQL联想数据失败'
    )
    if (res) {
      const {data} = res
      commit('SET_DBSCHEMA', data)
    }
    instance.close()
  },
  async getTitle({commit, dispatch, state}, payload) {
    const instance = Loading.service({
      fullscreen: true
    })
    const res = await simpleAsyncTo(getTitle(payload), '获取系统标题失败')
    if (res) {
      const {data} = res
      commit('SET_TITLE', data)
    }
    instance.close()
  },
  async getBtnAuths({commit, dispatch, state}, payload) {
    const instance = Loading.service({
      fullscreen: true
    })
    const res = await simpleAsyncTo(getBtnAuths(payload), '获取按钮权限失败')
    if (res) {
      const {data} = res
      commit('SET_BUTTON_AUTHS', data)
    }
    instance.close()
  },
  async getProjectList({commit, dispatch, state}, payload) {
    const instance = Loading.service({
      fullscreen: true
    })
    const res = await simpleAsyncTo(getProjectList(payload), '获取项目列表失败')
    if (res) {
      const {data} = res
      commit('SET_PROJECT_LIST', data && data.length ? data : [])
    }
    instance.close()
  },
  async getDicsData({commit}, payload) {
    if (gettingDicsData) return
    gettingDicsData = true
    const instance = Loading.service({
      fullscreen: true
    })
    const res = await simpleAsyncTo(getDictParams(payload), '获取字典数据失败')
    if (res) {
      const {data} = res
      commit('SET_DICS_DATA', data || {})
    }
    instance.close()
    gettingDicsData = false
  },
  async getMetadata({commit, state}, payload) {
    if (gettingMetadata) return
    gettingMetadata = true
    const instance = Loading.service({
      fullscreen: true
    })
    const res = await simpleAsyncTo(
      getMetaDataField({
        project_id: state.project.project_id,
        business_field_id: state.project.business_field_id
      }),
      '获取数据域失败'
    )
    if (res) {
      const {data} = res
      commit('SET_METADATA', data || {})
    }
    instance.close()
    gettingMetadata = false
  }
}
