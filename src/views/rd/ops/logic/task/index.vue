<template>
  <section class="logic-task ops-aside side-view">
    <div class="sv-head">
      <strong>逻辑表任务</strong>
      <span>
        <i class="icon el-icon-refresh-right font-16" @click="getData"></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input
        class="dark-input"
        v-model="keyword"
        placeholder="逻辑表名或物理节点名"
        prefix-icon="iconfont icon-guolv"
      ></el-input>
    </div>
    <ul class="ops-aside-tabs">
      <li class="ops-aside-tabs-item is-active">逻辑表名</li>
    </ul>
    <div class="ops-aside-body" v-loading="!!loading">
      <OpsNodata v-if="!treeData.length"></OpsNodata>
      <template v-else>
        <el-tree
          class="sv-tree ops-aside-tree"
          ref="tree"
          :data="treeData"
          :render-content="renderContent"
          @node-click="nodeClick"
        ></el-tree>
        <div class="ops-aside-nomore">没有更多了</div>
      </template>
    </div>
    <ColumnPane
      :data="columnData"
      :visible.sync="visibleColumnPane"
      :style="{left: `${splitWidth}`}"
    ></ColumnPane>
  </section>
</template>

<script>
import {treeData} from './data'
import {logicTypeMapIcon} from '@/config/rd-config'
import OverflowTooltip from '@c/overflow-tooltip'
import mixin from '../mixin'
import treeMixin from '@/mixins/ops-tree'

export default {
  name: 'LogicTask',
  mixins: [mixin, treeMixin],
  data() {
    return {
      loading: 0,
      activeTab: 'task',
      keyword: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      this.loading++
      this.$sleep(1000)
      // const res = await this.$simpleAsyncTo(getData(), '获取数据失败')
      const res = treeData
      if (res) {
        this.treeData = res.data.map(item => {
          item.label = item.name
          item.children.forEach(c => {
            Object.assign(c, {
              label: c.nodeName,
              id: c.nodeId
            })
          })
          return item
        })
      }
      this.loading--
    },
    processData(source, target) {
      source.forEach(s => {
        target.push({})
      })
    },
    renderContent(h, {node, data, store}) {
      let html = ''
      if (data.leaf) {
        html = (
          <span class="node-leaf custom-node">
            <span class="node-content">
              <span class="node-icon">
                <i class="icon iconfont icon-MxSQL"></i>
              </span>
              <OverflowTooltip>
                <span class="node-id">{data.nodeId}</span>
              </OverflowTooltip>
              <OverflowTooltip>
                <span class="node-name">{data.label}</span>
              </OverflowTooltip>
            </span>
            <span class="node-controls">
              <el-tooltip
                popper-class="dark-popper"
                placement="top"
                content="查看字段"
              >
                <i
                  class="icon font-16 iconfont icon-ziduangeshi"
                  on-click={e => this.showColumns(e, {data, node})}
                ></i>
              </el-tooltip>
            </span>
          </span>
        )
      } else {
        html = (
          <span class="custom-node">
            <span class="node-content">
              <i class={logicTypeMapIcon[data.type] + ' icon font-18 info'}></i>
              <span class="node-name">
                &nbsp;{`${data.label}(${data.children.length})`}
              </span>
            </span>
          </span>
        )
      }
      return html
    },
    nodeClick(data, node) {
    }
  }
}
</script>

<style lang="scss"></style>
