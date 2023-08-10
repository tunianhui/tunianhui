<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 15:40:15
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-13 17:09:53
 * @FilePath: \智能数据构建\src\views\rd\operation-new\pages\cycle-task\index.vue
-->
<template>
  <div class="cycle-task" ref="cycleTask">
    <TabsHeader
      title="周期任务"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">我的任务</el-checkbox>
          <el-checkbox label="2">已暂停任务</el-checkbox>
        </el-checkbox-group>
        <span class="mr-10 ml-10">
          <el-input v-model="searchVal" placeholder="请输入任务对象名称或ID" @input="inputSearch">
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
    <!-- <TabsHeader
      title=" "
      :tabs="tabs"
      :active="activeTab"
      height="40px"
      class="mb-15"
      :borderBottomWrapper="true"
      @tab-click="tab => activeTab = tab.name"
    >
    </TabsHeader> -->
    <div class="table-wrapper" :style="{height: `${height}px)`}">
      <PageTableLayout :showDag="showDag" :height="height" @leftClickHange="showDag = false">
        <template v-slot:left>
          <ScriptTable
            :height="height - 36"
            @showDagHande="showDagHande"
            @rowClick="rowClick"
            @refresh="refresh"
            :showDag="showDag"
            :loading="loadingTable"
            :data="tableData"
            :showCheckBox="false"
          ></ScriptTable>
          <PageBottomTips
            :showDag="showDag"
            :actiosList="actiosList"
            :total="total"
            :currentPage="currentPage"
            :showPageCheck="false"
            @stopHander="stopHander"
            @changeCheck="changeCheck"
            @currentChange="currentPageChange"
          ></PageBottomTips>
        </template>
        <template v-slot:right>
          <FlowWrapper
            pageType="cycle"
            :data="graphData"
            :loading="graphLoading"
          ></FlowWrapper>
        </template>
      </PageTableLayout>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import TabsHeader from '@c/tabs-header'
import SearchItemConfig from '../../component/search-item.vue'
import ScriptTable from './script-table.vue'
import PageBottomTips from '../../component/page-bottom-tips.vue'
import PageTableLayout from '../../component/page-table-layout.vue'
import FlowWrapper from '../../component/flow'
import { getCycleTaskList, getOwnerList, getDag } from '@/api/rd/operation-new/cycle-task'
import { mapGetters } from 'vuex'
export default {
  name: 'CycleTask',
  components: {
    TabsHeader,
    SearchItemConfig,
    ScriptTable,
    PageBottomTips,
    PageTableLayout,
    FlowWrapper
  },
  computed: {
    ...mapGetters(['project']),
  },
  data() {
    return {
      tabs: [
        { label: '脚本', name: 'script' },
        { label: '明细及汇总表', name: 'detail' }
      ],
      activeTab: 'script',
      checkList: [],
      searchVal: '',
      showFileterItem: false,
      filterOptions: [
        {
          label: '负责人',
          key: 'operUser',
          operUser: '',
          type: 'select-one',
          options: []
        },
        {
          label: '调度方式',
          key: 'jobType',
          jobType: [],
          type: 'checkbox',
          options: [
            { label: '正常调度', value: '0' },
            { label: '暂停调度', value: '1' }
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
          label: '更新时间',
          key: 'updateTime',
          updateTime: [],
          type: 'time',
          options: [
            { label: '今天', value: '1', fn: () => [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
            { label: '昨天', value: '2', fn: () => [dayjs().subtract(1, 'd').format('YYYY-MM-DD'), dayjs().subtract(1, 'd').format('YYYY-MM-DD')] },
          ]
        }
      ],
      height: 0,
      actiosList: [
        // { name: '暂停', icon: 'el-icon-video-pause', command: 'stopHander' },
        // { name: '恢复', icon: 'iconfont icon-huifu', command: 'restoreHander' },
        // { name: '修改负责人', icon: 'iconfont icon-zerenren', command: 'editOwerHander' },
        // { name: '修改优先级', icon: 'iconfont icon-yuanbiao-xianxing', command: 'editPriorityHander' }
      ],
      showDag: false,
      graphLoading: false, // 图表loading
      loadingTable: false, // 表格loading
      searchData: {},
      total: 0,
      tableData: [],
      currentPage: 1,
      graphData: {},
    }
  },
  watch: {
    searchData: {
      handler(val) {
        this.currentPage = 1
        this.getCycleTaskList()
      },
      deep: true
    },
    checkList: {
      handler(val) {
        this.currentPage = 1
        this.getCycleTaskList()
      },
      deep: true
    }
  },
  created() {
    this.getOwnerList()
    this.getCycleTaskList()
  },
  methods: {
    changeSearchItem(data) {
      this.searchData = data
    },
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const pageHeaderHeight = 40
        // const pageTabsHeight = 40
        const pageHeaderMarginBottom = 5
        // const tabsMarginBottom = 15
        const pageHeight = this.$refs.cycleTask.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageHeaderMarginBottom + pagePaddingTop)
      })
    },
    stopHander() {
      const h = this.$createElement;
      this.$confirm('提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        message: h('div', null, [
            h('p', {style: ''}, '确定暂停全部已选任务吗？'),
            h('p', { style: 'color: rgba(0,0,0,0.65);font-size:12px' }, '暂停的任务仍正常生成实例，但当前任务生成实例及下游依赖实例均不调度')
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
    changeCheck(val) {
      console.log(val)
      this.tableData = this.tableData.map(item => {
        return {
          ...item,
          check: val
        }
      })
    },
    refresh() {
      this.getCycleTaskList()
    },
    showDagHande(row) {
      console.log(row)
      this.showDag = true
      this.getDagData(row)
    },
    rowClick(row) {
      this.showDag = true
      this.getDagData(row)
    },
    // 获取列表数据
    async getCycleTaskList() {
      this.loadingTable = true
      const params = {
        searchVal: this.searchVal,
        pageNo: this.currentPage,
        pageSize: 10,
        projectId: this.project.project_id,
        isMyTask: this.checkList.includes('1') ? 1 : 0,
        isPause: this.checkList.includes('2') ? 1 : 0
      }
      for (const key in this.searchData) {
        if (this.searchData.hasOwnProperty(key)) {
          if (key === 'updateTime') {
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
      const res = await this.$simpleAsyncTo(getCycleTaskList(params), '获取周期任务列表失败')
      if (res) {
        this.tableData = res.data.map(d => {
          d.check = false
          return d
        })
        this.total = res.totalRecords
      }
      this.loadingTable = false
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
    currentPageChange(val) {
      this.currentPage = val
      this.getCycleTaskList()
    },
    inputSearch(val) {
      this.currentPage = 1
      this.getCycleTaskList()
    },
    // 获取DAG图数据
    async getDagData(row) {
      this.graphLoading = true
      await this.$sleep(1000)
      const res = await this.$simpleAsyncTo(getDag({
        code: row.code,
        projectId: this.project.project_id,
        type: 'cycle',
        id: row.id
      }), '获取DAG图数据失败')
      if (res) {
        // this.graphData = res.data
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
        console.log(this.graphData)
      }
      this.graphLoading = false
    },
  }
}
</script>

<style lang="scss" scoped>
.cycle-task {
  padding: 10px 15px 0px 15px;
  height: 100%;
  background-color: rgb(229, 228, 233);
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
}
</style>