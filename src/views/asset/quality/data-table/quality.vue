<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-06-23 15:40:34
 * @LastEditTime: 2021-10-11 16:23:41
 * @Description:
-->
<template>
  <SimpleEditDialog
    :title="type === 'add' ? '创建规则' : '编辑规则'"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    :width="template_custom_rule_type === '0' ? '600px' : '800px' "
    :top="template_custom_rule_type === '0' ? '20vh' : '15vh'"
    class="add-quality-rule"
    confirmText="确定"
  >
    <div class="el-form-item el-form-item--mini" :style="{width: '50%'}">
      <label for="type" class="el-form-item__label rule-type" style="width: 120px;">规则类型</label>
      <div class="el-form-item__content rule-type-select" style="margin-left: 120px;">
        <el-select v-model="template_custom_rule_type" placeholder="请选择规则类型" @change="changeType" :disabled="type === 'edit'">
          <el-option :label="item.label" :value="item.value" v-for="item in typeList" :key="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div v-if="template_custom_rule_type === '0'">
      <el-form :model="ruleForm" :rules="rules" size="mini" ref="ruleForm" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="对象名称" prop="object_name">
              <el-select v-model="ruleForm.object_name" placeholder="对象名称" clearable @change="objectChange">
                <el-option :label="item.object_info" :value="item.object_name" v-for="item in objectList" :key="item.object_name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规则强度" prop="rule_level">
              <el-select v-model="ruleForm.rule_level" placeholder="规则强度" clearable>
                <el-option :label="item.label" :value="item.value" v-for="item in strengthList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="模板类型" prop="template_id">
          <el-select v-model="ruleForm.template_id" placeholder="模板类型" clearable @change="templateChange">
            <el-option :label="item.template_name" :value="item.template_id" v-for="item in templateTypeList" :key="item.template_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="趋势" prop="trend" v-if="ruleForm.template_id !== ''">
          <el-select v-model="ruleForm.trend" placeholder="趋势" clearable>
            <el-option :label="item.name" :value="item.value" v-for="item in checkRule.trend_data" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <div class="line" v-if="ruleForm.template_id !== ''"></div>
        <div class="template-wrapper" v-if="ruleForm.template_id !== ''">
          <div class="title">{{checkRule.check_type}}</div>
          <el-row v-if="checkRule.check_type === '对比设置'">
            <el-col :span="12">
              <el-form-item label="对比规则" prop="comparison_expr">
                <el-select v-model="ruleForm.comparison_expr" placeholder="对比规则" clearable>
                  <el-option :label="item.comparison_name" :value="item.comparison_expr" v-for="item in checkRule.check_rule" :key="item.comparison_expr"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目标值" prop="threshold">
                <el-input v-model="ruleForm.threshold" size="mini" placeholder="请设定阈值"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-form-item label="阈值设定" prop="threshold">
              <el-input v-model="ruleForm.threshold" placeholder="请设定阈值" size="mini"></el-input>
            </el-form-item>
          </el-row>
          <div class="tips">
            <i class="el-icon-warning-outline"></i>
            此处填写数据质量规则配置为所期望数据要求，当实际状况与当前所填规则有差异时, 规则校验结果即判为宜昌,从而引发告警。
          </div>
        </div>
      </el-form>
    </div>
    <div v-if="template_custom_rule_type === '1'">
      <el-form :model="ruleForm2" :rules="rules2" size="mini" ref="ruleForm2" label-width="120px">
        <el-form-item label="规则名称" prop="rule_name">
          <el-input v-model="ruleForm2.rule_name" size="mini" placeholder="规则名称,不超过64字符"></el-input>
        </el-form-item>
        <el-form-item label="规则内容" prop="sql_context">
          <MonacoEditor
            style="height:200px;"
            has-top-tools
            has-bottom-tools
            :example="false"
            :qualityExample="true"
            :code.sync="ruleForm2.sql_context"
            @verification="sqlVerification"
            @copyHint="copyHint"
          />
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="规则强度" prop="rule_level">
              <el-select v-model="ruleForm2.rule_level" placeholder="规则强度" clearable>
                <el-option :label="item.label" :value="item.value" v-for="item in strengthList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="检测类型" prop="check_type">
              <el-select v-model="ruleForm2.check_type" placeholder="检测类型" clearable @change="checkTypeChange">
                <el-option :label="item.check_type" :value="item.check_type" v-for="item in checkTypeList" :key="item.check_type_value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="趋势" prop="trend">
              <el-select v-model="ruleForm2.trend" placeholder="趋势" clearable>
                <el-option :label="item.trend" :value="item.trend" v-for="item in customTrendList" :key="item.trend_value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="line" v-if="ruleForm2.check_type !== ''"></div>
        <div class="template-wrapper" v-if="ruleForm2.check_type !== ''">
          <div class="title">{{ title }}</div>
          <el-row v-if="compareVisible">
            <el-col :span="12">
              <el-form-item label="对比规则" prop="comparison_expr">
                <el-select v-model="ruleForm2.comparison_expr" placeholder="对比规则" clearable>
                  <el-option :label="item.comparison_name" :value="item.comparison_expr" v-for="item in customCheckRule" :key="item.comparison_expr"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="目标值" prop="threshold">
                <el-input v-model="ruleForm2.threshold" size="mini" placeholder="请设定阈值"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-else>
            <el-form-item label="阈值设定" prop="threshold">
              <el-input v-model="ruleForm2.threshold" placeholder="请设定阈值" size="mini"></el-input>
            </el-form-item>
          </el-row>
          <div class="tips">
            <i class="el-icon-warning-outline"></i>
            此处填写数据质量规则配置为所期望数据要求，当实际状况与当前所填规则有差异时, 规则校验结果即判为宜昌,从而引发告警。
          </div>
        </div>
      </el-form>
    </div>
  </SimpleEditDialog>
