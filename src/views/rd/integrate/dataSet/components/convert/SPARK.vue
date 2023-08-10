<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-28 16:25:05
 * @LastEditTime: 2023-08-07 09:50:28
 * @Description:
-->

<template>
  <div class="comp-option-single">
    <el-form ref="form" label-width="140px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="SPARK过程脚本" prop="command">
        <div style="color:#999">注意：每条命令语句的后面请用“;”结束，只支持select语句</div>
        <MonacoEditor :code.sync="form.command" style="height: 350px;" class="editor" />
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
        command: [{ required: true, message: '请输入脚本', trigger: 'blur' }]
      }
    }
  },
  created () {
  },
  watch: {
    nodeData: {
      immediate: true, // 初始化 必须
      deep: true,
      handler (val) {
        if (Object.keys(val).length > 1) {
          this.form = val
        } else {
          this.configForm()
          this.form.name = val.name
          this.$refs.form && this.$refs.form.resetFields()
        }
      }
    }
  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        command: ''
      }
    }
  }
}
</script>
