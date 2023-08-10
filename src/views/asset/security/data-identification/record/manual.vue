<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-23 10:51:04
 * @LastEditTime: 2023-05-17 17:43:01
 * @Description:
-->
<template>
  <section class="security-wrapper">
    <div class="flex-end mb-10">
      <el-input v-model="tblName" placeholder="请输入表名" style="width: 200px" @input="searchChange"></el-input>
      <el-input v-model="columnName" placeholder="请输入字段" class="ml-20" style="width: 200px" @input="searchChange"></el-input>
      <el-select v-model="dedupStrategy" placeholder="去重策略" class="ml-20" @change="searchChange">
        <el-option v-for="item in dedupStrategyList" :key="item.value" :label="item.name" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" class="ml-20" @click="handleAdd">手动添加</el-button>
    </div>

    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="unitName" label="板块">
      </el-table-column>
      <el-table-column prop="projectName" label="项目">
      </el-table-column>
      <el-table-column prop="dbType" label="数据源类型">
      </el-table-column>
      <el-table-column prop="dbName" label="数据库">
      </el-table-column>
      <el-table-column prop="tableName" label="数据表">
      </el-table-column>
      <el-table-column prop="columnName" label="表字段">
      </el-table-column>
      <el-table-column prop="identifyRuleId" label="识别规则" width="140">
        <template slot-scope="{row}">
          <el-select v-model="row.identifyRuleId" placeholder="识别规则">
            <el-option v-for="item in identifyRuleList" :key="item.identifyRuleId" :label="item.identifyRuleName" :value="item.identifyRuleId">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="dedupStrategy" label="去重策略" width="160">
        <template slot-scope="{row}">
          <el-select v-model="row.dedupStrategy" placeholder="去重策略">
            <el-option v-for="item in dedupStrategyList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="生效状态">
        <template slot-scope="{row}">
          <el-switch v-model="row.status" active-value="1" inactive-value="0" @change=changeStatus(row)>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="保存" placement="top">
            <el-button type="text" @click="handleEdit(row)"><i class="iconfont icon-baocun font-16 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text" @click="handleDel(row)"><i class="el-icon-delete font-16 color-btn"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="拷贝" placement="top">
            <el-button type="text" @click="handleCopy(row)"><i class="iconfont icon-fuzhi font-16 color-btn"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>

    <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="tableData"></SelectFooter>

    <!-- 编辑 -->
    <el-dialog :title="title" :visible.sync="editRuleVisible" width="40%" :close-on-click-modal="false">
      <el-form :model="form" ref="formRef" label-width="100px" :rules="rules">
        <el-form-item label="板块" prop="unitId">
          <el-select v-model="form.unitId" placeholder="请选择板块">
            <el-option v-for="item in unitList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="projectId">
          <el-select v-model="form.projectId" placeholder="请选择项目">
            <el-option v-for="item in projectList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据表" prop="columnName">
          <el-select v-model="form.columnName" placeholder="请选择数据表">
            <el-option v-for="item in identifyRuleList" :key="item.identifyRuleId" :label="item.identifyRuleName" :value="item.identifyRuleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="表字段" prop="dbType">
          <el-select v-model="form.dbType" placeholder="请选择表字段">
            <el-option v-for="item in identifyRuleList" :key="item.identifyRuleId" :label="item.identifyRuleName" :value="item.identifyRuleId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="去重策略" prop="dedupStrategy">
          <el-select v-model="form.dedupStrategy" placeholder="请选择去重策略">
            <el-option v-for="item in dedupStrategyList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="识别规则" prop="identifyRuleId">
          <el-select v-model="form.identifyRuleId" placeholder="请选择识别规则">
            <el-option v-for="item in identifyRuleList" :key="item.identifyRuleId" :label="item.identifyRuleName" :value="item.identifyRuleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRuleVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRuleSure">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import SelectFooter from './footer'
import pager from '@/mixins/pager'
import {
  getBusinList,
  getProjectList,
  getPagedIdentifyRule,
  getPagedManualData,
  getManualDetail,
  saveManual,
  updateManual,
  deleteManual,
  updateManualStatus
} from '@/api/asset/security.js'
export default {
  name: 'Manual',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      form: {},
      tblName: '',
      columnName: '',
      dedupStrategy: '',
      title: '',
      fixed: false,
      loading: 0,
      editRuleVisible: false,
      ruleType: 1,
      rules: {
        unitId: [{ required: true, message: '请选择板块', trigger: 'change' }],
        projectId: [{ required: true, message: '请选择项目', trigger: 'change' }],
        columnName: [{ required: true, message: '请选择数据表', trigger: 'change' }],
        dbType: [{ required: true, message: '请选择表字段', trigger: 'change' }],
        dedupStrategy: [{ required: true, message: '请选择去重策略', trigger: 'change' }],
        identifyRuleId: [{ required: true, message: '请选择识别规则', trigger: 'change' }]
      },
      dedupStrategyList: [
        { name: '覆盖线上打标', value: 'cover' },
        { name: '保留线上打标', value: 'retain' }
      ],
      tableData: [],
      multipleSelection: [],
      unitList: [],
      projectList: [],
      identifyRuleList: []
    }
  },
  created () {
    this.getTableList()
    this.getBizunitList()
  },
  mounted () {
    this.getPagedIdentifyRuleList()
  },
  watch: {
    'form.unitId' (val) {
      if (val) {
        this.getProjectData(val)
      }
    }
  },
  methods: {
    searchChange () {
      this.getTableList()
    },

    async getTableList () {
      this.loading++
      let params = {
        tblName: this.tblName,
        columnName: this.columnName,
        dedupStrategy: this.dedupStrategy,
        ...this.pageFilters
      }
      const res = await getPagedManualData(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading--
    },

    async getBizunitList () {
      const res = await getBusinList()
      if (res) {
        this.unitList = res.data
      }
    },

    // 获取项目列表
    async getProjectData (unitId) {
      const res = await getProjectList({ unitId })
      if (res) {
        this.projectList = res.data
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

    async changeStatus (row) {
      const params = {
        manualColId: row.manualColId,
        status: row.status
      }
      const res = await updateManualStatus(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '状态修改成功!'
        })
      }
    },

    handleAdd () {
      this.title = '新增'
      this.editRuleVisible = true
    },

    handleDel (row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitDel(row.manualColId)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除!'
        })
      })
    },

    async submitDel (manualColId) {
      const res = await deleteManual({ manualColId })
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getTableList()
      }
    },

    async handleCopy (row) {
      const res = await getManualDetail({ manualColId: row.manualColId })
      if (res) {
        this.form = res.data
        this.title = '拷贝'
        this.editRuleVisible = true
      }
    },

    // 编辑
    async handleEdit (item) {
      const { manualColId, dedupStrategy, identifyRuleId } = item
      const params = {
        manualColId, dedupStrategy, identifyRuleId
      }
      const res = await updateManual(params)
      if (res) {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }
    },

    handleRuleSure () {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.submitRule()
        }
      })
    },

    async submitRule () {
      const res = await saveManual(this.form)
      if (res) {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this.editRuleVisible = false
        this.getTableList()
      }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.security-wrapper {
  position: relative;
  height: 95%;
  background-color: #fff;
  padding-top: 10px;
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .tips {
    font-size: 14px;
    color: #999;
    line-height: 20px;
    margin: 20px 0;
  }
  
}
</style>
