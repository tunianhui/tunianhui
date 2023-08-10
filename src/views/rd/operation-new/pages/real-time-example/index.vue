<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 15:57:19
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-20 16:46:50
 * @FilePath: \dataphin\src\views\rd\operation-new\pages\real-time-example\index.vue
-->
<template>
  <div class="real-time-example" ref="realTimeExample">
    <TabsHeader
      title="实时实例"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <el-button>
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
        <el-checkbox label="1">我的暂停实例</el-checkbox>
        <el-checkbox label="2">我的停止实例</el-checkbox>
        <el-checkbox label="3">我今日操作的实例</el-checkbox>
      </el-checkbox-group>
      <span class="mr-10 ml-10">
        <el-input v-model="taskKeyword" placeholder="请输入节点名称或节点ID">
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
          <RealTimeTableExample :height="height - 36"></RealTimeTableExample>
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
import PageBottomTips from '../../component/page-bottom-tips.vue'
import PageTableLayout from '../../component/page-table-layout.vue'
import RealTimeTableExample from './table.vue'
export default {
  name: 'RealTimeExample',
  components: {
    TabsHeader,
    SelectQuickTime,
    SearchItemConfig,
    PageBottomTips,
    PageTableLayout,
    RealTimeTableExample
  },
  data() {
    return {
      checkList: [],
      taskKeyword: '',
      showFileterItem: false,
      height: 0,
      showDag: false,
      filterOptions: [
        {
          label: '细分类型',
          key: 'subdivisionType',
          type: 'select',
          subdivisionType: [],
          options: [
            { label: '脚本', value: '1' }
          ]
        },
        {
          label: '运行状态',
          key: 'runStatus',
          type: 'select',
          runStatus: [],
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
          label: '最近操作人',
          key: 'recentOperator',
          type: 'select',
          recentOperator: [],
          options: []
        },
        {
          label: '负责人',
          key: 'owner',
          owner: [],
          type: 'select'
        },
        {
          label: '集群',
          key: 'colony',
          type: 'select',
          colony: [],
          options: []
        },
        {
          label: '引擎版本',
          key: 'engineVersion',
          type: 'select',
          engineVersion: [],
          options: []
        },
        {
          label: '操作日期',
          key: 'operationDate',
          operationDate: [],
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
      actiosList: [
        { name: '暂停', icon: 'iconfont icon-execute-', command: 'suspendHandle' },
        { name: '恢复', icon: 'iconfont icon-huifu', command: 'restoreHandle' },
        { name: '重跑', icon: 'iconfont icon-zhongpao', command: 'rerunHandle' },
        { name: '停止', icon: 'iconfont icon-zhongzhi', command: 'stopHandle' },
        { name: '下线', icon: 'iconfont icon-xiaxian2', command: 'offlineHandle' }
      ]
    }
  },
  methods: {
    changeSearchItem() {},
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const pageHeaderHeight = 40
        const pageTabsHeight = 60
        const pageHeaderMarginBottom = 0
        const tabsMarginBottom = 10
        const pageHeight = this.$refs.realTimeExample.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageTabsHeight + pageHeaderMarginBottom + pagePaddingTop + tabsMarginBottom)
      })
    },
    changeCheck(data) {}
  }
}
</script>

<style lang="scss" scoped>
.real-time-example {
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
}
</style>