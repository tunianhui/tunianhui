<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-07 11:57:49
 * @LastEditTime: 2023-07-28 15:15:10
 * @Description:
-->

<template>
  <div class="comp-option">
    <el-form ref="form" label-width="140px" :model="form" :rules="rules" label-suffix="：" style="height: 460px;">
      <el-row :gutter="20" class="h100">
        <el-col :span="13" class="left-col h100">
          <el-form-item label="步骤名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="文件类型" prop="fileType">
            <el-select v-model="form.fileType" placeholder="请选择">
              <el-option v-for="(item, index) in columnDataTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.fileType === 'text'||form.fileType === 'csv' " label="字段分隔符" prop="fieldDelimiter">
            <el-input v-model="form.fieldDelimiter" placeholder="请输入" :maxlength="64"></el-input>
          </el-form-item>
          <el-form-item label="数据内容起始行" prop="startLine">
            <el-input v-model="form.startLine" placeholder=""></el-input>
          </el-form-item>
          <el-form-item label="上传本地文件">
            <el-upload class="upload-demo" drag accept=".txt,.csv,.xls,.xlsx" action="https://jsonplaceholder.typicode.com/posts/" @before-upload='handleBeforeUpload'>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传txt/csv/xls/xlsx文件，且不能超过500MB</div>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="11" class="right-col h100">
          <div class="header">
            <span>输出字段</span>
            <el-button type="primary" icon="el-icon-plus" @click="manageField">新建字段</el-button>
          </div>
          <el-table row-key="name" ref="singleTable" :data="form.column" style="width: 100%; height: 380px; overflow: auto; cursor: move;" class="mb-20">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="name" label="字段">
              <template slot-scope="scope">
                <el-input v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型">
              <template slot-scope="scope">
                <el-select v-model="scope.row.fileType" placeholder="请选择">
                  <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item.itemValue" :value="item.itemCode"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-button type="text" @click="handdleDel(scope.row, scope.$index)"><i class="el-icon-delete font-14 color-btn"></i></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="移动" placement="top">
                  <el-button type="text"><i class="iconfont icon-move font-14 color-btn"></i></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getdictitemlist, getSchemaList, getSchemaFieldList } from '@/api/rd/data-collection'

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
        fileType: [{ required: true, message: '请选择', trigger: 'change' }],
        fieldDelimiter: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        startLine: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        encoding: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        schemaId: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      encodingList: [
        { itemValue: 'UTF-8', itemCode: 'UTF-8' },
        { itemValue: 'GBK', itemCode: 'GBK' }
      ],
      dataTypeList: [],
      columnDataTypeList: [],
      // 是否显示字段管理
      dialogVisible: false
    }
  },
  created () {
  },
  mounted () {
    this.dragSort()
  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        path: '',
        fileType: 'text',
        fieldDelimiter: ',',
        encoding: 'UTF-8',
        schemaId: '',
        startLine: 1,
        column: []
      }
    },

    // 字段管理
    manageField () {
      this.form.column.push({ name: '', type: '' })
    },

    handleBeforeUpload (file) {
      const fileSize = file.size // 文件大小，单位为字节
      const maxSize = 500 * 1024 * 1024 // 500M的大小限制，转换为字节
      if (fileSize > maxSize) {
        this.$message.error('文件大小超过限制，请选择小于500M的文件')
        return false // 阻止文件的上传
      }
      return true // 允许文件的上传
    },

    async configData () {
      const dictCodes = ['LOCALFILEREADER_FILETYPE', 'COLUMN_DATATYPE']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.columnDataTypeList = results[0].data
      this.dataTypeList = results[1].data
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
<style scoped lang="scss">
.filter-wrapper {
  text-align: right;
  span {
    font-size: 12px;
    color: #c0c0ff;
    cursor: pointer;
  }
}
</style>
