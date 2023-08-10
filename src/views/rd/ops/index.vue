<template>
  <section class="ops-layout">
    <router-view v-if="modelRoute.includes($route.path)"></router-view>
    <Split v-model="splitWidth" max="550px" min="44px" v-else>
      <SideNav slot="left" :collapse.sync="collapse" :visibleQuicklyAdd="false"></SideNav>
      <template slot="right">
        <component ref="mainComp" :is="components[activeComp.name]" :data="activeComp.data"></component>
      </template>
    </Split>
    <component :is="components[activeDialogComp]" :data="activeNode" :visible="!!activeDialogComp"></component>
  </section>
</template>

<script>
import Split from '@c/split'
import SideNav from '../layout/sidenav'
import { mapMutations, mapGetters } from 'vuex'
import components from './components'
import '@/assets/css/side-view.scss'
import '@/assets/css/ops-aside.scss'

export default {
  name: 'Ops',
  components: {
    SideNav,
    Split
  },
  // 兼容开发、萃取的组件
  provide: {
    tabStore: {},
    components,
    editComponents: {},
    editComponentsMap: {}
  },
  data () {
    const width = '425px'
    return {
      splitWidth: width,
      initialSplitWidth: width,
      collapse: false,
      components,
      modelRoute: ['/rd/ops/node-code', '/rd/ops/run-log'],
      visibleDialog: false
    }
  },
  computed: {
    ...mapGetters({
      activeComp: 'ops/activeComp',
      activeNode: 'ops/activeNode',
      activeDialogComp: 'ops/activeDialogComp'
    })
  },
  watch: {
    collapse (val) {
      if (this.isSplitChange) {
        this.isSplitChange = false
      } else {
        this.splitWidth = val ? '45px' : this.initialSplitWidth
        this.isCollpaseChange = true

        this.rendererGraph()
      }
      this.setCollapse(val)
    },
    splitWidth (val) {
      this.setSplitWidth(val)
      if (this.isCollpaseChange || this.isSplitChange) {
        this.isCollpaseChange = false
        this.isSplitChange = false
        return
      }
      if (parseFloat(val) < 300) {
        this.collapse = !this.collapse
      } else {
        if (this.collapse) {
          this.collapse = false
          this.isSplitChange = true
        }

        this.rendererGraph()
      }
    }
  },
  methods: {
    ...mapMutations({
      setCollapse: 'SET_COLLAPSE',
      setSplitWidth: 'ops/SET_SPLIT_WIDTH'
    }),
    rendererGraph () {
      const mainComp = this.$refs.mainComp
      mainComp.changeGraphSize && mainComp.changeGraphSize()
    }
  }
}
</script>

<style lang="scss">
.ops-layout {
  width: 100%;
  height: 100%;
  .msl-aside.msl-aside-collapsed {
    .t-opreate {
      margin: 0px;
    }
    .navs {
      height: 1000%;
    }
  }
}
</style>
