<template>
  <el-header :height="$styleVars.headerHeight" class="layout-header">
    <div class="fl flex-layout">
      <!-- <div class="head-title" :style="{'padding-right': isInRd ? '9vw' : isHome ? '1vw' : '5vw'}"> -->
      <div class="head-title" :style="{'padding-right': isHome ? '1vw' : '5vw'}">
        <transition-group name="fadeinleft">
          <img width="30" src="@/assets/images/logo_2.png" key="log" v-if="isHome" style="vertical-align: middle;margin-bottom: 5px;" />
          <!-- <i class="icon iconfont icon-logo-1" key="logo" v-if="isHome"></i> -->
          <!-- <router-link tag="i" to="/home" class="icon iconfont icon-liebiao" v-else></router-link> -->
          <i class="icon iconfont icon-liebiao" key="menu" v-popover:menupopover v-show="!isHome"></i>
        </transition-group>
        <el-popover ref="menupopover" placement="bottom" trigger="hover" :visible-arrow="false" popper-class="dark-popper no-gutter" transition="el-zoom-in-top" :disabled="isHome">
          <ul class="popper-list" v-if="initMenus">
            <router-link v-for="item in initMenus" :key="item.path + Date.now()" :to="item.path" tag="li">
              <touch-ripple v-if="!item.meta.block">
                <i :class="item.meta.icon"></i>
                &nbsp;&nbsp;{{ item.meta.name }}
              </touch-ripple>
            </router-link>
          </ul>
        </el-popover>
        <transition name="fadeinleft" mode="out-in">
          <!-- <span v-if="!visible">{{ $config.name }}</span> -->
          <span v-if="!visible">{{
            $store && $store.getters ? $store.getters.title : ''
          }}</span>
        </transition>
        <span class="active-menu">
          <transition name="fadeinleft" mode="out-in">
            <span v-if="!isHome">
              <strong v-if="!visible">·</strong>
              {{ activeMenuName }}
            </span>
          </transition>
          <!-- <span class="switch-wrapper" v-if="showSwitch">
            <el-switch v-model="value1">
            </el-switch>
          </span>
          <span class="tips-wrapper" v-if="showSwitch">
            <div :class="{'prod-active': !value1}">生产</div>
            <div :class="{'dev-active': value1}">开发</div>
          </span> -->
        </span>
      </div>
      <div v-if="$route.path.indexOf('/rd/operation-new') > -1">
        <el-select class="dark-input" popper-class="dark-popper no-arrow no-gutter" v-model="activeProject" @change="_setProject">
          <el-option v-for="(item, index) in projectList" :key="index" :label="item.project_name" :value="item.project_id"></el-option>
        </el-select>
      </div>
      <transition name="fadeinleft" mode="out-in">
        <!-- v-if="menus && !visible" -->
        <ul v-if="menus" class="menus flex-layout" :key="activeMenuName">
          <!-- <li v-if="menu.meta.href">
            <a :href="menu.meta.href">
              <touch-ripple>{{menu.meta.name}}</touch-ripple>
            </a>
          </li>-->
          <li>
            <router-link :to="menu.path" v-for="menu in menus.filter(menu => !menu.meta.hideInMenu)" :key="menu.name" :class="{
                'router-link-active':
                  $route.path === exreactInitializePath &&
                  menu.path === '/rd/exreact'
              }" @click="changeRoute(menu)">
              <touch-ripple v-if="!menu.meta.block">{{
                menu.meta.name
              }}</touch-ripple>
            </router-link>
          </li>
          <!-- <router-link tag="li" :to="menu.path"
            v-for="menu in menus"
            :key="menu.name"
            @click="changeRoute(menu)"
          >
            <touch-ripple>{{menu.meta.name}}</touch-ripple>
          </router-link>-->
        </ul>
      </transition>
    </div>
    <div class="fr flex-layout">
      <!-- <transition name="fadeinleft" mode="out-in">
        <div class="g-search" @keyup.enter.native="searchHandle" v-if="visibleGlobalInput">
          <el-input
            placeholder="请输入查询内容"
            v-model="gs"
            prefix-icon="el-icon-search"
            class="dark-input"
          ></el-input>
          <input type="hidden" />
        </div>
      </transition>-->
      <!-- <el-tooltip effect="dark" content="消息"></el-tooltip> -->
      <div class="tool">
        <!-- <i class="icon el-icon-chat-dot-square"></i>
        <i class="icon el-icon-setting"></i> -->
        <i class="icon el-icon-message-solid" @click="$router.push({path: '/notice-center'})"></i>
        <HelpMenus @click="clickHelpMenus"></HelpMenus>

        <!-- <i class="icon el-icon-s-custom"></i> -->
      </div>
    </div>
    <el-drawer
      :title="helpTitle"
      :visible.sync="helpDrawer"
      :withHeader="false"
      :modal="false"
      size="480px"
      custom-class="help-drawer"
      direction="rtl"
    >
      <div class="help-drawer-wrapper">
        <HelpDrawerHeader :title="helpTitle" @close="helpDrawer = false"></HelpDrawerHeader>
        <Guide v-if="helpType == 'guide'"></Guide>
      </div>
    </el-drawer>
  </el-header>
