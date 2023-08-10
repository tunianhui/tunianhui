/*
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-05-28 10:00:04
 * @LastEditTime: 2022-08-26 16:03:32
 * @Description:
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import objectTable from './object-table'
import ops from './ops'
import createLogger from 'vuex/dist/logger'
import server from './server'

const debug = process.env.NODE !== 'production'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  strict: debug,
  modules: {
    dev: objectTable('dev'),
    exreact: objectTable('exreact'),
    safety: objectTable('safety'),
    myPower: objectTable('myPower'),
    myManage: objectTable('myManage'),
    belong: objectTable('belong'),
    audit: objectTable('audit'),
    standard: objectTable('standard'),
    server,
    ops
  },
  plugins: debug ? [createLogger()] : []
})

if (module.hot) {
  module.hot.accept(['./state', './actions', './getters', './mutations'], _ => {
    const newState = require('./state').default
    const newActions = require('./actions').default
    const newGetters = require('./getters').default
    const newMutations = require('./mutations').default
    const newObjectTable = require('./object-table').default
    const newops = require('./ops').default

    store.hotUpdate({
      state: newState,
      actions: newActions,
      getters: newGetters,
      mutations: newMutations,
      mudules: {
        dev: newObjectTable('dev'),
        exreact: newObjectTable('exreact'),
        safety: newObjectTable('safety'),
        myPower: newObjectTable('myPower'),
        myManage: newObjectTable('myManage'),
        belong: newObjectTable('belong'),
        audit: newObjectTable('audit'),
        standard: newObjectTable('standard'),
        ops: newops,
        server
      }
    })
  })
}

export default store
