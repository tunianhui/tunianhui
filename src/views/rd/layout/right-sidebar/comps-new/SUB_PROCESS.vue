<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-12 16:56:30
 * @LastEditTime: 2023-05-13 16:44:13
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="100px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-form-item label="子节点" prop="processDefinitionCode">
            <el-select v-model="form.processDefinitionCode" placeholder="请选择">
              <el-option v-for="item in workFlowsList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
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
        processDefinitionCode: [{ required: true, message: '请选择子节点(必选)', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () { },
  methods: {
    configForm () {
      this.form = {
        ...this.configData
      }
    }
  }
}
</script>
