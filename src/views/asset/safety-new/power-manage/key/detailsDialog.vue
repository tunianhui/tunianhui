<template>
    <section class="datasource-power container select">
        <div class="mb-20">
            <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item class="mb-5" :to="{ path: '/asset/safety-new/power-manage/key' }">密钥权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>密钥权限详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="mb-30">
            <div class="mb-30-5">
                <div class="mb-30-1">
                    <div class="icon-box">
                     <i class="iconfont icon-miyao1"></i>   
                    </div>
                    <div class="icon-tit">密钥</div>
                </div>
            </div>
            <div class="mb-30-10">
                <div class="mb-30-2">{{ info.secretKeyName }}</div>
                <div class="mb-30-3">
                    <div>环境:<span>生产环境</span></div>
                    <div class="mb-30-4">负责人:<span>{{ info.owner }}</span></div>
                </div>
            </div>
        </div>
        <div class="mb-40">
            <!-- <div>用户权限列表</div> -->
            <div class="flex">
                <div class="page-title mr-20">用户权限列表</div>
            </div>
            <div class="flex mr-15">
                <!-- <div class="flex mr-10"> -->
                    <el-button icon="iconfont icon-filter" @click="handleFilter"></el-button>
                    <el-input v-model="form.account"  prefix-icon="el-icon-search" clearable placeholder="请输入账号名称" class="ml-10 mr-10" @change="getPermissionDetail"></el-input>
                    <el-button icon="el-icon-refresh-right" @click="getPermissionDetail"></el-button>
                <!-- </div> -->
            </div>
        </div>
        <div v-show="showCondition" class="condition-wrapper mb-10">
          <el-form :model="form" inline class="form" label-width="110px">
            <el-form-item label="权限来源" class="form-item">
                <el-checkbox-group v-model="form.permissionSourceName" clearable @change="getPermissionDetail(),setHeightFun()">
                    <el-checkbox v-for="(item, index) in statusList" :label="item.name" :key="index">{{item.name}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="权限类型" class="form-item">
                <el-select v-model="form.permissionTypeName" clearable  placeholder="全部" @change="getPermissionDetail(),setHeightFun()">
                    <el-option v-for="item in permissionTypeList" :key="item.value" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div>
            <el-divider v-if="form.permissionSourceName.length || form.permissionTypeName"></el-divider>
            <el-tag :key="1"  v-if="form.permissionSourceName.length"  size="mini" :closable="true" class="mr-5" @close="handleClose('1')">权限来源: {{form.permissionSourceName.join('、')}}</el-tag>
            <el-tag :key="2" v-if="form.permissionTypeName"  size="mini" closable class="mr-5" @close="handleClose('2')">权限类型: {{form.permissionTypeName}}</el-tag>
        </div>
        </div>
        <el-table :data="tableData" style="width: 100%" v-loading="!!loading" :height="getHeight" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="account" label="账号">
                <template slot-scope="{row}">
                    <span>{{ row.accountType }}</span>
                    <div style="color: #D3E0E9;">{{ row.account }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="permissionTypeName" label="权限类型"></el-table-column>
            <el-table-column prop="validUntil" label="有效期至">
                <template slot-scope="{row}">
                    {{ row.validUntil === 'all' ? '长期' : row.validUntil}}
                </template>
            </el-table-column>
            <el-table-column prop="permissionSourceName" label="权限来源">
                <template slot-scope="{row}">
                    <!-- <span>申请授权</span> -->
                    <div>{{ row.authAccount }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="{row}">
                    <el-tooltip class="item" effect="dark" content="回收" placement="top">
                    <el-button type="text" @click="handleRecovery(row)"><i class="iconfont icon-huishou font-16 color-btn"></i></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
       <!-- <div class="select"> -->
        <FooterCom :total="count" @setTableList="getTableData">
            <div slot="left">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
                    <span class="font-12">选中 {{multipleSelection.length}} 个</span>
                </el-checkbox>
                <el-button type="text" :disabled="multipleSelection.length === 0" @click="batchRecover">
                    <i class="iconfont icon-huishou font-12 color-btn mr-5"><span class="ml-5">回收</span></i>
                </el-button>
            </div>
        </FooterCom>
        <!-- <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData" :total="total" @batchRecover="batchRecover" @batchDel="handleEdit" @setTableList="getTableData"></SelectFooter> -->
        <RecoveryDialog :info="infoData" v-if="recoveryVisible" @recoveryClose="recoveryClose" @recoverFun="closeFun"></RecoveryDialog>
    </section>
</template>

<script>
import { getPermissionTypeData, getPermissionDetail } from '@/api/asset/security.js'
import FooterCom from '@c/footerCom.vue'
import SelectFooter from './footer'
import RecoveryDialog from './recovery'
export default {
    name: 'detailsDialog',
    components: {
     FooterCom,
     SelectFooter,
     RecoveryDialog,
    },
    data() {
        return {
            dynamicTags:['1', '2'],
            loading: 0,
            showCondition: false,
            statusList: [
                {name:'申请授权', value: 0},
                {name:'主动授权', value: 1}
            ],
            form: {
                permissionSourceName: [],
                permissionTypeName: '',
                account: '',
            },
            permissionTypeList: [],
            tableData: [],
            info: {},
            recoveryVisible: false,
            infoData: [],
            bodyHeight: 0,
            getHeight:0,
            count:0,
            checkAll: false,
            isIndeterminate: false,
            multipleSelection:[],
            pageFilters: {
                pageSize: 10,
                pageNo: 1 // 前台分页使用
            },
        }
    },
    mounted() {
        this.getPermissionTypeData()
        this.getPermissionDetail()
        this.info = JSON.parse(localStorage.getItem('details'))
        this.$nextTick(_ => {
          this.bodyHeight = window.innerHeight
          this.getHeight = this.bodyHeight - 318
        })
    },
    methods: {
        handleClose(tag) {
            if (tag === '1') {
                this.form.permissionSourceName = []
            } else {
                this.form.permissionTypeName = ''
            }
            this.getPermissionDetail()
        },
        getTableData(val) {
            this.pageFilters = val
            this.getPermissionDetail()
        },
        handleCheckAllChange(val) {
            console.log(val)
            if (val) {
                this.tableData.forEach(item => {
                 this.$refs.multipleTable.toggleAllSelection(item)
                })
            } else {
                this.$refs.multipleTable.clearSelection()
            }
        },
        batchRecover() {
            this.multipleSelection[0].typeDialog = 'details'
            this.infoData = this.multipleSelection
            this.recoveryVisible = true
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
            if (val.length === this.tableData.length) {
              this.checkAll = true
            }
            if (val.length === 0) {
              this.checkAll = false
            }
            console.log(val, 'ertretr')
        },
        closeFun() {
            this.infoData = []
            this.recoveryVisible = false
            this.getPermissionDetail()
        },
        handleFilter() {
            this.showCondition = !this.showCondition
            if (this.showCondition) {
                this.setHeightFun()
                // this.getHeight = this.bodyHeight - 320 - 100
            } else {
                this.getHeight = this.bodyHeight - 318
            }
        },
        handleRecovery(row) {
            // console.log(row)
            row.typeDialog = 'details'
            this.infoData.push(row)
            this.recoveryVisible = true
        },
        recoveryClose() {
            this.infoData = []
            this.recoveryVisible = false
        },
        async getPermissionTypeData() {
            const res = await getPermissionTypeData()
            if (res) {
                this.permissionTypeList = res.data
            }
        },
        setHeightFun() {
            if (this.form.permissionSourceName.length || this.form.permissionTypeName) {
                this.getHeight = this.bodyHeight - 320 - 128
            } else {
                this.getHeight = this.bodyHeight - 320 - 100
            }
        },
        async getPermissionDetail() {
            this.loading++
            // this.setHeightFun()
            const permissionSource = []
            this.form.permissionSourceName.forEach(item => {
                if (item === '申请授权') {
                    permissionSource.push(0)  // 申请授权的选择选择0,主动授权的选择选择1. 这
                } else {
                    permissionSource.push(1)
                }
            })
            const param = {
                ...this.pageFilters,
                account: this.form.account,
                permissionType: this.form.permissionTypeName === '查看秘钥值' ? "secret_watch" : this.form.permissionTypeName === '数据集成加密' ? 'integration_encryption' : this.form.permissionTypeName === '数据集成解密' ? 'integration_decryption' : '',
                permissionSource: permissionSource + '', 
                secretKeyId: this.info.secretKeyId,
                secretKeyName: this.info.secretKeyName ,
            }
            const res = await getPermissionDetail(param)
            if (res) {
                this.tableData = res.data.totalList
                this.count = res.data.total
            }
            this.loading--
        }
    }
}
</script>

<style lang="scss" scoped>
.select{
    position: relative;
}
:deep(.el-breadcrumb__inner) {
    font-weight:normal;
    color: #2E74FF;
}
.mb-30{
    margin-bottom: 10px;
    display: flex;
    background-color: #FFFFFF;
    .mb-30-5{
        background-color: #2E74FF;
        width: 100px;
        height: 125px;
        // display: flex;
        // position: relative;
        display: flex;
        .mb-30-1{
            margin: auto;
        }
    }
    .mb-30-10{
        margin-left: 20px;
        font-size: 14px;
        .mb-30-2{
            margin-top:10px;
        }
        .mb-30-3{
            color: rgba(0, 0, 0, 0.45);
            display: flex;
            margin-top: 60px;
            font-size: 12px;
            span{
                color: rgba(0, 0, 0, 0.65);
                margin-left: 15px;
            }
            .mb-30-4{
                margin-left: 30px;
            }
        }
    }
    
    .icon-box{
        width: 40px;
        height: 40px;
        background-color: #FFFFFF;
        display: flex;
    }
    .iconfont{
        font-size: 20px;
        color: #2E74FF;
        background-color: #FFFFFF;
        margin: auto;
    }
    .icon-tit{
        font-size: 14px;
        color:#FFFFFF ;
        margin-left: 5px;
    }
}
.mb-40{
    margin-bottom: 10px;
    display: flex;
    position: relative;
    .page-title{
        font-size: 16px;
        font-weight: 700px;
    }
    .mr-15{
        position: absolute;
        right: 0;
        margin-right: 0px;
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