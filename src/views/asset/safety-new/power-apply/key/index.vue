<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-05-24 17:00:15
 * @Description:
-->

<template>
  <section class="datasource-power container key-wrapper">
    <Header :tabs="tabs" v-model="activeName" :active="activeName" :showCount="true" title="密钥权限" ref="head" @change="changeHandle">
        <div class="actions" style="display: flex;">
          <el-input v-model="secretKeyname" prefix-icon="el-icon-search" @change="searchChange" clearable placeholder="请输入密钥名称" class="ml-10 mr-10"></el-input>
          <el-button icon="iconfont icon-filter" @click="handleFilter"></el-button>
          <el-button type="primary" @click="applyKey">申请密钥权限</el-button>
          <el-button class="ml-10" icon="el-icon-refresh-right"></el-button>
        </div>
      </Header>
    <!-- <div class="head mb-10">
      <div class="flex">
        <div class="page-title mr-20">密钥权限</div>
      </div>
      <div>
        <div class="flex top-right">
          <el-input v-model="secretKeyname" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入密钥名称" class="ml-10 mr-10"></el-input>
          <el-button icon="iconfont icon-filter" @click="handleFilter"></el-button>
          <el-button>申请密钥权限</el-button>
          <el-button class="ml-10" icon="el-icon-refresh-right"></el-button>
        </div>
      </div>
    </div> -->
    <div v-show="showCondition" class="condition-wrapper mb-10">
          <el-form :model="form" inline class="form" label-width="110px">
            <el-form-item label="权限类型" class="form-item">
                <el-select v-model="form.permissionType" clearable  placeholder="全部" @change="getPermissionList(), setHeightFun()" >
                    <el-option v-for="item in permissionTypeList" :key="item.value" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="权限来源" class="form-item">
                <el-checkbox-group v-model="form.permissionSource" clearable @change="getPermissionList(), setHeightFun()">
                    <el-checkbox v-for="(item, index) in statusList" :label="item.name" :key="index">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item v-if="activeName === '2'" label="失效原因" class="form-item">
              <el-radio-group v-model="form.invalidityReason" @input="getPermissionList(), setHeightFun()">
                <el-radio v-for="(item, index) in invalidityReasonTypeList" :label="item.name" :key="index">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
        </el-form>
        <div>
            <el-divider v-if="form.permissionSource.length || form.permissionType || form.invalidityReason"></el-divider>
            <el-tag :key="1" v-if="form.permissionSource.length"  size="mini" closable class="mr-5" @close="handleClose('1')">权限来源: {{form.permissionSource.join('、')}}</el-tag>
            <el-tag :key="2" v-if="form.permissionType"  size="mini" closable class="mr-5" @close="handleClose('2')">权限类型: {{form.permissionType}}</el-tag>
            <el-tag :key="3" v-if="form.invalidityReason" size="mini" closable class="mr-5" @close="handleClose('3')">失效原因: {{ form.invalidityReason }}</el-tag>
        </div>
    </div>
    <el-card>
      <el-table ref="multipleTable" :data="tableData" style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange" :height="getHeight">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="secretKeyname" label="密钥名称">
          <template slot-scope="{row}">
            <div class="keyName">
              <span class="icon iconfont icon-yuechi iconBg"></span>
              <span class="ml-10">{{ row.secretKeyName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="field2" label="环境">
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
        <el-table-column prop="permissionTypeName" label="权限类型">
          <template slot-scope="{row}">
            <div>{{ row.permissionTypeName }}</div>
            <!-- <el-popover
                placement="bottom"
                trigger="click"
                popper-class="workorde-remark">
                <div>{{ row.permissionTypeName }}</div>
                <el-button slot="reference" type="text"> 查看密钥</el-button>
                </el-popover> -->
          </template>

        </el-table-column>
        <el-table-column prop="validUntil" label="有效期至">
          <template slot-scope="{row}">
            <div>{{ row.validUntil === 'all' ? '长期' :  row.validUntil}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="permissionSourceName" label="权限来源">
          <template slot-scope="{row}">
            <div>{{row.permissionSourceName}}</div>
            <div>{{row.account}}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="{row}">
            <el-tooltip v-if="activeName === '1'" class="item" effect="dark" content="续期" placement="top">
              <el-button :disabled="row.invalidityDate === 'all'" type="text" @click="handleRenewal(row)"><i class="iconfont icon-lishibanben font-14 color-btn"></i></el-button>
            </el-tooltip>
            <el-tooltip v-if="activeName === '1'" class="item" effect="dark" content="交还" placement="top">
              <el-button type="text" @click="handleReturn([row])"><i class="iconfont icon-huifu font-14 color-btn"></i></el-button>
            </el-tooltip>
            <el-tooltip v-if="activeName === '2'" class="item" effect="dark" content="申请权限" placement="top">
              <el-button type="text" @click="handleApply([row])"><i class="iconfont icon-huifu font-14 color-btn"></i></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination> -->

    <SelectFooter 
    :tab="activeName" 
    @checkAllChange="checkAllChange" 
    :multipleSelection="multipleSelection" 
    :tableData="tableData" 
    :total="total" 
    @batchRecover="batchRecover"
     @batchDel="handleEdit" 
     @sendValue="handleClick"
     @batchApply="batchApply"
     ></SelectFooter>

    <RecoveryDialog :info="info" v-if="recoveryVisible" @recoveryClose="recoveryClose" @submitRecovery="submitRecovery"></RecoveryDialog>
    <ApplyDialog :info="info" v-if="applyVisible" @applyClose="applyClose" @submitApply="submitApply"></ApplyDialog>
  </section>
</template>

<script>
import mixin from '../../mixins'
import RecoveryDialog from './recovery'
import ApplyDialog from './apply.vue'
import SelectFooter from './footer'
import pager from '@/mixins/pager'
import { getPermissionDetail, getPermissionTypeData, invalidityReasonType, permissionReturn } from '@/api/asset/security.js'

export default {
  name: 'KeyPower',
  components: {
    SelectFooter,
    RecoveryDialog,
    ApplyDialog
  },
  mixins: [pager, mixin],
  data () {
    return {
      statusList: [
                {name:'申请授权', value: 0},
                {name:'主动授权', value: 1}
      ],
      showCondition: false,
      activeName: '1',
      loading: 0,
      tableData: [],
      multipleSelection: [],
      secretKeyname: '',
      recoveryVisible: false,
      applyVisible: false,
      info: [],
      tabs: [
        {
          label: '已生效',
          value: '1',
          total: 0
        },
        {
          label: '已失效',
          value: '2',
          total: 0
        }
      ],
      total1: 0,
      total2: 0,
      permissionTypeList: [],
      form: {
        permissionType: '',
        permissionSource: [],
        invalidityReason: ''
      },
      invalidityReasonTypeList: [],
      total: 0,
      getHeight: 0,
    }
  },
  mounted () { 
    this.getPermissionList('0')
    this.getPermissionList()
    this.getPermissionTypeData()
    this.invalidityReasonType()
    this.$nextTick(_ => {
      this.bodyHeight = window.innerHeight
      this.getHeight = this.bodyHeight - 193
    })
  },
  methods: {
    //申请密钥权限
    applyKey() {
      this.applyVisible = true; 
    },
    handleClick(val) {
      this.pageFilters = val
      this.getPermissionList()
    },
    handleClose(tag) {
      if (tag === '2') {
        this.form.permissionType = ''
      } else if (tag === '1') {
        this.form.permissionSource = []
      } else {
        this.form.invalidityReason = ''
      }
      this.setHeightFun()
      this.getPermissionList()
    },
    async getPermissionTypeData() {
        const res = await getPermissionTypeData()
        if (res) {
            this.permissionTypeList = res.data
        }
      },
    changeHandle(val) {
      this.activeName = val
      if (this.showCondition) {
        this.setHeightFun()
      } else {
        this.getHeight = this.bodyHeight - 193
      }
      this.form.invalidityReason = ''
      this.getPermissionList()
    },
    async getPermissionList (data) {
      const permissionSource = []
      this.form.permissionSource.forEach(item => {
          if (item === '申请授权') {
              permissionSource.push(0)  
          } else {
              permissionSource.push(1)
          }
      })
      const params = {
        secretKeyname: this.secretKeyname,
        status: data ? '0' : this.activeName === '1' ? '1' : '0',
        invalidityReason: this.activeName === '2' ? this.form.invalidityReason : undefined,
        permissionSource: permissionSource + '',
        permissionType: this.form.permissionType === '查看秘钥值' ? "secret_watch" : this.form.permissionType === '数据集成加密' ? 'integration_encryption' : this.form.permissionType === '数据集成解密' ? 'integration_decryption' : '',  
        ...this.pageFilters
      }
      const res = await getPermissionDetail(params)
      if (res) {
        if (data) {
          this.tabs[1].total = res.data.total
        } else {
          this.tableData = res.data.totalList
          this.total = res.data.total
          if (this.activeName === '2') {
            this.tabs[1].total = res.data.total
          } else if (this.activeName === '1') {
            this.tabs[0].total = res.data.total
          }
        }
      }
    },
    async invalidityReasonType() {
      const res = await invalidityReasonType()
      if (res) {
        this.invalidityReasonTypeList = res.data
      }
    },

    handleRenewal (row) {
      this.info.push(row)
      this.recoveryVisible = true
    },

    recoveryClose (val) {
      this.info = []
      this.recoveryVisible = false
    },
    applyClose() {
      this.info = []
      this.applyVisible = false
    },
    submitApply() {
      // this.info = []
      this.applyVisible = false
      this.getPermissionList()
    },
    submitRecovery() {
      this.info = []
      this.recoveryVisible = false
      this.getPermissionList()
    },
    handleReturn (row) {
      // secretKeyname
      const add = row.map(item => item.secretKeyname)
      this.$confirm(`确定交还密钥 ${add} 的权限吗`, '交还密钥权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.permissionReturn(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        })
      })
    },
    handleApply(row) {
      this.info = row
      this.applyVisible = true
    },
    async permissionReturn(data) {
      const secretAccountId = data.map(item => item.secretAccountId)
      const res = await permissionReturn({secretAccountId: secretAccountId+ ''}) 
      if (res) {
        this.getPermissionList()
        this.tabs[1].total = this.tabs[1].total + data.length
        this.$message({
          type: 'success',
          message: '交还成功!'
        })
      }
    },
    setHeightFun () {
        if (this.form.permissionSource.length || this.form.permissionType || this.form.invalidityReason ) {
          if (this.activeName === '1') {
            this.getHeight = this.bodyHeight - 323
          } else {
            this.getHeight = this.bodyHeight - 375
          }
        } else {
          if (this.activeName === '1') {
            this.getHeight = this.bodyHeight - 295
          } else {
            this.getHeight = this.bodyHeight - 347
          }
        }
    },
    handleFilter () {
      this.showCondition = !this.showCondition
      if (this.showCondition) {
        this.setHeightFun ()
      } else {
        this.getHeight = this.bodyHeight - 193
      }
    },

    searchChange (val) {
      this.getPermissionList()
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

    // 续期
    handleEdit () {
      this.info = this.multipleSelection
      this.recoveryVisible = true
    },

    // 交还
    batchRecover () {
      this.handleReturn(this.multipleSelection)
      console.log(this.multipleSelection)
    },
    //申请权限
    batchApply() {
      this.info = this.multipleSelection
      this.applyVisible = true
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
.condition-wrapper {
  background-color: #fff;
  padding: 20px 30px;
  :deep(.el-form) {
    .el-form-item {
      width: 48.5%;
      border: 1px solid #dcdfe6;
      padding: 0 10px;
      height: 34px;
      line-height: 28px;
    }
    .el-form-item__content {
      width: calc(100% - 110px);
      border-left: 1px solid #dcdfe6;
      padding-left: 10px;
      .el-select {
        width: 100%;
        .el-input__inner {
          border: none;
        }
      }
    }
  }
  .el-divider{
    margin-top: 0px;
    margin-bottom: 5px;
  }
//   .el-divider {
//     :deep(.el-divider--horizontal){
//         margin: none;
//     }
//   }
}
</style>
