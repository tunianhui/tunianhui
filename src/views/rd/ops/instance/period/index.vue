<template>
  <section class="instance-period ops-aside side-view">
    <div class="sv-head">
      <strong>周期实例</strong>
      <span>
        <i class="icon el-icon-refresh-right font-16" @click="refresh"></i>
      </span>
    </div>

    <div class="sv-search">
      <el-input class="dark-input" v-model="keyword" placeholder="输入节点名称或ID" prefix-icon="iconfont icon-guolv" @keyup.native.enter.stop="refresh"></el-input>
      <input type="hidden" />
    </div>
    <div class="checkbox-group">
      <el-checkbox v-model="isCreate" @change="refresh">我的实例</el-checkbox>
      <el-checkbox v-model="isError" @change="refresh">出错实例</el-checkbox>
      <el-checkbox v-model="isComplete" @change="refresh">未完成实例</el-checkbox>
    </div>

    <BussDay @change="changeBussDay" v-model="bussDay"></BussDay>

    <ul class="ops-aside-tabs">
      <li v-for="tab in tabs" :key="tab.value" :class="['ops-aside-tabs-item', {'is-active': activeTab === tab.value}]" @click="changeTab(tab)">{{ tab.label }}</li>
    </ul>

    <el-row class="ops-aside-list-header" :gutter="10">
      <el-col :span="8">Node ID</el-col>
      <el-col :span="16">节点名称</el-col>
    </el-row>
    <div class="ops-aside-body" v-scroll-load="loadTreeData">
      <OpsNodata v-if="!treeData.length"></OpsNodata>
      <template v-else>
        <div class="ops-aside-list-body" v-loading="!!loading">
          <el-row v-for="row in filterData" :key="row.cube_id" :class="{'is-active': row.cube_id === activeNode.cube_id}" @click.native="nodeClick(row)">
            <el-col :span="8">
              <i :class="`${(statusMap[row.status] || {}).icon} font-16 status`"></i>
              <i class="font-16 iconfont icon-MxSQL node-icon"></i>
              <OverflowTooltip>
                <span class="info node-id" v-html="$highlightKeyword(row.cube_id, keyword)"></span>
              </OverflowTooltip>
            </el-col>
            <el-col :span="16">
              <OverflowTooltip>
                <p class="node-label node-row mr-10" v-html="$highlightKeyword(row.name, keyword)"></p>
              </OverflowTooltip>
              <OverflowTooltip>
                <p class="info node-row">{{ row.time }}</p>
              </OverflowTooltip>
            </el-col>
          </el-row>
        </div>
        <div class="ops-aside-nomore">没有更多了</div>
      </template>
    </div>
  </section>
</template>

<script>
import { statusMap } from '@/config/ops-config'
import BussDay from '@c/buss-day'

import { listCycleInstance } from '@/api/rd/ops'
import { formateTimeGap } from '@/libs/util'
import mixins from '@/mixins/ops-tree'

export default {
  name: 'InstancePeriod',
  components: {
    BussDay
  },
  mixins: [mixins],
  data () {
    return {
      statusMap,
      activeTab: 'logic',
      tabs: [
        // {value: 'common', label: '常规实例'},
        { value: 'logic', label: '逻辑表物理化实例' }
      ],
      isCreate: false,
      isError: false,
      isComplete: false,
      bussDay: '',
      instance_id: ''
    }
  },
  async created () {
    const id = this.$route.params.id
    const instance_id = this.$route.params.instance_id
    this.keyword = id || ''
    this.instance_id = instance_id || ''
    await this.getData()
    if (id) {
      const row = this.treeData.find(d => d.cube_id === id)
      row && this.nodeClick(row)
    }
    if (!id && instance_id) {
      const row = this.treeData.find(d => d.instance_id === instance_id)
      row && this.nodeClick(row)
    }
  },
  methods: {
    changeTab (tab) {
      this.activeTab = tab.value
      this.getData()
    },
    changeBussDay (bussDay) {
      this.bussDay = bussDay
      this.refresh()
    },
    async getData () {
      this.loading++
      const res = await this.$simpleAsyncTo(
        listCycleInstance({
          projectName: this.project.project_name,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
          keyword: this.keyword,
          isToday: this.isToday,
          isCreate: this.isCreate,
          isError: this.isError,
          isComplete: this.isComplete,
          repair_date: this.bussDay,
          cube_id: this.keyword,
          instance_id: this.instance_id
        }),
        '获取列表失败'
      )
      if (res) {
        this.isEnd = res.isEnd

        this.treeData = this.treeData.concat(
          res.data.map(item => {
            item.time = this.getTime(item)
            item.name = item.job_name
            return item
          })
        )
      }
      this.loading--
    },
    getTime (data) {
      if (!data) {
        return '--'
      }
      const { start_date, end_date } = data
      const gap = formateTimeGap(start_date, end_date)
      return `${start_date} 至 ${end_date}(${gap})`
    },
    nodeClick (row) {
      this.setActiveComp({
        name: 'InstancePeriodGraph',
        data: row,
        type: 'instance-period'
      })
      this.setActiveNode(row)
      this.$root.eventEmitter.emit('changeGraph')
    }
  }
}
</script>
