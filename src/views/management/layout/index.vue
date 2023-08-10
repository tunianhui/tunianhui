<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 11:59:45
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-27 18:00:43
 * @FilePath: \智能数据构建\src\views\management\layout\index.vue
-->
<template>
  <div class="operation-new-layout">
    <aside class="sl-aside" :style="{width: `${width}px`}" @mouseenter.stop="mouseenter" @mouseleave.stop="mouseleave">
      <ul class="sl-aside-menus">
        <li
          v-for="menus in side_menu.filter(menu => !menu.meta.hideInMenu)"
          :key="menus.name"
          :class="['menu-item', menus.meta.jump === false && 'no-jump']"
        >
          <div class="title" v-if="menus.meta.jump === false && sideWdithHover">
            <i class="icon" :class="menus.meta.icon" v-if="menus.meta.icon"></i>
            <span style="white-space: nowrap;">
              {{ menus.meta.name }}
            </span>
          </div>
          <router-link tag="div" class="title" v-else :to="menus.path">
            <touch-ripple :class="[sideWdithHover ? '' : 'custom-touch-ripple']">
              <i class="icon" :class="menus.meta.icon" v-if="menus.meta.icon"></i>
              <span v-show="sideWdithHover">
                {{ menus.meta.name }}
              </span>
            </touch-ripple>
          </router-link>
          <ul class="submenu" v-if="menus.children">
            <router-link
              v-for="menu in menus.children.filter(
                item => !item.meta.hideInMenu
              )"
              :key="menu.name"
              tag="li"
              :to="menu.path"
              class="submenu-item"
            >
              <touch-ripple v-if="menu.meta.name" :class="[sideWdithHover ? '' : 'custom-touch-ripple']">
                <i class="icon" :class="menu.meta.icon" v-if="menu.meta.icon"></i>
                <span v-show="sideWdithHover">
                  {{ menu.meta.name }}
                </span>
              </touch-ripple>
            </router-link>
          </ul>
        </li>
      </ul>
      <div class="foolter-aside-menus" @click="fixedAsideHandle">
        <i class="iconfont icon-sidebar-toggle-copy"></i>
      </div>
    </aside>
    <div class="operation-new-layout-main">
      <transition name="fadeinleft" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: 'OperationNewLayout',
  computed: {
    ...mapGetters(['side_menu']),
    sideWdithHover() {
      if (this.width <= 40) {
        return false
      }
      return true
    }
  },
  data() {
    return {
      width: 40,
      fixedAside: false,
      maxWidth: 160
    }
  },
  created() {
    console.log(this.side_menu)
  },
  methods: {
    mouseenter() {
      if (this.fixedAside) return
      this.width = this.maxWidth
    },
    mouseleave() {
      if (this.fixedAside) return
      this.width = 40
    },
    fixedAsideHandle() {
      this.fixedAside = !this.fixedAside
      if (this.fixedAside) {
        this.width = this.maxWidth
      } else {
        this.width = 40
      }
    }
  }
}
</script>

<style lang="scss">
.operation-new-layout {
  display: flex;
  flex-direction: row;
  height: 100%;
  .sl-aside {
    height: 100%;
    background-color: $sideMenu;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 1;
    transition: width 0.3s;
    padding-bottom: 35px;
    &-menus {
      font-size: 12px;
      margin-top: 5px;
      height: 100%;
      overflow-y: overlay;
      overflow-x: hidden;
      .menu-item {
        &.no-jump {
          padding: 3px 0;

          .title {
            color: $grey5;
            font-size: 14px;
            padding: 0 20px;
          }
        }
        .title {
          color: $grey9;
          line-height: 36px;
        }
      }

      .v-touch-ripple {
        width: 100%;
        padding: 0 14px;
        line-height: 36px;
        box-sizing: border-box;
        cursor: pointer;
        white-space: nowrap;
        &.custom-touch-ripple {
          padding: 0 14px;
          .iconfont {
            padding-right: 0px;
          }
        }
        .iconfont {
          font-size: 14px;
          padding-right: 10px;
        }
        > span {
          white-space: nowrap;
        }
      }
      .submenu {
        .submenu-item {
          color: $grey9;
        }
      }
      .router-link-exact-active,
      .router-link-exact-active:hover {
        background-color: $sideMenuActive;
        i {
          color: #83A3EB;
        }
      }

      .v-touch-ripple:hover {
        background-color: $sideMenuHover;
        i {
          color: #83A3EB;
        }
      }
      &::-webkit-scrollbar {
        width: 7px;
        height: 1px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background-color: transparent;
      }
      &:hover {
        &::-webkit-scrollbar-thumb {
          background-color: #D7D9E3;
        }
      }
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 3px rgba(0,0,0,0);
        background: $sideMenu;
        border-radius: 3px;
        display: none;
      }
    }
    .foolter-aside-menus {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      height: 35px;
      line-height: 35px;
      cursor: pointer;
      i {
        font-size: 18px;
        color: #fff;
      }
    }
  }
  .operation-new-layout-main {
    flex: 1;
    width: 0;
  }
  .fadeinleft-enter-active,
  .fadeinleft-leave-active {
    opacity: 1;
    transform: translateZ(0);
  }
}
</style>