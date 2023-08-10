<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-08-01 14:43:30
 * @LastEditTime: 2023-08-07 09:14:57
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="160px" class="form-content">
      <el-collapse v-model="activeNames">
        <!-- <el-collapse-item title="基本参数" name="1">
          <el-form-item label="程序类型" prop="programType">
            <el-select v-model="form.programType" placeholder="请选择">
              <el-option v-for="item in programTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主函数的Class" prop="mainClass">
            <el-input v-model="form.mainClass" placeholder="请填写主函数的Class"></el-input>
          </el-form-item>
          <el-form-item label="主程序包" prop="mainJar">
            <el-select v-model="form.mainJarName" placeholder="请选择主程序包" ref="mainJar">
              <el-option :label="form.mainJarName" :value="form.mainJarName" style="max-height:auto;background-color:#fff;padding: 0;font-weight:400">
                <el-tree :data="mainJarList" :props="{label:'fullName'}" accordion :highlight-current="true" @node-click="handleNodeClick" :expand-on-click-node="false">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部署方式" prop="deployMode">
            <el-radio-group v-model="form.deployMode">
              <el-radio label="cluster">cluster</el-radio>
              <el-radio label="client">client</el-radio>
              <el-radio label="local">local</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="任务名称" prop="appName">
            <el-input v-model="form.appName" placeholder="请输入任务名称"></el-input>
          </el-form-item>
          <el-form-item label="Spark版本" prop="sparkVersion">
            <el-select v-model="form.sparkVersion" placeholder="请选择">
              <el-option v-for="item in sparkVersionList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item> -->
        <el-collapse-item title="运行参数" name="1">
          <!-- 运行参数 -->
          <template v-if="taskType === '5'">
            <!-- SPARK过程任务 -->
            <el-form-item label="ExecutorCores" prop="executorCores">
              <el-input-number v-model="form.executorCores" :min="1" :max="10000"></el-input-number>
            </el-form-item>
            <el-form-item label="NumExecutors" prop="numExecutors">
              <el-input-number v-model="form.numExecutors" :min="1" :max="10000"></el-input-number>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="ExecutorMemory" prop="executorMemory">
                  <el-input v-model="form.executorMemory" placeholder="请输入Executor内存数"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="DriverMemory" prop="driverMemory">
                  <el-input v-model="form.driverMemory" placeholder="请输入Driver内存数"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="YarnQueue" prop="yarnqueue">
              <el-input v-model="form.yarnqueue" placeholder=""></el-input>
            </el-form-item>
          </template>
          <template v-if="taskType === '3' || taskType === '4'">
            <!-- 离线同步和实时同步 -->
            <el-form-item label="TaskManagerCount" prop="yarntaskManagerNum">
              <el-input v-model="form.yarntaskManagerNum" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="TaskManagerMemory" prop="yarntaskManager">
              <el-input v-model="form.yarntaskManager" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="JobManagerMemory" prop="yarnjobManager">
              <el-input v-model="form.yarnjobManager" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="TaskManagerSlots" prop="yarnslots">
              <el-input v-model="form.yarnslots" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="Parallelism" prop="parallelism">
              <el-input v-model="form.parallelism" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="YarnQueue" prop="yarnqueue">
              <el-input v-model="form.yarnqueue" placeholder=""></el-input>
            </el-form-item>
          </template>
        </el-collapse-item>
        <el-collapse-item title="自定义参数" name="2">
          <!-- 自定义参数 -->
          <template v-if="form.runParams && form.runParams.length">
            <el-row :gutter="10" v-for="(item,index) in form.runParams" :key="index">
              <el-col :span="7">
                <el-form-item label="" label-width='0px' :key="item.key" :prop="'runParams.' + index + '.paramName'" :rules="{required: true, message: 'paramName(必填)', trigger: ['blur','change']}">
                  <el-input v-model="item.paramName" placeholder="paramName(必填)"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-input v-model="item.paramValue" placeholder="paramValue(选填)"></el-input>
              </el-col>
              <el-col :span="7">
                <el-select v-model="item.paramType" placeholder="请选择">
                  <el-option v-for="item in typeList" :key="item.name" :label="item.name" :value="item.name"></el-option>
                </el-select>
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
  mixins: [comMixins],
  data () {
    return {
      form: {},
      rules: {
        name: [{ required: true, message: '请输入名称(必填)', trigger: ['blur', 'change'] }],
        taskPriority: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        workerGroup: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        mainClass: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        mainJar: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        driverMemory: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        numExecutors: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        executorMemory: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        executorCores: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        yarnjobManager: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        yarntaskManager: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        yarntaskManagerNum: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        yarnslots: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        parallelism: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        yarnqueue: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        taskManagerCount: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        taskManagerMemory: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        jobManagerMemory: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        taskManagerSlots: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
      },

      typeList: [
        { name: 'STRING' },
        { name: 'SHELL' }
      ],
      // 离线任务 & 同步任务
      taskType: '3'
    }
  },
  created () {
    this.getResourcesData()
    this.getMainJarList()
  },
  mounted () {
  },
  methods: {
    configForm () {
      this.form = {
        // programType: '',
        // sparkVersion: 'SPARK2',
        // deployMode: 'local',
        taskManagerCount: 2,
        taskManagerMemory: '1024MB',
        jobManagerMemory: '1024MB',
        taskManagerSlots: 2,
        numExecutors: 2,
        executorCores: 2,
        driverMemory: '512MB',
        executorMemory: '2G',
        yarnjobManager: '1024MB',
        yarntaskManager: '1024MB',
        yarntaskManagerNum: 10,
        yarnslots: 3,
        parallelism: 3,
        yarnqueue: 'default',
        runParams: [],
        ...this.configData
      }
    },

    // 添加自定义参数
    handleAddParameters () {
      const data = { paramName: '', paramValue: '', paramType: 'STRING', key: Date.now() }
      this.form.runParams.push(data)
    },

    // 删除自定义参数
    handleDelParameters (item, index) {
      this.form.runParams.splice(index, 1)
    }
  }
}
</script>
