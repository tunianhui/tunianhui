<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-12 16:56:30
 * @LastEditTime: 2023-05-16 13:52:49
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
      nodeType: 'SUB_PROCESS',
      form: {},
      rules: {}
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
