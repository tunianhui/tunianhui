<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:12
 * @LastEditTime: 2023-04-20 19:40:28
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
      <el-form-item label="请求地址" prop="url">
        <el-input v-model="form.url" placeholder="请填写请求地址(必填)"></el-input>
      </el-form-item>
      <el-form-item label="请求类型" prop="httpMethod">
        <el-select v-model="form.httpMethod" placeholder="请选择">
          <el-option v-for="item in httpMethodList" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求参数" prop="httpParams">
        <el-button type="primary" circle icon="el-icon-plus" @click="handleAddHttpParams"></el-button>
      </el-form-item>
      <template v-if="form.httpParams && form.httpParams.length">
        <el-row :gutter="10" v-for="(item,index) in form.httpParams" :key="index" class="mt-10">
          <el-col :span="6">
            <el-form-item label="" :key="item.key" :prop="'httpParams.' + index + '.prop'" :rules="{required: true, message: 'prop(必填)', trigger: ['blur','change']}">
              <el-input v-model="item.prop" placeholder="prop(必填)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-select v-model="item.httpParametersType" placeholder="请选择">
              <el-option v-for="item in httpParametersTypeList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="item.value" placeholder="value(选填)"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" icon="el-icon-delete" circle @click="delHttp(item,index)"></el-button>
          </el-col>
        </el-row>
      </template>
      <el-form-item label="校验条件" prop="httpCheckCondition" class="mt-10">
        <el-select v-model="form.httpCheckCondition" placeholder="请选择">
          <el-option v-for="item in httpCheckConditionList" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="校验内容" prop="condition">
        <el-input v-model="form.condition" type="textarea" :rows="3" placeholder="请填写校验内容"></el-input>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="连接超时（毫秒）" prop="connectTimeout">
            <el-input-number v-model="form.connectTimeout" :min="0" :max="282475248"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Socket超时（毫秒）" prop="socketTimeout">
            <el-input-number v-model="form.socketTimeout" :min="0" :max="282475248"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="自定义参数" prop="localParams">
        <el-button type="primary" circle icon="el-icon-plus" @click="handleAddParameters"></el-button>
      </el-form-item>
      <template v-if="form.localParams && form.localParams.length">
        <el-row :gutter="10" v-for="(item,index) in form.localParams" :key="index" class="mt-10">
          <el-col :span="6">
            <el-form-item label="" :key="item.key" :prop="'localParams.' + index + '.prop'" :rules="{required: true, message: 'prop(必填)', trigger: ['blur','change']}">
              <el-input v-model="item.prop" placeholder="prop(必填)"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-select v-model="item.direct" disabled placeholder="请选择">
              <el-option v-for="item in directList" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="item.type" disabled placeholder="请选择">
              <el-option v-for="item in typeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="item.value" placeholder="value(选填)"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelParameters(item,index)"></el-button>
          </el-col>
        </el-row>
      </template>
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
    nodeData: Object
  },
  mixins: [comMixins],
  data () {
    return {
      // ^http:\/\/[a-zA-Z0-9\-\.]+(\.[a-zA-Z]{2,4})(:[0-9]+)?(\/.*)?$
      // ^https:\/\/[a-zA-Z0-9\-\.]+(\.[a-zA-Z]{2,4})(:[0-9]+)?(\/.*)?$
      // /\bhttps?:\/\/\S+/
      // /^(?:(http|https):\/\/)[a-zA-Z0-9\-\.]+(\.[a-zA-Z]{2,4})(:[0-9]+)?(\/.*)?$/
      form: {},
      rules: {
        name: [{ required: true, message: '请输入名称(必填)', trigger: ['blur', 'change'] }],
        taskPriority: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        workerGroup: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        url: [
          { required: true, message: '请填写请求地址(必填)', trigger: ['blur', 'change'] },
          {
            pattern: /\bhttps?:\/\/\S+/,
            message: '请求地址需包含http或者https',
            trigger: ['blur', 'change']
          }
        ],
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
        httpMethod: 'GET',
        httpCheckCondition: 'STATUS_CODE_DEFAULT',
        connectTimeout: 60000,
        socketTimeout: 60000,
        localParams: [],
        httpParams: [],
        ...this.configData
      }
    },
    // 请求参数
    handleAddHttpParams () {
      const data = { prop: '', httpParametersType: 'PARAMETER', value: '', key: Date.now() }
      this.form.httpParams.push(data)
    },
    delHttp (item, index) {
      this.form.httpParams.splice(index, 1)
    }
  }
}
</script>
