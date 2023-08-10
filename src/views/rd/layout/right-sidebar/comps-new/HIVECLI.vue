<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:44:14
 * @LastEditTime: 2023-05-12 15:03:57
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="140px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-form ref="form" :model="form" :rules="rules" label-position="right" class="form-content">
            <el-form-item label="Hive Cli 任务类型" prop="hiveCliTaskExecutionType" class="mt-10">
              <el-select v-model="form.hiveCliTaskExecutionType" placeholder="请选择">
                <el-option v-for="item in hiveCliTaskExecutionTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Hive Cli 选项" prop="hiveCliOptions">
              <el-input v-model="form.hiveCliOptions" placeholder="请输入您的Hive Cli选项，如--verbose等"></el-input>
            </el-form-item>
          </el-form>
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
        hiveSqlScript: [{ required: true, message: '请输入脚本（必填）', trigger: ['blur', 'change'] }]
      },
      hiveCliTaskExecutionTypeList: [
        { name: 'FROM_SCRIPT', value: 'SCRIPT' },
        { name: 'FROM_FILE', value: 'FILE' }
      ]
    }
  },
  created () {
    this.getResourcesData()
  },
  methods: {
    configForm () {
      this.form = {
        localParams: [],
        ...this.configData
      }
    }
  }
}
</script>
