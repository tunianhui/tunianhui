<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-03-14 9:23:03
 * @LastEditTime: 2023-06-05 10:50:18
-->
<template>
  <div class='data-table' ref="dataTable">
    <div class="head">
      <div class="flex">
        <div class="head-title font-18 mr-20">待发布对象列表</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="规范建模(0)" name="first"></el-tab-pane>
          <el-tab-pane label="数据处理(4)" name="second"></el-tab-pane>
          <el-tab-pane label="数据服务(9)" name="third"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="请输入关键字" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>

    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
      <el-table-column prop="field1" label="对象名称">
      </el-table-column>
      <el-table-column prop="field2" label="对象ID">
      </el-table-column>
      <el-table-column prop="field3" label="对象类型"></el-table-column>
      <el-table-column prop="field4" label="版本号">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="查看版本详情" placement="top">
            <span class="count">{{row.field4}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="field5" label="变更类型"></el-table-column>
      <el-table-column prop="field6" label="最近提交人/时间"></el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="上传" placement="top">
            <el-button type="text"><i class="el-icon-upload font-16 color-btn" title="上传" @click="handleUpload(scope.row)"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="handleEdit(scope.row)"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"><i class="el-icon-delete font-16 color-btn" title="删除" @click="handleDel(scope.row)"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>

    <Upload :visible="visibleUpload" :row="row" @close="closeInfo"></Upload>
  </div>
</template>

<script>
import pager from '@/mixins/pager'
import Upload from './upload'

export default {
  name: 'ToIssue',
  props: {},
  mixins: [pager],
  components: {
    Upload
  },
  data () {
    return {
      activeName: 'first',
      visibleUpload: false,
      tableData: [
        {
          field1: 'rdbms_rw',
          field2: '787888',
          field3: '离线管道',
          field4: '1',
          field5: '新增',
          field6: '2020-09-14 18:17:18'
        },
        {
          field1: 'rdbms_rw',
          field2: '787888',
          field3: '离线管道',
          field4: '1',
          field5: '新增',
          field6: '2020-09-14 18:17:18'
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
        label: '最近提交人',
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
    getTableList () {

    },

    handleClick (tab, event) {
      console.log(tab, event)
    },

    handleUpload (item) {
      this.visibleUpload = true
    },

    handleEdit (item) {

    },

    handleDel (item) {

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
  .count {
    color: #2253d4;
  }
}
</style>
