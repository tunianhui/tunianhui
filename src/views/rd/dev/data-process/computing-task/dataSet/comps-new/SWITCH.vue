<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:41
 * @LastEditTime: 2023-05-15 09:20:43
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form-content">
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
      nodeType: 'SWITCH',
      form: {},
      rules: {
        hiveSqlScript: [{ required: true, message: '请输入脚本（必填）', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () { },
  methods: {
    configForm () {
      this.form = {

      }
    }
  }
}
</script>
