<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:12
 * @LastEditTime: 2023-05-13 17:46:58
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="170px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <el-form-item label="请求地址" prop="url">
            <el-input v-model="form.url" placeholder="请填写请求地址(必填)"></el-input>
          </el-form-item>
          <el-form-item label="请求类型" prop="httpMethod">
            <el-select v-model="form.httpMethod" placeholder="请选择">
              <el-option v-for="item in httpMethodList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="请求参数" name="2">
          <template v-if="form.httpParams && form.httpParams.length">
            <el-row :gutter="10" v-for="(item,index) in form.httpParams" :key="index">
              <el-col :span="7">
                <el-form-item label="" label-width="10px" :key="item.key" :prop="'httpParams.' + index + '.prop'" :rules="{required: true, message: 'prop(必填)', trigger: ['blur','change']}">
                  <el-input v-model="item.prop" placeholder="prop(必填)">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-select v-model="item.httpParametersType" placeholder="请选择">
                  <el-option v-for="item in httpParametersTypeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-col>
              <el-col :span="7">
                <el-input v-model="item.value" placeholder="value(选填)"></el-input>
              </el-col>
              <el-col :span="2">
                <el-button type="text" icon="el-icon-delete" @click="delHttp(item,index)"></el-button>
              </el-col>
            </el-row>
          </template>
          <el-button type="primary" icon="el-icon-plus" @click="handleAddHttpParams">添加参数</el-button>
        </el-collapse-item>
        <el-collapse-item title="校验参数" name="3">
          <el-form-item label="校验条件" prop="httpCheckCondition">
            <el-select v-model="form.httpCheckCondition" placeholder="请选择">
              <el-option v-for="item in httpCheckConditionList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="校验内容" prop="condition">
            <el-input v-model="form.condition" type="textarea" :rows="3" placeholder="请填写校验内容"></el-input>
          </el-form-item>
          <el-form-item label="连接超时（毫秒）" prop="connectTimeout">
            <el-input-number v-model="form.connectTimeout" :min="0" :max="282475248"></el-input-number>
          </el-form-item>
          <el-form-item label="Socket超时（毫秒）" prop="socketTimeout">
            <el-input-number v-model="form.socketTimeout" :min="0" :max="282475248"></el-input-number>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="自定义参数" name="4">
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
        ]
      }
    }
  },
  created () { },
  methods: {
    configForm () {
      this.form = {
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
