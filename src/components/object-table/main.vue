<template>
  <section class="object-table">
    <el-tabs v-model="activeTab" @tab-click="changeObjectList">
      <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name">
        <component :is="components[item.component]" v-if="activeTab === item.name" :module="module"></component>
      </el-tab-pane>
    </el-tabs>
    <el-tooltip content="定位">
      <router-link :to="path">
        <el-link :underline="false" class="font-16 location" icon="el-icon-location"></el-link>
      </router-link>
    </el-tooltip>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex' //eslint-disable-line
import { types } from '@/config/rd-config'

export default {
  name: 'ObjectList',
  inject: ['tabStore', 'components'],
  props: {
    data: Object
  },
  data () {
    return {
      types,
      tabs: [],
      module: '',
      activeTab: ''
    }
  },
  computed: {
    ...mapGetters(['project']),
    path () {
      return (
        (this.tabs.find(item => item.name === this.activeTab) || {}).path || ''
      )
    }
  },
  watch: {
    // 'tabStore.states.activeValue'(val) {
    //   if (val === types.OBJECTTABLE) {
    //     this.getTreeData()
    //   }
    // },
    tabs: {
      immediate: true,
      handler (val) {
        console.log(val)
      }
    },
    active: {
      immediate: true,
      handler (val) {
        this.activeTab = val
      }
    }
  },
  methods: {
    ...mapMutations({
      setTagFlag: 'SET_TAGFLAG'
    }),
    changeObjectList (tab) {
      this.setActive(tab.name)
      if (tab.name !== 'category') {
        this.setTagFlag({ flag: 'home', data: {} })
      }
    }
  }
}
</script>

<style lang="scss">
.object-table {
  height: 100%;
  background-color: $grey7;
  position: relative;

  .el-tabs {
    height: 100%;
    .el-tabs__header {
      padding: 0 10px;
      background-color: $grey10;
      .el-tabs__nav-wrap::after {
        background-color: $grey10;
      }
      .el-tabs__item {
        font-size: 12px;
      }
    }
    .el-tabs__content {
      height: calc(100% - 55px);
    }
  }
  .el-link.location {
    position: absolute;
    right: 15px;
    top: 12px;
  }
}
</style>
