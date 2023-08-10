<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:42:29
 * @LastEditTime: 2023-05-14 18:34:30
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="80px">
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
      nodeType: 'PYTHON',
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
