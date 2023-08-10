<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-07-10 11:38:08
 * @LastEditTime: 2023-07-31 14:15:25
 * @Description: 字符串拼接
-->

<template>
  <div class="comp-option-convert">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64" style="width: 200px;"></el-input>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" style="height: calc(100% - 50px);">
      <el-col :span="12" class="left-col h100">
        <div class="header">
          <span>输入字段</span>
        </div>
        <el-input v-model="keyword1" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table :data="form.inputColumn" style="width: 100%; height: 330px; overflow: auto;">
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
        </el-table>
      </el-col>
      <el-col :span="12" class="right-col h100">
        <div class="header">
          <span>输出字段</span>
          <el-button type="primary" icon="el-icon-plus" @click="manageField">新建字段</el-button>
        </div>
        <el-input v-model="keyword2" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table row-key="name" ref="singleTable" :data="form.outputColumn" style="width: 100%; height: 330px; overflow: auto; cursor: move;">
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
          <el-table-column prop="newname" label="新字段" />
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text" @click="handdleEdit(scope.row, scope.$index)"><i class="el-icon-edit font-14 color-btn"></i></el-button>
              </el-tooltip>
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

    <el-dialog title="新建字段" append-to-body :visible.sync="dialogVisible" width="900px">
      <el-row :gutter="30">
        <el-col :span="12" class="left-col h100">
          <el-form ref="form2" label-width="100px" :model="form2" :rules="rules2" label-suffix="：">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form2.name" placeholder="字母、数字、下划线，64个字符以内" :maxlength="64"></el-input>
            </el-form-item>
            <el-form-item label="表达式" prop="expression">
              <el-input v-model="form2.expression" type="textarea" :rows="4" placeholder="请填写表达式" :maxlength="128" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="数据类型" prop="type">
              <el-select v-model="form2.type" placeholder="">
                <el-option v-for="(item, index) in dataTypeList" :key="index" :label="item.itemCode" :value="item.itemValue"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12" class="right-col h100 right-wrapper">
          <el-table :data="processingMethodList" style="width: 100%; height: 330px; overflow: auto;">
            <el-table-column type="index" label="序号" width="55" />
            <el-table-column prop="name" label="处理方法" />
            <el-table-column label="操作" width="70">
              <template slot-scope="scope">
                <el-button type="text" @click="handdleConfig(scope.row, scope.$index)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handdleAddField">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改字段" append-to-body :visible.sync="fieldVisible" width="400px">
      <el-form ref="form" label-width="100px" :model="field" label-suffix="：">
        <el-form-item label="原字段" prop="name">
          <span>{{field.name}}</span>
        </el-form-item>
        <el-form-item label="新字段" prop="newname">
          <el-input v-model="field.newname" placeholder="" :maxlength="64"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fieldVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateFiled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import comMixins from './mixins'
import { getdictitemlist } from '@/api/rd/data-collection'

export default {
  mixins: [comMixins],
  data () {
    return {
      form: {},
      rules: {
        name: [
          { required: true, message: '请输入步骤名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ]
      },
      rules2: {
        name: [
          { required: true, message: '字母、下划线（_）、数字', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含字母、下划线（_）、数字', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        expression: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      // 是否显示字段管理
      dialogVisible: false,
      // 选择的字段 绑定值
      fieldData: [],
      form2: {},
      dataTypeList: [],
      fieldVisible: false,
      field: {},

      processingMethodList: [
        { name: '字符串转日期', value: 1 },
        { name: '日期时间转字符串', value: 2 },
        { name: '日期转时间戳', value: 3 },
        { name: '时间戳转日期', value: 4 },
        { name: '时间戳转日期时间', value: 5 }
      ]
    }
  },
  created () {
    this.configData()
  },
  mounted () {
    this.dragSort()
  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        inputColumn: [], // 根据上游的输入，为您展示输入字段
        outputColumn: [] // 输出字段
      }
    },

    async configData () {
      const dictCodes = ['COLUMN_DATATYPE']
      const results = await Promise.all(dictCodes.map(dictCode => getdictitemlist({ dictCode })))
      this.dataTypeList = results[0].data
    },

    // 字段管理
    manageField () {
      this.dialogVisible = true
    },

    handdleAddField () {
      this.$refs.form2.validate(valid => {
        if (valid) {
          const { name, type } = this.form2
          this.form.outputColumn.push({ name, type })
          this.dialogVisible = false
        }
      })
    },

    handdleConfig () {

    },

    // 编辑字段
    handdleEdit (item, index) {
      this.field = item
      this.fieldVisible = true
    },

    updateFiled () {
      this.fieldVisible = false
    },

    handdleDel (item, index) {
      this.form.outputColumn.splice(index, 1)
    }
  }
}
</script>
<style lang='scss' scoped>
.right-wrapper {
  background-color: white;
  padding: 10px 0;
}
</style>
