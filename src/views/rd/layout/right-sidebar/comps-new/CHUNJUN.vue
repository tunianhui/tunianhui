<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:59
 * @LastEditTime: 2023-05-14 15:24:19
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="140px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-form-item label="部署方式" prop="deployMode">
            <el-radio-group v-model="form.deployMode">
              <el-radio label="local">local</el-radio>
              <el-radio label="standlone">standlone</el-radio>
              <el-radio label="yarn-session">yarn-session</el-radio>
              <el-radio label="yarn-per-job">yarn-per-job</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选项参数" prop="others">
            <el-input type="textarea" :rows="2" v-model="form.others" placeholder="请输入选项参数"></el-input>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="自定义参数" name="2">
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
      type: 'CHUNJUN',
      form: {},
      rules: {
        name: [{ required: true, message: '请输入名称(必填)', trigger: ['blur', 'change'] }],
        taskPriority: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        workerGroup: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        json: [{ required: true, message: '语句不能为空', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () { },
  methods: {
    configForm () {
      this.form = {
        deployMode: 'local',
        localParams: [],
        ...this.configData
      }
    }
  }
}
</script>
