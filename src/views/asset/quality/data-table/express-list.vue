<!--
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-06-23 13:55:26
 * @LastEditTime: 2023-01-04 11:13:48
 * @Description:
-->
<template>
  <div class='express-list mt-15'>
    <section class="head">
      <div class="head-left">
        <span class="label font-12">分区表达式</span>
        <el-input v-model="expression" size="mini">
          <i slot="suffix" class="el-input__icon el-icon-edit-outline" @click="editPartHandle"></i>
        </el-input>
        <i class="el-icon-delete" @click="delListHandle"></i>
      </div>
      <div class="head-action">
        <el-button type="primary" icon="el-icon-plus" class="action-btn" @click="addHandle">创建质量规则</el-button>
        <el-button type="primary" icon="el-icon-refresh-right" class="action-refresh" @click="refeshHandle"></el-button>
      </div>
    </section>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
      <!-- @selection-change="handleSelectionChange" -->
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="object_name" label="对象名称">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.object_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="object_type" label="对象类型" width="80">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.object_type}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="template_name" label="模板名称">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.template_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="check_type" label="监测类型" width="100">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.check_type}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="trend" label="趋势" width="100">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.trend}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="target_value" label="实际值" width="100"></el-table-column>
      <el-table-column prop="comparison_name" label="比较方式">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.comparison_name}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="threshold" label="阈值" width="100">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.threshold}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="rule_level" label="规则强度" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.rule_level === '0'">强规则</span>
          <span v-if="scope.row.rule_level === '1'">弱规则</span>
        </template>
      </el-table-column>
      <el-table-column prop="template_custom_rule_type" label="规则类型">
        <template slot-scope="scope">
          <div v-if="scope.row.template_custom_rule_type === '0'">
            <OverflowTooltip class="width">
              质量模板规则
            </OverflowTooltip>
          </div>
          <div v-if="scope.row.template_custom_rule_type === '1'">
            <OverflowTooltip class="width">
              自定义规则
            </OverflowTooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="testrun_status" label="试跑状态">
        <template slot-scope="scope">
          <span v-if="scope.row.testrun_status === '0'">
            <i class="iconfont icon-weikaiqi" style="color:#bfbfbf;margin-right: 3px;"></i>未试跑
          </span>
          <span v-else-if="scope.row.testrun_status === '1'">
            <i class="iconfont icon-yikaiqi" style="color:#2BC048;margin-right: 3px;"></i>试跑成功
          </span>
          <span v-else>
            <i class="iconfont icon-shibai" style="color:#ca435b;margin-right: 3px;"></i>试跑失败
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="校验开关">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" @change="statusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="规则试跑" placement="top">
            <el-button type="text">
              <i class="el-icon-video-play font-16 color-btn" @click="batchOpen(scope.row)"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text">
              <i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="editHandle(scope.row)"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"><i class="el-icon-delete font-16 color-btn" title="删除" @click="delHandle(scope.row)"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <AddExpression v-if="partVisible" :visible="partVisible" @close="partClose" @refresh="partRefresh" :obj="{type: 'edit', part: part}"></AddExpression>
    <Quality v-if="visible" :visible="visible" @close="close" @refresh="listRefresh" :partId="part_id" :obj="{type: type, row: curRow}" :curRuleData="curRuleData"></Quality>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import Quality from './quality'
