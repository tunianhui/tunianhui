<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-02-22 14:32:44
 * @LastEditTime: 2023-07-31 11:17:42
 * @Description:
-->

<template>
  <div class="comp-option-three">
    <el-form ref="form" label-width="100px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入步骤名称" :maxlength="64" style="width: 200px;"></el-input>
      </el-form-item>
    </el-form>
    <el-row :gutter="30" style="height: calc(100% - 50px);">
      <el-col :span="8" class="left-col h100">
        <div class="header">
          <span>输入字段</span>
        </div>
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table :data="form.inputColumn" style="width: 100%; height: 330px; overflow: auto;">
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
        </el-table>
      </el-col>
      <el-col :span="8" class="center-col h100">
        <div class="header">
          <span>筛选条件</span>
          <span @click=" filterType = !filterType">{{filterType ? '切换到配置模式':'切换到脚本模式'}}</span>
        </div>
        <div v-if="filterType">
          <MonacoEditor :code.sync="form.filterWhere" style="height: 350px;" />
        </div>
        <div v-else>
          <!-- 配置模式 -->
        </div>
      </el-col>
      <el-col :span="8" class="right-col h100">
        <div class="header">
          <span class="mr-10">输出字段</span>
        </div>
        <el-input v-model="keyword" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入关键词" class="mb-10"></el-input>
        <el-table row-key="name" ref="singleTable" :data="form.outputColumn" style="width: 100%; height: 330px; overflow: auto;">
          <el-table-column type="index" label="序号" width="55" />
          <el-table-column prop="name" label="字段" />
          <el-table-column prop="type" label="类型" />
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="移动" placement="top">
                <el-button type="text"><i class="iconfont icon-move font-14 color-btn"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
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
      form: {
        type: '', // 组件类型
        name: '', // 步骤名称
        inputColumn: [], // 根据上游的输入，为您展示输入字段
        outputColumn: [] // 输出字段
      },
      rules: {
        name: [
          { required: true, message: '请输入步骤名称', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ]
      },
      filterType: true,
      // 选择的字段 绑定值
      fieldData: [],
      schemaList: []
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
    }

  }
}
</script>
