<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 15:53:42
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-13 17:08:50
 * @FilePath: \智能数据构建\src\views\rd\operation-new\pages\cycle-example\index.vue
-->
<template>
  <div class="cycle-example" ref="cycleExample">
    <TabsHeader
      title="周期实例"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">我的实例</el-checkbox>
          <el-checkbox label="2">失败实例</el-checkbox>
          <el-checkbox label="3">未完成实例</el-checkbox>
        </el-checkbox-group>
        <!-- <div style="display: flex; font-size: 12px; align-items: center;">
          <span class="ml-10 mr-10">业务日期</span>
          <SelectQuickTime v-model="time" :options="options" class="custom-select-quick-time" width="250px"></SelectQuickTime>
        </div> -->
        <span class="mr-10 ml-10">
          <el-input v-model="searchVal" placeholder="请输入实例对象名称或ID" @input="inputSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </span>
        <el-button @click="showFileterItem = !showFileterItem">
          <i class="iconfont icon-filter"></i>
          {{showFileterItem ? '收起' : '筛选'}}
        </el-button>
        <el-button @click="refresh">
          <i class="el-icon-refresh-right"></i>
        </el-button>
      </div>
    </TabsHeader>
    <SearchItemConfig
      @change="changeSearchItem"
      :style="{height: showFileterItem ? '' : '0', overflow: 'hidden'}"
      :filterOptions="filterOptions"
      :showMore="false"
      class="mb-5"
      ref="searchItemConfig"
      v-resize="resizeDom"
    ></SearchItemConfig>
    <div class="table-wrapper" :style="{height: `${height}px)`}">
      <PageTableLayout :showDag="showDag" :height="height" @leftClickHange="showDag = false">
        <template v-slot:left>
          <ScriptTableExample
            :height="height - 36"
            @showDagHande="showDagHande"
            @refresh="refresh"
            @rowClick="rowClick"
            :showDag="showDag"
            :loading="loadingTable"
            :showCheckBox="false"
            :data="tableData"
          ></ScriptTableExample>
          <PageBottomTips
            :showPageCheck="false"
            :showDag="showDag"
            :actiosList="scriptActiosList"
            :currentPage="currentPage"
            :total="total"
            @stopHander="stopHander"
            @currentChange="currentPageChange"
            @changeCheck="changeCheck"
          ></PageBottomTips>
        </template>
        <template v-slot:right>
          <FlowWrapper
            pageType="cycleInstance"
            :data="graphData"
            :loading="graphLoading"
            :mainId="mainId"
            @command="command"
          ></FlowWrapper>
        </template>
      </PageTableLayout>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import TabsHeader from '@c/tabs-header'
