<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:42:55
 * @LastEditTime: 2023-05-15 17:22:15
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
      nodeType: 'DEPENDENT',
      form: {},
      rules: {
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
