<template>
  <div class="effect">
    <FilterFieldCard
      class="mb-10"
      ref="filterFieldCard"
      placeholder="请输入关键字"
      @confirm="getTableList"
      :filterData="filterData"
      v-resize="resizeDom"
    ></FilterFieldCard>

    <el-table
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      :class="{'fixed': fixed, 'tabel-cell-noe': false}"
      v-loading="!!loading"
      :height="height"
    >
      <el-table-column prop="cube_code" label="数据对象" min-width="240">
        <template slot-scope="{row}">
          <div class="icon-two-text" @click="jumpDetail(row)">
            <span class="iconfont icon-weiduluojibiao1"></span>
            <div class="ml-10">
              <div class="first-text">{{ row.cubeCode }}</div>
              <div class="second-text">{{ row.cubeId }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="businessFieldName" label="数据板块">
        <template slot-scope="{row}">
          <div class="first-line">{{row.businessFieldName}}</div>
          <!-- <div class="second-line">{{row.field4}}</div> -->
        </template>
      </el-table-column>
      <el-table-column prop="project_name" label="表所在项目">
        <template slot-scope="{row}">
          <div class="first-line">{{row.projectName}}</div>
          <!-- <div class="second-line">{{row.field6}}</div> -->
        </template>
      </el-table-column>
      <el-table-column prop="lastValidEndTime" label="字段最近到期日期">
      </el-table-column>
      <el-table-column prop="authTypeCode" label="权限账号">
        <template slot-scope="{row}">
          <div class="first-line">{{row.accountType}}</div>
          <div class="second-line">{{row.accountTypeCode}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="authTypeCode" label="权限类型">
      </el-table-column>
      <el-table-column prop="operation" label="操作" width="80">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="交还" placement="top">
            <el-button type="text" @click="handleReturn(row)"><i class="iconfont icon-jiaohuan font-14 color-btn"></i></el-button>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="续期" placement="top">
            <el-button type="text" @click="handleRenewal(row)"><i class="iconfont icon-lishibanben font-14 color-btn"></i></el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-footer">
      <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" :layout="layout" :total="total"></el-pagination>
    </div>

    <!-- 续期 -->
    <el-dialog title="续期权限" :visible.sync="renewalVisible">
      <el-form :model="renewalForm" :rules="renewalRules" ref="renewalForm" label-width="120px">
        <el-form-item label="权限类型" prop="auth_type">
          <el-checkbox-group v-model="renewalForm.auth_type" disabled>
            <el-checkbox label="1">查表数据</el-checkbox>
            <el-checkbox label="2">改表数据</el-checkbox>
            <el-checkbox label="3">删表数据</el-checkbox>
            <el-checkbox label="4">改表结构</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="有效期至" prop="validEndTime">
          <el-date-picker align="center" v-model="renewalForm.validEndTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="续期原因" prop="reason">
          <el-input type="textarea" v-model="renewalForm.reason" :rows="5" :maxlength="128" :minlength="5" resize="none" placeholder="请填写续期原因，不少于5个字" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="renewalVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('renewalForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pageMixin from './mixins'
import mixin from '../../mixins'
import pager from '@/mixins/pager'
import { getPermissionTableList, returnTable, renewalTable } from '@/api/asset/authority'
export default {
  name: 'TableApply',
  mixins: [pageMixin, mixin, pager],
  props: {
    activeTab: String
  },
  data () {
    return {
      tableData: [],
      loading: 0,
      fixed: false,
      renewalVisible: false,
      renewalForm: {
        auth_type: [],
        validEndTime: '',
        reason: ''
      },
      renewalRules: {
        auth_type: [
          { required: true, message: '请选择' }
        ],
        validEndTime: [
          { required: true, message: '请选择' }
        ],
        reason: [
          { required: true, message: '请输入' }
        ]
      },
      curRow: {},
      height: '0'
    }
  },
  watch: {
    activeTab (val) {
      if (val === '1') {
        this.getTableList()
      }
    }
  },
  created () {
    this.configData()
    this.getTableList()
  },
  methods: {

    async configData () {
      await this.getTableType()
      await this.getBussinessList()
      await this.getProjectData()

      this.filterData = [
        {
          label: '表类型',
          id: '表类型',
          options: this.tableTypeList
        },
        {
          label: '表环境',
          id: '表环境',
          options: this.environmentList
        },
        {
          label: '数据板块',
          id: '数据板块',
          options: this.bussinessList
        },
        {
          label: '表所在项目',
          id: '表所在项目',
          options: this.projectList
        },
        {
          label: '账号类型',
          id: '账号类型',
          options: this.accountTypeList
        }
      ]
    },

    async getTableList (curFilter = [], keyword = '') {
      this.loading++
      let params = {
        keyword,
        businId: '', // 数据板块ID
        accountType: '', // 权限账号类型
        environment: '', // 环境
        expiredDate: '', // 过期日期
        projectId: '', // 表所在项目id
        tableType: '', // 表类型
        ...this.pageFilters
      }

      curFilter.forEach(e => {
        switch (e.module) {
          case '到期日期':
            params.expiredDate = e.value
            break
          case '表类型':
            params.tableType = e.value
            break
          case '表环境':
            params.environment = e.value
            break
          case '数据板块':
            params.businId = e.value
            break
          case '表所在项目':
            params.projectId = e.value
            break
          case '账号类型':
            params.accountType = e.value
            break
        }
      })

      const res = await getPermissionTableList(params)
      this.loading--
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
        this.$emit('total', this.total)
      }
    },

    handleRenewal (row) {
      this.renewalVisible = true
      const a = {
        SELECT: '1',
        UPDATE: '2',
        DELETE: '3',
        ALTER: '4'
      }
      this.curRow = row
      this.renewalForm.auth_type = row.authType.split(',').map(e => a[e])
    },

    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            cubeId: this.curRow.cubeId,
            projectId: this.curRow.projectId,
            accountType: this.curRow.accountType,
            accountTypeCode: this.curRow.accountTypeCode,
            reason: this.renewalForm.reason,
            validEndTime: this.renewalForm.validEndTime,
          }
          const res = await this.$simpleAsyncTo(renewalTable(params), '续期失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '续期成功!'
            })
            this.getTableList()
            this.resetForm()
          }
        }
      })
    },

    resetForm() {
      this.$refs['renewalForm'].resetFields()
      this.renewalVisible = false
    },

    handleReturn (row) {
      this.$confirm(`确定交还 ${row.cubeCode} 的权限吗`, '交还权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // this.submitReturnTable(row.id)
        const params = {
          cubeId: row.cubeId,
          projectId: row.projectId,
          accountType: row.accountType,
          accountTypeCode: row.accountTypeCode,
        }
        const res = await this.$simpleAsyncTo(returnTable(params), '交还失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '交还成功!'
          })
          this.getTableList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消!'
        })
      })
    },


    jumpDetail (row) {
      this.$emit('jumpDetail', row)
    },
    resizeDom(data) {
      this.$nextTick(() => {
        this.height = `calc(100% - ${parseInt(data.height) + 36}px)`
      })
    }
  }
}
</script>

<style lang="less" scoped>
.effect {
  height: calc(100% - 40px);
}
.icon {
  font-size: 24px;
  color: #4783ff;
}

.icon-two-text {
  display: flex;
  align-items: center;
  cursor: pointer;
  .icon-weiduluojibiao1 {
    font-size: 30px;
    color: var(--success);
  }
  .first-text {
    font-size: 12px;
    height: 14px;
    line-height: 14px;
    margin-bottom: 4px;
    color: #2153d4;
  }
  .second-text {
    font-size: 12px;
    height: 14px;
    color: var(--black45);
    line-height: 14px;
  }
}

.first-line {
  font-size: 12px;
  height: 14px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 14px;
  margin-bottom: 4px;
}

.second-line {
  font-size: 12px;
  height: 14px;
  color: var(--black45);
  line-height: 14px;
}
</style>
