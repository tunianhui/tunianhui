<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:41:47
 * @LastEditTime: 2023-05-14 17:32:34
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="140px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <!-- 基本参数 -->
          <el-form-item label="程序类型" prop="programType">
            <el-select v-model="form.programType" placeholder="请选择">
              <el-option v-for="item in programTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主函数的Class" prop="mainClass">
            <el-input v-model="form.mainClass" placeholder="请填写主函数的Class"></el-input>
          </el-form-item>
          <el-form-item label="主程序包" prop="mainJarName">
            <el-select v-model="form.mainJarName" placeholder="请选择主程序包" ref="mainJar">
              <el-option :label="form.mainJarName" :value="form.mainJarName" style="max-height:auto;background-color:#fff;padding: 0;font-weight:400">
                <el-tree :data="mainJarList" :props="{label:'fullName'}" accordion :highlight-current="true" @node-click="handleNodeClick" :expand-on-click-node="false">
                </el-tree>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部署方式" prop="deployMode">
            <el-radio-group v-model="form.deployMode">
              <el-radio v-if="form.flinkVersion === '<1.10'" label="cluster">cluster</el-radio>
              <template v-if="form.flinkVersion !== '<1.10'">
                <el-radio label="per-job/cluster">per-job/cluster</el-radio>
                <el-radio label="application">application</el-radio>
              </template>
              <el-radio label="local">local</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="form.deployMode !== 'local' ">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Flink版本" prop="flinkVersion">
                  <el-select v-model="form.flinkVersion" placeholder="请选择">
                    <el-option v-for="item in flinkVersionList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="任务名称" prop="appName">
              <el-input v-model="form.appName" placeholder="请输入任务名称(选填)"></el-input>
            </el-form-item>
          </template>
        </el-collapse-item>
        <el-collapse-item title="运行参数" name="2">
          <!-- 运行参数 -->
          <template v-if="form.deployMode !== 'local' ">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="JobManager内存数" prop="jobManagerMemory">
                  <el-input v-model="form.jobManagerMemory" placeholder="JobManager内存数"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="TaskManager内存数" prop="taskManagerMemory">
                  <el-input v-model="form.taskManagerMemory" placeholder="请输入taskManagerMemory内存数"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="TaskManager数量" prop="taskManager" v-if="form.flinkVersion === '<1.10'">
              <el-input-number v-model="form.taskManager" :min="1" :max="10000" placeholder="请输入TaskManager数量"></el-input-number>
            </el-form-item>
            <el-form-item label="slot" prop="slot">
              <el-input-number v-model="form.slot" :min="1" :max="10000"></el-input-number>
            </el-form-item>
          </template>

          <el-form-item label="并行度" prop="parallelism">
            <el-input-number v-model="form.parallelism" :min="1" :max="10000"></el-input-number>
          </el-form-item>
          <el-form-item label="主程序参数" prop="mainArgs">
            <el-input type="textarea" :rows="2" v-model="form.mainArgs" placeholder="请输入主程序参数"></el-input>
          </el-form-item>
          <el-form-item label="选项参数" prop="others">
            <el-input type="textarea" :rows="2" v-model="form.others" placeholder="请输入选项参数"></el-input>
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
        mainClass: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }],
        mainJar: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        parallelism: [{ required: true, message: '请输入', trigger: ['blur', 'change'] }]
      },
      deployModeList: [
        ['cluster', 'local'],
        ['per-job/cluster', 'application', 'local']
      ]
    }
  },
  created () {
    this.getResourcesData()
    this.getMainJarList()
  },
  watch: {
    'form.flinkVersion': {
      handler (val) {
        this.form.deployMode = val === '<1.10' ? 'cluster' : 'per-job/cluster'
      }
    }
  },
  methods: {
    configForm () {
      this.form = {
        flinkVersion: '<1.10',
        programType: 'SCALA',
        sparkVersion: 'SPARK2',
        deployMode: 'cluster',
        jobManagerMemory: '1G',
        taskManagerMemory: '2G',
        slot: 1,
        taskManager: 2,
        parallelism: 1,
        localParams: [],
        ...this.configData
      }
    }
  }
}
</script>