</template>

<script>
import {
  queryObjectInfo,
  queryTemplateType,
  queryTrendAndCheckInfo,
  insertAuditTableRule,
  queryQualityTrend,
  queryQualityCheckType,
  queryQualityOperator,
  updateAuditTableRule,
  sqlVerification
} from '@/api/asset/quality/tableRules'
export default {
  name: 'AddQuality',
  props: {
    visible: Boolean,
    obj: Object,
    partId: String,
    curRuleData: Object
  },
  components: {},
  data() {
    return {
      cube_id: '',
      table_code: '',
      part_id: '',
      isVisible: false,
      template_custom_rule_type: '0',
      typeList: [
        {label: '质量模板规则', value: '0'},
        {label: '自定义规则', value: '1'}
      ],
      ruleForm: {},
      rules: {
        object_name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        rule_level: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        template_id: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        trend: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        threshold: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      strengthList: [
        {label: '弱规则', value: '1'},
        {label: '强规则', value: '0'}
      ],
      objectList: [],
      templateTypeList: [],
      trendList: [],
      checkRule: {
        check_rule: [],
        check_type: '',
        trend_data: []
      },
      ruleForm2: {},
      rules2: {
        rule_name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        sql_context: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        rule_level: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        check_type: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        trend: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        comparison_expr: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        threshold: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      customTrendList: [],
      checkTypeList: [],
      customCheckRule: [],
      type: '',
      title: '',
      compareVisible: true
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    },
    partId: {
      immediate: true,
      handler(val) {
        this.part_id = val
      }
    },
    curRuleData: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.cube_id = val.cube_id
          this.table_code = val.table_code
        }
      }
    },
    obj: {
      deep: true,
      immediate: true,
      handler(val) {
        this.cube_id = this.curRuleData.cube_id
        this.table_code = this.curRuleData.table_code
        this.type = val.type
        this.initForm(val)
      }
    }
  },
  created() {
    // // 模板规则
    // if (this.template_custom_rule_type === '0') {
    //   this._queryObjectInfo()
    // } else {
    //   // 自定义规则
    //   this._queryQualityTrend()
    //   this._queryQualityCheckType()
    //   this._queryQualityOperator()
    // }
  },
  methods: {
    async initForm(params) {
      if (params.type === 'add') {
        if (this.template_custom_rule_type === '0') {
          await this._queryObjectInfo()
          this.ruleForm = {
            template_custom_rule_type: '0',
            object_name: '',
            rule_level: '',
            template_id: '',
            trend: '',
            threshold: '',
            comparison_expr: ''
          }
        } else {
          this.ruleForm2 = {
            template_custom_rule_type: '1',
            rule_name: '',
            sql_context: '',
            rule_level: '',
            trend: '',
            check_type: '',
            comparison_expr: '',
            threshold: ''
          }
        }
      } else {
        this.template_custom_rule_type = params.row.template_custom_rule_type
        if (this.template_custom_rule_type === '0') {
          await this._queryObjectInfo()
          this._queryTemplateType({object_type: this.objectList.find(item => item.object_name === params.row.object_name).object_type})
          this._queryTrendAndCheckInfo({template_id: params.row.template_id})
          this.ruleForm = {
            ...params.row
          }
        } else {
          this._queryQualityTrend()
          this._queryQualityOperator()
          this._queryQualityCheckType()
          this.ruleForm2 = {
            ...params.row,
            rule_name: params.row.object_name
          }
        }
      }
    },
    changeType() {
      this.$nextTick(() => {
        if (this.template_custom_rule_type === '0') {
          this.$refs['ruleForm'].clearValidate()
          this._queryObjectInfo()
        } else {
          this.$refs['ruleForm2'].clearValidate()
          this._queryQualityTrend()
          this._queryQualityCheckType()
          this._queryQualityOperator()
        }
      })
    },
    confirm() {
      if (this.template_custom_rule_type === '0') {
        this.$refs['ruleForm'].validate(valid => {
          if (valid) {
            let params = {}
            if (this.checkRule.check_type === '对比设置') {
              params = {
                ...this.ruleForm,
                part_id: this.part_id,
                object_type: this.objectList.find(item => item.object_name === this.ruleForm.object_name).object_type,
                comparison_name: this.checkRule.check_rule.find(item => item.comparison_expr === this.ruleForm.comparison_expr).comparison_name
              }
            } else {
              params = {
                ...this.ruleForm,
                part_id: this.part_id,
                object_type: this.objectList.find(item => item.object_name === this.ruleForm.object_name).object_type
              }
              delete params.comparison_expr
            }
            if (this.type === 'add') {
              this._insertAuditTableRule(params)
            } else {
              this._updateAuditTableRule(params)
            }
          }
        })
      } else {
        this.$refs['ruleForm2'].validate(valid => {
          if (valid) {
            let params = {}
            if (this.checkTypeList.find(item => item.check_type === this.ruleForm2.check_type).check_type_value === 'fix') {
              params = {
                ...this.ruleForm2,
                part_id: this.part_id,
                comparison_name: this.customCheckRule.find(item => item.comparison_expr === this.ruleForm2.comparison_expr).comparison_name
              }
            } else {
              params = {
                ...this.ruleForm2,
                part_id: this.part_id
              }
              delete params.comparison_expr
            }
            this.sqlVerification(true, params)
          }
        })
      }
    },
    close() {
      this.$emit('close')
    },
    // 新增规则
    async _insertAuditTableRule(params) {
      // console.log(params, '====')
      const res = await this.$simpleAsyncTo(insertAuditTableRule(params), '新增失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '新增规则成功'
        })
      }
    },
    // 编辑规则
    async _updateAuditTableRule(params) {
      const res = await this.$simpleAsyncTo(updateAuditTableRule(params), '编辑失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '编辑规则成功'
        })
      }
    },
    // 规范性校验
    async sqlVerification(isSave = false, from = {}) {
      const params = {
        sql_context: this.ruleForm2.sql_context
      }
      const res = await this.$simpleAsyncTo(
        sqlVerification(params),
        '规范性校验失败'
      )
      if (res) {
        if (isSave === true) {
          if (this.type === 'add') {
            this._insertAuditTableRule(from)
          } else {
            this._updateAuditTableRule(from)
          }
        } else {
          this.$message({
            type: 'success',
            message: res.msg
          })
        }
      }
    },
    // 复制参考示例
    copyHint(params) {
      this.ruleForm2.sql_context = params
    },
    // 质量规则-对象查询
    async _queryObjectInfo() {
      const params = {
        cube_id: this.cube_id,
        table_code: this.table_code
      }
      const res = await this.$simpleAsyncTo(queryObjectInfo(params), '获取数据失败')
      if (res) {
        this.objectList = res.data
      }
    },
    objectChange(val) {
      if (val) {
        this._queryTemplateType({object_type: this.objectList.find(item => item.object_name === val).object_type})
        this.ruleForm.template_id = ''
      } else {
        this.templateTypeList = []
      }
    },
    // 质量规则-模板类型
    async _queryTemplateType(params) {
      const res = await this.$simpleAsyncTo(queryTemplateType(params), '获取数据失败')
      if (res) {
        this.templateTypeList = res.data
      }
    },
    templateChange(val) {
      if (val) {
        this._queryTrendAndCheckInfo({template_id: val})
        this.ruleForm.trend = ''
      } else {
        this.checkRule = {}
        this.ruleForm.trend = ''
      }
    },
    async _queryTrendAndCheckInfo(params) {
      const res = await this.$simpleAsyncTo(queryTrendAndCheckInfo(params), '获取数据失败')
      if (res) {
        this.checkRule = res.data
        if (this.checkRule.check_type === '对比设置') {
          this.rules['comparison_expr'] = [{ required: true, message: '必填项', trigger: 'change' }]
        } else {
          delete this.rules.comparison_expr
        }
      }
    },
    // 自定义规则 - 检测类型变化
    checkTypeChange(val) {
      if (val) {
        if (this.checkTypeList.find(item => item.check_type === val).check_type_value === 'fix') {
          this.title = '对比设置'
          this.compareVisible = true
          this.rules2['comparison_expr'] = [{ required: true, message: '必填项', trigger: 'change' }]
        } else {
          delete this.rules2.comparison_expr
          this.title = '波动阈值'
          this.compareVisible = false
        }
      }
    },
    // 质量规则-自定义规则趋势
    async _queryQualityTrend() {
      const res = await this.$simpleAsyncTo(queryQualityTrend(), '获取数据失败')
      if (res) {
        this.customTrendList = res.data
      }
    },
    // 质量规则-自定义规则检测类型
    async _queryQualityCheckType() {
      const res = await this.$simpleAsyncTo(queryQualityCheckType(), '获取数据失败')
      if (res) {
        this.checkTypeList = res.data
        if (this.type === 'edit') {
          this.checkTypeChange(this.ruleForm2.check_type)
        }
      }
    },
    // 质量规则-自定义对比规则
    async _queryQualityOperator() {
      const res = await this.$simpleAsyncTo(queryQualityOperator(), '获取数据失败')
      if (res) {
        this.customCheckRule = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.add-quality-rule {
  .line {
    border-bottom: 1px solid $grey6;
  }
  .template-wrapper {
    .title {
      padding: 8px 0px;
      color: $grey1;
    }
    .tips {
      width: 80%;
      margin: 0 auto 15px;
      line-height: 20px;
    }
  }
  .rule-type {
    &::before {
      content: "*";
      color: #F56C6C;
      margin-right: 4px;
    }
  }
  .rule-type-select {
    .el-input.is-disabled .el-input__inner {
      color: $grey3 !important;
    }
  }
}
</style>
