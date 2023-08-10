<template>
  <Layout
    ref="layout"
    body-class="msl-body"
    class="safety-sidemenu-layout"
    :data="sidebarData"
    placement="center"
    @close="closeSidebar"
  >
  <Split v-model="splitWidth" max="550px" min="44px">
    <Sidenav :collapse.sync="collapse" slot="left"></Sidenav>
    <template slot="right" class="msl-main" ref="main">
      <transition name="fadeinright" mode="out-in">
        <component ref="wellcome" :is="components.Wellcome" v-if="!tabs.length"></component>
        <div class="msl-tabs" v-else>
          <div class="tab-controls">
            <i
              class="iconfont icon-sidebar-toggle"
              v-popover:tabControlsPopover
              @click="visibleWellcome = false"
            ></i>
            <el-tooltip content="查看操作指引" placement="top">
              <i
                :class="['iconfont icon-zhiyin', {active: visibleWellcome}]"
                @click="visibleWellcome = true"
              ></i>
            </el-tooltip>
            <el-popover
              ref="tabControlsPopover"
              popper-class="dark-popper no-gutter"
              trigger="click"
              placement="bottom-end"
              transition="el-zoom-in-top"
              :width="200"
              :visible-arrow="false"
            >
              <ul class="popper-list tabs-list" :style="{'max-height': `${tabsListMaxHeight}px`}">
                <li
                  v-for="tab in tabs"
                  :key="tab.name"
                  @click="setActiveTab(tab.name)"
                  :class="{active: tab.name === activeTabName}"
                >
                  <touch-ripple class="space-between">
                    <span>
                      <i class=""></i> &nbsp;
                      <span>{{tab.label}}</span>
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
          <el-tabs
            ref="tabs"
            v-model="activeTabName"
            type="card"
            closable
            @tab-remove="removeTab"
            @tab-click="clickTab"
          >
            <el-tab-pane
              v-for="tab in tabs"
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
              lazy
              v-show="!visibleWellcome && tab.name === activeTabName"
            >
              <span
                class="label"
                slot="label"
                :title="tab.label"
              >
                <i class="icon iconfont icon-sidebar-toggle-copy"></i>
                <OverflowTooltip :width="80">
                  <span>{{tab.label}}</span>
                </OverflowTooltip>
              </span>
              <component :is="components[tab.component]" :data="tab.data"></component>
            </el-tab-pane>
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
import Sidenav from './sidenav'
import OverflowTooltip from '@c/overflow-tooltip'
import {on, off} from '@/libs/dom'
import {mapMutations} from 'vuex'
const width = '280px'
export default {
  name: 'Safety',
  components: {
    Layout,
    Split,
    Sidenav,
    OverflowTooltip
  },
  watch: {
    collapse(val) {
      if (this.isSplitChange) {
        this.isSplitChange = false
      } else {
        this.splitWidth = val ? '45px' : this.initialSplitWidth
        this.isCollpaseChange = true
      }
      this.setCollapse(val)
    },
    splitWidth(val) {
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
      }
    }
  },
  computed: {
    tabs() {
      return this.tabStore ? this.tabStore.states.list : []
    },
    activeTabName: {
      get() {
        return this.activeTab.name
      },
      set(val) {
        this.visibleWellcome = false
        this.tabStore && this.tabStore.commit('setActive', val)
      }
    },
    activeTab() {
      return this.tabStore.states.active ? this.tabStore.states.active : {}
    }
  },
  data() {
    return {
      sidebarData: [],
      splitWidth: width,
      initialSplitWidth: width,
      collapse: false,
      visibleWellcome: false,
      tabsListMaxHeight: 0
    }
  },
  created() {
  },
  mounted() {
    this.setSize()
    on(window, 'resize', this.setSize)
  },
  beforeDestroy() {
    off(window, 'resize', this.setSize)
  },
  methods: {
    ...mapMutations({
      setCollapse: 'SET_COLLAPSE'
    }),
    setSize() {
      this.tabsListMaxHeight =
        window.innerHeight - parseInt(this.$styleVars.headerHeight) - 30 - 120
    },
    closeSidebar() {},
    removeTab(name) {
      this.tabStore.commit('remove', name)
    },
    removeOtherTabs() {
      this.tabStore.commit('removeOther')
    },
    clearTabs() {
      this.tabStore.commit('clear')
    },
    clickTab() {},
    setActiveTab(name) {
      this.tabStore.commit('setActive', name)
    }
  }
}
</script>

<style lang="scss">
$tabHeaderHeight: 30px;
$tabHeaderBg: $sideMenuStress;
$tabHeaderItemBg: $sideMenu;
$tabHeaderItemColor: $grey10;
$skewWidth: 12px;
$skewDeg: 22deg;
$tabHeaderIcon: lighten($--color-primary, 10%);
// 选中状态的字体颜色
$tabHeaderItemActiveColor: $grey2;
// 选中状态的背景颜色
$tabHeaderItemActiveBg: $grey10;
$tabControlsWidth: 70px;
.safety-sidemenu-layout {
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
                &.is-active {
                  position: relative;
                  z-index: 1;
                  color: $tabHeaderItemActiveColor;
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
                }

                .label {
                  span {
                    display: inline-block;
                    max-width: 100px;
                    line-height: normal;
                    position: relative;
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
