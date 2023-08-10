<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-10 10:22:27
 * @LastEditTime: 2023-07-24 10:02:52
 * @Description:
-->

<template>
  <div class="comp-option-single">
    <el-form ref="form" label-width="130px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="选择字段" prop="selectColumn">
        <el-select v-model="form.selectColumn" placeholder="请选择">
          <el-option v-for="(item, index) in form.inputColumn" :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="脱敏规则" prop="ruleId">
        <el-select v-model="form.ruleId" placeholder="请选择">
          <el-option v-for="(item, index) in ruleList" :key="index" :label="item.maskRuleName" :value="item.maskRuleId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import comMixins from './mixins'
export default {
  props: {
    id: String,
    nodeData: Object
  },
  mixins: [comMixins],
  data () {
    return {
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        selectColumn: [{ required: true, message: '请选择', trigger: 'change' }],
        ruleId: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  created () {

  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        ruleId: '',
        selectColumn: ''
      }
    }
  }
}
</script>