import SelectQuickTime from '../../component/select-time.vue'
import SearchItemConfig from '../../component/search-item.vue'
import PageBottomTips from '../../component/page-bottom-tips.vue'
import PageTableLayout from '../../component/page-table-layout.vue'
import ScriptTableExample from './script-table.vue'
import DetailTableCucleExample from './detail-table.vue'
import FlowWrapper from '../../component/flow/index.vue'
import { mapGetters } from 'vuex'
import {
  getOwnerList,
  getCycleExampleList,
  getDag
} from '@/api/rd/operation-new/cycle-example.js'
export default {
  name: 'CycleExample',
  components: {
    TabsHeader,
    SelectQuickTime,
    SearchItemConfig,
    PageBottomTips,
    PageTableLayout,
    ScriptTableExample,
    DetailTableCucleExample,
    FlowWrapper
  },
  watch: {
    checkList: {
      handler(val) {
        this.currentPage = 1
        this.getCycleExampleList()
      },
      deep: true
    },
    searchData: {
      handler(val) {
        this.currentPage = 1
        this.getCycleExampleList()
      },
      deep: true
    },
  },
  data() {
    return {
      height: 0,
      time: [],
      checkList: [],
      searchVal: '',
      showFileterItem: false,
      options: [
        { label: '今天', value: '1', fn: () => [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
        { label: '昨天', value: '2', fn: () => [dayjs().subtract(1, 'd').format('YYYY-MM-DD'), dayjs().subtract(1, 'd').format('YYYY-MM-DD')] },
        { label: '全部', value: '3', fn: () => [] },
      ],
      filterOptions: [
        {
          label: '负责人',
          key: 'operUser',
          operUser: '',
          type: 'select-one',
          options: []
        },
        {
          label: '运行状态',
          key: 'status',
          status: '',
          type: 'select-one',
          options: [
            { label: '未运行', value: '0' },
            { label: '运行中', value: '1' },
            { label: '暂停', value: '3' },
            { label: '成功', value: '7' },
            { label: '失败', value: '6' },
            { label: '停止', value: '5' }
          ]
        },
        {
          label: '调度周期',
          key: 'jobCycle',
          jobCycle: [],
          type: 'checkbox',
          options: [
            { label: '分钟', value: 'MINUTE' },
            { label: '小时', value: 'HOUR' },
            { label: '日', value: 'DAILY' },
            { label: '周', value: 'WEEK' },
            { label: '月', value: 'MONTH' },
            { label: '年', value: 'YEAR' }
          ]
        },
          {
          label: '运行方式',
          key: 'jobType',
          jobType: [],
          type: 'checkbox',
          options: [
            { label: '正常运行', value: '0' },
            { label: '暂停运行', value: '1' }
          ]
        },
        {
          label: '开始运行',
          key: 'startRunTime',
          startRunTime: [],
          type: 'time',
          typeView: 'datetimerange',
          valueFormat: 'YYYY-MM-DD HH:mm:ss',
          options: [
            { label: '最近一小时', value: '1', fn: () => [dayjs().subtract(1, 'h').format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')], minWidth: '86px' },
            { label: '今天', value: '2', fn: () => [dayjs().format('YYYY-MM-DD HH:mm:ss'), dayjs().format('YYYY-MM-DD HH:mm:ss')] },
            { label: '昨天', value: '3', fn: () => [dayjs().subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss'), dayjs().subtract(1, 'd').format('YYYY-MM-DD HH:mm:ss')] },
          ]
        }
      ],
      activeTab: 'script',
      showDag: false,
      scriptActiosList: [
        // { name: '重跑', icon: 'iconfont icon-zhongpao', command: 'rerunHandle' },
        // { name: '终止', icon: 'iconfont icon-zhongzhi', command: 'terminationHandle' },
        // { name: '暂停', icon: 'el-icon-video-pause', command: 'stopHander' },
        // { name: '恢复', icon: 'iconfont icon-huifu', command: 'restoreHander' }
      ],
      graphData: {},
      graphLoading: false,
      currentPage: 1,
      total: 0,
      searchData: {},
      loadingTable: false,
      tableData: [],
      mainId: ''
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  created() {
    console.log(this.project)
    this.getOwnerList()
    this.getCycleExampleList()
  },
  methods: {
    refresh() {
      this.getCycleExampleList()
    },
    changeSearchItem(data) {
      console.log(data)
      this.searchData = data
    },
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const pageHeaderHeight = 40
        // const pageTabsHeight = 40
        const pageHeaderMarginBottom = 5
        // const tabsMarginBottom = 15
        const pageHeight = this.$refs.cycleExample.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageHeaderMarginBottom + pagePaddingTop)
      })
    },
    rowClick(row) {
      this.showDag = true
      this.getGraphData(row)
    },
    changeCheck() {},
    stopHander() {
      const h = this.$createElement;
      this.$confirm('提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [
            h('p', {style: ''}, '确定暂停全部已选实例吗？'),
            h('p', { style: 'color: rgba(0,0,0,0.65);font-size:12px' }, '')
          ]),
      }).then(() => {
        this.$message({
          type: 'success',
          message: '暂停成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消暂停'
        })
      })
    },
    rerunErrorHandle() {
      console.log(123)
    },
    // 置成功继续调度
    continueSchedulingHandle() {
      const h = this.$createElement;
      this.$confirm('置成功继续调度', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [
            h('p', {style: ''}, '请谨慎操作！确定将此实例成功并恢复未执行的调度吗？'),
          ]),
      }).then(() => {
        this.$message({
          type: 'success',
          message: '置成功继续调度成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消置成功继续调度'
        })
      })
    },
    showDagHande(row) {
      console.log(row)
      this.getGraphData(row)
      this.showDag = true
      this.mainId = row.id
    },
    async getGraphData(row) {
      this.graphLoading = true
      await this.$sleep(1000)
      const res = await this.$simpleAsyncTo(getDag({
        code: row.code,
        projectId: this.project.project_id,
        type: 'cycleInstance',
        id: row.id
      }), '获取DAG图失败')
      if(res) {
        const { taskDefinitionList, processTaskRelationList } = res.data
        const nodes = []
        taskDefinitionList.map(d => {
          const node = {
            ...d,
            type: d.task_type,
            id: d.id + ''
          }
          nodes.push(node)
        })
        const edges = []
        processTaskRelationList.map(d => {
          if (d.pre_task_code != 0) {
            const source = nodes.find(item => item.code === d.pre_task_code)
            const target = nodes.find(item => item.code === d.post_task_code)
            edges.push({
              source: source.id + '',
              target: target.id + ''
            })
          }
        })
        this.graphData = JSON.parse(JSON.stringify({
          nodes,
          edges
        }))
      }
      this.graphLoading = false
    },
    command(data) {
      console.log(data, 'command')
    },
    // 获取负责人列表
    async getOwnerList() {
      const res = await this.$simpleAsyncTo(getOwnerList({
        project_id: this.project.project_id
      }), '获取负责人列表失败')
      if (res) {
        const operUser = this.filterOptions.find(item => item.key === 'operUser')
        operUser.options = res.data.map(item => ({ label: item.user_name, value: item.user_id }))
      }
    },
    // 获取实例列表
    async getCycleExampleList() {
      this.loadingTable = true
      console.log(this.project)
      const params = {
        searchVal: this.searchVal,
        pageNo: this.currentPage,
        pageSize: 10,
        projectId: this.project.project_id,
        isMy: this.checkList.includes('1') ? 1 : 0,
        isFail: this.checkList.includes('2') ? 1 : 0,
        isComplete: this.checkList.includes('3') ? 1 : 0,
      }
      for (const key in this.searchData) {
        if (this.searchData.hasOwnProperty(key)) {
          if (key === 'startRunTime') {
            params['startTime'] = this.searchData[key][0]
            params['endTime'] = this.searchData[key][1]
          } else {
            if (typeof this.searchData[key] === 'string') {
              params[key] = this.searchData[key]
            } else {
              params[key] = JSON.stringify(this.searchData[key])
            }
          }
        }
      }
      const res = await this.$simpleAsyncTo(getCycleExampleList(params), '获取实例列表失败')
      if (res) {
        this.tableData = res.data.map(d => {
          d.check = false
          return d
        })
        this.total = res.totalRecords
      }
      this.loadingTable = false
    },
    currentPageChange(val) {
      this.currentPage = val
      this.getCycleExampleList()
    },
    inputSearch(val) {
      this.currentPage = 1
      this.getCycleExampleList()
    },
  }
}
</script>

<style lang="scss" scoped>
.cycle-example {
  padding: 10px 15px 0px 15px;
  height: 100%;
  background-color: rgb(229, 228, 233);
  ::v-deep {
    .el-checkbox__label {
      font-size: 12px;
    }
  }
  .content-wrapper {
    height: calc(100% - 40px);
  }
  ::v-deep {
    .el-checkbox__label {
      font-size: 12px;
      color: rgba(0,0,0,0.85);
    }
  }
  .table-wrapper {
    padding-bottom: 36px;
    position: relative;
  }
  .custom-select-quick-time {
    ::v-deep {
      .quick-item-wrapper {
        .item:first-child {
          border-radius: 4px 0 0 4px;
        }
        .item:last-child {
          border-radius: 0 4px 4px 0px;
        }
      }
    }
  }
}
</style>