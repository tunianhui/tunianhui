<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-06-07 14:18:12
 * @Description:
-->

<template>
  <section class="key-wrapper">
    <div class="head mb-10">
      <div class="flex">
        <div class="page-title mr-20">密钥权限</div>
      </div>
      <div>
        <div class="flex top-right">
          <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入密钥名称" class="ml-10 mr-10"></el-input>
          <el-button class="ml-10" icon="el-icon-refresh-right"></el-button>
        </div>
      </div>
    </div>
    <el-card>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="secretKeyname" label="密钥名称">
          <template slot-scope="{row}">
            <div class="keyName">
              <span class="icon iconfont icon-yuechi iconBg"></span>
              <span class="ml-10">{{ row.secretKeyname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="environment" label="环境">
          <template slot-scope="{row}">
            <span>生产环境</span>
          </template>
        </el-table-column>
        <el-table-column prop="account" label="权限账号">
          <template slot-scope="{row}">
            <div>{{row.accountType}}</div>
            <div>{{row.account}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="permissionTypeName" label="权限类型"></el-table-column>
        <el-table-column prop="invalidityDate" label="有效期至"></el-table-column>
        <el-table-column prop="permissionSourceName" label="权限来源">
          <template slot-scope="{row}">
            <div>{{row.permissionSourceName}}</div>
            <div>{{row.account}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="{row}">
            <el-tooltip class="item" effect="dark" content="续期" placement="top">
              <el-button type="text" @click="handleRenewal(row)"><i class="iconfont icon-lishibanben font-14 color-btn"></i></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="交还" placement="top">
              <el-button type="text" @click="handleReturn(row)"><i class="iconfont icon-huifu font-14 color-btn"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- <el-pagination  @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination> -->

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" :total="total" @batchRecover="batchRecover" @batchDel="handleEdit"></SelectFooter>

    <RecoveryDialog :info="info" v-if="recoveryVisible" @recoveryClose="recoveryClose"></RecoveryDialog>
  </section>
</template>

<script>
import RecoveryDialog from './recovery'
import SelectFooter from './footer'
import pager from '@/mixins/pager'
import { getPermissionDetail } from '@/api/asset/security.js'

export default {
  name: 'KeyPower',
  components: {
    SelectFooter,
    RecoveryDialog
  },
  mixins: [pager],
  data () {
    return {
      loading: 0,
      tableData: [],
      multipleSelection: [],
      inputVal: '',
      recoveryVisible: false,
      info: {}
    }
  },
  mounted () {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList () {
      const params = {
        permissionSource: '1',
        permissionType: '',
        status: '1',
        ...this.pageFilters
      }
      const res = await getPermissionDetail(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
    },

    handleRenewal (row) {
      this.info = row
      this.recoveryVisible = true
    },

    recoveryClose (val) {
      this.recoveryVisible = false
    },

    handleReturn (row) {
      this.$confirm(`确定交还密钥 ${row.secretKeyname} 的权限吗`, '交还密钥权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '交还成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        })
      })
    },

    handleFilter () {
      this.showCondition = !this.showCondition
    },

    searchChange (val) { },

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

    // 续期
    handleEdit () {
      this.recoveryVisible = true
    },

    // 交还
    batchRecover () {

    }
  }
}
</script>

<style lang="scss" scoped>
.key-wrapper {
  position: relative;
  height: 100%;
  .head {
    display: flex;
    justify-content: space-between;
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
  .keyName {
    display: flex;
    align-items: center;
    .iconBg {
      background: #2358fe;
      color: #fff;
    }
  }
}
</style>
