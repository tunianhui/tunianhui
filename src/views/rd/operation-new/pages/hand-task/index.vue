<template>
  <div class="hand-task" ref="handTask">
    <TabsHeader
      title="手动任务"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">我的任务</el-checkbox>
          <!-- <el-checkbox label="2">今日更新</el-checkbox> -->
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
      class="mb-10"
      ref="searchItemConfig"
      v-resize="resizeDom"
    ></SearchItemConfig>
    <div class="table-wrapper" :style="{height: `${height}px)`}">
      <PageTableLayout :showDag="showDag" :height="height" @leftClickHange="showDag = false">
        <template v-slot:left>
          <HandTaskTable
            :height="height - 36"
            @showDagHande="showDagHande"
            @rowClick="rowClick"
            @refresh="refresh"
            :showDag="showDag"
            :data="tableData"
            :loading="tableLoading"
          ></HandTaskTable>
          <PageBottomTips
            :showDag="showDag"
            :total="total"
            :showPageCheck="false"
            :currentPage="currentPage"
            @currentChange="currentPageChange"
          ></PageBottomTips>
        </template>
        <template v-slot:right>
          <FlowWrapper
            pageType="manual"
            :data="graphData"
            :loading="graphLoading"
          ></FlowWrapper>
        </template>
      </PageTableLayout>
    </div>
  </div>
</template>

<script>
import TabsHeader from '@c/tabs-header'
import SearchItemConfig from '../../component/search-item.vue'
import PageTableLayout from '../../component/page-table-layout.vue'
import PageBottomTips from '../../component/page-bottom-tips.vue'
import HandTaskTable from './table.vue'
import { mapGetters } from 'vuex'
import FlowWrapper from '../../component/flow'
import {
  getHandTaskList,
  getOwnerList,
  getHandTaskDag
} from '@/api/rd/operation-new/hand-task'
export default {
  name: 'HandTask',
  components: {
    TabsHeader,
    SearchItemConfig,
    PageTableLayout,
    PageBottomTips,
    HandTaskTable,
    FlowWrapper
  },
  data() {
    return {
      checkList: [],
      searchVal: '',
      showFileterItem: false,
      filterOptions: [
        // {
        //   label: '业务类型',
        //   key: ['businessType', 'subdivisionType'],
        //   type: 'select-multiple',
        //   businessType: '',
        //   subdivisionType: []
        // },
        {
          label: '负责人',
          key: 'operUser',
          operUser: '',
          type: 'select-one',
          options: []
        },
        // {
        //   label: '优先级',
        //   key: 'priority',
        //   priority: [],
        //   type: 'checkbox',
        //   options: [
        //     { label: '最高', value: '1' },
        //     { label: '高', value: '2' },
        //     { label: '中等', value: '3' },
        //     { label: '低', value: '4' },
        //     { label: '最低', value: '5' }
        //   ]
        // }
      ],
      actiosList: [
        // { name: '修改负责人', icon: 'iconfont icon-zerenren', command: 'editOwerHander' },
        // { name: '修改优先级', icon: 'iconfont icon-yuanbiao-xianxing', command: 'editPriorityHander' }
      ],
      height: 0,
      showDag: false,
      total: 0,
      currentPage: 1,
      searchData: {},
      tableData: [],
      tableLoading: false,
      graphData: {},
      graphLoading: false
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  watch: {
    searchData: {
      handler(val) {
        this.currentPage = 1
        this.getHandTaskList()
      },
      deep: true
    },
    checkList: {
      handler(val) {
        this.currentPage = 1
        this.getHandTaskList()
      },
      deep: true
    }
  },
  created() {
    this.getOwnerList()
    this.getHandTaskList()
  },
  methods: {
    changeSearchItem(data) {
      this.searchData = data
    },
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const pageHeaderHeight = 40
        const pageTabsHeight = 0
        const pageHeaderMarginBottom = 10
        const tabsMarginBottom = 0
        const pageHeight = this.$refs.handTask.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageTabsHeight + pageHeaderMarginBottom + pagePaddingTop + tabsMarginBottom)
      })
    },
    showDagHande(row) {
      console.log(row)
      this.showDag = true
      this.getHandTaskDag(row)
    },
    rowClick(row) {
      this.showDag = true
      this.getHandTaskDag(row)
    },
    currentPageChange(val) {
      console.log(val)
      this.currentPage = val
      this.getHandTaskList()
    },
    inputSearch(val) {
      this.currentPage = 1
      this.getHandTaskList()
    },
    refresh() {
      this.getHandTaskList()
    },
    // 获取手动任务列表
    async getHandTaskList() {
      this.tableLoading = true
      const params = {
        pageNo: this.currentPage,
        pageSize: 10,
        searchVal: this.searchVal,
        projectId: this.project.project_id,
        operUser: this.searchData.operUser,
        isMy: this.checkList.includes('1') ? 1 : 0,
      }
      const res = await this.$simpleAsyncTo(getHandTaskList(params), '获取手动任务列表失败')
      if (res) {
        this.total = res.totalRecords
        this.tableData = res.data
      }
      this.tableLoading = false
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
    // 获取流程图数据
    async getHandTaskDag(row) {
      this.graphLoading = true
      const params = {
        code: row.code,
        projectId: this.project.project_id,
        type: 'manual',
        taskId: row.id
      }
      const res = await this.$simpleAsyncTo(getHandTaskDag(params), '获取流程图数据失败')
      if (res) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.hand-task {
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