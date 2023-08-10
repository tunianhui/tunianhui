<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:12
 * @LastEditTime: 2023-05-16 16:38:51
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
      nodeType: 'HTTP',
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
