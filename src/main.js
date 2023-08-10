/*
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-05-28 09:59:51
 * @LastEditTime: 2023-07-26 10:03:53
 * @Description:
 */
import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugins from '@/libs/plugins'
import ElementUI from 'element-ui'
import './element-variable.scss'
import VueTouchRipple from 'vue-touch-ripple'
import 'vue-touch-ripple/dist/vue-touch-ripple.css'
import importDirective from '@/directive'
// import 'animate.css'
import 'element-ui/lib/theme-chalk/display.css'

// import VForm from 'vform-builds' // 引入VForm库
import VForm from '@/libs/vform-builds/dist/VFormDesigner.umd.min' // 引入lib包
import 'element-ui/lib/theme-chalk/index.css' // 引入element-ui样式
import '@/libs/vform-builds/dist/VFormDesigner.css' // 引入lib包VForm样式
// import 'vform-builds/dist/VFormDesigner.css' // 引入VForm样式

import config from '@/config/index.js'
import styleVars from '@/config/style-vars.js'

import '@/assets/iconfont/iconfont.css'
// import '@/assets/icon/iconfont.css'
import '@/assets/css/common.scss'
import '@/assets/css/page.scss'
import '@/assets/css/element-ui.scss'
import '@/assets/css/side-view.scss'
import '@/assets/css/transition.scss'
import '@/assets/css/colorVariable.scss'

import * as d3 from 'd3'
import globalMixin from '@/mixins/global'
import EventEmitter from '@/libs/event-emitter'
import SimpleEditDialog from '@c/simple-edit-dialog'
import SimpleHead from '@c/simple-head'
import SimpleConfirm from '@c/simple-confirm'
import MonacoEditor from '@c/monaco-editor/index'
import OverflowTooltip from '@c/overflow-tooltip'
import FilterFieldCard from '@c/filter-card'
import CellContent from '@c/cell-content'
import Status from '@c/status'
import { insertSeparator } from '@/libs/util'
// import importElementComponents from './ele'
// importElementComponents(Vue)

import axios from 'axios'
import ZmTreeOrg from 'zm-tree-org'
import '@/assets/css/zm-tree-org.scss' // 如果需要axios，请引入
/* 注意：如果你的项目中有使用axios，请用下面一行代码将全局axios复位为你的axios！！ */
window.axios = axios

Vue.use(ZmTreeOrg)
Vue.config.productionTip = false
Vue.prototype.$config = config
Vue.prototype.$styleVars = styleVars
Vue.prototype.$d3 = d3

Vue.use(plugins)
Vue.use(ElementUI, {
  size: 'mini'
})
Vue.use(VForm) // 全局注册VForm(同时注册了v-form-designer和v-form-render组件)
Vue.use(VueTouchRipple)

Vue.component(SimpleEditDialog.name, SimpleEditDialog)
Vue.component(SimpleHead.name, SimpleHead)
Vue.component(SimpleConfirm.name, SimpleConfirm)
Vue.component(MonacoEditor.name, MonacoEditor)
Vue.component(CellContent.name, CellContent)
Vue.component(Status.name, Status)
Vue.component('OverflowTooltip', OverflowTooltip)
Vue.component('FilterFieldCard', FilterFieldCard)

Vue.filter('insertSeparator', insertSeparator)

importDirective(Vue)

new Vue({
  router,
  store,
  render: h => h(App),
  data: {
    eventEmitter: new EventEmitter()
  },
  mounted() {
    Vue.mixin(globalMixin)
  }
}).$mount('#app')
