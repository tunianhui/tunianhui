<template>
  <section :class="['msl-aside', collapse && 'msl-aside-collapsed']">
    <el-tabs v-model="editableTabsValue" type="card" class="tab-nav">
      <el-tab-pane :key="tab.name" v-for="tab in side_menu.filter(menu => !menu.meta.hideInMenu)" :name="tab.name">
        <touch-ripple slot="label" class="pr-10 pl-10" v-if="!collapse">{{ tab.meta.name }}</touch-ripple>
        <div class="menus">
          <transition-group name="fadeInLeft" tag="ul" v-for="menu in menus" :key="menu.name">
            <li v-if="menu.meta.jump === false && menu.children" :key="menu.name">
              <div :label="menu.meta.name" class="label mt-10 space-between" v-if="!collapse">
                <span>{{menu.meta.name}}</span>
                <span v-if="menu.meta.block">
                  <el-tooltip effect="dark" content="申请记录" placement="top" popper-class="record">
                    <i class="icon iconfont icon-shenqingjilu mr-5" title="申请记录"></i>
                  </el-tooltip>
                  <i class="icon iconfont icon-createTemplate ml-5" v-popover:menupopover></i>
                  <el-popover ref="menupopover" placement="bottom-start" trigger="click" :visible-arrow="false" popper-class="dark-popper no-gutter asfety-my-authority" transition="el-zoom-in-top">
                    <ul class="popper-apply popper-list">
                      <li class="apply-current" v-for="item in menu.children" :key="item.path + Date.now()" @click="applyPowerHandle(item)">
                        <touch-ripple>
                          {{ item.meta.name }}
                        </touch-ripple>
                      </li>
                    </ul>
                  </el-popover>
                </span>
              </div>
              <div v-else class="flex-center">
                <el-tooltip effect="dark" :content="menu.meta.name" placement="right" :disabled="!collapse">
                  <i class="icon iconfont icon-shixian"></i>
                </el-tooltip>
              </div>
              <ul>
                <router-link tag="li" class="menuitem" v-for="submenu in menu.children.filter(m => !m.meta.hideInMenu)" :key="submenu.name" :to="submenu.path" @click.native.stop="tabsClickHandle(menu)">
                  <touch-ripple style="width" class="space-between">
                    <span>
                      <el-tooltip effect="dark" :content="submenu.meta.name" placement="right" :disabled="!collapse">
                        <i :class="submenu.meta.icon" class="mr-10"></i>
                      </el-tooltip>
                      <span v-if="!collapse">{{ submenu.meta.name }}</span>
                    </span>
                    <span class="apply" @click.stop="applyPowerHandle(submenu)" v-if="submenu.meta.block&&!collapse">
                      <i class="icon iconfont icon-createTemplate" :title="'申请'+submenu.meta.name"></i>
                    </span>
                  </touch-ripple>
                </router-link>
              </ul>
            </li>
          </transition-group>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div :class="['collapse collapse-arrow', collapse && 'collapsed']" @click.stop="collapseHandle">
      <i class="icon el-icon-caret-left"></i>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { safetyType } from '@/config/safety-config'
