<template>
  <Layout ref="layout" body-class="msl-body" class="mutl-sidemenu-layout" :data="sidebarData" @close="closeSidebar">
    <Split v-model="splitWidth" max="550px" min="44px">

      <SideNav slot="left" :collapse.sync="collapse" :visibleQuicklyAdd="visibleQuicklyAdd"></SideNav>

      <template slot="right" class="msl-main" ref="main">
        <transition name="fadeinright" mode="out-in">
          <component ref="wellcome" :is="components.Wellcome" v-if="!tabs.length"></component>
          <div class="msl-tabs" v-else>
            <div class="tab-controls">
              <i class="iconfont icon-sidebar-toggle-copy" v-popover:tabControlsPopover @click="setWellcomeVisible(false)"></i>
              <el-tooltip content="查看操作指引" placement="top">
                <i :class="['iconfont icon-zhiyin', {active: visibleWellcome}]" @click="setWellcomeVisible(true)"></i>
              </el-tooltip>
              <el-popover ref="tabControlsPopover" popper-class="dark-popper no-gutter" trigger="click" placement="bottom-end" transition="el-zoom-in-top" :width="200" :visible-arrow="false">
                <ul class="popper-list tabs-list" :style="{'max-height': `${tabsListMaxHeight}px`}">
                  <li v-for="tab in tabs" :key="tab.name" @click="setActiveTab(tab.name)" :class="{active: tab.name === activeTabName}">
                    <touch-ripple class="space-between">
                      <span>
                        <i :class="getIcon(tab)" :style="{color: getColor(tab)}"></i>
                        &nbsp;
                        <span>{{ tab.label }}</span>
                      </span>
                      <i class="el-icon-close" @click.stop="removeTab(tab.name)"></i>
                    </touch-ripple>
                  </li>
                </ul>

                <ul class="popper-list">
                  <li @click="removeTab(activeTabName)">
                    <touch-ripple>关闭当前</touch-ripple>
                  </li>
                  <li @click="removeOtherTabs">
                    <touch-ripple>关闭其他</touch-ripple>
                  </li>
                  <li @click="clearTabs">
                    <touch-ripple>关闭全部</touch-ripple>
                  </li>
                </ul>
              </el-popover>
            </div>

            <el-tabs ref="tabs" v-model="activeTabName" type="card" closable @tab-remove="removeTab" @tab-click="clickTab">
              <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name" lazy v-show="!visibleWellcome && tab.name === activeTabName">
                <span class="label" slot="label" :type="
                    [
                      'codeTask',
                      'adSearch',
                      'codeTaskSql',
                      'codeTaskShell'
                    ].includes(tab.tabType) && activeTabName === tab.name
                      ? 'editor'
                      : ''
                  " :title="tab.label">
                  <i :class="tab.icon" :style="{fontSize: '12px', verticalAlign: 'top'}"></i>
                  <OverflowTooltip>
                    <span>{{ tab.label }}</span>
                  </OverflowTooltip>
                </span>
                <!-- 右栏 -->
                <component :is="components[tab.component]" :data="tab.data"></component>
              </el-tab-pane>

              <transition name="fadeinleft" mode="out-in">
                <component ref="wellcome" :is="components.Wellcome" v-if="visibleWellcome"></component>
              </transition>
            </el-tabs>
          </div>
        </transition>
      </template>
    </Split>
  </Layout>
</template>

<script>
import Layout from '@c/mini-sidebar-layout'
import Split from '@c/split'
import SideNav from './sidenav'
import OverflowTooltip from '@c/overflow-tooltip'
import { mapMutations, mapGetters } from 'vuex'
import { on, off, addClass, hasClass } from '@/libs/dom'
import mixin from './mixin'

const Attr = _ =>
  import(/* webpackChunkName: "Attr" */ './right-sidebar/attr.vue')

const Version = _ =>
  import(/* webpackChunkName: "version" */ './right-sidebar/version.vue')

const RequestParams = _ =>
  import(/* webpackChunkName: "request-params" */ './right-sidebar/request-params.vue')

const Return = _ =>
  import(/* webpackChunkName: "return" */ './right-sidebar/return.vue')

