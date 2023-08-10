<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-22 15:38:20
 * @LastEditTime: 2022-11-02 20:26:48
 * @Description:
-->
<template>
  <section class="asset-permissions">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">资产权限审计</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="数据表" name="数据表"></el-tab-pane>
          <el-tab-pane label="数据源" name="数据源"></el-tab-pane>
        </el-tabs>
      </div>
      <div>
        <div class="flex top-right">
          <el-checkbox class="check-box">我管理的</el-checkbox>
          <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入数据表名" class="ml-10 mr-10"></el-input>
          <el-button @click="handleFilter" icon="iconfont icon-filter">筛选</el-button>
          <el-button class="ml-10" @click="exportRecord()">查看导出记录</el-button>
          <el-button type="primary" @click="exportPermission">导出权限审计详情</el-button>
          <!-- <el-dropdown @command="handleCommand" class="ml-10">
            <el-button type="primary"> 导出权限审计详情<i class="el-icon-arrow-down el-icon--right"></i> </el-button>
            <el-dropdown-menu slot="dropdown" style="width: 145px">
              <el-dropdown-item command="all">全量导出</el-dropdown-item>
              <el-dropdown-item command="part">按筛选条件导出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
          <el-button class="ml-10" icon="el-icon-refresh-right"></el-button>
        </div>
      </div>
    </div>
    <template v-if="activeName === '数据表'">
      <el-card v-show="showCondition" class="mb-10">
        <el-form :model="form" class="form">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="表类型" class="form-item">
                <el-select v-model="form.tableType" placeholder="请选择表类型">
                  <el-option v-for="item in tableTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表环境" class="form-item">
                <el-checkbox-group v-model="form.tableEnvList">
                  <el-checkbox label="开发环境"></el-checkbox>
                  <el-checkbox label="生产环境"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="数据板块" class="form-item">
                <el-select v-model="form.dataBlock" placeholder="请选择数据板块">
                  <el-option v-for="item in dataBlockList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属项目" class="form-item">
                <el-select v-model="form.belong" placeholder="请选择所属项目">
                  <el-option v-for="item in belongList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="表负责人" class="form-item">
                <el-select v-model="form.manager" placeholder="请选择表负责人">
                  <el-option v-for="item in managerList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号类型" class="form-item">
                <el-checkbox-group v-model="form.accountTypeList">
                  <el-checkbox label="个人账号"></el-checkbox>
                  <el-checkbox label="生产账号"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="权限账号" class="form-item">
                <el-select v-model="form.authAccount" placeholder="请选择权限账号">
                  <el-option v-for="item in authAccountList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="权限类型" class="form-item">
                <el-checkbox-group v-model="form.authTypeList">
                  <el-checkbox label="查表数据"></el-checkbox>
                  <el-checkbox label="改表数据"></el-checkbox>
                  <el-checkbox label="改表结构"></el-checkbox>
                  <el-checkbox label="删除表"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card>
        <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" width="45"></el-table-column>
          <el-table-column prop="field1" label="数据对象" min-width="200">
            <template slot-scope="{row}">
              <span class="icon iconfont icon-shougongbiaoqian"></span>
              <span class="ml-10">{{ row.field1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="field2" label="表环境" width="160"> </el-table-column>
          <el-table-column prop="field3" label="数据板块" width="140"> </el-table-column>
          <el-table-column prop="field4" label="项目" min-width="150"></el-table-column>
          <el-table-column prop="field4" label="权限账号" width="140"></el-table-column>
          <el-table-column prop="field5" label="账号类型" width="120"></el-table-column>
          <el-table-column prop="field6" label="写权限申请" width="120"> </el-table-column>
          <el-table-column prop="field7" label="资产安全策略" width="120">
            <template slot-scope="{row}">
              <i :class="row.field7 === '开启' ? 'el-icon-success' : 'el-icon-remove'"></i>
              <span class="ml-5">{{ row.field7 }}</span>
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
          <el-table-column prop="field1" label="导出人" min-width="100"> </el-table-column>
          <el-table-column prop="field2" label="导出时间" width="160"> </el-table-column>
          <el-table-column prop="field3" label="导出主题" min-width="160"> </el-table-column>
          <el-table-column prop="field4" label="状态" width="80">
            <template slot-scope="{row}">
              <i :class="row.field4 === '成功' ? 'el-icon-success' : 'el-icon-remove'"></i>
              <span class="ml-5">{{ row.field4 }}</span>
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
    </template>

    <template v-if="activeName === '数据源'">
      <el-card>
        <el-table :data="dataSourceTable">
          <el-table-column prop="object" label="数据对象"></el-table-column>
          <el-table-column prop="env" label="环境"></el-table-column>
          <el-table-column prop="account" label="权限账号"></el-table-column>
          <el-table-column prop="accountType" label="账号类型"></el-table-column>
          <el-table-column prop="authType" label="权限类型"></el-table-column>
          <el-table-column prop="effectiveDate" label="有效期"></el-table-column>
          <el-table-column prop="manager" label="数据源负责人"></el-table-column>
        </el-table>
      </el-card>
      <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
    </template>

    <!-- 导出权限审计详情 -->
    <el-dialog title="导出权限审计详情" :visible.sync="exportPermissionDialog" @close="closeExportDia" width="45%" class="export-dialog" :close-on-click-modal="false">
      <el-form :model="form2" ref="exportForm" label-width="120px">
        <el-form-item label="导出范围：" prop="exportScope" :rules="{ required: true, message: '请选择导出范围', trigger: 'change' }" class="export-scope">
          <el-select v-model="form2.exportScope">
            <el-option v-for="item in exportScopeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeExportDia">取 消</el-button>
        <el-button type="primary" @click="closeExportDia">确 定</el-button>
      </div>
    </el-dialog>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" @batchEdit="handleTransfer"></SelectFooter>
  </section>
</template>

<script>
import pager from '@/mixins/pager'
export default {
  name: 'assetPermissions',
  mixins: [pager],
  data () {
    return {
      showCondition: false,
      form: {
        tableType: '',
        tableEnvList: [],
        dataBlock: '',
        belong: '',
        manager: '',
        accountTypeList: [],
        authAccount: '',
        authTypeList: []
      },
      tableTypeList: [
        { label: '', value: '' },
        { label: '', value: '' }
      ],
      dataBlockList: [
        { label: '', value: '' },
        { label: '', value: '' }
      ],
      belongList: [
        { label: '', value: '' },
        { label: '', value: '' }
      ],
      managerList: [
        { label: '', value: '' },
        { label: '', value: '' }
      ],
      authAccountList: [
        { label: '', value: '' },
        { label: '', value: '' }
      ],
      activeName: '数据表',
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
      dialogVisible: false,
      dataSourceTable: [],
      exportPermissionDialog: false,
      form2: {
        exportScope: ''
      },
      exportScopeList: [
        { label: '用户资源权限详情', value: '1' },
        { label: '用户资源操作详情', value: '2' },
      ]
    }
  },
  mounted () { },
  methods: {
    exportPermission () {
      this.exportPermissionDialog = true
    },
    closeExportDia () {
      this.exportPermissionDialog = false
    },
    handleFilter () {
      this.showCondition = !this.showCondition
    },
    handleCommand (command) {
      switch (command) {
        case 'all':
          break
        case 'part':
          break
        default:
          break
      }
    },
    searchChange (val) { },
    handleClick (val) { },
    exportRecord () {
      this.dialogVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    checkAllChange (boolean) {
      if (boolean) {
        this.tableData.forEach((item) => {
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
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },
    handleEdit () { }
  }
}
</script>

<style lang="scss">
.asset-permissions {
  .check-box {
    line-height: 28px;
  }
  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
    .top-right {
      align-items: center;
      .el-input {
        .el-input__inner {
          height: 32px !important;
          line-height: 32px !important;
        }
        .el-input__icon {
          line-height: 32px !important;
        }
      }
    }
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
<style lang="scss" scoped>
$formItemHeight: 32px;
.asset-permissions {
  .form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border: 1px solid #dcdfe6;
    height: $formItemHeight;
    ::v-deep .el-form-item__label {
      display: flex;
      justify-content: center;
      width: 100px;
      height: $formItemHeight;
      line-height: $formItemHeight;
      border-right: 1px solid #dcdfe6;
    }
    ::v-deep .el-form-item__content {
      flex: 1;
    }
    ::v-deep .el-checkbox-group {
      margin-left: 15px;
      display: flex;
      align-items: center;
    }
    ::v-deep .el-select {
      width: 100%;
      input {
        border: 0;
      }
    }
  }
  .export-dialog {
    ::v-deep .el-dialog {
      .export-scope {
        margin-bottom: 60px;
      }
    }
  }
}
</style>
