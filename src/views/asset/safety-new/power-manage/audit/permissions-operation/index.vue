<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-22 15:38:20
 * @LastEditTime: 2022-11-02 20:27:14
 * @Description:
-->
<template>
  <section class="permissions-operation">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">权限操作审计</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="数据表" name="first"></el-tab-pane>
          <el-tab-pane label="数据源" name="second"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <div class="flex">
          <el-checkbox class="check-box">我管理的</el-checkbox>
          <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入数据表名" class="ml-10 mr-10"></el-input>
          <el-button>筛选</el-button>
          <el-button @click="handleAdd()">查看导出记录</el-button>
          <el-button type="primary">导出权限审计详情</el-button>
          <el-button icon="el-icon-refresh-right"></el-button>
        </div>
      </div>
    </div>

    <el-card>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="45"></el-table-column>
        <el-table-column prop="field1" label="数据对象" min-width="200">
          <template slot-scope="{row}">
            <span class="icon iconfont icon-shougongbiaoqian"></span>
            <span class="ml-10">{{row.field1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="表环境" width="160">
        </el-table-column>
        <el-table-column prop="field3" label="数据板块" width="140">
        </el-table-column>
        <el-table-column prop="field4" label="项目" min-width="140"></el-table-column>
        <el-table-column prop="field4" label="权限账号" width="140"></el-table-column>
        <el-table-column prop="field5" label="账号类型" width="140"></el-table-column>
        <el-table-column prop="field6" label="写权限申请" width="120">
        </el-table-column>
        <el-table-column prop="field7" label="资产安全策略" width="120">
          <template slot-scope="{row}">
            <i :class=" row.field7 === '开启' ? 'el-icon-success':'el-icon-remove' "></i>
            <span class="ml-5">{{row.field7}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <el-button type="text"><i class="el-icon-set-up font-14 color-btn" @click="handleTransfer(row)"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>

    <!-- 设置弹窗 -->
    <el-dialog title="导出记录" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" v-draggable="{trigger: '.el-dialog__header', body: '.el-dialog', recover: false}" width="50%">
      <el-table :data="tableData2" style="width: 100%">
        <el-table-column prop="field1" label="导出人" min-width="100">
        </el-table-column>
        <el-table-column prop="field2" label="导出时间" width="160">
        </el-table-column>
        <el-table-column prop="field3" label="导出主题" min-width="160">
        </el-table-column>
        <el-table-column prop="field4" label="状态" width="80">
          <template slot-scope="{row}">
            <i :class=" row.field4 === '成功' ? 'el-icon-success':'el-icon-remove' "></i>
            <span class="ml-5">{{row.field4}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="导出" placement="top">
              <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'permissionsOperation',
  components: {

  },
  mixins: [pager],
  data () {
    return {
      activeName: 'first',
      inputVal: '',
      loading: 0,
      tableData: [
        {
          field1: 'tb_test_zh',
          field2: '开发环境',
          field3: 'LD_log_dev',
          field4: 'v3_4_dev',
          field5: '',
          field6: '个人账号',
          field7: '开启'
        },
        {
          field1: 'tb_test_zh',
          field2: '开发环境',
          field3: 'LD_log_dev',
          field4: 'v3_4_dev',
          field5: '',
          field6: '个人账号',
          field7: '开启'
        }
      ],
      multipleSelection: [],
      tableData2: [
        {
          field1: 'SuperAdmin',
          field2: '2022-07-07 10:31',
          field3: '用户资源权限详情_202207',
          field4: '成功'
        },
        {
          field1: 'SuperAdmin',
          field2: '2022-07-07 10:31',
          field3: '用户资源权限详情_202207',
          field4: '成功'
        }
      ],

      // 弹窗相关
      dialogVisible: false
    }
  },
  mounted () { },
  methods: {
    searchChange (val) { },
    handleClick (val) { },
    handleAdd () {
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    checkAllChange (boolean) {
      if (boolean) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },

    // 批量转交
    handleTransfer () {
      this.$confirm('转交后原负责人将无法对该元数据配置进行变更操作，确认转交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.permissions-operation {
  .check-box {
    line-height: 28px;
  }
  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .count {
    color: #4783ff;
  }
  .line {
    height: 1px;
    border-bottom: 1px solid #d9d9d9;
  }
  .detail {
    padding: 5px 10px;
    background-color: #fff;
  }
  .name-input {
    width: 200px;
  }
}
</style>
