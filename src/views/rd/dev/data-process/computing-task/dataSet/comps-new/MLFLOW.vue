<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-25 09:53:48
 * @LastEditTime: 2023-05-12 14:38:13
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right">
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
      nodeType: 'MLFLOW',
      form: {},
      rules: {}
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {}
    }
  }
}
</script>
