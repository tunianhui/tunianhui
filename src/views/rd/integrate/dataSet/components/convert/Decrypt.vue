<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-06-29 16:49:56
 * @LastEditTime: 2023-07-19 10:23:19
 * @Description:
-->

<template>
  <div class="comp-option-single">
    <el-form ref="form" label-width="110px" :model="form" :rules="rules" label-suffix="：">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="form.name" placeholder="" :maxlength="64"></el-input>
      </el-form-item>
      <el-form-item label="选择字段" prop="selectColumn">
        <el-select v-model="form.selectColumn" placeholder="请选择">
          <el-option v-for="(item, index) in form.inputColumn" :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="解密算法" prop="encryptionAlgorithm">
        <el-select v-model="form.encryptionAlgorithm" placeholder="请选择解密算法">
          <el-option v-for="(item, index) in encryptionAlgorithmList" :key="index" :label="item.algorithmName" :value="item.algorithmValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="秘钥" prop="secretKeyId">
        <el-select v-model="form.secretKeyId" placeholder="请选择秘钥">
          <el-option v-for="(item, index) in secretkeylist" :key="index" :label="item.secretKeyName" :value="item.secretKeyId"></el-option>
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
      form: {
      },
      rules: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '只能包含汉字、字母、下划线（_）、数字', trigger: 'blur' }
        ],
        selectColumn: [{ required: true, message: '请选择', trigger: 'change' }],
        encryptionAlgorithm: [{ required: true, message: '请选择', trigger: 'change' }],
        secretKeyId: [{ required: true, message: '请选择', trigger: 'change' }]
      }
    }
  },
  created () {
  },
  methods: {
    configForm () {
      this.form = {
        type: '', // 组件类型
        name: '', // 步骤名称
        encryptionAlgorithm: '',
        selectColumn: '',
        secretKeyId: ''
      }
    }
  }
}
</script>
