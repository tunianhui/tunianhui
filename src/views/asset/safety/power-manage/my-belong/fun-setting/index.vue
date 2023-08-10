<template>
  <section class="function-my-setting table-authority monitor-filter ">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>功能权限配置</div>
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
        <el-table-column prop="fun_name" label="功能权限">
          <template slot-scope="scope">
            <div class="color">
              {{scope.row.fun_name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="lv" label="权限等级" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.lv}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="time" label="最长授权" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <OverflowTooltip style="width:150px">{{scope.row.ownership}}</OverflowTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="settingHandle(scope.row)">
              <i class="icon iconfont icon-gongnengquanxianpeizhi"></i>
            </el-button>
            <el-button type="text" @click="deliverHandle(scope.row)">
              <i class="icon iconfont icon-zhuanjiao"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <NoData v-else title="功能权限配置"></NoData>
    <FunSettingDialog v-if="funDialogVisible" :data="data" :type="type" @funSettingDialogHandle="funSettingDialogHandle"></FunSettingDialog>
  </section>
</template>

<script>
import NoData from '@c/no-data'
import OverflowTooltip from '@c/overflow-tooltip'
import FunSettingDialog from './fun-setting-dialog'
export default {
  name: 'FunctionSetting',
  components: {
    NoData,
    OverflowTooltip,
    FunSettingDialog
  },
  data () {
    return {
      searchValue: '',
      loading: false,
      funDialogVisible: false,
      tableData: [
        {
          fun_name: '123'
        }
      ],
      data: {},
      type: ''
    }
  },
  methods: {
    searchFilterTable () { },
    settingHandle (row) {
      this.funDialogVisible = true
      this.type = 'belong'
      this.data = row
    },
    deliverHandle (row) {
      this.funDialogVisible = true
      this.type = 'deliver'
      this.data = row
    },
    funSettingDialogHandle () {
      this.funDialogVisible = false
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
.function-my-setting {
  .search {
    margin-right: 20px;
    .el-input {
      width: 200px;
      .el-input__inner {
        // border: none;
        // border-bottom: 1px solid $grey6;
        border-radius: 0;
        // background-color: $grey7;
      }
    }
  }
}
</style>