export default {
  name: 'Server',
  mixins: [mixin],
  components: {
    Layout,
    SideNav,
    Split,
    OverflowTooltip
  },
  data () {
    const width = '280px'
    return {
      // 动态展示 ---> 监听路由变化
      sidebarData: [
        { label: '属性查看', name: 'attr', component: Attr, hidden: false },
        { label: '请求参数', name: 'request-params', component: RequestParams, hidden: false },
        { label: '返回参数', name: 'return', component: Return, hidden: false }
        // { label: '版本', name: 'version', component: Version, hidden: false }
      ],
      splitWidth: width,
      initialSplitWidth: width,
      collapse: false,
      components: {},
      editComponents: [],
      tabsListMaxHeight: 0,
      visibleQuicklyAdd: true
    }
  },
  watch: {
    $route (to, from) {
      // /server/api-create
      // /server/api-register
      // /server/func
      // /server/arrange
      // /server/flow
      if (to.path === '/server/api-create' || to.path === '/server/api-register' || to.path === '/server/arrange') {
        this.sidebarData = [
          { label: '属性查看', name: 'attr', component: Attr, hidden: false },
          { label: '请求参数', name: 'request-params', component: RequestParams, hidden: false },
          { label: '返回参数', name: 'return', component: Return, hidden: false }
        ]
      } else if (to.path === '/server/func') {
        this.sidebarData = [
          { label: '属性查看', name: 'attr', component: Attr, hidden: false },
          { label: '版本', name: 'version', component: Version, hidden: false }
        ]
      } else {
        this.sidebarData = [
          { label: '属性查看', name: 'attr', component: Attr, hidden: false }
        ]
      }
      console.log(to.path, from.path)
    },
    collapse (val) {
      if (this.isSplitChange) {
        this.isSplitChange = false
      } else {
        this.splitWidth = val ? '45px' : this.initialSplitWidth
        this.isCollpaseChange = true
        this.rerenderWellcome()
      }
      this.setCollapse(val)
    },
    activeAttr (val) {
      val && val.name && this.$refs.layout.setActiveSidebar(this.sidebarData[0])
    },
    tabs: {
      immediate: true,
      handler (val, oldVal) {
        if (val.length > 0) {
          this.handlerObserveTabs()
        } else {
          this.setWellcomeVisible(false)
          if (this.tabObserver) {
            this.tabObserver.disconnect()
            this.tabObserver = null
          }
        }
      }
    },
    splitWidth (val) {
      if (this.isCollpaseChange || this.isSplitChange) {
        this.isCollpaseChange = false
        this.isSplitChange = false
        return
      }
      if (parseFloat(val) < 220) {
        this.collapse = !this.collapse
      } else {
        if (this.collapse) {
          this.collapse = false
          this.isSplitChange = true
        }
        this.rerenderWellcome()
      }
    }
  },
  computed: {
    ...mapGetters(['visibleWellcome']),
    tabs () {
      return this.tabStore ? this.tabStore.states.list : []
    },
    activeTabName: {
      get () {
        return this.activeTab.name
      },
      set (val) {
        this.setWellcomeVisible(false)
        this.tabStore && this.tabStore.commit('setActive', val)
      }
    },
    activeTab () {
      return this.tabStore ? this.tabStore.states.active : {}
    },
    activeAttr () {
      return (this.attrStore && this.attrStore.states.active) || {}
    }
  },
  mounted () {
    this.setSize()
    on(window, 'resize', this.setSize)
  },
  beforeDestroy () {
    off(window, 'resize', this.setSize)
  },
  beforeRouteLeave (to, from, next) {
    if (!to.matched.some(route => route.meta && route.meta.href)) {
      this.clearTabs()
    }
    next()
  },
  methods: {
    ...mapMutations({
      setCollapse: 'SET_COLLAPSE',
      setWellcomeVisible: 'SET_WELLCOME_VISIBLE'
    }),
    rerenderWellcome () {
      this.$refs.wellcome && this.$refs.wellcome.renderer()
    },
    async handlerObserveTabs () {
      await this.$sleep(500)
      if (!this.tabObserver && this.$refs.tabs) {
        const $tabs = this.$refs.tabs.$el.querySelector(
          '.el-tabs__header .el-tabs__nav'
        )
        $tabs
          .querySelectorAll('.el-tabs__item')
          .forEach(this.setEditorTabHeadClass)
        this.tabObserver = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            const node = mutation.target
            if (hasClass(node, 'el-tabs__item')) {
              this.setEditorTabHeadClass(node)
            }
            mutation.addedNodes.forEach(node => {
              this.setEditorTabHeadClass(node)
            })
          })
        })
        this.tabObserver.observe($tabs, {
          childList: true,
          subtree: true,
          attributes: true
        })
      }
    },
    setEditorTabHeadClass (tabHead) {
      const label = tabHead.querySelector('.label')
      if (label && label.getAttribute('type') === 'editor') {
        !hasClass(tabHead, 'tab-head-black') &&
          addClass(tabHead, 'tab-head-black')
      }
    },
    setSize () {
      this.tabsListMaxHeight =
        window.innerHeight - parseInt(this.$styleVars.headerHeight) - 30 - 120
    },
    removeTab (name) {
      this.tabStore.commit('remove', name)
    },
    setActiveTab (name) {
      this.tabStore.commit('setActive', name)
    },
    closeSidebar () {
      this.attrStore.commit('setActive', null)
    },
    clickTab (tab, event) {
      this.setWellcomeVisible(false)
    },
    removeOtherTabs () {
      this.tabStore.commit('removeOther')
    },
    clearTabs () {
      this.tabStore.commit('clear')
    }
  }
}
</script>

<style lang="scss">
$tabHeaderHeight: 30px;
$tabHeaderBg: $sideMenuStress;
$tabHeaderItemBg: $sideMenu;
$tabHeaderIcon: lighten($--color-primary, 10%);
$skewWidth: 12px;
$skewDeg: 22deg;
$tabHeaderItemColor: $grey10;
// 选中状态的字体颜色
$tabHeaderItemActiveColor: $grey2;
// 选中状态的背景颜色
$tabHeaderItemActiveBg: $grey10;
$tabControlsWidth: 70px;

