<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-12 16:56:30
 * @LastEditTime: 2023-04-20 19:41:45
 * @Description:
-->
<template>
  <div class="node-data-wrapper">
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="节点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称(必填)"></el-input>
      </el-form-item>
      <el-form-item label="运行标志" prop="flag">
        <el-radio-group v-model="form.flag">
          <el-radio label="YES">正常</el-radio>
          <el-radio label="NO">禁止执行</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="任务优先级" prop="taskPriority">
        <el-select v-model="form.taskPriority" placeholder="请选择">
          <el-option v-for="item in taskLevelList" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Worker分组" prop="workerGroup">
            <el-select v-model="form.workerGroup" placeholder="请选择">
              <el-option v-for="item in workersList" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环境名称" prop="environmentCode">
            <el-select v-model="form.environmentCode" placeholder="请选择">
              <el-option v-for="item in environmentsList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务组名称" prop="taskGroupId">
            <el-select v-model="form.taskGroupId" placeholder="请选择">
              <el-option v-for="item in taskGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组内优先级" prop="taskGroupPriority">
            <el-input-number v-model="form.taskGroupPriority" :max="10000" :disabled="!form.taskGroupId" placeholder="请输入"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="超时告警" prop="timeoutFlag">
        <el-switch v-model="form.timeoutFlag" active-value="OPEN" inactive-value="CLOSE">
        </el-switch>
      </el-form-item>
      <template v-if="form.timeoutFlag === 'OPEN'">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="超时策略" prop="timeoutNotifyStrategyList">
              <el-checkbox-group v-model="form.timeoutNotifyStrategyList">
                <el-checkbox label="WARN">超时告警</el-checkbox>
                <el-checkbox label="FAILED">超时失效</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超时时长（分）" prop="timeout">
              <el-input-number v-model="form.timeout" :min="1" :max="9999999999"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-form-item label="子节点" prop="processDefinitionCode">
        <el-select v-model="form.processDefinitionCode" placeholder="请选择">
          <el-option v-for="item in workFlowsList" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="前置任务" prop="task">
        <el-select v-model="form.task" multiple clearable placeholder="请选择">
          <el-option v-for="item in form.preTaskList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
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
        timeoutNotifyStrategyList: [{ required: true, message: '超时策略必须选一个', trigger: ['blur', 'change'] }],
        processDefinitionCode: [{ required: true, message: '请选择子节点(必选)', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () { },
  methods: {
    configForm () {
      this.form = {
        failRetryTimes: 0,
        failRetryInterval: 1,
        delayTime: 0,
        ...this.configData
      }
    }
  }
}
</script>
