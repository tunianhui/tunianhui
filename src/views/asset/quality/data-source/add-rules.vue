<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-06-25 15:35:09
 * @LastEditTime: 2022-10-19 17:33:36
 * @Description:
-->
<template>
  <SimpleEditDialog title="创建质量规则"
                    :visible="isVisible"
                    @close="close"
                    @confirm="confirm"
                    width="600px"
                    top="25vh"
                    class="add-rule-dialog"
                    confirmText="确定">
    <el-form :model="ruleForm"
             :rules="rules"
             size="mini"
             ref="ruleForm"
             label-width="120px">
      <el-form-item label="规则类型"
                    prop="type">
        <el-select v-model="ruleForm.type"
                   placeholder="对象名称"
                   clearable>
          <el-option :label="item.label"
                     :value="item.label"
                     v-for="item in typeList"
                     :key="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="对象名称"
                        prop="name">
            <el-select v-model="ruleForm.name"
                       placeholder="对象名称"
                       clearable>
              <el-option :label="item.label"
                         :value="item.label"
                         v-for="item in nameList"
                         :key="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规则强度"
                        prop="strength">
            <el-select v-model="ruleForm.strength"
                       placeholder="规则强度"
                       clearable>
              <el-option :label="item.label"
                         :value="item.label"
                         v-for="item in strengthList"
                         :key="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="模板类型"
                    prop="templateType">
        <el-select v-model="ruleForm.templateType"
                   placeholder="模板类型"
                   clearable>
          <el-option :label="item.label"
                     :value="item.label"
                     v-for="item in templateTypeList"
                     :key="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监测频率"
                    prop="rate">
        <el-row>
          <el-col :span="2">每隔</el-col>
          <el-col :span="10">
            <el-select v-model="ruleForm.rate"
                       clearable>
              <el-option :label="item.label"
                         :value="item.label"
                         v-for="item in rateList"
                         :key="item.label"></el-option>
            </el-select>
          </el-col>
          <el-col :span="10"
                  :offset="1">
            <el-select v-model="ruleForm.unit">
              <el-option :label="item.label"
                         :value="item.label"
                         v-for="item in unitList"
                         :key="item.label"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="生效时段"
                    prop="effect">
        <el-radio-group class="rule-group"
                        v-model="ruleForm.effect">
          <el-row>
            <el-col :span="24">
              <el-radio label="all">全天</el-radio>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-radio label="time">指定时段</el-radio>
            </el-col>
            <el-col :span="18">
              <el-time-picker class="time-picker"
                              is-range
                              v-model="ruleForm.time"
                              range-separator="至"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              placeholder="选择时间范围"> </el-time-picker>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
export default {
  name: 'QualityAddRules',
  props: {
    visible: Boolean
  },
  components: {},
  data () {
    return {
      isVisible: false,
      ruleForm: {
        type: '',
        name: '',
        strength: '',
        templateType: '',
        rate: '',
        unit: '',
        effect: '',
        time: ''
      },
      rules: {
        type: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        strength: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        templateType: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        rate: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        effect: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      typeList: [],
      nameList: [],
      strengthList: [
        { label: '弱' },
        { label: '强' }
      ],
      templateTypeList: [
        { label: '类型1', value: '1' },
        { label: '类型2', value: '2' }
      ],
      rateList: [],
      unitList: []
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler (val) {
        this.isVisible = val
      }
    }
  },
  computed: {},
  created () { },
  mounted () { },
  methods: {
    close () {
      this.$emit('update:visible', false)
      this.$emit('close', false)
    },
    confirm () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$emit('confirm', this.ruleForm)
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.el-date-editor.time-picker.el-input,
.el-date-editor.time-picker.el-input__inner {
  width: 100%;
}
.rule-group {
  .el-radio {
    line-height: 28px;
  }
}
</style>