export default {
  name: 'safetySidenav',
  props: {
    collapse: Boolean
  },
  computed: {
    ...mapGetters(['side_menu', 'project']),
    menus () {
      return (
        (this.side_menu.find(m => this.editableTabsValue === m.name) || {})
          .children || []
      )
    }
  },
  inject: ['tabStore', 'components'],
  data () {
    return {
      editableTabsValue: ''
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler (val) {
        if (!this.pathsMap) {
          this.pathsMap = this.getPathsMap()
        }
        this.editableTabsValue = (
          this.side_menu.find(menu => this.pathsMap.get(menu).includes(val)) ||
          this.side_menu[0]
        ).name
      }
    }
  },
  created () {
  },
  methods: {
    collapseHandle () {
      this.$emit('update:collapse', !this.collapse)
    },
    getPathsMap () {
      const _getPaths = (routes, paths = []) => {
        paths.push(routes.path)
        routes.children &&
          routes.children.forEach(r => {
            _getPaths(r, paths)
          })
        return paths
      }
      const pathsMap = new WeakMap()
      this.side_menu.forEach(menu => {
        pathsMap.set(menu, _getPaths(menu))
      })
      return pathsMap
    },

    applyPowerHandle (menu) {
      if (menu.name !== safetyType.APIPOWER && menu.name !== safetyType.FUNCTIONPOWER) {
        let component = ''
        let modelKey = ''
        if (menu.name === safetyType.DIMENSIONPOWER) {
          component = 'ApplyLogic'
          modelKey = 'table_logic_auth_flow'
        } else if (menu.name === safetyType.PHYSICEPOWER) {
          // component = 'ApplyPhy'
          component = 'ApplyLogic'
          modelKey = 'table_physical_auth_flow'
        } else if (menu.name === safetyType.DATASOURCEPOWER) {
          component = 'ApplyDatasource'
          modelKey = 'service_ds_auth_flow'
        }
        this.tabStore.commit('add', {
          label: `申请${menu.meta.name}`,
          name: menu.name,
          component,
          data: { modelKey, name: menu.name }
        })
      }
    },

    tabsClickHandle (tab) {
      const path = this.$route.path
      let router = tab.children.filter(e => {
        return e.path.indexOf(path) > -1
      })
      if (router && router.length) {
        if (tab.name === 'myPower') {
          this.$store.commit(`myPower/SET_ACTIVE`, router[0].name)
        } else if (tab.name === 'myManage') {
          this.$store.commit(`myManage/SET_ACTIVE`, router[0].name)
        } else if (tab.name === 'belong') {
          this.$store.commit(`belong/SET_ACTIVE`, router[0].name)
        } else if (tab.name === 'audit') {
          this.$store.commit(`audit/SET_ACTIVE`, router[0].name)
        }
      }
      let component = ''
      if (tab.name === 'myPower') {
        component = 'PowerManage'
      } else if (tab.name === 'myManage') {
        component = 'MYManage'
      } else if (tab.name === 'belong') {
        component = 'MYBelong'
      } else if (tab.name === 'audit') {
        component = 'Audit'
      }
      this.tabStore.commit('add', {
        label: tab.meta.name,
        name: tab.name,
        component,
        data: tab
      })
    }
  }
}
</script>

<style lang="scss">
.msl-aside {
  position: relative;
  background-color: $sideMenuStress;
  height: 100%;
  font-size: 12px;
  .record {
    border-radius: 0 !important;
  }
  &.msl-aside-collapsed {
    // .menus {
    //   border-right: 0 solid $sideMenuStress;
    //   &:hover {
    // width: $mutlSideWidthCollapse;

    //     .label {
    //       height: 20px;
    //       &:before {
    //         opacity: 1;
    //       }
    //       &:after {
    //         opacity: 0;
    //       }
    //     }
    //   }
    // }
  }
  .collapse.collapse-arrow {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    width: 10px;
    height: 50px;
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
    background-color: $sideMenu;
    color: $grey10;
    font-size: 12px;
    text-align: center;
    z-index: 999;
    cursor: pointer;

    &.collapsed {
      i {
        transform: rotate(180deg);
        margin-left: -75%;
        margin-top: -75%;
      }
    }
    i {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.3s ease-in-out;
    }
  }
  $tabHeight: 40px;
  .tab-nav {
    height: 100%;
    > .el-tabs__header {
      margin: 0;
      border-bottom: none;
      padding: 0 10px;
      height: $tabHeight;
      .el-tabs__nav {
        border: none;
        .el-tabs__item {
          color: $grey5;
          padding: 0 0px;
          // margin: 0 5px;
          border-left: none;
          &.is-active {
            border-bottom: 2px solid $grey10;
            // background-color: $sideMenu;
            color: $grey9;
          }
        }
      }
    }
    .el-tabs__content {
      height: calc(100% - #{$tabHeight});
      background-color: $sideMenu;
      $liItemHeight: 35px;
      .el-tab-pane {
        height: 100%;
      }
      .menus {
        height: 100%;
        color: $grey5;
        width: 100%;
        .label {
          height: $liItemHeight;
          padding: 0 10px;
          line-height: $liItemHeight;
          font-size: 12px;
          i {
            cursor: pointer;
          }
        }
        li {
          // height: 35px;
          line-height: $liItemHeight;
          width: 100%;
          font-size: 14px;
        }
        .v-touch-ripple {
          width: 100%;
          padding: 0 15px;
          // line-height: $liItemHeight;
          // box-sizing: border-box;
          cursor: pointer;

          // .iconfont {
          //   font-size: 14px;
          //   padding-right: 10px;
          // }
        }
        .menuitem {
          color: $grey5;
          .apply {
            display: none;
            cursor: pointer;
            i {
              color: $grey4 !important;
            }
          }
        }
        .router-link-exact-active,
        .router-link-exact-active:hover {
          background-color: $sideMenuActive;
          color: $grey9;
          i {
            color: $user;
          }
        }
        .v-touch-ripple:hover {
          background-color: $sideMenuHover;
          color: $grey9;
          i {
            color: $user;
          }
          .apply {
            display: block;
            z-index: 9;
          }
        }
      }
    }
  }
}
.apply-current {
  .v-touch-ripple:hover {
    background-color: $sideMenuHover;
  }
}
</style>
