<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 15:56:21
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-13 17:10:26
 * @FilePath: \智能数据构建\src\views\rd\operation-new\pages\hand-example\index.vue
-->
<template>
  <div class="hand-example" ref="handExample">
    <TabsHeader
      title="手动实例"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <el-button @click="refresh">
          <i class="el-icon-refresh-right"></i>
        </el-button>
        <el-button @click="$router.push({path: '/rd/operation-new/operation-large-market/example-statistics'})">
          <i class="iconfont icon-biaodanliebiao"></i>
          查看实例统计
        </el-button>
      </div>
    </TabsHeader>
    <div style="display: flex;align-items: center;justify-content: flex-end; background: #fff;height:60px">
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="1">我的实例</el-checkbox>
        <el-checkbox label="2">失败实例</el-checkbox>
        <el-checkbox label="3">未完成实例</el-checkbox>
      </el-checkbox-group>
      <div style="display: flex; font-size: 12px; align-items: center;">
        <span class="ml-10 mr-10" style="color: rgba(0,0,0,0.5)">开始运行日期</span>
        <SelectQuickTime v-model="time" :options="options" class="custom-select-quick-time" width="250px" :showDateBorder="false"></SelectQuickTime>
      </div>
      <span class="mr-10 ml-10">
        <el-input v-model="searchVal" placeholder="请输入节点名称或节点ID" @input="inputSearch">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </span>
      <el-button @click="showFileterItem = !showFileterItem" class="mr-20">
        <i class="iconfont icon-filter"></i>
        {{showFileterItem ? '收起' : '筛选'}}
      </el-button>
    </div>
    <SearchItemConfig
      @change="changeSearchItem"
      :style="{height: showFileterItem ? '' : '0', overflow: 'hidden'}"
      :filterOptions="filterOptions"
      :showMore="false"
      class="mb-10 custom-search-item"
      ref="searchItemConfig"
      v-resize="resizeDom"
    ></SearchItemConfig>
    <div class="table-wrapper" :style="{height: `${height}px)`}">
      <PageTableLayout :showDag="showDag" :height="height" @leftClickHange="showDag = false">
        <template v-slot:left>
          <RecordTableExample
            :showDag="showDag"
            :height="height - 36"
            :data="tableData"
            v-loading="loading"
            @rowClick="rowClick"
            @refresh="refresh"
            @showDagHande="showDagHande"
          ></RecordTableExample>
          <PageBottomTips
            :showPageCheck="false"
            :showDag="showDag"
            @changeCheck="changeCheck"
            @currentChange="currentPageChange"
            :currentPage="currentPage"
            :total="total"
          ></PageBottomTips>
        </template>
        <template v-slot:right>
          <FlowWrapper
            pageType="manualInstance"
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
import SelectQuickTime from '../../component/select-time.vue'
import SearchItemConfig from '../../component/search-item.vue'
import PageTableLayout from '../../component/page-table-layout.vue'
import RecordTableExample from './table.vue'
import PageBottomTips from '../../component/page-bottom-tips.vue'
import FlowWrapper from '../../component/flow'
import { mapGetters } from 'vuex'
import {
  getHandExampleList,
  getOwnerList,
  getDagData
} from '@/api/rd/operation-new/hand-example.js'
export default {
  name: 'HandExample',
  components: {
    TabsHeader,
    SelectQuickTime,
    SearchItemConfig,
    PageTableLayout,
    RecordTableExample,
    PageBottomTips,
    FlowWrapper
  },
  data() {
    return {
      checkList: [],
      searchVal: '',
      time: '',
      height: 0,
      options: [
        { label: '今天', value: '1', fn: () => [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
        { label: '昨天', value: '2', fn: () => [dayjs().subtract(1, 'd').format('YYYY-MM-DD'), dayjs().subtract(1, 'd').format('YYYY-MM-DD')] },
        { label: '全部', value: '3', fn: () => [] },
      ],
      showFileterItem: false,
      filterOptions: [
        // {
        //   label: '业务类型',
        //   key: ['businessType', 'subdivisionType'],
        //   type: 'select-multiple',
        //   businessType: '',
        //   subdivisionType: [],
        //   options: [
        //     { label: '脚本', value: '1' }
        //   ],
        //   multipleSelectOptions: [
        //     { label: 'MAX_COMPUTE', value: '1' }
        //   ]
        // },
        {
          label: '运行状态',
          key: 'status',
          type: 'select-one',
          status: '',
          options: [
            { label: '成功', value: '7' },
            { label: '失败', value: '6' },
            { label: '运行中', value: '1' },
            { label: '暂停', value: '3' },
            { label: '停止', value: '5' },
            { label: '未运行', value: '0' },
          ]
        },
        // {
        //   label: '优先级',
        //   key: 'priority',
        //   type: 'select',
        //   priority: [],
        //   options: [
        //     { label: '最高', value: '1' },
        //     { label: '高', value: '2' },
        //     { label: '中等', value: '3' },
        //     { label: '低', value: '4' },
        //     { label: '最低', value: '5' },
        //   ]
        // },
        {
          label: '负责人',
          key: 'operUser',
          operUser: '',
          type: 'select-one',
          options: [],
        },
      ],
      showDag: false,
      actiosList: [
        // { name: '重跑', icon: 'iconfont icon-zhongpao', command: 'rerunErrorHandle' },
        // { name: '终止', icon: 'iconfont icon-zhongzhi', command: 'terminationHandle' },
        // { name: '强制重跑', icon: 'iconfont icon-qiangzhizhongpao', command: 'forcedRerunHandle' }
      ],
      tableData: [],
      loading: false,
      currentPage: 1,
      total: 0,
      searchData: {},
      graphData: {},
      graphLoading: false,
    }
  },
  watch: {
    searchData: {
      handler() {
        this.currentPage = 1
        this.getHandExampleList()
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters(['project']),
  },
  created() {
    this.getHandExampleList()
  },
  methods: {
    changeSearchItem(data) {
      this.searchData = data
    },
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const pageHeaderHeight = 40
        const pageTabsHeight = 60
        const pageHeaderMarginBottom = 0
        const tabsMarginBottom = 10
        const pageHeight = this.$refs.handExample.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageTabsHeight + pageHeaderMarginBottom + pagePaddingTop + tabsMarginBottom)
      })
    },
    changeCheck(data) {},
    // 手动任务实例列表
    async getHandExampleList() {
      this.loading = true
      const params = {
        searchVal: this.searchVal,
        pageNo: this.currentPage,
        pageSize: 10,
        projectId: this.project.project_id,
        startTime: this.time ? this.time[0] : '',
        endTime: this.time ? this.time[1] : '',
        operUser: this.searchData.operUser || '',
        status: this.searchData.status || '',
        isMy: this.checkList.includes('1') ? 1 : 0,
        isFail: this.checkList.includes('2') ? 1 : 0,
        isComplete: this.checkList.includes('3') ? 1 : 0,
      }
      const res = await this.$simpleAsyncTo(getHandExampleList(params), '手动任务实例列表获取失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading = false
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
    inputSearch() {
      this.getHandExampleList()
    },
    currentPageChange(val) {
      this.currentPage = val
      this.getHandExampleList()
    },
    refresh() {
      this.getHandExampleList()
    },
    showDagHande(row) {
      this.showDag = true
      this.getHandTaskDag(row)
    },
    rowClick(row) {
      this.showDag = true
      this.getHandTaskDag(row)
    },
    // 获取手动实例DAG图数据
    async getHandTaskDag(row) {
      this.graphLoading = true
      const res = await this.$simpleAsyncTo(getDagData({
        code: row.code,
        projectId: this.project.project_id,
        type: 'manualInstance',
        id: row.id
      }), '获取手动实例DAG图数据失败')
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
    },
  }
}
</script>

<style lang="scss" scoped>
.hand-example {
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
  .custom-search-item {
    ::v-deep {
      .wrapper {
        padding-top: 0;
      }
    }
  }
  ::v-deep {
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>