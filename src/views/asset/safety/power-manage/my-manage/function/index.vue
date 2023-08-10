<template>
  <section class="function-my-manage table-authority monitor-filter ">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>功能权限管理</div>
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
    <NoData v-else title="功能权限"></NoData>
    <EmpowerDialog v-if="empowerVisible" @empowerClose="empowerClose" :type="type" :data="data"></EmpowerDialog>
  </section>
</template>

<script>
import NoData from '@c/no-data'
import EmpowerDialog from './empower-dialog'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'FunctionMyManage',
  components: {
    NoData,
    EmpowerDialog,
    OverflowTooltip
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

<style lang="scss">
@import '@/assets/css/monitor.scss';
.function-my-manage {
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
