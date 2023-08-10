<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:59
 * @LastEditTime: 2023-05-16 13:46:59
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="140px">
      <MonacoEditor :code.sync="form.json" class="editor" />
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
      nodeType: 'CHUNJUN',
      form: {},
      rules: {
        json: [{ required: true, message: '语句不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () { },
  methods: {
    configForm () {
      this.form = {
        json: ''
      }
    }
  }
}
</script>
