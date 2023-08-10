<template>
  <section class="logic-instance ops-aside side-view">
    <div class="sv-head">
      <strong>逻辑表实例</strong>
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

    <BussDay @change="getData" v-model="bussDay"></BussDay>

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
import BussDay from '@c/buss-day'
import {statusMap} from '@/config/ops-config'
import mixin from '../mixin'
import treeMixin from '@/mixins/ops-tree'
import {formateTimeGap} from '@/libs/util'

export default {
  name: 'LogicInstance',
  mixins: [treeMixin],
  components: {
    BussDay
  },
  data() {
    return {
      bussDay: '',
      status: {
        1: 'el-icon-error error',
        6: 'el-icon-remove info',
        0: 'el-icon-success success'
      }
    }
  },
  methods: {
    async getData() {
      this.loading++
      await this.$sleep(1000)
      // const res = await this.$simpleAsyncTo(getData({day: this.bussDay}), '获取数据失败')
      const res = treeData
      if (res) {
        this.treeData = res.data.map(item => {
          item.label = item.name
          item.children.forEach(c => {
            Object.assign(c, {
              label: c.taskName,
              id: c.nodeId
            })
          })
          return item
        })
      }
      this.loading--
    },
    renderContent(h, {node, data, store}) {
      let html = ''
      if (data.leaf) {
        html = (
          <span class="node-leaf custom-node">
            <i class={`status-icon ${(statusMap[data.status] || {}).icon}`}></i>
            <span class="node-content">
              <span class="node-icon">
                <i class="icon font-16 iconfont icon-MxSQL"></i>
              </span>
              <OverflowTooltip>
                <span class="node-id info">{data.nodeId}</span>
              </OverflowTooltip>
              <span class="node-name">
                <OverflowTooltip>
                  <span class="node-row">{data.label}</span>
                </OverflowTooltip>
                <OverflowTooltip>
                  <span class="node-row info">
                    {this.getTime(data.executeTimeEntity)}
                  </span>
                </OverflowTooltip>
              </span>
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
                <OverflowTooltip>
                  <span class="node-row">{`${data.label}(${data.children.length})`}</span>
                </OverflowTooltip>
                <OverflowTooltip>
                  <span class="node-row info">
                    {this.getTime(data.executeTimeEntity)}
                  </span>
                </OverflowTooltip>
              </span>
            </span>
          </span>
        )
      }
      return html
    },
    getTime(data) {
      if (!data) {
        return '--'
      }
      const {executeStartTime, executeEndTime} = data
      // const gap = formateTimeGap(new Date(executeEndTime).getTime() - new Date(executeStartTime).getTime())
      const gap = formateTimeGap(executeEndTime, executeStartTime)
      return `${executeStartTime} 至 ${executeEndTime}(${gap})`
    },
    nodeClick(data, node) {
    }
  }
}
</script>
