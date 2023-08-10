<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-06-18 09:08:38
 * @LastEditTime: 2021-06-30 14:05:55
 * @Description:
-->
<template>
  <el-container class="layout" direction="vertical">
    <Header v-if="$route.path !== '/asset/log'"></Header>
    <el-main>
      <keep-alive :include="cacheList">
        <transition name="fadeinleft" mode="out-in">
          <router-view></router-view>
        </transition>
      </keep-alive>
    </el-main>
  </el-container>
</template>

<script>
import Header from './header.vue'
import {on, off} from '@/libs/dom'

export default {
  name: 'layout',
  components: {
    Header
  },
  data() {
    return {
      gs: '',
      menus: [],
      activeMenuName: '',
      isHome: false,
      visible: false
    }
  },
  computed: {
    cacheList() {
      // const list = this.
      return []
    }
  },
  mounted() {
    this.resize()
    on(window, 'resize', this.resize)
  },
  destroyed() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      const width = window.innerWidth
      this.visible = width < 992
    }
  }
}
</script>

<style lang="scss">
.layout {
  width: 100%;
  height: 100%;

  .el-main {
    padding: 0;
    height: calc(100% - 50px);
    overflow: hidden;
  }
}
</style>
