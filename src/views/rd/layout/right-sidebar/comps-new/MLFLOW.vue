<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-25 09:53:48
 * @LastEditTime: 2023-05-19 09:47:03
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="200px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-form-item label="MLflow Tracking Server URI" prop="url">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item label="MLflow 任务类型" prop="mlTaskType">
            <el-select v-model="form.mlTaskType" placeholder="请选择">
              <el-option v-for="item in mlTaskTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型" prop="taskType">
            <el-select v-model="form.taskType" clearable placeholder="请选择">
              <el-option v-for="item in taskTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实验名称" prop="taskGroupPriority">
            <el-input v-model="form.taskGroupPriority" placeholder="experiment_001"></el-input>
          </el-form-item>
          <el-form-item label="参数" prop="timeoutFlag">
            <el-input v-model="form.timeoutFlag"></el-input>
          </el-form-item>
          <el-form-item label="运行仓库" prop="resourceNameList">
            <el-input v-model="form.resourceNameList" placeholder="可以为git仓库或worker上的路径"></el-input>
          </el-form-item>
          <el-form-item label="项目版本" prop="localParams">
            <el-input v-model="form.localParams" placeholder="项目git版本"></el-input>
          </el-form-item>
          <el-form-item label="资源" prop="task" class="mt-10">
            <el-select v-model="form.task" multiple clearable placeholder="请选择资源">
              <el-option v-for="item in form.preTaskList" :key="item.id" :label="item.label" :value="item.id"></el-option>
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
        url: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
      },
      mlTaskTypeList: [
        { name: 'MLFLOW Models', value: 'MLFLOW Models' },
        { name: 'MLFLOW Projects', value: 'MLFLOW Projects' }
      ],
      taskTypeList: [
        { name: 'Custom project', value: 'Custom project' },
        { name: 'AutoML', value: 'AutoML' },
        { name: 'BasicAlgorithm', value: 'BasicAlgorithm' }
      ]
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
