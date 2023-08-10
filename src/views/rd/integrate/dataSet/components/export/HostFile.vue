<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-15 11:03:30
 * @LastEditTime: 2023-08-08 14:09:23
 * @Description:
-->

<template>
  <div class="comp-option-single">
    <el-form ref="form" label-width="130px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="文件前缀" prop="filePrefix">
        <el-input v-model="form.filePrefix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="文件后缀" prop="fileSuffix">
        <el-input v-model="form.fileSuffix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="目标路径" prop="path">
        <el-input v-model="form.path" placeholder=""></el-input>
      </el-form-item>
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
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        path: '',
        filePrefix: '',
        fileSuffix: ''
      }
    }
  }
}
</script>