</template>

<script>
import { on, off } from '@/libs/dom'
import { mapMutations, mapGetters, mapActions } from 'vuex'
import storage from '@/libs/storage'
import HelpMenus from './help-menus.vue'
import HelpDrawerHeader from './help-drawer-header.vue'
import Guide from './guide.vue'
const HOME = '/home'

export default {
  name: 'Layout',
  components: {
    HelpMenus,
    HelpDrawerHeader,
    Guide
  },
  data () {
    return {
      value1: true, // 开发 & 生产
      exreactInitializePath: '/exreact/initialize',
      gs: '',
      menus: [],
      activeMenuName: '',
      isHome: false,
      visible: false,
      env: false, // false => dev | true => prov
      activeProject: '',
      helpTitle: '',
      helpDrawer: false,
      helpType: ''
    }
  },
  computed: {
    ...mapGetters(['projectList', 'project']),
    showSwitch () {
      return location.pathname.includes('/rd/dev') || location.pathname.includes('/rd/integrate')
    },
    initMenus () {
      return (
        this.$router.options.routes.find(r => r.name === 'index') || {}
      ).children.filter(r => !r.meta.hideInMenu)
    },
    cacheList () {
      // const list = this.
      return []
    },
    visibleGlobalInput () {
      return this.$route.path.indexOf('/rd/dev') > -1
    },
    isInRd () {
      return this.$route.path.startsWith('/rd')
    }
  },
  created () {
    if (this.$route.path.indexOf('/rd/operation-new') > -1) {
      this.getProjectList()
    }
  },
  mounted () {
    this.resize()
    on(window, 'resize', this.resize)
  },
  destroyed () {
    off(window, 'resize', this.resize)
  },
  watch: {
    $route: {
      immediate: true,
      handler (route) {
        this.changeMenu(route)
        if (this.$route.path.indexOf('/rd/operation-new') > -1) {
          // this.activeProject = this.project.project_id
          if (this.project && this.project.project_id) {
            this.activeProject = this.project.project_id
          } else {
            const data = storage.get('project')
            if (data) {
              this.setProject(data)
              this.activeProject = data.project_id
            } else {
              this.setProject(this.projectList[0])
              this.activeProject = this.projectList[0].project_id
            }
          }
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      setSideMenu: 'SET_SIDE_MENU',
      setProject: 'SET_PROJECT'
    }),
    ...mapActions(['getProjectList']),
    changeMenu (route) {
      this.isHome = route.path === HOME
      if (this.isHome) {
        this.menus = this.initMenus
        return
      }

      // 萃取初始化
      if (route.path === this.exreactInitializePath) {
        const rdMenus = this.initMenus.find(menu => menu.path === '/rd')
        this.menus = rdMenus.children
        this.activeMenuName = rdMenus.meta.name
        return
      }

      const l = route.matched.length,
        menu = l ? route.matched[1] : null
      if (!menu) return

      const secondRoute = this.initMenus.find(r => r.path === menu.path)
      if (secondRoute) {
        const { meta, children } = secondRoute
        this.activeMenuName = meta.name
        if (meta.headMenu) {
          this.menus = children

          const activeRoute = route.matched[2]
          if (activeRoute.meta.sideMenu && secondRoute.children) {
            const sideMenu =
              (
                secondRoute.children.find(r => r.path === activeRoute.path) ||
                {}
              ).children || []

            this.setSideMenu(sideMenu)
            return
          }
          this.setSideMenu([])
          return
        }
        if (meta.sideMenu) {
          this.menus = null
          this.setSideMenu(children)
        }
      }
    },
    resize () {
      const width = window.innerWidth
      this.visible = this.visibleGlobalInput ? width < 992 : width < 766
    },
    searchHandle () { },
    _setProject (val) {
      this.setProject(this.projectList.find(item => item.project_id === val))
    },
    clickHelpMenus (command) {
      this.helpDrawer = true
      switch (command) {
        case 'guide':
          // this.$router.push({ path: '/guide' })
          this.helpTitle = '新手引导'
          this.helpType = 'guide'
          break
        case 'help':
          // window.open('https://www.yuque.com/fe-dev/rd')
          this.helpTitle = '帮助文档'
          this.helpType = 'help'
          break
        case 'workOrder':
          // window.open('https://rd.yuque.com/fe-dev/rd/rd')
          this.helpTitle = '工单系统'
          this.helpType = 'workOrder'
          break
      }
    },
  }
}
</script>

<style lang="scss">
.layout-header {
  // width:
  background-color: $headerBg;
  padding: 0 !important;
  height: $headerHeight;
  line-height: $headerHeight;
  user-select: none;
  .active-menu {
    color: $grey10;
    cursor: pointer;
    position: relative;
    .icon.iconfont {
      font-size: 20px;
      margin-left: 5px;
    }
    strong {
      display: inline-block;
      padding: 0 8px;
      font-size: 20px;
      line-height: 24px;
    }
    .switch-wrapper {
      position: absolute;
      width: 40px;
      height: 40px;
      transform-origin: center center;
      transform: rotate(90deg);
      .el-switch {
        position: absolute;
        top: 50%;
        left: 65%;
        transform: translate(-50%, -50%);
        .el-switch__core {
          width: 24px !important;
          height: 12px !important;
          &::after {
            top: -1px;
            height: 12px;
            width: 12px;
          }
        }
      }
      .el-switch.is-checked .el-switch__core::after {
        left: 100%;
        margin-left: -12px;
      }
    }
    .tips-wrapper {
      position: absolute;
      left: 92px;
      top: -20px;
      font-size: 12px;
      width: 40px;
      .dev-active {
        color: #ffad0a;
      }
      .prod-active {
        color: #9873ff;
      }
      div {
        height: 14px;
      }
    }
  }
  .head-title {
    font-size: 18px;
    color: $grey10;
    padding-right: 5vw;
    // background-color: #000a12;
    padding-left: 15px;
    .icon.iconfont {
      color: $grey10;
      font-size: 20px;
      padding-right: 10px;
      height: 100%;
      display: inline-block;
      cursor: pointer;
      outline: none;
    }
  }
  .switch {
    cursor: pointer;
    width: 60px;
    height: 40px;
    position: absolute;
    left: calc(100% + 5px);
    top: -8px;
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      margin: 0;
    }
    &.is-active {
      .switch-core {
        &:after {
          top: 100%;
          margin-top: -17px;
        }
      }
    }
    .switch-label {
      font-size: 13px;
      line-height: 16px;
      position: absolute;
      left: 28px;
      &-top {
        top: 1px;
      }
      &-bottom {
        bottom: 2px;
      }
      &.is-active {
        color: $env;
      }
    }
    .switch-core {
      display: inline-block;
      background-color: $sideMenu;
      border: 1px solid $sideMenu;
      width: 20px;
      height: 40px;
      box-sizing: border-box;
      border-radius: 10px;
      position: absolute;
      left: 3px;
      top: 0;
      &:after {
        content: '';
        position: absolute;
        top: 1px;
        left: 1px;
        border-radius: 100%;
        transition: all 0.3s;
        width: 16px;
        height: 16px;
        background-color: $env;
      }
    }
  }
  .menus {
    li {
      // padding: 0 20px;
      cursor: pointer;
      font-size: 15px;
      .v-touch-ripple {
        // width: 100%;
        height: 100%;
        padding: 0 2vw;
      }
      > a {
        color: $grey5;
        &:hover {
          color: $grey10;
        }
      }
      .router-link-active {
        color: $grey10;
        position: relative;
        .v-touch-ripple::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          left: 0;
          bottom: 0;
          background-color: $grey10;
        }
      }
    }
  }
  .g-search {
    margin-right: 12px;
  }
  .tool {
    padding-right: 10px;
    .icon {
      margin: 0 7px;
      color: $grey6;
      &:hover {
        cursor: pointer;
        color: $grey10;
      }
    }
  }
}
.header-popover-menus.el-popper {
  width: auto;
  padding: 2px 0;
  margin-top: 0 !important;
  min-width: 80px !important;
  border-radius: 0;
  background-color: $headerBg;
  border-color: $headerHover;
}
.help-drawer.rtl {
  height: calc(100% - 50px)!important;
  top: 50px!important;
  .help-drawer-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
}
</style>
