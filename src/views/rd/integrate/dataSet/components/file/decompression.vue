<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-06 17:31:02
 * @LastEditTime: 2023-07-19 10:49:37
 * @Description:
-->

<template>
  <div class="comp-option-single">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="压缩格式" prop="compressType">
        <el-select v-model="form.compressType" placeholder="请选择压缩格式">
          <el-option v-for="(item, index) in compressTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件前缀" prop="filePrefix">
        <el-input v-model="form.filePrefix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="文件后缀" prop="fileSuffix">
        <el-input v-model="form.fileSuffix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getdictitemlist } from '@/api/rd/data-collection'

export default {
  mixins: [comMixins],
  data () {
    return {
      form: {
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        compressType: [{ required: true, message: '请选择', trigger: 'change' }],
        path: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      },
      compressTypeList: []
    }
  },
  created () {
    this.configData()
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
    },

    async configData () {
      const dictCodes = ['FILEUNCOMPRESS_COMPRESSTYPE']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.compressTypeList = results[0].data
    }
  }
}
</script>
