<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 15:55:13
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-20 16:44:04
 * @FilePath: \dataphin\src\views\rd\operation-new\pages\record-example\index.vue
-->
<template>
  <div class="record-example" ref="recordExample">
    <TabsHeader
      title="补数据实例"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">我提交得</el-checkbox>
          <el-checkbox label="2">补数失败</el-checkbox>
          <el-checkbox label="3">补数未完成</el-checkbox>
        </el-checkbox-group>
        <div style="display: flex; font-size: 12px; align-items: center;">
          <span class="ml-10 mr-10">提交日期</span>
          <SelectQuickTime v-model="time" :options="options" class="custom-select-quick-time" width="250px"></SelectQuickTime>
        </div>
        <span class="mr-10 ml-10">
          <el-input v-model="taskKeyword" placeholder="请输入实例对象名称或ID">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </span>
        <el-button @click="showFileterItem = !showFileterItem">
          <i class="iconfont icon-filter"></i>
          {{showFileterItem ? '收起' : '筛选'}}
        </el-button>
        <el-button>
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
          <RecordTableExample :height="height - 36" @showDagHande="showDagHande" :showDag="showDag"></RecordTableExample>
          <PageBottomTips
            :showDag="showDag"
            :actiosList="actiosList"
            @changeCheck="changeCheck"
          ></PageBottomTips>
        </template>
        <template v-slot:right>
          <div class="table-wrapper-right"></div>
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
import PageBottomTips from '../../component/page-bottom-tips.vue'
import RecordTableExample from './table.vue'
export default {
  name: 'recordExample',
  components: {
    TabsHeader,
    SelectQuickTime,
    SearchItemConfig,
    PageTableLayout,
    PageBottomTips,
    RecordTableExample
  },
  data() {
    return {
      showFileterItem: false,
      checkList: [],
      time: [],
      taskKeyword: '',
      showDag: false,
      height: 0,
      options: [
        { label: '今天', value: '1', fn: () => [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
        { label: '昨天', value: '2', fn: () => [dayjs().subtract(1, 'd').format('YYYY-MM-DD'), dayjs().subtract(1, 'd').format('YYYY-MM-DD')] },
        { label: '全部', value: '3', fn: () => [] },
      ],
      filterOptions: [
        {
          label: '实例类型状态',
          key: 'subdivisionType',
          type: 'select',
          subdivisionType: [],
          options: [
            { label: '成功', value: '1' },
            { label: '失败', value: '2' },
            { label: '运行中', value: '3' },
            { label: '等待调度时间', value: '4' },
            { label: '限流中', value: '5' },
            { label: '未运行', value: '6' },
            { label: '等待调度资源', value: '7' },
          ]
        },
        {
          label: '补数据状态',
          key: 'subdivisionStatus',
          type: 'select',
          subdivisionStatus: [],
          options: [
            { label: '成功', value: '1' },
            { label: '失败', value: '2' },
            { label: '运行中', value: '3' },
            { label: '未运行', value: '4' },
          ]
        },
        {
          label: '实例负责人',
          key: 'owner',
          owner: [],
          type: 'select'
        },
        {
          label: '补数据提交人',
          key: 'submitter',
          submitter: [],
          type: 'select'
        },
        {
          label: '业务日期',
          key: 'businessDate',
          businessDate: [],
          type: 'time',
          typeView: 'daterange',
          valueFormat: 'YYYY-MM-DD',
          options: [
            { label: '今天', value: '1', fn: () => [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
            { label: '昨天', value: '2', fn: () => [dayjs().subtract(1, 'd').format('YYYY-MM-DD'), dayjs().subtract(1, 'd').format('YYYY-MM-DD')] },
            { label: '全部', value: '3', fn: () => [] },
          ]
        },
        {
          label: '开始运行',
          key: 'startRunTime',
          startRunTime: '',
          type: 'time',
          typeView: 'date',
          valueFormat: 'YYYY-MM-DD',
          options: [
            { label: '今天', value: '2', fn: () => dayjs().format('YYYY-MM-DD ') },
            { label: '昨天', value: '3', fn: () => dayjs().subtract(1, 'd').format('YYYY-MM-DD') },
          ]
        }
      ],
      actiosList: [
        { name: '重跑所有失败实例', icon: 'iconfont icon-zhongpao', viewType: 'dropdown', children: [
          { label: '重跑所有失败实例', value: 1, command: 'rerunErrorHandle' },
          { label: '重跑所有终态实例', value: 2, command: 'rerunFinalStateHandle' },
          { label: '强制重跑所有实例', value: 3, command: 'forceRerunAllHandle' },
        ]},
        { name: '终止', icon: 'iconfont icon-zhongzhi', command: 'terminationHandle' },
        { name: '置成功继续调度', icon: 'iconfont icon-zhichenggongjixutiaodu', command: 'continueSchedulingHandle' }
      ]
    }
  },
  methods: {
    changeSearchItem() {},
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const pageHeaderHeight = 40
        const pageTabsHeight = 0
        const pageHeaderMarginBottom = 0
        const tabsMarginBottom = 10
        const pageHeight = this.$refs.recordExample.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageTabsHeight + pageHeaderMarginBottom + pagePaddingTop + tabsMarginBottom)
      })
    },
    changeCheck(data) {},
    showDagHande() {
      this.showDag = true
    }
  }
}
</script>

<style lang="scss" scoped>
.record-example {
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
}
</style>