import {
  deleteAuditTablePartExpr,
  auditTableRuleVerification,
  deleteAuditTableRule,
  queryTableRuleByPartId,
  auditRuleTrailRun
} from '@/api/asset/quality/tableRules'
import AddExpression from './add-expression'
export default {
  name: 'ExpressList',
  props: {
    data: Object,
    ind: Number,
    curRuleData: Object
  },
  components: {
    OverflowTooltip,
    Quality,
    AddExpression
  },
  data () {
    return {
      part: {},
      part_id: '',
      expression: '',
      fixed: false,
      tableData: [],
      // multipleSelection: [],
      // isIndeterminate: false,
      // checkAll: false,
      loading: 0,
      visible: false,
      partVisible: false,
      type: '',
      curRow: {}
    }
  },
  watch: {
    data: {
      handler (val) {
        this.part_id = val.part_id
        this.expression = val.expression
        this.tableData = val.tableData
        this.part = {
          part_id: val.part_id,
          part_type: val.part_type,
          table_part_info: val.part_day,
          table_part_hour_info: val.part_hour
        }
      },
      deep: true,
      immediate: true
    },
    multipleSelection: {
      deep: true,
      handler (val) {
        if (val.length === 0 || val.length === this.tableData.length) {
          this.isIndeterminate = false
        } else if (val.length < this.tableData.length) {
          this.isIndeterminate = true
        }
      }
    }
  },
  computed: {},
  created () { },
  mounted () { },
  methods: {
    // 编辑分区表达式
    editPartHandle () {
      this.partVisible = true
    },
    partClose () {
      this.partVisible = false
    },
    partRefresh () {
      this.partVisible = false
      this.$emit('refresh')
    },
    // 删除分区表达式
    delListHandle () {
      this.$confirm(`确认删除此分区表达式吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        this._deleteAuditTablePartExpr()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async _deleteAuditTablePartExpr () {
      const res = await this.$simpleAsyncTo(deleteAuditTablePartExpr({
        id: this.part_id
      }), '删除失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }
    },
    addHandle () {
      this.visible = true
      this.type = 'add'
    },
    listRefresh () {
      this.type = ''
      this.visible = false
      this._queryTableRuleByPartId()
    },
    close () {
      this.type = ''
      this.visible = false
    },
    // handleSelectionChange(val) {
    //   this.multipleSelection = val
    // },
    // checkAllChange(boolean) {
    //   if (boolean) {
    //     this.tableData.forEach(item => {
    //       this.$refs.multipleTable.toggleRowSelection(item)
    //     })
    //   } else {
    //     this.$refs.multipleTable.clearSelection()
    //   }
    // },
    statusChange (row) {
      this._auditTableRuleVerification({
        id: row.id,
        status: row.status === '0' ? '1' : '0',
        template_custom_rule_type: row.template_custom_rule_type
      })
    },
    async _auditTableRuleVerification (params) {
      this.loading++
      const res = await this.$simpleAsyncTo(auditTableRuleVerification(params), '开关校验失败')
      if (res) {
        // 局部刷新数据
        this._queryTableRuleByPartId()
        this.$message({
          type: 'success',
          message: '开关校验成功'
        })
      }
      this.loading--
    },
    async _queryTableRuleByPartId () {
      this.loading++
      const res = await this.$simpleAsyncTo(queryTableRuleByPartId({ part_id: this.part_id }), '开关校验失败')
      if (res) {
        this.tableData = res.data
      }
      this.loading--
    },
    editHandle (row) {
      this.type = 'edit'
      this.curRow = row
      this.visible = true
    },
    delHandle (row) {
      this.$confirm(`确认删除此条质量规则吗？`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        this._deleteAuditTableRule(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async _deleteAuditTableRule (params) {
      this.loading++
      const res = await this.$simpleAsyncTo(deleteAuditTableRule({
        id: params.id,
        status: params.status,
        template_custom_rule_type: params.template_custom_rule_type
      }), '删除失败')
      if (res) {
        // 局部刷新数据
        this._queryTableRuleByPartId()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }
      this.loading--
    },
    refeshHandle () {
      // 局部刷新数据
      this._queryTableRuleByPartId()
    },
    batchOpen (row) {
      this.$confirm(`确认规则试跑吗？`, '规则试跑', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: false
      }).then(() => {
        this._auditRuleTrailRun(row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消规则试跑'
        })
      })
    },
    async _auditRuleTrailRun (params) {
      this.loading++
      const res = await this.$simpleAsyncTo(auditRuleTrailRun({
        rule_id: params.id,
        template_custom_rule_type: params.template_custom_rule_type
      }), '规则试跑失败')
      if (res) {
        // 局部刷新数据
        this._queryTableRuleByPartId()
        this.$message({
          type: 'success',
          message: '规则试跑成功'
        })
      }
      this.loading--
    }
  }
}
</script>

<style scoped lang="scss">
.express-list {
  .head {
    .head-left {
      display: flex;
      .label {
        width: 100px;
        line-height: 28px;
        display: block;
      }
      .el-icon-delete {
        font-size: 14px;
        color: $--color-primary;
        line-height: 28px;
        padding: 0px 6px;
        &:hover {
          cursor: pointer;
        }
      }
      .el-icon-edit-outline {
        font-size: 14px;
        color: $--color-primary;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  .width {
    width: calc(100% - 1px);
  }
}

</style>
