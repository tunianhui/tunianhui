<!--
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-06-22 17:23:10
 * @LastEditTime: 2023-01-04 11:14:11
 * @Description:
-->
<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    width="880px"
    top="25vh"
    class="add-rule-dialog"
    confirmText="确定"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="分区表达式类型" prop="part_type">
        <el-row>
          <el-col :span="6">
            <el-select v-model="ruleForm.part_type" placeholder="请选择分区表达式类型" @change="typeChange">
              <el-option :label="item.label" :value="item.label" v-for="item in typeList" :key="item.label"></el-option>
            </el-select>
          </el-col>
          <el-col :span="8" :offset="1">
            <span>天分区：</span>
            <el-autocomplete
              style="width:calc(100% - 60px)"
              class="inline-input"
              v-model="ruleForm.table_part_info"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              @select="blurHandle"
              @change="blurHandle"
            ></el-autocomplete>
          </el-col>
          <el-col :span="8" :offset="1">
            <span>小时分区：</span>
            <el-autocomplete
              style="width:calc(100% - 70px)"
              class="inline-input"
              v-model="ruleForm.table_part_hour_info"
              :fetch-suggestions="querySearch1"
              placeholder="请输入内容"
              @select="blurHandle1"
              @change="blurHandle1"
            ></el-autocomplete>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="分区预算" prop="table_part_info">
        {{stringName}}
      </el-form-item>
      <div class="mb-20">
        <i class="el-icon-warning-outline"></i>
        对分区表达式的编辑会对改分区下所有规则同时生效
      </div>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import {insertAuditTablePartExpr, updateAuditTablePartExpr, auditTablePartExprFormat, auditTableHourPartExprFormat} from '@/api/asset/quality/tableRules'
export default {
  name: 'AddExpression',
  props: {
    visible: Boolean,
    base_id: String,
    obj: Object,
    type: String,
    part: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    
  },
  data() {
    return {
      isVisible: false,
      ruleForm: {},
      rules: {
        part_type: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        table_part_info: [
          { required: true, message: '必填项', trigger: 'blur' }
        ]
      },
      table_part_info: '',
      table_part_hour_info: '',
      typeList: [
        {label: '非分区表'},
        {label: '自定义'}
      ],
      options: [
        {
          label: 'ds=${yyyyMMdd-1}',
          value: 'ds=${yyyyMMdd-1}'
        },
        {
          label: 'ds=${yyyy/MM/dd-1}',
          value: 'ds=${yyyy/MM/dd-1}'
        },
        {
          label: 'ds=${yyyy-MM-dd-1}',
          value: 'ds=${yyyy-MM-dd-1}'
        }
      ],
      options1: [
        {
          label: 'hour=${HH}',
          value: 'hour=${HH}'
        },
        {
          label: 'hour=${HH-1/24}',
          value: 'hour=${HH-1/24}'
        },
        {
          label: 'hour=${HH-2/24}',
          value: 'hour=${HH-2/24}'
        }
      ],
      title: '创建分区表达式'
    }
  },
  computed: {
    // 分区预算string
    stringName() {
      if (this.table_part_info && this.table_part_hour_info) {
        return `${this.table_part_info},${this.table_part_hour_info}`
      } else if (this.table_part_info && !this.table_part_hour_info) {
        return `${this.table_part_info}`
      } else if (!this.table_part_info && this.table_part_hour_info) {
        return `${this.table_part_hour_info}`
      } else {
        return ''
      }
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    },
    obj: {
      immediate: true,
      handler(val) {
        if (val.type === 'add') {
          this.ruleForm = {
            base_id: val.part.base_id,
            part_type: '非分区表',
            table_part_info: 'ds=NONE',
            table_part_hour_info: ''
          }
          this.table_part_info = 'ds=NONE'
          this.title = '创建分区表达式'
        }
        if (val.type === 'edit') {
          this.ruleForm = {
            ...val.part
          }
          if (this.ruleForm.part_type === '非分区表') {
            this.table_part_info = 'ds=NONE'
            this.table_part_hour_info = ''
          } else {
            this._auditTablePartExprFormat()
            if (this.ruleForm.table_part_hour_info) {
              this._auditTableHourPartExprFormat()
            }
          }
          this.title = '编辑分区表达式'
        }
      }
    }
  },
  created() {},
  methods: {
    querySearch(queryString, cb) {
      cb(this.options)
    },
    querySearch1(queryString, cb) {
      cb(this.options1)
    },
    confirm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.obj.type === 'add') {
            this._insertAuditTablePartExpr()
          }
          if (this.obj.type === 'edit') {
            this._updateAuditTablePartExpr()
          }
        }
      })
    },
    async _insertAuditTablePartExpr() {
      const res = await this.$simpleAsyncTo(insertAuditTablePartExpr(this.ruleForm), '获取失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '新增成功'
        })
      }
    },
    async _updateAuditTablePartExpr() {
      const res = await this.$simpleAsyncTo(updateAuditTablePartExpr(this.ruleForm), '获取失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }
    },
    close() {
      this.$emit('update:visible', false)
      this.$emit('close', false)
    },
    typeChange() {
      if (this.ruleForm.part_type === '非分区表') {
        this.ruleForm.table_part_info = 'ds=NONE'
        this.table_part_info = 'ds=NONE'
      } else {
        this.ruleForm.table_part_info = ''
        this.table_part_info = ''
      }
    },
    blurHandle() {
      if (this.ruleForm.part_type === '自定义' && this.ruleForm.table_part_info !== '') {
        this._auditTablePartExprFormat()
      }
    },
    blurHandle1() {
      if (this.ruleForm.part_type === '自定义') {
        this._auditTableHourPartExprFormat()
      }
    },
    async _auditTablePartExprFormat() {
      const res = await this.$simpleAsyncTo(auditTablePartExprFormat({
        part_type: this.ruleForm.part_type,
        table_part_info: this.ruleForm.table_part_info
      }), '获取失败')
      if (res) {
        this.table_part_info = res.data
      }
    },
    async _auditTableHourPartExprFormat() {
      const res = await this.$simpleAsyncTo(auditTableHourPartExprFormat({
        part_type: this.ruleForm.part_type,
        table_part_hour_info: this.ruleForm.table_part_hour_info
      }), '获取失败')
      if (res) {
        this.table_part_hour_info = res.data
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
