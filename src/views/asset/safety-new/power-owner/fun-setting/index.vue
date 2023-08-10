<template>
  <section class="function-my-setting">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">功能权限配置</div>
      </div>
      <div>
        <div class="flex">
          <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键字" class="ml-10 mr-10"></el-input>
          <el-button icon="el-icon-refresh-right"></el-button>
        </div>
      </div>
    </div>

    <template v-if="tableData.length">
      <el-table :data="tableData" style="width: 100%" ref="table" v-loading="loading">
        <el-table-column prop="fun_name" label="功能权限">
          <template slot-scope="scope">
            <div class="color">
              {{scope.row.fun_name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="权限等级" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.level}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="approver" label="审批人" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="time" label="最长授权" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.ownership}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" icon="icon iconfont icon-gongnengquanxianpeizhi" @click="settingHandle(scope.row)">
            </el-button>
            <el-button type="text" icon="icon iconfont icon-zhuanjiao" @click="deliverHandle(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <NoData v-else title="功能权限配置"></NoData>
    <FunSettingDialog v-if="funDialogVisible" :data="data" :type="type" @funSettingDialogHandle="funSettingDialogHandle"></FunSettingDialog>
  </section>
</template>

<script>
import NoData from '@c/no-data'
import FunSettingDialog from './fun-setting-dialog'
export default {
  name: 'FunctionSetting',
  components: {
    NoData,
    FunSettingDialog
  },
  data () {
    return {
      inputVal: '',
      loading: false,
      funDialogVisible: false,
      tableData: [
        {
          fun_name: '123',
          level: 1,
          approver: 'test001',
          ownership: '120天'
        },
        {
          fun_name: '123',
          level: 1,
          approver: 'test001',
          ownership: '120天'
        }
      ],
      data: {},
      type: ''
    }
  },
  methods: {
    searchChange (val) { },
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
  padding: 10px 15px;
  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
  }
}

</style>
