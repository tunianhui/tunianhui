<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-25 09:54:20
 * @LastEditTime: 2023-05-22 13:55:16
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
      nodeType: 'Pytorch',
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
