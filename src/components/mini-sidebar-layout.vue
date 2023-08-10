<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-06-18 09:08:33
 * @LastEditTime: 2023-05-14 16:52:43
 * @Description:
-->
<template>
  <section class="mini-sidebar-layout">
    <div :class="['ms-layout-main', `ms-layout-main-${placement}`, data.length ? '': 'padding-no']">
      <div :class="['ms-layout-body', bodyClass]">
        <slot></slot>
      </div>
    </div>
    <MiniSidebar v-if="data.length" ref="miniSideBar" :data="data" :placement="placement" @close="close"></MiniSidebar>
  </section>
</template>

<script>
import MiniSidebar from './mini-sidebar'

// 使用 参看 views/rd/dev/wellcome/index.vue
export default {
  name: '',
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
    },
    bodyClass: String
  },
  components: {
    MiniSidebar
  },
  data () {
    return {}
  },
  created () {
    this.$root.eventEmitter.on('hideSidebar', _ => {
      this.hideSidebar()
    })
  },
  methods: {
    setActiveSidebar (value) {
      this.$refs.miniSideBar.show(value)
    },
    hideSidebar () {
      this.$refs.miniSideBar.hide()
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.mini-sidebar-layout {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .ms-layout-main {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;

    .ms-layout-body {
      width: 100%;
      height: 100%;
    }
    &.ms-layout-main-left {
      padding-left: 30px;
      &.padding-no {
        padding-left: 0px;
      }
    }
    &.ms-layout-main-right {
      padding-right: 30px;
      &.padding-no {
        padding-right: 0px;
      }
    }
  }
}
</style>
