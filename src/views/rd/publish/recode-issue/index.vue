<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-03-14 9:23:03
 * @LastEditTime: 2023-06-05 10:50:38
-->
<template>
  <div class='data-table' ref="dataTable">
    <div class="head">
      <div class="flex">
        <div class="head-title font-18 mr-20">发布记录列表</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="管理脚本(7)" name="first"></el-tab-pane>
          <el-tab-pane label="规范建模(1)" name="second"></el-tab-pane>
          <el-tab-pane label="数据处理(11)" name="third"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="请输入关键字" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>

    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
      <el-table-column prop="field1" label="发布名">
        <template slot-scope="{row}">
          <span>{{row.field1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="field2" label="发布ID">
      </el-table-column>
      <el-table-column prop="field3" label="名称"></el-table-column>
      <el-table-column prop="field4" label="对象ID"></el-table-column>
      <el-table-column prop="field5" label="对象类型"></el-table-column>
      <el-table-column prop="field6" label="版本号">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="查看版本详情" placement="top">
            <span class="count">{{row.field6}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="field7" label="变更类型"></el-table-column>
      <el-table-column prop="field8" label="发布人/时间">
        <template slot-scope="{}">
          <div>test001</div>
          <div>2021-01-06 21:13:21</div>
        </template>
      </el-table-column>
      <el-table-column prop="field9" label="发布状态/完成时间">
        <template slot-scope="{}">
          <div>发布成功</div>
          <div>2021-01-26 21:13:21</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="handleEdit(scope.row)"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
  </div>
</template>

<script>
import pager from '@/mixins/pager'

export default {
  name: 'RecodeIssue',
  props: {},
  mixins: [pager],
  components: {
  },
  data () {
    return {
      activeName: 'first',
      tableData: [
        {
          field1: 'CSV_2455',
          field2: '787888',
          field3: 'csv',
          field4: '89834399',
          field5: '离线管道',
          field6: 18,
          field7: '更新',
          field8: '发布成功',
          field9: '2020-09-14 18:17:18'
        },
        {
          field1: 'CSV_2455',
          field2: '787888',
          field3: 'csv',
          field4: '89834399',
          field5: '离线管道',
          field6: 18,
          field7: '更新',
          field8: '发布成功',
          field9: '2020-09-14 18:17:18'
        }
      ],
      fixed: false,
      loading: 0,
      dataBaseList: [],
      filterData: []
    }
  },

  async created () {
    this.filterData = [
      {
        label: '最近发布人',
        id: '最近提交人',
        options: []
      },
      {
        label: '所属数据库',
        id: '所属数据库',
        options: []
      }
    ]
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },

    getTableList () {
    },

    handleEdit (item) {

    }
  }
}
</script>

<style lang="scss">
.data-table {
  height: 100%;
  position: relative;
  overflow-y: overlay;
  .head {
    padding-top: 10px;
    padding-bottom: 8px;
  }
  .width {
    width: calc(100% - 1px);
  }
  .count {
    color: #2253d4;
    cursor: pointer;
  }
}
</style>
