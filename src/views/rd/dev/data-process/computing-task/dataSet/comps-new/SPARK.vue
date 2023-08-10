<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-12 16:57:36
 * @LastEditTime: 2023-05-14 18:34:04
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
      nodeType: 'SPARK',
      form: {},
      rules: {}
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
