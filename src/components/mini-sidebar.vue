<template>
  <section :class="['mini-sidebar', `mini-sidebar-${placement}`]" ref="miniSidebar">
    <ul class="bar-nav">
      <li class="bar-nav-item" @click="togglePanel(item)" v-for="(item, index) in panelList" :key="item.name || index" :class="{'is-active': visible && active && active.name === item.name}">
        <a href="javascript:;">{{item.label}}</a>
      </li>
    </ul>
    <div class="bar-main bar-panel" v-if="visible" :class="{'is-active': visible}" :style="visible && activeObj.width ? {width: activeObj.width, left: `-${activeObj.width}`} : ''">
      <transition :name="`fadein${placement}`" mode="out-in">
        <component :is="active && active.component"></component>
      </transition>
    </div>
  </section>
</template>

<script>
import { on, off } from '@/libs/dom'

// 使用 参看 './mini-sidebar-layout.vue'
export default {
  name: 'MiniSidebar',
  inject: ['attrStore', 'tabStore'],
  props: {
    /**
      [
        {label: '显示在侧边栏上的文字', name: '侧边栏的标记', component: VueComponent},
        {label: '显示在侧边栏上的文字', name: '侧边栏的标记', component: VueComponent}
      ]
     */
    data: {
      type: Array,
      required: true
    },
    // 显示方向
    placement: {
      type: String,
      default: 'right' // left | right
    }
  },
  data () {
    return {
      visible: false,
      active: null,
      newPanel: []
    }
  },
  computed: {
    panelList () {
      return this.newPanel.filter(item => !item.hidden)
    },
    activeObj () {
      return (this.attrStore && this.attrStore.states.active) || {}
    },
    activeTab() {
      return this.tabStore && this.tabStore.states.active
    }
  },
  watch: {
    visible (value) {
      const miniSidebar = this.$refs.miniSidebar.parentNode || document.body
      if (value) {
        on(miniSidebar, 'click', this.close)
      } else {
        off(miniSidebar, 'click', this.close)
      }
    },
    activeTab: {
      handler(value) {
        if (JSON.stringify(value) !== '{}' && value.tabType === 'computingTask') {
          this.newPanel = this.data
        } else {
          this.newPanel = this.data.map(item => {
            if (item.name === 'attr' || item.name === 'myfile') {
              return {
                ...item,
                hidden: false
              }
            } else {
              return {
                ...item,
                hidden: true
              }
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
  },
  methods: {
    close (ev) {
      if (ev.target.parentElement.id === '6666') {
        return
      }

      if (ev.target.innerText === '添加前置检查条件' || ev.target.innerText === '添加规则') {
        return
      }

      !ev.target.closest('.mini-sidebar') && this.hide()
    },
    togglePanel (item) {
      if (this.active && this.active.name === item.name) {
        this.visible = !this.visible
      } else {
        this.show(item)
      }
    },
    hide () {
      this.visible = false
      setTimeout(_ => this.$emit('close'), 300)
    },
    show (item) {
      if (item) {
        this.active = item
        this.visible = true
      }
    }
  }
}
</script>

<style lang="scss">
$z-index: 99;
.mini-sidebar {
  position: absolute;
  width: 30px;
  height: 100%;
  z-index: $z-index;

  $borderActive: lighten($--color-primary, 15%);
  $width: 750px;
  &.mini-sidebar-left {
    left: 0;
    top: 0;
    .bar-nav {
      &-item {
        &.is-active {
          border-right: 3px solid $borderActive;
        }
      }
    }
    .bar-main.bar-panel {
      border-right: 1px solid $grey6;
      display: none;
      transition: all 0.3s;
      &.is-active {
        opacity: 1;
        width: $width;
        left: 100%;
        display: block;
      }
    }
  }

  &.mini-sidebar-right {
    top: 0;
    right: 0;

    .bar-nav {
      &-item {
        &.is-active {
          border-left: 3px solid $borderActive;
        }
      }
    }

    .bar-main.bar-panel {
      border-left: 1px solid $grey6;
      &.is-active {
        opacity: 1;
        width: $width;
        left: -$width;
      }
    }
  }
  .bar-nav {
    font-size: 12px;
    width: 30px;
    height: 100%;
    background-color: $sideMenu;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    z-index: $z-index + 1;

    &-item {
      // text-shadow: 0 0 1px white;
      position: relative;
      z-index: 1;
      margin: 0;
      text-align: center;
      flex: none;
      cursor: pointer;
      &:not(:first-child) {
        border-top: 1px solid $headerBg;
      }
      a {
        display: inline-block;
        width: 16px;
        padding: 15px 0 10px;
        line-height: 16px;
        white-space: normal;
        word-break: break-all;
        vertical-align: middle;
        color: $grey5;
      }

      &.is-active,
      &.is-active:hover {
        background-color: $sideMenuActive;
        a {
          color: $grey9;
        }
      }

      &:hover {
        background-color: $sideMenuHover;
        a {
          color: $grey8;
        }
      }
    }
  }

  .bar-main.bar-panel {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 100%;
    // padding: 15px;
    background: white;
    overflow-x: hidden;
    overflow-y: auto;
    transition: $transition;
    opacity: 0;
    z-index: $z-index;
    box-sizing: border-box;
  }
}
</style>
