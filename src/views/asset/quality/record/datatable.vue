<template>
  <div class="check-datatable quality">
    <div ref="quality">
      <FilterFieldCard
        class="mb-10"
        ref="filterFieldCard"
        @confirm="getTableList"
        :filterData="filterData"></FilterFieldCard>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="!!loading"
        :default-expand-all="true">
        <el-table-column type="expand" width="1px">
          <template slot-scope="scope">
            <div class="rules-header">
              <div class="header-middle">
                <div>
                  <el-button type="primary" class="mr-10" @click.stop="showDetial(scope.row)">规则详情 <i :class="[scope.row.showRule ? 'el-icon-arrow-up': 'el-icon-arrow-down','ml-5']"></i></el-button>
                  <div>
                    <div class="mr-10 title">
                      校验结果
                    </div>
                    <div class="mr-50">
                      规则数：{{scope.row.rule_num}}
                    </div>
                    <div class="mr-50">
                      已校验规则数：{{scope.row.verifyRuleNum}}
                    </div>
                    <div class="mr-50">
                      校验异常：
                      <span class="mr-50"><i class="iconfont icon-jinggao1 font-16 mr-5"></i>强规则异常：{{scope.row.StrongRuleErrorNum}}</span>
                      <span class="mr-50"><i class="iconfont icon-jinggao2 font-16 mr-5" style="color:#FFC20F"></i>弱规则异常：{{scope.row.WeakRuleErrorNum}}</span>
                    </div>
                  </div>
                </div>
                <div style="cursor: pointer;" @click.stop="$emit('qualityReportHandle', scope.row)">质量报告 <i class="el-icon-arrow-right"></i></div>
              </div>
            </div>
            <div v-if="scope.row.showRule">
              <el-table :data="detailTable" style="width: 100%" class="sub-table">
                <el-table-column prop="audit_part" label="分区">
                  <template slot-scope="scope">
                    <OverflowTooltip class="width">{{scope.row.audit_part}}</OverflowTooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="rule_id" label="规则序号">
                  <template slot-scope="scope">
                    <OverflowTooltip class="width">{{scope.row.rule_id}}</OverflowTooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="template_name" label="规则模板名称">
                  <template slot-scope="scope">
                    <OverflowTooltip class="width">{{scope.row.template_name}}</OverflowTooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="rule_name" label="规则名称">
                  <template slot-scope="scope">
                    <OverflowTooltip class="width">{{scope.row.rule_name}}</OverflowTooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="audit_time" label="运行时间">
                  <template slot-scope="scope">
                    <OverflowTooltip class="width">{{scope.row.audit_time}}</OverflowTooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="rule_level" label="规则属性">
                  <template slot-scope="scope">
                    <OverflowTooltip class="width">{{scope.row.rule_level === '0' ? '强规则' : '弱规则'}}</OverflowTooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="audit_status" label="校验结果" width="80px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.audit_status === 'false'">
                      <i class="iconfont icon-jinggao2 font-14" style="color: #FFC20F"></i> 异常
                    </span>
                    <span v-if="scope.row.audit_status === 'true'">
                      <i class="iconfont icon-yikaiqi" style="color:#2BC048"></i> 通过
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="表名称" prop="table_code">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.table_code}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="oper_user" label="负责人">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.oper_user}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="project_code" label="所属项目">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.project_code}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="last_time" label="最新校验时间">
          <template slot-scope="scope">
            <OverflowTooltip class="width">{{scope.row.last_time}}</OverflowTooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="fr pt-10 pb-10"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="pageFilters.pageSize"
        :page-sizes="pageSizes"
        :current-page.sync="pageFilters.pageNo"
        layout="total, prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import mixin from './mixin'
import pager from '@/mixins/pager'
import {
  getOfficerList,
  getVerifyTableList,
  getVerifyRuleDetailList
} from '@/api/asset/quality/record'
import {
  queryProject
} from '@/api/asset/quality/tableRules'
export default {
  name: 'CheckDataTable',
  mixins: [mixin, pager],
  data() {
    return {
      loading: 0,
      fixed: false,
      tableData: [],
      filterData: [],
      ownerNameList: [],
      projectList: [],
      detailTable: [],
      showRule: false
    }
  },
  async created() {
    await this._getOfficerList()
    await this._getProjectList()
    this.filterData = [
      {
        label: '负责人',
        id: '负责人',
        options: this.ownerNameList
      },
      {
        label: '所属项目',
        id: '所属项目',
        options: this.projectList
      },
      {
        label: '状态',
        id: '状态',
        options: [
          {
            label: '通过',
            id: '0'
          },
          {
            label: '异常',
            id: '1'
          }
        ]
      }
    ]
    this.getTableList()
  },
  methods: {
    async getTableList(curFilter = [], keyword = '') {
      this.loading++
      let params = {
        name: keyword,
        officer: '',
        project_id: '',
        status: '',
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '负责人':
            params.officer = e.value
            break
          case '状态':
            params.status = e.value
            break
          case '所属项目':
            params.project_id = e.value
            break
        }
      })
      const res = await this.$simpleAsyncTo(getVerifyTableList(params), '获取失败')
      if (res) {
        this.tableData = res.data.map(item => {
          return {
            ...item,
            showRule: false
          }
        })
        this.total = res.totalRecords
      }
      this.loading--
    },
    // 负责人
    async _getOfficerList() {
      const params = {}
      const res = await this.$simpleAsyncTo(getOfficerList(params), '获取失败')
      if (res) {
        this.ownerNameList = res.data.map(item => {
          return {
            id: item.oper_user,
            label: item.oper_user
          }
        })
      }
    },
    // 所属项目
    async _getProjectList() {
      const params = {}
      const res = await this.$simpleAsyncTo(queryProject(params), '获取失败')
      if (res) {
        this.projectList = res.data.map(item => {
          return {
            id: item.project_id,
            label: item.project_code
          }
        })
      }
    },
    showDetial(row) {
      this.tableData.forEach(item => {
        if (item.id === row.id) {
          item.showRule = !item.showRule
          if (item.showRule) {
            this._getVerifyRuleDetailList(row)
          }
        } else {
          item.showRule = false
        }
      })
    },
    // 规则详情
    async _getVerifyRuleDetailList(row) {
      this.loading++
      const params = {
        base_id: row.id,
        maxDate: row.last_time
      }
      const res = await this.$simpleAsyncTo(getVerifyRuleDetailList(params), '获取失败')
      if (res) {
        this.detailTable = res.data
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.check-datatable {
  .header-middle {
    .title {
      font-weight: bold;
    }
  }
}
</style>
