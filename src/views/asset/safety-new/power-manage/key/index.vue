<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-07-26 14:13:31
 * @Description:
-->

<template>
  <section class="datasource-power container key-wrapper">
    <div class="head mb-10">
      <div class="flex">
        <div class="page-title mr-20">密钥权限管理</div>
      </div>
      <div>
        <div class="flex top-right">
          <el-input v-model="searchData.secretKeyName" prefix-icon="el-icon-search" @change="searchChange" clearable placeholder="请输入密钥" class="ml-10 mr-10"></el-input>
          <el-button class="ml-10" icon="el-icon-refresh-right"></el-button>
        </div>
      </div>
    </div>

    <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange" :height="bodyHeight - 145">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="secretKeyName" label="密钥名称">
        <template slot-scope="{row}">
          <div class="keyName">
            <span class="icon iconfont icon-yuechi iconBg"></span>
            <span class="ml-10">{{ row.secretKeyName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="field2" label="环境">
        <template slot-scope="{row}">
          <span>生产环境</span>
        </template>
      </el-table-column>
      <el-table-column prop="authorizedAccountNum" label="有权限账号个数"> </el-table-column>
      <el-table-column prop="owner" label="负责人"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="查看权限详情" placement="top">
            <el-button type="text" @click="handleCheck(row)"><i class="iconfont icon-shujutancha font-14 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权" placement="top">
            <el-button type="text" @click="handleAuthorize(row)"><i class="iconfont icon-shouquan1 font-14 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="回收" placement="top">
            <el-button type="text" @click="handleRecovery(row)"><i class="iconfont icon-huishou font-16 color-btn"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" :total="total" @batchRecover="batchRecover" @batchDel="handleEdit" @setTableList="getTableData"></SelectFooter>

    <EmpowerDialog :info="info" v-if="empowerVisible" @empowerClose="empowerClose" @empowerFun="closeFun"></EmpowerDialog>
    <RecoveryDialog :info="info" v-if="recoveryVisible" @recoveryClose="recoveryClose" @recoverFun="closeFun"></RecoveryDialog>
  </section>
</template>

<script>
import EmpowerDialog from './empower'
import RecoveryDialog from './recovery'
import SelectFooter from './footer'
import pager from '@/mixins/pager'
import { getSecretKeysData, permissionAuth, permissionRecycling } from '@/api/asset/security.js'
export default {
  name: 'KeyPower',
  components: {
    SelectFooter,
    EmpowerDialog,
    RecoveryDialog
  },
  mixins: [pager],
  data () {
    return {
      loading: 0,
      tableData: [],
      multipleSelection: [],
      inputVal: '',
      empowerVisible: false,
      recoveryVisible: false,
      info: [],
      bodyHeight: 400,
      pageFilters: {
        pageSize: 10,
        pageNo: 1 // 前台分页使用
      },
      searchData: {
        secretKeyName: ''
      },
      total: 0
    }
  },
  mounted () {
    this.$nextTick(_ => {
      this.bodyHeight = window.innerHeight
    })

    console.log('9999', this.$route.query)
    const { secretKeyId, secretKeyName } = this.$route.query
    if (secretKeyId) {
      this.searchData = { secretKeyId, secretKeyName }
    }
    this.getSecretKeys()
  },
  methods: {
    handleCheck (row) {
      localStorage.setItem('details', JSON.stringify(row))
      this.$router.push('/asset/safety-new/power-manage/key/detailsDialog').catch((err) => { console.log(err) })
      // 跳转 ---> 详情
    },

    handleAuthorize (row) {
      this.info.push(row)
      this.empowerVisible = true
    },

    handleRecovery (row) {
      this.info.push(row)
      this.recoveryVisible = true
    },

    empowerClose () {
      this.info = []
      this.empowerVisible = false
    },
    closeFun () {
      this.info = []
      this.empowerVisible = false
      this.recoveryVisible = false
      this.getSecretKeys()
    },
    recoveryClose () {
      this.info = []
      this.recoveryVisible = false
    },

    async getSecretKeys () {
      const params = {
        ...this.searchData,
        ...this.pageFilters
      }
      const res = await getSecretKeysData(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
    },

    searchChange (val) {
      this.getSecretKeys()
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

    // 批量授权
    handleEdit () {
      // this.multipleSelection
      this.empowerVisible = true
      this.info = this.multipleSelection
      console.log(999, this.multipleSelection)
    },

    // 批量回收
    batchRecover () {
      this.recoveryVisible = true
      this.info = this.multipleSelection
      // this.multipleSelection
    },
    // 分页
    getTableData (val) {
      this.pageFilters = val
      this.getSecretKeys()
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
