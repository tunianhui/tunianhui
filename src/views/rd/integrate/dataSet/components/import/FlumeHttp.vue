<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-07 13:48:45
 * @LastEditTime: 2023-07-28 18:00:54
 * @Description:
-->

<template>
  <div class="comp-option">
    <el-form ref="form" label-width="120px" :model="form" :rules="rules" label-suffix="：" style="height: 440px;">
      <el-row :gutter="20" class="h100">
        <el-col :span="14" class="left-col h100">
          <el-form-item label="步骤名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="数据源" prop="dataSourceId">
            <el-select v-model="form.dataSourceId" clearable placeholder="请选择数据源">
              <el-option v-for="(item, index) in dataSourceList" :key="index" :label="item.dataSourceName" :value="item.dataSourceId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="端口" prop="port">
            <el-input v-model="form.port" placeholder="请输入文件路径" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="绑定主机" prop="bind">
            <el-input v-model="form.bind" placeholder="请输入" :maxlength="128"></el-input>
          </el-form-item>
          <el-form-item label="是否启用SSL" prop="ssl">
            <el-select v-model="form.ssl" placeholder="请选择">
              <el-option label="启用" :value="true"></el-option>
              <el-option label="不启用" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <template v-if="form.ssl">
            <el-form-item label="keystore文件" prop="keystore">
              <el-input v-model="form.keystore" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="keystore密码" prop="keystore-password">
              <el-input v-model="form['keystore-password']" placeholder=""></el-input>
            </el-form-item>
          </template>

        </el-col>
        <el-col :span="10" class="right-col h100">
          <el-form-item label="输出字段" prop="schemaId" label-width="100px">
            <el-select v-model="form.schemaId" placeholder="请选择">
              <el-option v-for="(item, index) in schemaList" :key="index" :label="item.schemaName" :value="item.schemaId"></el-option>
            </el-select>
          </el-form-item>
          <el-table :data="form.column" style="width: 100%; height: 380px; overflow: auto;" class="mb-20">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="name" label="字段" />
            <el-table-column prop="type" label="类型" />
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getDatasourceList, getSchemaList, getSchemaFieldList } from '@/api/rd/data-collection'

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
          { required: true, message: '请输入步骤名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        dataSourceId: [{ required: true, message: '请选择', trigger: 'change' }],
        ssl: [{ required: true, message: '请选择', trigger: 'change' }],
        port: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        schemaId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {
        ...this.form,
        type: '', // 组件类型
        name: '', // 步骤名称
        dataSourceId: '',
        database: '',
        fieldDelimiter: '',
        port: '',
        bind: '',
        ssl: false,
        keystore: '',
        'keystore-password': '',
        schemaId: '',
        column: []
      }
    },

    // 数据源列表
    async getDataSource () {
      const { project_id } = this.project
      const params = {
        projectId: project_id,
        dataSourceType: 'RemoteHost'
      }
      const res = await getDatasourceList(params)
      if (res) {
        this.dataSourceList = res.data.datasource
      }
    },

    // Schema信息列表查询
    async getSchemaData () {
      const { project_id } = this.project
      const params = {
        projectId: project_id
      }
      const res = await getSchemaList(params)
      if (res) {
        this.schemaList = res.data.schema
      }
    },

    // 查询Schema字段列表信息
    async getSchemafield (schemaId) {
      const res = await getSchemaFieldList({ schemaId })
      if (res) {
        this.form.column = res.data.field.map(item => {
          return {
            name: item.fieldName, type: item.dataType
          }
        })
      }
    }
  }
}
</script>
