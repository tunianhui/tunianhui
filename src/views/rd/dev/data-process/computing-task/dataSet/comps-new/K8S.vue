<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-25 09:53:00
 * @LastEditTime: 2023-05-16 15:12:00
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
      nodeType: 'K8S',
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
