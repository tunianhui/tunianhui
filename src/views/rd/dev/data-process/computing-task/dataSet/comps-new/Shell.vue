<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-10 14:35:18
 * @LastEditTime: 2023-05-16 13:51:42
 * @Description: Shell
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="100px">
      <MonacoEditor :code.sync="form.rawScript" class="editor" />
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
      nodeType: 'Shell',
      form: {},
      rules: {
        rawScript: [{ required: true, message: '请输入脚本（必填）', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {
        rawScript: ''
      }
    }
  }
}
</script>
