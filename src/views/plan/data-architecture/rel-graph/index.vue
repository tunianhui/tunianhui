<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-29 09:30:12
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-05-31 10:40:02
 * @FilePath: \数据智能构建\src\views\plan\data-architecture\rel-graph\index.vue
-->
<template>
  <div class="rel-graph">
    <GraphLegend :list="viewNodeTypeList" legendType="1"></GraphLegend>
    <div class="graph" ref="graphContainer"></div>
    <EntityRelDrawer v-if="drawer" :currentData="currentEntityRelData" @close="drawer = false"></EntityRelDrawer>
  </div>
</template>

<script>
import GraphLegend from './graph-legend.vue'
import EntityRelDrawer from './entity-rel-drawer.vue'
import graph from './graph'
import {
  queryDataFieldRelDiagram,
} from '@/api/plan/data-architecture'
export default {
  name: 'RelGraph',
  components: {
    GraphLegend,
    EntityRelDrawer
  },
  props: {
    businId: {
      type: String,
      required: true
    }
  },
  mixins: [graph],
  watch: {
    businId: {
      handler(val) {
        if (val) {
          // this.getGraphData()
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      drawer: false,
      viewNodeTypeList: []
    }
  },
  methods: {
    // 获取关系图数据
    async getGraphData() {
      const res = await this.$simpleAsyncTo(queryDataFieldRelDiagram({busin_id: this.businId}), '获取关系图数据失败')
      if (res) {
        const nodes = []
        const edges = []
        this.flattenNestedArray(nodes, edges, [res.data])
        const list = []
        nodes.map(d => {
          const { type } = d.data
          list.push(type)
        })
        this.viewNodeTypeList = Array.from(new Set(list))
        return { nodes, edges }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.rel-graph {
  position: relative;
  height: 100%;
  background: #fff;
  // padding-top: 40px;
  .graph {
    height: 100%;
  }
}
</style>