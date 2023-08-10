<template>
  <div class="datasource-power container">
    <div ref="quality" v-if="tableData.length">
      <div class="head">
        <div class="flex">
          <div class="page-title mr-20">数据源权限管理</div>
        </div>
        <div>
          <div class="flex">
            <el-button><i class="el-icon-refresh-right"></i></el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="dataPlate" label="数据源">
          <template slot-scope="scope">
            <div class="color">
              <OverflowTooltip style="width:150px">
                {{scope.row.dataPlate}}
              </OverflowTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.role}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="gaveSource" label="授权来源" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.gaveSource}}</OverflowTooltip>
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

    <NoData v-else title="数据源权限"></NoData>

    <div class="pagination-footer">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
    </div>
    <EmpowerDialog :user="user" v-if="empowerVisible" @empowerClose="empowerClose"></EmpowerDialog>
    <RecoveryDialog :user="user" v-if="recoveryVisible" @recoveryClose="recoveryClose"></RecoveryDialog>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import EmpowerDialog from './empower-dialog'
import RecoveryDialog from './recovery-dialog'
import pager from '@/mixins/pager'
import NoData from '@c/no-data'
export default {
  name: 'DataSourcePower',
  mixins: [pager],
  components: {
    OverflowTooltip,
    EmpowerDialog,
    RecoveryDialog,
    NoData
  },
  data () {
    return {
      empowerVisible: false,
      recoveryVisible: false,
      user: '',
      tableData: [
        {
          dataPlate: 'LD_v32_dual_env_test_bizunit',
          role: '超级管理员',
          gaveSource: '负责人',
          ownership: ''
        }
      ]
    }
  },
  created () {
  },
  methods: {
    empowerHandle (row) {
      this.user = row.dataPlate
      this.empowerVisible = true
    },
    empowerClose () {
      this.empowerVisible = false
    },
    recoveryHandle (row) {
      this.user = row.dataPlate
      this.recoveryVisible = true
    },
    recoveryClose () {
      this.recoveryVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.datasource-power {
  height: 100%;
  position: relative;
  background: #ebeaef;
  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
  }
}
</style>
