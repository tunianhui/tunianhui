<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 15:44:15
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-08 10:41:11
 * @FilePath: \dataphin\src\views\rd\operation-new\pages\real-time-task\index.vue
-->
<template>
  <div class="real-time-task" ref="realTimeTask">
    <TabsHeader
      title="实时任务"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <el-checkbox-group v-model="checkList">
          <el-checkbox label="1">我操作的任务</el-checkbox>
          <el-checkbox label="2">我的已启动实例任务</el-checkbox>
        </el-checkbox-group>
        <span class="mr-10 ml-10">
          <el-input v-model="taskKeyword" placeholder="请输入任务对象名称，节点名称或节点ID">
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
          <RealTimeTaskTable  :height="height - 36" @showDagHande="showDagHande" :showDag="showDag"></RealTimeTaskTable>
          <PageBottomTips
            :showDag="showDag"
            :actiosList="actiosList"
            @changeCheck="changeCheck"
          ></PageBottomTips>
        </template>
      </PageTableLayout>
    </div>
  </div>
</template>

<script>
import TabsHeader from '@c/tabs-header'
import SearchItemConfig from '../../component/search-item.vue'
import PageTableLayout from '../../component/page-table-layout.vue'
import RealTimeTaskTable from './table.vue'
import PageBottomTips from '../../component/page-bottom-tips.vue'
export default {
  name: 'RealTimeTask',
  components: {
    TabsHeader,
    SearchItemConfig,
    PageTableLayout,
    RealTimeTaskTable,
    PageBottomTips
  },
  data() {
    return {
      height: 0,
      checkList: [],
      taskKeyword: '',
      showFileterItem: false,
      filterOptions: [
        {
          label: '细分类型',
          key: 'subdivisionType',
          type: 'select',
          subdivisionType: []
        },
        {
          label: '最近操作人',
          key: 'lastOperator',
          type: 'select',
          lastOperator: []
        },
        {
          label: '负责人',
          key: 'owner',
          owner: [],
          type: 'select'
        },
        {
          label: '集群',
          key: 'cluster',
          cluster: [],
          type: 'select'
        },
        {
          label: '引擎版本',
          key: 'engineVersion',
          engineVersion: [],
          type: 'select'
        },
        {
          label: '是否启动实例',
          key: 'isStartInstance',
          isStartInstance: [],
          type: 'select'
        },
      ],
      showDag: false,
      actiosList: [
        { name: '启动正式实例', icon: 'iconfont icon-yuanbiao-xianxing', command: 'editOwerHander' },
        { name: '修改负责人', icon: 'iconfont icon-zerenren', command: 'editPriorityHander' }
      ],
    }
  },
  methods: {
    changeSearchItem() {},
    resizeDom(data) {
      this.$nextTick(_ => {
        const { height } = data
        const pageHeaderHeight = 40
        const pageTabsHeight = 0
        const pageHeaderMarginBottom = 10
        const tabsMarginBottom = 0
        const pageHeight = this.$refs.realTimeTask.clientHeight
        const pagePaddingTop = 10
        this.height = pageHeight - (parseInt(height) + pageHeaderHeight + pageTabsHeight + pageHeaderMarginBottom + pagePaddingTop + tabsMarginBottom)
      })
    },
    showDagHande(row) {
      console.log(row)
      this.showDag = true
    },
    changeCheck(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.real-time-task {
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