<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-10 16:34:18
 * @LastEditTime: 2023-08-08 11:50:59
 * @Description:
-->

<template>
  <div class="comp-option-single">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="文件前缀" prop="filePrefix">
        <el-input v-model="form.filePrefix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="文件后缀" prop="fileSuffix">
        <el-input v-model="form.fileSuffix" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="数据源" prop="dataSourceId">
        <el-select v-model="form.dataSourceId" clearable placeholder="请选择数据源">
          <el-option v-for="(item, index) in dataSourceList" :key="index" :label="item.dataSourceName" :value="item.dataSourceId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="hdfs路径" prop="path">
        <el-input v-model="form.path" placeholder=""></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getDatasourceList } from '@/api/rd/data-collection'

export default {
  props: {
    id: String,
    nodeData: Object
  },
  mixins: [comMixins],
  data () {
    return {
      form: {
        type: '', // 组件类型
        name: '', // 步骤名称
        dataSourceId: '',
        database: '',
        path: '',
        filePrefix: '',
        fileSuffix: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        dataSourceId: [{ required: true, message: '请选择', trigger: 'change' }],
        path: [
          { required: true, message: '请输入', trigger: 'blur' }
        ]
      }
    }
  },
  created () { },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        dataSourceId: '',
        path: '',
        filePrefix: '',
        fileSuffix: ''
      }
    },

    // 数据源列表
    async getDataSource () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceType: 'HDFS'
      }
      const res = await getDatasourceList(params)
      if (res) {
        this.dataSourceList = res.data.datasource
      }
    }
  }
}
</script>
