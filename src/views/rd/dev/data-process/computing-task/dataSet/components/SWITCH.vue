<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:41
 * @LastEditTime: 2023-04-21 17:37:29
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
        <el-col :span="12">
          <el-form-item label="失败重试次数（次）" prop="failRetryTimes">
            <el-input-number v-model="form.failRetryTimes" :min="0" :max="10000"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失败重试间隔（分）" prop="failRetryInterval">
            <el-input-number v-model="form.failRetryInterval" :min="0" :max="10000"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="延时执行时间（分）" prop="delayTime">
            <el-input-number v-model="form.delayTime" :min="0" :max="10000"></el-input-number>
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
      <!-- <el-form-item label="条件" prop="condition">
      </el-form-item> -->
      <template v-if="form.switchResult.dependTaskList && form.switchResult.dependTaskList.length">
        <el-row :gutter="10" v-for="(item,index) in form.switchResult.dependTaskList" :key="index" class="mt-10">
          <el-col :span="14">
            <el-form-item label="条件" :key="item.key">
              <el-input v-model="item.condition" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分支流转">
              <el-select v-model="item.nextNode" placeholder="请选择">
                <el-option v-for="item in form.branchList" :key="item.id" :label="item.label" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" icon="el-icon-delete" circle @click="delCondition(item,index)"></el-button>
          </el-col>
        </el-row>
      </template>
      <el-button type="primary" circle icon="el-icon-plus" @click="handleAddCondition"></el-button>
      <el-form-item label="分支流转" class="mt-10">
        <el-select v-model="form.switchResult.nextNode" placeholder="请选择">
          <el-option v-for="item in form.branchList" :key="item.id" :label="item.label" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="前置任务" prop="task" class="mt-10">
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
    nodeData: Object,
    edges: Array
  },
  mixins: [comMixins],
  data () {
    return {
      form: {},
      rules: {
        name: [{ required: true, message: '请输入名称(必填)', trigger: ['blur', 'change'] }],
        taskPriority: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        workerGroup: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        hiveSqlScript: [{ required: true, message: '请输入脚本（必填）', trigger: ['blur', 'change'] }],
        timeoutNotifyStrategyList: [{ required: true, message: '超时策略必须选一个', trigger: ['blur', 'change'] }]
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
        switchResult: {
          dependTaskList: []
        },
        ...this.configData
      }
    },
    // 添加条件
    handleAddCondition () {
      const data = { condition: '', nextNode: '', key: Date.now() }
      this.form.switchResult.dependTaskList.push(data)
    },
    // 删除条件
    delCondition (item, index) {
      this.form.switchResult.dependTaskList.splice(index, 1)
    }
  }
}
</script>