.mutl-sidemenu-layout,
.tabs-type {
  height: 100%;
  overflow: hidden;
  @include clearfix;

  &.is-collpase {
    .msl-aside {
      /* width: $mutlSideWidthCollapse; */
    }
    .msl-main {
      /* width: calc(100% - #{$mutlSideWidthCollapse}); */
    }
  }
  .msl-aside,
  .msl-main {
    height: 100%;
    float: left;
    transition: $transition;
  }
  .msl-aside {
    width: 100%;
    /* width: $mutlSideWidth; */
  }
  .msl-main {
    width: 100%;
    /* width: calc(100% - #{$mutlSideWidth}); */
  }
  .msl-tabs {
    width: 100%;
    height: 100%;
    position: relative;
    .tab-controls {
      position: absolute;
      right: 0;
      top: 0;
      background-color: $tabHeaderBg;
      width: $tabControlsWidth;
      height: $tabHeaderHeight;
      line-height: $tabHeaderHeight;
      text-align: center;
      color: $grey5;
      padding-right: 8px;
      .iconfont {
        display: inline-block;
        width: ($tabControlsWidth - 8) / 2;
        color: $grey5;
        &.active,
        &.active:hover {
          background-color: $grey7;
          color: $tabHeaderBg;
        }
        &:hover {
          cursor: pointer;
          color: $grey9;
        }
      }
    }
    .el-tabs.el-tabs--card {
      width: 100%;
      height: 100%;
      > .el-tabs__header {
        width: calc(100% - #{$tabControlsWidth});
        height: $tabHeaderHeight;
        border: none;
        background-color: $tabHeaderBg;
        margin: 0;

        > .el-tabs__nav-wrap {
          > .el-tabs__nav-prev,
          > .el-tabs__nav-next {
            line-height: $tabHeaderHeight;
          }
          > .el-tabs__nav-scroll {
            > .el-tabs__nav {
              border: none;
              > .el-tabs__item {
                height: $tabHeaderHeight;
                line-height: $tabHeaderHeight;
                border: none;
                color: $tabHeaderItemColor;
                margin-left: 10px;
                background: $sideMenu;
                position: relative;
                z-index: 0;
                transition: $transition;

                &::before,
                &:after {
                  content: '';
                  position: absolute;
                  top: 0;
                  width: $skewWidth;
                  height: 100%;
                  background-color: $sideMenu;
                  transition: $transition;
                }

                &::before {
                  left: -$skewWidth / 2;
                  transform: skew(-$skewDeg);
                  z-index: 2;
                  box-shadow: -2px 0px 2px rgba($tabHeaderItemBg, 0.3);
                }
                &::after {
                  right: -$skewWidth / 2;
                  transform: skew($skewDeg);
                  z-index: 3;
                  box-shadow: 2px 0px 2px rgba($tabHeaderItemBg, 0.3);
                }
                .el-icon-close {
                  top: -2px;
                }

                &:hover {
                  .el-icon-close {
                    background-color: #c0c4cc;
                    color: $grey10;
                  }
                }
                &.is-active {
                  position: relative;
                  // color: $grey10;
                  background: $tabHeaderItemActiveBg;
                  z-index: 2;
                  &::before,
                  &::after {
                    background: $tabHeaderItemActiveBg;
                  }

                  &.tab-head-black {
                    color: #fff;
                    background: $sideMenuActive;
                    &::before,
                    &::after {
                      background: $sideMenuActive;
                    }
                  }
                  .label {
                    color: $grey2;
                  }
                }

                .label {
                  color: $grey5;
                  span {
                    display: inline-block;
                    max-width: 100px;
                    line-height: normal;
                    position: relative;
                    font-size: 13px;
                    top: 4px;
                    margin-left: 3px;
                    vertical-align: top !important;
                    @include textEllipsis;
                  }
                  .iconfont {
                    margin-right: 3px;
                    color: $tabHeaderIcon;
                    font-size: 16px;
                    font-weight: 500;
                  }
                }
              }
            }
          }
        }
      }
      > .el-tabs__content {
        height: calc(100% - #{$tabHeaderHeight});
        overflow: hidden;
        .el-tab-pane {
          height: 100%;
          overflow: auto;
        }
      }
    }
  }
}
.msl-body {
  position: relative;
}

.el-popper {
  .tabs-list.popper-list {
    overflow: auto;
    border-bottom: 1px solid $tabHeaderItemBg;
    @include scrollbar($grey8);

    li {
      &.active,
      &.active:hover {
        background-color: $tabHeaderItemBg;
      }
    }

    .iconfont {
      color: lighten($--color-primary, 10%);
    }
    .el-icon-close {
      position: relative;
      z-index: 10;
      color: $grey4;
      &:hover {
        color: $grey10;
      }
    }
  }
}

</style>
