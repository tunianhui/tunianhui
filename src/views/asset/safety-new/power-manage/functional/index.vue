<template>
  <div class="functional-power container">
    <div ref="quality" v-if="tableData.length">
      <div class="head">
        <div class="flex">
          <div class="page-title mr-20">功能权限管理</div>
        </div>
        <div>
          <div class="flex">
            <span class="search">
              <el-input v-model="searchValue" prefix-icon="el-icon-search" placeholder="请输入关键字" @input.native="searchFilterTable">
              </el-input>
            </span>
            <el-button><i class="el-icon-refresh-right"></i></el-button>
          </div>
        </div>
      </div>

      <el-table :data="tableData" style="width: 100%" ref="table" v-loading="loading">
        <el-table-column prop="datasource_name" label="功能权限">
          <template slot-scope="scope">
            <div class="color">
              <OverflowTooltip style="width:150px">
                {{scope.row.datasource_name}}
              </OverflowTooltip>
            </div>
            <OverflowTooltip style="width:150px">{{scope.row.datasource_id}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="lv" label="权限等级" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.lv}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="ownership" label="权限归属" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <OverflowTooltip style="width:150px">{{scope.row.ownership}}</OverflowTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" @click="empowerHandle(scope.row)">
              <i class="icon iconfont icon-shouquan1"></i>
            </el-button>
            <el-button type="text" @click="recoveryHandle(scope.row)">
              <i class="icon iconfont icon-huishou"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <NoData v-else title="功能权限"></NoData>
    <div class="pagination-footer">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
    </div>
    <EmpowerDialog v-if="empowerVisible" @empowerClose="empowerClose" :type="type" :data="data"></EmpowerDialog>
  </div>
</template>

<script>
import NoData from '@c/no-data'
import EmpowerDialog from './empower-dialog'
import pager from '@/mixins/pager'
export default {
  name: 'FunctionalPower',
  mixins: [pager],
  components: {
    NoData,
    EmpowerDialog
  },
  data () {
    return {
      loading: false,
      searchValue: '',
      tableData: [
        {
          datasource_name: '123',
          datasource_id: '123',
          lv: '高',
          ownership: '312'
        }
      ],
      empowerVisible: false,
      type: '',
      data: {}
    }
  },
  methods: {
    searchFilterTable () { },
    empowerHandle (row) {
      this.data = row
      this.empowerVisible = true
      this.type = 'empower'
    },
    recoveryHandle (row) {
      this.empowerVisible = true
      this.type = 'recovery'
      this.data = row
    },
    empowerClose () {
      this.empowerVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.functional-power {
  height: 100%;
  position: relative;
  background: #ebeaef;
  padding: 10px 15px;

  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
    .search {
      margin-right: 20px;
      .el-input {
        width: 200px;
        .el-input__inner {
          border: none;
          border-bottom: 1px solid $grey6;
          border-radius: 0;
          background-color: $grey7;
        }
      }
    }
  }
}
</style>
