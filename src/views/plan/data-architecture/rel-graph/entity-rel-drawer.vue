<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-30 15:55:30
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-07 09:38:34
 * @FilePath: \数据智能构建\src\views\plan\data-architecture\rel-graph\entity-rel-drawer.vue
-->
<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    direction="rtl"
    :modal="false"
    size="68%"
    :wrapperClosable="false"
    @close="close"
  >
    <div class="graph-wrapper" v-loading="loading">
      <div>
        <div class="legend">
          <GraphLegend :list="legendList" style="width:auto" legendType="1"></GraphLegend>
          <el-divider direction="vertical"></el-divider>
          <GraphLegend :list="legendList1" style="width:auto" legendType="2"></GraphLegend>
        </div>
        <div class="entity-graph-screen" ref="entityGraph"></div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import GraphLegend from './graph-legend.vue'
import { queryEntityRelDiagram } from '@/api/plan/data-architecture.js'
import EvtityRel from './entity-rel-mixin'
export default {
  name: 'EntityRelDrawer',
  mixins: [EvtityRel],
  props: {
    currentData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    GraphLegend
  },
  data() {
    return {
      drawer: true,
      loading: false,
      legendList: [],
      legendList1: [],
      title: ''
    }
  },
  mounted() {
    this.title = (this.currentData.nodeBaseData || {}).nodeName
  },
  methods: {
    close() {
      this.$emit('close', false)
    },
    // 实体关系图数据
    async _queryEntityRelDiagram(graph) {
      const res = await this.$simpleAsyncTo(queryEntityRelDiagram({entity_id: this.currentData.id}), '获取实体关系数据失败')
      if (res) {
        const { nodes = [], edges } = res.data
        this.legendList = Array.from(new Set(nodes.map(d => d.type)))
        this.legendList1 = Array.from(new Set(edges.map(d => d.row_type)))
        this.graphData = {
          nodes,
          edges
        }
        
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-drawer__wrapper {
  z-index: 1000;
  ::v-deep {
    .el-drawer__container {
      height: calc(100% - 155px);
      top: 143px;
      .el-drawer {
        box-shadow: -6px 0 16px -8px rgba(0,0,0,.08), -9px 0 28px 0 rgba(0,0,0,.05), -12px 0 48px 16px rgba(0,0,0,.03);
        .el-drawer__header {
          padding: 17px 20px;
          margin-bottom: 0;
          > span {
            font-weight: 500;
            font-size: 14px;
            line-height: 22px;
            color: rgba(0,0,0,.85);
          }
        }
        .el-drawer__body {
          padding: 20px;
        }
      }
    }
  }
  .graph-wrapper {
    height: 100%;
    > div {
      height: 100%;
      .legend {
        display: flex;
        align-items: center;
      }
      .entity-graph-screen {
        height: calc(100% - 40px);
      }
    }
  }
}
</style>