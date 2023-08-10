<template>
  <section :class="['msl-aside', collapse && 'msl-aside-collapsed']">
    <div class="msl-aside-main dark-loading">
      <div class="t-opreate">
        <el-select class="dark-input" popper-class="dark-popper no-arrow no-gutter" v-model="activeProject" @change="_setProject">
          <el-option v-for="(item, index) in projectList" :key="index" :label="item.project_name" :value="item.project_id"></el-option>
        </el-select>

        <el-popover ref="createPopper" v-if="visibleQuicklyAdd" popper-class="dark-popper create-popper" placement="bottom-start" :visible-arrow="false" v-model="visibleCreatePopper">
          <ul class="popper-list">
            <li v-for="items in editComponents" :key="items.value">
              <el-popover trigger="hover" placement="right-start" :visible-arrow="false" popper-class="dark-popper create-popper sub-create-popper">
                <touch-ripple slot="reference" class="space-between">
                  <span>{{ items.label }}</span>
                  <i class="el-icon-arrow-right"></i>
                </touch-ripple>

                <ul class="popper-list">
                  <li v-for="item in items.children" :key="item.value" :class="{'is-disabled': item.disabled}" @click.stop="createHandle(item, $event)">
                    <touch-ripple>
                      {{ item.label }}
                      <el-tooltip v-if="!!item.tip" :content="item.tip" placement="top">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </touch-ripple>
                  </li>
                </ul>
              </el-popover>
            </li>
          </ul>
        </el-popover>
      </div>

      <div class="navs">
        <div class="tab-pane">
          <div class="menus" v-show="menus && menus.length">
            <transition-group name="fadeInLeft" tag="ul" v-for="menu in menus" :key="menu.name">
              <li v-if="menu.meta.jump === false && menu.children" :key="menu.name">
                <div :label="menu.meta.name" class="label"></div>
                <ul>
                  <router-link tag="li" class="menuitem" v-for="submenu in menu.children" :key="submenu.name" :to="submenu.path">
                    <touch-ripple>
                      <el-tooltip effect="dark" :content="submenu.meta.name" placement="right" :disabled="!collapse">
                        <i :class="submenu.meta.icon" :color="submenu.meta.color"></i>
                      </el-tooltip>
                      <span>{{ submenu.meta.name }}</span>
                    </touch-ripple>
                  </router-link>
                </ul>
              </li>
              <router-link tag="li" class="menuitem" :key="menu.meta.name" :to="menu.path" v-else>
                <touch-ripple>
                  <el-tooltip effect="dark" :content="menu.meta.name" placement="right" :disabled="!collapse">
                    <i :class="menu.meta.icon" :color="menu.meta.color"></i>
                  </el-tooltip>
                  <span>{{ menu.meta.name }}</span>
                </touch-ripple>
              </router-link>
            </transition-group>
          </div>
          <div :class="['nav-view', !menus || (!menus.length && 'no-nav')]">
            <transition name="fadeInLeft" mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <div :class="['collapse collapse-arrow', collapse && 'collapsed']" @click.stop="collapseHandle">
      <i class="icon el-icon-caret-left"></i>
    </div>

    <transition name="el-fade-in-linear" v-if="visibleQuicklyAdd">
      <!-- <transition name="el-zoom-in-top"> -->
      <component :visible="visibleRdEditDialog" :is="components[activeRdEditDialog.component]" :title="activeRdEditDialog.title" :data="activeRdEditDialog.data || null" :callback="activeRdEditDialog.callback" @close="setActiveRdEditDialog(false)"></component>
    </transition>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { capitalize } from '@/libs/util'
import sidemenu from '@/mixins/sidemenu'

