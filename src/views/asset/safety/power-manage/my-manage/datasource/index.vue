<template>
  <section class="datasource-my-manage table-authority monitor-filter ">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>数据源权限管理</div>
      <div>
        <span class="search">
          <el-input v-model="searchValue" prefix-icon="el-icon-search" placeholder="请输入关键字" @input.native="searchFilterTable">
          </el-input>
        </span>
        <span class="new-btn ml-10">
          <i class="el-icon-refresh-right"></i>
        </span>
      </div>
    </div>
    <el-card class="table-record" v-if="tableData.length">
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="datasource_name" label="数据源">
          <template slot-scope="scope">
            <div class="color">
              <OverflowTooltip style="width:150px">
                {{scope.row.datasource_name}}
              </OverflowTooltip>
            </div>
            <OverflowTooltip style="width:150px">{{scope.row.datasource_id}}</OverflowTooltip>
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
        <el-table-column label="操作" show-overflow-tooltip>
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
    </el-card>
    <NoData v-else title="数据源权限"></NoData>
    <EmpowerDialog :user="user" v-if="empowerVisible" @empowerClose="empowerClose"></EmpowerDialog>
    <RecoveryDialog :user="user" v-if="recoveryVisible" @recoveryClose="recoveryClose"></RecoveryDialog>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import EmpowerDialog from './empower-dialog'
import RecoveryDialog from './recovery-dialog'
import NoData from '@c/no-data'
export default {
  name: 'DatasourceMyManage',
  components: {
    OverflowTooltip,
    EmpowerDialog,
    RecoveryDialog,
    NoData
  },
  data () {
    return {
      searchValue: '',
      tableData: [
        {
          datasource_name: '123',
          datasource_id: '123',
          role: 'OWNER',
          gaveSource: 'OWNER',
          ownership: ''
        }
      ],
      user: '',
      empowerVisible: false,
      recoveryVisible: false
    }
  },
  methods: {
    searchFilterTable () { },
    empowerHandle (row) {
      this.user = row.datasource_name
      this.empowerVisible = true
    },
    empowerClose () {
      this.empowerVisible = false
    },
    recoveryHandle (row) {
      this.user = row.datasource_name
      this.recoveryVisible = true
    },
    recoveryClose () {
      this.recoveryVisible = false
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
.datasource-my-manage {
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
</style>
