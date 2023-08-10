<template>
  <section class="security-wrapper">
    <div class="mb-10">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="mb-5" :to="{ path: '/asset/security/data-identification/record' }">识别记录</el-breadcrumb-item>
        <el-breadcrumb-item>手动添加</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <p>手动添加</p>
    <div class="main" :style="{height: `${bodyHeight - 130}` + 'px'}">
      <div class="mb-20">去重设置</div>
      <el-form :model="dataForm" ref="dataForm" label-width="80px" inline :rules="rules1">
        <el-form-item label="去重策略" prop="dedupStrategy">
          <el-radio-group v-model="dataForm.dedupStrategy">
            <el-radio v-for="(item, index) in dedupStrategyTypeList" :key="index" :label="item.value">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider></el-divider>
        <div class="flex main-mr1">
          <p>已添加记录</p>
          <div class="flex main-mb-10">
            <el-input class="tabName" prefix-icon="el-icon-search" placeholder="请输入表名"></el-input>
            <el-button type="primary" @click="handleClick">按表添加</el-button>
          </div>
        </div>
        <el-table :data="dataForm.tableData" ref="elTable" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="tableId" label="数据表">
            <template slot-scope="{row}">
              <el-select v-model="row.tableId">
                <el-option v-for="(item, index) in TableList" :key="index" :value="item.tableId" :label="item.tableName"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="columnId" label="表字段">
            <template slot-scope="{row}">
              <el-select v-model="row.columnId">
                <el-option v-for="(item, index) in columnList" :key="index" :value="item.value" :label="item.name" :disabled="item.columnStatus === 0 "></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="identifyRuleId" label="识别规则">
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.'+ scope.$index +'.identifyRuleId'" :rules="tableDataRules.identifyRuleId">
                <el-select v-model="scope.row.identifyRuleId">
                  <el-option v-for="(item, index) in identifyRuleList" :key="index" :label="item.identifyRuleName" :value="item.identifyRuleId"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="classifyShortName" label="数据分类">
            <template slot-scope="{row}">
              <span class="data-classify">{{row.classifyShortName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="levelShortName" label="数据分级">
            <template slot-scope="{row}">
              <span class="data-classify"> <i class="icon iconfont icon-APIshouquan"></i> {{row.levelShortName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="生效状态">
            <template slot-scope="{row}">
              <el-switch v-model="row.status" active-value="1" inactive-value="0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <el-tooltip content="在此表下继续配置字段识别规则" placement="top">
                <el-button type="text" @click="configClick(scope)"><i class="icon-tab iconfont icon-jia"></i></el-button>
              </el-tooltip>
              <!-- <el-button type="text"><i class="icon-tab iconfont icon-jia"></i></el-button>   -->
              <el-button type="text" @click="deleteClick(scope)"><i class="icon-tab iconfont icon-shanchu1"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="footer-bu">
        <div class="footer">
          <el-divider></el-divider>
          <div class="footer-main">
            <el-checkbox class="footer-check" v-model="checkAll" @change="handleCheckAllChange">已选中 {{multipleSelection.length}} 个</el-checkbox>
            <!-- <div class="font-12">已选中 {{multipleSelection.length}} 个</div> -->
            <el-button type="text" :disabled="multipleSelection.length===0" class="ml-10" @click="changeIdentifyRule">
              <i class="icon iconfont icon-zhiliangguize font-14 color-btn mr-5"><span class="ml-5">更改识别规则</span></i>
            </el-button>
            <el-popover :disabled="multipleSelection.length===0" placement="top" width="15" trigger="hover">
              <el-button type="text" class="ml-10" @click="handleCommand('a')">
                <i class="icon iconfont icon-kaiqi font-14 color-btn mr-5"><span class="m1-5">开启</span></i></el-button> </br>
              <el-button type="text" class="ml-10" @click="handleCommand('b')">
                <i class="icon iconfont icon-shixiao1 font-14 color-btn mr-5"><span class="m1-5">关闭</span></i></el-button>
              <el-button slot="reference" type="text" class="ml-10"><i class="icon iconfont icon-kaiqi font-14 color-btn mr-5"><span class="ml-5">生效状态</span></i></el-button>
            </el-popover>
            <el-button type="text" :disabled="multipleSelection.length===0" @click="buttonClick" class="ml-10">
              <i class="icon iconfont icon-shanchu1 font-14 color-btn mr-5"><span class="ml-5">删除</span></i>
            </el-button>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="column">
          <div>
            <el-button @click="cancelClick">取消</el-button>
            <el-button type="primary" @click="changeStatus">上传</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 按表添加 -->
    <el-dialog class="add-table" title="按表添加" @close="close" :visible.sync="editRuleVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="formList" ref="formRef" label-width="110px" :rules="rules">
        <el-form-item label="数据表" prop="tableId">
          <el-select :disabled="isVisible" v-model="formList.tableId" filterable placeholder="请选择数据表">
            <!-- <el-input clearable class="inline-input" prefix-icon="el-icon-search" placeholder="请输入搜索关键字" v-model="state2" @input="querySearch"></el-input>
            <el-divider></el-divider> -->
            <el-option v-for="(item, index) in TableList" :key="index" :value="item.tableId" :label="item.tableName">
              <template>
                <div class="slot-tab">
                  <i v-if="item.dbType === 'es'" class="icon1 iconfont icon-esOutput1"></i>
                  <i v-if="item.dbType === 'hive'" class="icon2 iconfont icon-putongduixiang"></i>
                  <i v-if="item.dbType === 'oracle'" class="icon3 iconfont icon-esOutput1"></i>
                  <i v-if="item.dbType === 'mysql'" class="icon4 iconfont icon-Flink_SQL"></i>
                  <div style="margin: 0 10px;">{{ item.tableName }}</div>
                  <div class="slot-mr1">{{ item.tableDesc }}</div>
                </div>
              </template>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表字段" prop="columnNameList">
          <el-select multiple v-model="formList.columnNameList">
            <div slot="empty">
              <el-input class="inline-input inline-column " prefix-icon="el-icon-search" placeholder="请选择字段" v-model="state1" @input="querySearchColum"></el-input>
              <el-divider></el-divider>
              <el-table :cell-style="{borderColor: '#fff'}" ref="singleTable" :data="columnList" :show-header="false" style="width: 100%,border:1px solid #fff;" @selection-change="handle">
                <el-table-column width="55" label="选择" type="selection" :disable="true" :selectable="selectable"></el-table-column>
                <el-table-column prop="name" label="责任人"></el-table-column>
              </el-table>
              <div style="margin:5px 0px;">
                <el-checkbox v-model="diaCheckedAll" @change="SelectAll" style="margin-left: 15px;">全选</el-checkbox>
              </div>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item label="配置统一规则">
          <el-switch v-model="unifiedRuleStatus" active-value="1" inactive-value="0">
          </el-switch>
          <div><i class="icon iconfont icon-info"></i>配置统一的识别规则后，您可在提交列表中字段的识别规则进
            行二次编辑更改；也可忽略直接添加字段至提交列表，再单独或批量配置的识别规则</div>
        </el-form-item>
        <el-form-item v-if="unifiedRuleStatus === '1'" label="识别规则" prop="identifyRuleId">
          <el-select v-model="formList.identifyRuleId" placeholder="请输入识别规则">
            <el-option v-for="(item, index) in identifyRuleList" :key="index" :label="item.identifyRuleName" :value="item.identifyRuleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRuleVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRuleSure">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 更改识别规则 -->
    <el-dialog title="更改识别规则" @close="closeRule" :visible.sync="isChangeRule" width="40%" :close-on-click-modal="false">
      <el-form :model="formRule" ref="formRule" label-width="110px" :rules="rulesRule">
        <el-form-item label="识别规则" prop="identifyRuleId">
          <el-select v-model="formRule.identifyRuleId" placeholder="请输入识别规则">
            <el-option v-for="(item, index) in identifyRuleList" :key="index" :label="item.identifyRuleName" :value="item.identifyRuleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isChangeRule = false">取 消</el-button>
        <el-button type="primary" @click="ClickRuleSure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getTableList,
  getColumnList,
  getPagedIdentifyRule,
  getManualSave,
  getManualUpload,
  getDedupStrategyType
} from '@/api/asset/security.js'
export default {
  name: 'addition',
  data () {
    return {
      isChangeRule: false,
      state2: '',
      state1: '',
      editRuleVisible: false,
      rules: {
        tableId: [{ required: true, message: '请选择数据表' }],
        columnNameList: [{ required: true, message: '请选择表字段' }],
        identifyRuleId: [{ required: true, message: '请选择表识别规则' }]
      },
      rules1: {
        dedupStrategy: [{ required: true, message: '请选择去重策略' }]
      },
      rulesRule: {
        identifyRuleId: [{ required: true, message: '请选择表识别规则' }]
      },
      tableDataRules: {
        identifyRuleId: [{ required: true, message: '请选择表识别规则' }]
      },
      TableList: [],
      columnList: [],
      identifyRuleList: [],
      formList: {
        tableId: '',
        columnId: [],
        identifyRuleId: '',
        status: '1',
        columnNameList: []
      },
      unifiedRuleStatus: '1',
      dataForm: {
        dedupStrategy: '',
        tableData: []
      },
      checkAll: '',
      dedupStrategyTypeList: [],
      isVisible: false,
      checked: '',
      checkedAll: false,
      diaCheckedAll: false,
      isIndeterminate: true,
      unitId: '',
      multipleSelection: [],
      bodyHeight: 0,
      restaurantsColum: [],
      columnMap: [],
      formRule: {
        identifyRuleId: ''
      }
    }
  },
  created () {
    this.getTableList()
  },
  mounted () {
    this.getPagedIdentifyRuleList()
    this.getDedupStrategyType()
    this.$nextTick(_ => {
      this.bodyHeight = window.innerHeight
    })
  },
  watch: {
    'formList.tableId': {
      handler (val) {
        if (val) {
          this.getColumnListData()
        }
      }
    }
  },
  methods: {
    // 更改识别规则
    changeIdentifyRule () {
      this.isChangeRule = true
    },
    closeRule () {
      this.isChangeRule = false
      this.$refs.formRule.resetFields()
    },
    ClickRuleSure () {
      this.$refs.formRule.validate(valid => {
        if (valid) {
          this.dataForm.tableData.forEach(item => {
            this.multipleSelection.forEach(itemMu => {
              if (itemMu.id === item.id) {
                item.identifyRuleId = this.formRule.identifyRuleId
              }
            })
          })
          this.isChangeRule = false
        }
      })
    },

    handleCommand (command) {
      this.dataForm.tableData.forEach(item => {
        this.multipleSelection.forEach(index => {
          if (index.id === item.id) {
            item.status = command === 'a' ? '1' : '0'
          }
        })
      })
    },
    isCheckAllFun (val) {
      if (val.length === this.dataForm.tableData.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.isCheckAllFun(val)
    },
    SelectAll (val) {
      this.diaCheckedAll = val
      if (val) {
        this.columnList.forEach(item => {
          this.$refs.singleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.singleTable.clearSelection()
      }
    },
    handleCheckAllChange (boolean) {
      this.checkAll = boolean
      if (boolean) {
        this.dataForm.tableData.forEach(item => {
          this.$refs.elTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.elTable.clearSelection()
      }
    },
    handle (row) {
      this.formList.columnNameList = []
      this.formList.columnId = []
      row.forEach(item => {
        this.formList.columnNameList.push(item.name)
        this.formList.columnId.push(item.value)
      })
      if (row.length === this.columnList.length) {
        this.diaCheckedAll = true
      } else {
        this.diaCheckedAll = false
      }
    },
    querySearch (queryString) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      if (results.length > 0) {
        this.TableList = results
      }
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.tableName.toUpperCase().indexOf(queryString.toUpperCase()) === 0)
      }
    },

    querySearchColum (queryString) {
      const restaurants = this.restaurantsColum
      const results = queryString ? restaurants.filter(this.createFilter1(queryString)) : restaurants
      this.columnList = results
    },

    createFilter1 (queryString) {
      return (restaurant) => {
        return (restaurant.name.toUpperCase().indexOf(queryString.toUpperCase()) === 0)
      }
    },
    configClick (data) {
      this.indexId = data.$index
      this.isVisible = true
      this.formList.tableId = data.row.tableId
      this.editRuleVisible = true
      this.columnMap = this.dataForm.tableData.map(item => item.columnId)
    },

    selectable (row, index) {
      if (this.columnMap.includes(row.value) || row.columnStatus === 0) {
        return false
      } else {
        return true
      }
    },

    deleteClick (data) {
      this.dataForm.tableData.forEach((item, index, array) => {
        array.splice(data.$index, 1)
      })
    },
    buttonClick () {
      this.dataForm.tableData.forEach((item, index, array) => {
        this.multipleSelection.forEach(item1 => {
          if (item1.id === item.id) {
            array.splice(index, 1)
          }
        })
      })
    },

    cancelClick () {
      this.$confirm('未完成上传的纪录将不会被保留，是否继续退出？', '当前记录尚未上传', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ path: '/asset/security/data-identification/record' })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        })
      })
    },
    changeStatus () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          // 失效的也能上传
          this.getManualUpload()
          // const status = this.dataForm.tableData.map(item => item.status)
          // const isStatus = status.every(item => item === '0')
          // if (isStatus) {
          //   this.$message({
          //     type: 'info',
          //     message: '请选择生效的记录上传'
          //   })
          // } else {

          // }
        }
      })
    },
    close () {
      this.$refs.singleTable.clearSelection()
      this.isVisible = false
      this.editRuleVisible = false
      this.state2 = ''
      this.state1 = ''
      this.columnList = this.restaurantsColum
      this.TableList = this.restaurants
      this.columnMap = []
      this.$refs.formRef.resetFields()
    },
    handleClick () {
      this.editRuleVisible = true
    },

    handleRuleSure () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.getManualSave()
          this.editRuleVisible = false
          this.isVisible = false
        }
      })
    },

    async getTableList () {
      await getTableList().then((res) => {
        this.TableList = res.data
        this.restaurants = res.data
      })
    },

    async getColumnListData () {
      const { tableId } = this.formList
      const res = await getColumnList({ tableId, columnIdList: '', searchText: '' })
      if (res) {
        this.columnList = res.data
        this.restaurantsColum = res.data
      }
    },
    // 获取识别规则列表
    async getPagedIdentifyRuleList () {
      const params = {
        pageNo: 1,
        pageSize: 100
      }
      const res = await getPagedIdentifyRule(params)
      if (res) {
        this.identifyRuleList = res.data.totalList
      }
    },

    async getManualSave () {
      const { columnId, ...config } = this.formList
      const data = {
        ...config,
        columnIdList: columnId + '',
        columnNameList: undefined
      }
      await getManualSave(data).then((res) => {
        this.dataForm.tableData.push(res.data[0])
        this.dataForm.tableData.forEach((item, index) => {
          item.id = index
        })
        this.isCheckAllFun(this.multipleSelection)
      })
    },
    async getManualUpload () {
      const addlist2 = []
      this.dataForm.tableData.forEach(item => {
        const addlist = item.tableName + ',' + item.tableId + ',' + item.identifyRuleId + ',' + item.unitId + ',' + item.projectId
        addlist2.push(addlist + '')
      })
      const uploadRecords = addlist2.join('|')
      const params = {
        dedupStrategy: this.dataForm.dedupStrategy,
        uploadRecords: uploadRecords
      }
      const res = await getManualUpload(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '上传成功'
        })
      }
    },
    async getDedupStrategyType () {
      const res = await getDedupStrategyType()
      if (res) {
        this.dedupStrategyTypeList = res.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-breadcrumb__inner) {
  font-weight: normal;
  color: #2e74ff;
}
.inline-column {
  margin-top: 5px;
}
.slot-tab {
  display: flex;
  .icon2 {
    color: #ffb420;
  }
  .slot-mr1 {
    margin-left: auto;
  }
}
.main {
  margin-top: 10px;
  width: 100%;
  background-color: #ffffff;
  padding: 20px;
  position: relative;
  .main-mr1 {
    position: relative;
    margin-bottom: 15px;
    .main-mb-10 {
      position: absolute;
      right: 0;
      margin-right: 0px;
    }
  }
  .icon-tab {
    color: #666;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .footer-bu {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: 5px;
  }
  .footer {
    margin-left: 10px;
    width: 98%;
    .footer-main {
      display: flex;
      .footer-check {
        height: 30px;
        line-height: 30px;
      }
    }
  }
  .column {
    display: flex;
    div {
      margin: auto;
    }
  }
  .el-divider {
    margin-top: 15px;
    margin-bottom: 15px;
  }
}
.tabName {
  margin-right: 5px;
}
.data-classify {
  display: block;
  width: fit-content;
  text-align: center;
  border: 1px solid #c6dcff;
  background-color: #d1e3fd;
  border-radius: 10px;
  padding: 0 20px;
}
.inline-input {
  :deep(.el-input__inner) {
    border: 1px solid #fff;
  }
}

.elTable {
  .el-table .cell,
  .el-table th div {
    white-space: normal !important;
  }
}
.el-divider {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