export default {
  name: 'SideNav',
  mixins: [sidemenu],
  props: {
    collapse: Boolean,
    visibleQuicklyAdd: Boolean
  },
  inject: ['tabStore', 'components', 'editComponents', 'editComponentsMap'],
  data () {
    return {
      activeThirdMenu: '',
      visibleCreatePopper: false,
      fileType: ''
    }
  },
  computed: {
    ...mapGetters(['activeRdEditDialog', 'visibleRdEditDialog']),
    menus () {
      return this.side_menu

      // return (
      //   (this.side_menu.find(m => this.activeThirdMenu === m.name) || {})
      //     .children || []
      // ).filter(m => !m.meta.hideInMenu)
    }
  },
  watch: {
    '$route.path': {
      immediate: true,
      handler (val) {
        if (this.innerChangeMenu) {
          this.innerChangeMenu = false
          return
        }
        if (!this.pathsMap) {
          this.pathsMap = this.getPathsMap()
        }
        this.activeThirdMenu = (
          this.side_menu.find(menu => this.pathsMap.get(menu).includes(val)) ||
          this.side_menu[0]
        ).name
      }
    }
  },
  mounted () { },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
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
    changeMenu (tab) {
      this.innerChangeMenu = true
      this.activeThirdMenu = tab.name
      this.$router.push(tab.path)
    },
    collapseHandle () {
      this.$emit('update:collapse', !this.collapse)
    },
    createHandle (data, event) {
      if (data.disabled) return
      const $popper = event.target.closest('.el-popper'),
        { type, value } = data,
        title = `新建${this.editComponentsMap[value].label}`,
        component = data.component || `${capitalize(value)}Edit`
      $popper && ($popper.style.display = 'none')
      this.visibleCreatePopper = false
      if (type === 'dialog') {
        this.setActiveRdEditDialog({
          component,
          title
        })
      } else {
        this.tabStore.commit('add', {
          label: title,
          tabType: value,
          name: `new_${value}_${Date.now()}`,
          component
        })
      }
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

  &.msl-aside-collapsed {
    .t-opreate {
      // margin: 10px 0;
      .el-select {
        width: 0;
        height: 0;
        overflow: hidden;
      }
      .iconfont {
        margin-left: 0;
      }
    }
    .tabs {
      height: 0;
    }
    .tab-pane {
      height: 100%;
    }
    .menus {
      border-right: 0 solid $sideMenuStress;
      &:hover {
        width: $mutlSideWidthCollapse;

        .label {
          height: 20px;
          &:before {
            opacity: 1;
          }
          &:after {
            opacity: 0;
          }
        }
      }
    }
  }

  .msl-aside-main {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  $t-opreate-height: 46px;
  .t-opreate {
    margin: 9px;
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    .el-select {
      flex: 1;
      transition: $transition;
    }
    .iconfont {
      display: inline-block;
      background-color: $headerBg;
      color: $grey4;
      padding: 7px;
      margin-left: 10px;

      &:hover {
        cursor: pointer;
        color: $grey9;
      }
    }
  }

  .navs {
    position: relative;
    background-color: $sideMenu;
    height: calc(100% - #{$t-opreate-height});
  }

  $height: 32px;
  .setHeight {
    height: $height;
    line-height: $height;
  }

  .tabs {
    display: flex;
    position: relative;
    z-index: 1;
    overflow: hidden;
    white-space: nowrap;
    height: 32px;
    transition: $transition;

    li {
      @extend .setHeight;
      flex: 1;
      text-align: center;
      color: $grey5;
      background-color: $sideMenuStress;
      cursor: pointer;
      &.is-active {
        background-color: $sideMenu;
        color: $grey9;
      }
      &:hover {
        color: $grey9;
      }
      .v-touch-ripple {
        width: 100%;
      }
    }
  }

  .tab-pane {
    position: relative;
    height: calc(100% - #{$height});
  }

  .menus {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    height: 100%;
    background: $sideMenu;
    border-right: 1px solid $sideMenuStress;
    border-top: 1px solid $sideMenuStress;
    color: $grey5;
    width: $mutlSideWidthCollapse;
    transition: $transition;
    overflow: hidden;
    &:hover {
      /* width: 65%; */
      width: 200px;
      z-index: 2;

      .label {
        height: $height;
        &:before {
          opacity: 0;
        }
        &:after {
          opacity: 1;
        }
      }
    }
    li.menuitem {
      height: $height;
    }
    .label {
      @extend .setHeight;
      margin-top: 3px;
      color: $grey6;
      text-indent: 10px;
      position: relative;
      height: 20px;
      transition: $transition;

      &:before {
        content: '';
        position: absolute;
        // width: 20px;
        width: $mutlSideWidthCollapse / 3;
        height: 1px;
        left: $mutlSideWidthCollapse / 3;
        top: 50%;
        background-color: $grey4;
        opacity: 1;
      }
      &:after {
        overflow: hidden;
        white-space: nowrap;
        content: attr(label);
        transition: $transition;
        opacity: 0;
      }
    }
    .hidden {
      opacity: 0;
      transition: $transition;
    }
    .v-touch-ripple {
      @extend .setHeight;
      width: 100%;
      transition: $transition;
      white-space: nowrap;
      overflow: hidden;
      cursor: pointer;

      i.iconfont {
        display: inline-block;
        width: $mutlSideWidthCollapse;
        font-size: 18px;
        text-align: center;
        outline: none;
      }

      &:hover {
        background-color: $sideMenuHover;
      }
    }
    .router-link-exact-active.router-link-active {
      .v-touch-ripple {
        background-color: $sideMenuActive;
        color: #fff;

        i.iconfont {
          color: lighten($--color-primary, 10%);
          // color: attr(data-color);

          $map: $dimensionTable $factTable $polymerTable;
          @each $color in $map {
            &[color='#{$color}'] {
              color: $color;
            }
          }
        }
      }
    }
  }
  .nav-view {
    width: 100%;
    padding-left: $mutlSideWidthCollapse;
    height: 100%;

    &.no-nav {
      padding-left: 0;
    }
  }
  .collapse.collapse-arrow {
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    width: 10px;
    height: 80px;
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
}
.create-popper.dark-popper {
  min-width: 80px;
}
.sub-create-popper.create-popper.dark-popper {
  margin-left: 6px;
}
</style>
