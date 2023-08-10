<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-12 16:56:45
 * @LastEditTime: 2023-05-15 09:11:10
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="120px" class="form-content">
      <MonacoEditor :code.sync="form.method" class="editor" />
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
      nodeType: 'PROCEDURE',
      form: {},
      rules: {
        method: [{ required: true, message: '请输入存储脚本', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {
        method: ''
      }
    }
  }
}
</script>
