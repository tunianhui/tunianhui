<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-29 16:49:56
 * @LastEditTime: 2023-07-31 11:22:55
 * @Description:
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
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table :data="form.inputColumn" style="width: 100%; height: 330px; overflow: auto;">
          <el-table-column prop="name" label="字段" />
        </el-table>
      </el-col>
      <el-col :span="12" class="right-col h100">
        <div class="header">
          <span>输出字段</span>
          <el-button type="primary" class="iconfont icon-filter font-14" @click="manageField">字段管理</el-button>
        </div>
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
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

    <!-- 字段管理 -->
    <el-dialog title="字段管理" append-to-body :visible.sync="dialogVisible" width="765px">
      <el-transfer :titles="['未选的输入字段', '已选的输入字段']" filterable filter-placeholder="请输入搜索关键词" v-model="fieldData" :data="form.inputColumn" :props="{ key: 'name', label: 'type' }">
        <template slot-scope="{ option }">
          <div class="space-between">
            <span>{{option.name}}</span>
            <span>{{option.type}}</span>
          </div>
        </template>
      </el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handdleSure">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改字段 -->
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

export default {
  props: {
    id: String,
    nodeData: Object
  },
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
      // 是否显示字段管理
      dialogVisible: false,
      fieldVisible: false,
      // 选择的字段 绑定值
      fieldData: [],
      field: {}
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
        inputColumn: [], // 输出字段
        outputColumn: [] // 输入字段
      }
    },

    // 字段管理
    manageField () {
      this.dialogVisible = true
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
    },

    handdleSure () {
      this.form.outputColumn = this.fieldData.map(ele1 => {
        const item = this.form.inputColumn.find(ele2 => ele2.name === ele1)
        return { name: item.name, type: item.type }
      })
      this.dialogVisible = false
    }
  }
}
</script>
