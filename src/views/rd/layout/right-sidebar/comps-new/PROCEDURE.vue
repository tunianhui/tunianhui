<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-12 16:56:45
 * @LastEditTime: 2023-07-14 14:02:14
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="140px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-form-item label="数据源类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option v-for="item in dataSourceTypeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据源实例" prop="datasource">
            <el-select v-model="form.datasource" placeholder="请选择">
              <el-option v-for="item in dataSourceList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="自定义参数" name="3">
          <!-- 自定义参数 -->
          <template v-if="form.localParams && form.localParams.length">
            <el-row :gutter="10" v-for="(item,index) in form.localParams" :key="index">
              <el-col :span="6">
                <el-form-item label="" label-width='0px' :key="item.key" :prop="'localParams.' + index + '.prop'" :rules="{required: true, message: 'prop(必填)', trigger: ['blur','change']}">
                  <el-input v-model="item.prop" placeholder="prop(必填)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-select v-model="item.direct" placeholder="请选择">
                  <el-option v-for="item in directList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select v-model="item.type" placeholder="请选择">
                  <el-option v-for="item in typeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-input v-model="item.value" placeholder="value(选填)"></el-input>
              </el-col>
              <el-col :span="2">
                <el-button id="6666" type="text" icon="el-icon-delete" circle @click="handleDelParameters(item,index)"></el-button>
              </el-col>
            </el-row>
          </template>
          <el-button type="primary" @click="handleAddParameters">添加参数</el-button>
        </el-collapse-item>
      </el-collapse>
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
      form: {},
      rules: {
        name: [{ required: true, message: '请输入名称(必填)', trigger: ['blur', 'change'] }],
        taskPriority: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        workerGroup: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        method: [{ required: true, message: '请输入存储脚本', trigger: ['blur', 'change'] }],
        type: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        datasource: [{ required: true, message: '请选择数据源实例', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {
        type: 'MYSQL',
        localParams: [],
        ...this.configData
      }
    }
  }
}
</script>
