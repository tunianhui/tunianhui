<template>
  <section class="task-manual ops-aside side-view" v-loading="!!loading">
    <div class="sv-head">
      <strong>手动任务</strong>
      <span>
        <i class="icon el-icon-refresh-right font-16" @click="getData"></i>
      </span>
    </div>
    <div class="sv-search">
      <el-input class="dark-input" v-model="keyword" placeholder="输入节点名称或ID" prefix-icon="iconfont icon-guolv"></el-input>
    </div>
    <el-checkbox-group v-model="checked">
      <el-checkbox v-for="item in checkList" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
    </el-checkbox-group>
    <ul class="ops-aside-tabs">
      <li v-for="tab in tabs" :key="tab.value" :class="['ops-aside-tabs-item', {'is-active': activeTab === tab.value}]" @click="changeTab(tab)">{{ tab.label }}</li>
    </ul>
    <el-row class="ops-aside-list-header" :gutter="10">
      <el-col :span="8">Node ID</el-col>
      <el-col :span="10">节点名称</el-col>
      <el-col :span="6">更新时间</el-col>
    </el-row>
    <div class="ops-aside-body ops-aside-list-body" ref="ops">
      <OpsNodata v-if="!tableData.length"></OpsNodata>
      <template v-else>
        <el-popover v-for="row in filterData" trigger="hover" placement="right" popper-class="dark-popper" :key="row.id" :width="320" :open-delay="300">
          <el-row slot="reference" @click="nodeClick(row)">
            <el-col :span="8">
              <i class="font-16 iconfont icon-MxSQL node-icon ml-5"></i>
              <OverflowTooltip>
                <span class="info node-id">{{ row.nodeId }}</span>
              </OverflowTooltip>
            </el-col>
            <el-col :span="10">
              <OverflowTooltip>
                <p class="node-label node-row mr-10">{{ row.nodeName }}</p>
              </OverflowTooltip>
            </el-col>
            <el-col :span="6">
              <OverflowTooltip>
                <p class="node-label node-row">{{ row.timeInfo.createTime }}</p>
              </OverflowTooltip>
            </el-col>
          </el-row>
          <el-form label-suffix="：" label-width="90px">
            <el-form-item label="Node ID">{{ row.nodeId }}</el-form-item>
            <el-form-item label="节点名称">{{ row.nodeName }}</el-form-item>
            <el-form-item label="负责人">{{ row.userInfo.owner.userName }}</el-form-item>
            <el-form-item label="运行时间">{{ row.timeInfo.createTime }}</el-form-item>
          </el-form>
        </el-popover>
        <div class="ops-aside-nomore" v-if="isShow">没有更多了</div>
      </template>
    </div>
  </section>
</template>

<script>
import OpsNodata from '@c/ops-nodata'
import OverflowTooltip from '@c/overflow-tooltip'
import { getTableList } from '@/api/rd/ops'
import mixins from '@/mixins/ops-tree'

export default {
  name: 'TaskManual',
  components: {
    OpsNodata,
    OverflowTooltip
  },
  mixins: [mixins],
  data () {
    return {
      checked: [],
      activeTab: 'routine',
      checkList: [
        { value: '1', label: '我的节点' },
        { value: '11', label: '今天发布' }
      ],
      tabs: [{ value: 'routine', label: '常规任务' }],
      tableData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    changeTab (tab) {
      this.activeTab = tab.value
    },
    async getData () {
      this.loading++
      const params = {
        pageRow: this.pageRow,
        pageSize: this.currentPage
      }
      const res = await this.$simpleAsyncTo(
        getTableList(params),
        '获取列表失败'
      )
      if (res) {
        this.total = res.total
        this.tableData = this.tableData.concat(res.data)
        if (this.currentPage === Math.ceil(this.total / this.pageRow)) {
          this.isShow = true
        }
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss"></style>
