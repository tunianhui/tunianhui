<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-12 16:57:01
 * @LastEditTime: 2023-05-15 14:43:58
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="140px">
      <MonacoEditor :code.sync="form.sql" class="editor" />
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
      nodeType: 'SQL',
      form: {},
      rules: {
        sql: [{ required: true, message: '语句不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {
        sql: ''
      }
    }
  }
}
</script>
