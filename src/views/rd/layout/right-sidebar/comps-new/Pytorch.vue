<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-25 09:54:20
 * @LastEditTime: 2023-05-14 15:15:42
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="160px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-form-item label="python脚本" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="脚本启动参数" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="展开更多配置" prop="timeoutFlag">
            <el-switch v-model="form.timeoutFlag" active-value="OPEN" inactive-value="CLOSE">
            </el-switch>
          </el-form-item>
          <el-form-item label="python项目地址" prop="description">
            <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入描述"></el-input>
          </el-form-item>
          <el-form-item label="是否创建新环境" prop="workerGroup">
            <el-switch v-model="form.workerGroup" active-value="OPEN" inactive-value="CLOSE">
            </el-switch>
          </el-form-item>
          <el-form-item label="依赖文件" prop="file">
            <el-input v-model="form.file"></el-input>
          </el-form-item>
          <el-form-item label="python版本" prop="version">
            <el-input v-model="form.version"></el-input>
          </el-form-item>
          <el-form-item label="python环境管理工具" prop="environmentCode">
            <el-select v-model="form.environmentCode" placeholder="请选择">
              <el-option v-for="item in environmentsList" :key="item.code" :label="item.name" :value="item.code"></el-option>
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
        rawScript: [{ required: true, message: '请输入脚本（必填）', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () {
    this.getResourcesData()
  },
  methods: {
    configForm () {
      this.form = {
        ...this.configData
      }
    }
  }
}
</script>
