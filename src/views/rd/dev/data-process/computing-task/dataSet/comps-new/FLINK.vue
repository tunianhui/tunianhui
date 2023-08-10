<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:41:47
 * @LastEditTime: 2023-05-22 13:54:19
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="140px" class="form-content">
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
      nodeType: 'FLINK',
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
