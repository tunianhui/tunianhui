<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:44:14
 * @LastEditTime: 2023-05-16 13:49:12
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <MonacoEditor :code.sync="form.hiveSqlScript" class="editor" />
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
      nodeType: 'HIVECLI',
      form: {},
      rules: {
        hiveSqlScript: [{ required: true, message: '请输入脚本（必填）', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {

      }
    }
  }
}
</script>
