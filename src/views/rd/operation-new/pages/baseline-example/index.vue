<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-09 17:33:47
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-08 10:57:24
 * @FilePath: \dataphin\src\views\rd\operation-new\pages\baseline-example\index.vue
-->
<template>
  <div :class="['baseline-example', showHome === 'home' ? 'active' : '']" ref="baselineExample">
    <template v-if="showHome === 'home'">
      <TabsHeader
        title="基线实例"
        :tabs="[]"
        active=""
        height="40px"
        :borderBottomWrapper="false"
      >
        <div slot="right" style="display: flex;align-items: center;">
          <el-checkbox-group v-model="checkList" class="mr-10">
            <el-checkbox label="1">业务日期：昨日</el-checkbox>
            <el-checkbox label="2">我负责的</el-checkbox>
            <el-checkbox label="3">破线基线</el-checkbox>
            <el-checkbox label="4">未完成基线</el-checkbox>
          </el-checkbox-group>
          <span class="mr-10 ml-10">
            <el-input v-model="baselineKeyword" placeholder="请输入基线名称">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </span>
          <el-button @click="showFileterItem = !showFileterItem">
            <i class="iconfont icon-filter"></i>
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
        <PageTableLayout :showDag="false" :height="height">
          <template v-slot:left>
            <BaselineExampleTable :height="height - 36" @action="action"></BaselineExampleTable>
            <PageBottomTips
              style="bottom:0;height:40px"
              :showDag="false"
              :showPageCheck="false"
              :actiosList="actiosList"
            ></PageBottomTips>
          </template>
        </PageTableLayout>
      </div>
    </template>
    <template v-if="showHome === 'detail'">
      <BaselineExampleDetail @back="showHome = 'home'" @viewGanttChart="viewGanttChart"></BaselineExampleDetail>
    </template>
    <template v-if="showHome === 'gantt'">
      <GanttChartChart @back="showHome = 'home'"></GanttChartChart>
    </template>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import TabsHeader from '@c/tabs-header'
import SearchItemConfig from '../../component/search-item.vue'
import PageTableLayout from '../../component/page-table-layout.vue'
import BaselineExampleTable from './table.vue'
import PageBottomTips from '../../component/page-bottom-tips.vue'
import BaselineExampleDetail from './detail.vue'
import GanttChartChart from './gantt-chart-chart.vue'
export default {
  name: 'BaselineExample',
  components: {
    TabsHeader,
    SearchItemConfig,
    PageTableLayout,
    BaselineExampleTable,
    PageBottomTips,
    BaselineExampleDetail,
    GanttChartChart
  },
  data() {
    return {
      height: 0,
      showHome: 'home',
      showFileterItem: false,
      checkList: [],
      baselineKeyword: '',
      filterOptions: [
        {
          label: '基线状态',
          key: 'bsellineStatus',
          bsellineStatus: [],
          type: 'checkbox',
          options: [
            { label: '安全', value: '1' },
            { label: '预警', value: '2' },
            { label: '破线', value: '3' },
            { label: '其他', value: '4' }
          ]
        },
        {
          label: '是否完成',
          key: 'isComplete',
          isComplete: [],
          type: 'checkbox',
          options: [
            { label: '是', value: '1' },
            { label: '否', value: '2' }
          ]
        },
        {
          label: '优先级',
          key: 'priority',
          priority: [],
          type: 'checkbox',
          options: [
            { label: '高', value: '1' },
            { label: '最高', value: '2' }
          ]
        },
        {
          label: '基线类型',
          key: 'baselineType',
          baselineType: [],
          type: 'checkbox',
          options: [
            { label: '天基线', value: '1' },
            { label: '空基线', value: '2' }
          ]
        },
        {
          label: '基线负责人',
          key: 'owner',
          owner: [],
          type: 'select',
          options: [
            { label: '张三', value: '1' },
            { label: '李四', value: '2' }
          ]
        },
        {
          label: '业务日期',
          key: 'updateTime',
          updateTime: [],
          type: 'time',
          options: [
            { label: '今天', value: '1', fn: () => [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')] },
            { label: '昨天', value: '2', fn: () => [dayjs().subtract(1, 'd').format('YYYY-MM-DD'), dayjs().subtract(1, 'd').format('YYYY-MM-DD')] },
          ]
        }
      ],
      actiosList: []
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
        const tabsMarginBottom = 15
        const pageHeight = this.$refs.baselineExample.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageTabsHeight + pageHeaderMarginBottom + pagePaddingTop + tabsMarginBottom)
      })
    },
    action() {
      this.showHome = 'detail'
    },
    viewGanttChart() {
      this.showHome = 'gantt'
    }
  },
}
</script>

<style lang="scss" scoped>
.baseline-example {
  height: 100%;
  background-color: rgb(240, 240, 240);
  &.active {
    padding: 10px 15px 0px 15px;
  }
  .table-wrapper {
    height: calc(100% - 50px);
    background: #fff;
    padding-bottom: 36px;
    position: relative;
  }
  ::v-deep {
    .el-checkbox__label {
      font-size: 12px;
    }
  }
}
</style>