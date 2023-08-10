<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:26
 * @LastEditTime: 2023-05-16 13:47:33
 * @Description:
-->
<template>
  <div class="node-data-edit">
    <el-form ref="form" :model="form" :rules="rules" label-position="right">
      <div></div>
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
      nodeType: 'CONDITIONS',
      form: {},
      rules: {
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

<style lang="scss" scoped>
.relationship-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 100%;
    background-color: #1890ff;
    border-radius: 4px;
    position: absolute;
    top: 0px;
  }
}
</style>
