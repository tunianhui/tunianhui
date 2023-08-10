<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-12 15:46:59
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-12 16:36:49
 * @FilePath: \数据智能构建\src\views\asset\standard-new\dataStandard\standardSet\attr.vue
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="650px"
    custom-class="form-standard-set-attr"
    top="10vh"
  >
    <el-form :model="form" ref="form" :label-width="formLabelWidth" :rules="rules">
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入属性名称"></el-input>
      </el-form-item>
      <el-form-item label="属性编码" prop="code">
        <el-input v-model="form.code" autocomplete="off" placeholder="请输入属性编码"></el-input>
      </el-form-item>
      <el-form-item label="属性类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择属性类型">
          <el-option label="类型1" value="1"></el-option>
          <el-option label="类型2" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否必填" prop="required">
        <el-radio-group v-model="form.required">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="属性字段类型" prop="attrType">
            <el-select v-model="form.attrType" placeholder="请选择属性字段类型">
              <el-option label="类型1" value="1"></el-option>
              <el-option label="类型2" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="属性值长度" prop="length">
            <el-input v-model="form.length" autocomplete="off" placeholder="请输入属性值长度"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" prop="desc">
        <el-input type="textarea" rows="4" v-model="form.desc" placeholder="请输入标准集描述"></el-input>
      </el-form-item>
      <el-form-item label="属性字段取值" prop="valueType">
        <el-radio-group v-model="form.valueType">
          <el-radio label="1">自定义输入</el-radio>
          <el-radio label="2">枚举值(单选)</el-radio>
          <el-radio label="3">枚举值(多选)</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="bounds" v-if="form.valueType === '2' || form.valueType === '3'">
        <div class="label">取值约束</div>
        <div class="wrapper">
          <div class="wrapper-left">
            <el-form-item label="" prop="bounds" label-width="0">
              <el-radio-group v-model="form.bounds">
                <el-row>
                  <el-col :span="24" class="mb-5 bounds-col">
                    <el-radio label="1">输入枚举值</el-radio>
                  </el-col>
                  <el-col :span="24" class="mb-5 bounds-col">
                    <el-radio label="2">引用码表</el-radio>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="wrapper-right">
             <el-row>
              <el-col :span="24" class="mb-5">
                <el-form-item label="" prop="enum" label-width="0" class="not-bottom-margin">
                  <el-input v-model="form.enum" autocomplete="off" placeholder="请输入枚举值" :disabled="form.bounds !== '1'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="mb-5">
                <el-form-item label="" prop="codeTable" label-width="0" class="not-bottom-margin">
                  <el-select v-model="form.attrType" placeholder="请选择码表" :disabled="form.bounds !== '2'">
                    <el-option label="码表1" value="1"></el-option>
                    <el-option label="码表2" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <el-form-item label="默认值" prop="defaultValue">
        <el-input v-model="form.defaultValue" autocomplete="off" placeholder="请输入默认值"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'StandardSetAttr',
  props: {
    title: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      dialogFormVisible: true,
      form: {
        name: '',
        code: '',
        type: '',
        required: '',
        attrType: '',
        length: '',
        desc: '',
        valueType: '1',
        defaultValue: '',
        bounds: '1',
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择属性类型', trigger: 'change' }
        ],
        required: [
          { required: true, message: '请选择是否必填', trigger: 'change' }
        ],
        attrType: [
          { required: true, message: '请选择属性字段类型', trigger: 'change' }
        ],
        length: [
          { required: true, message: '请输入属性值长度', trigger: 'blur' }
        ],
        valueType: [
          { required: true, message: '请选择属性字段取值', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      this.$emit('save')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .form-standard-set-attr {
  .bounds {
    display: flex;
    .label {
      width: 120px;
      text-align: end;
      padding-right: 10px;
      margin-top: 5px;
    }
    .wrapper {
      width: 0;
      flex: 1;
      display: flex;
      &-left {
        width: 110px;
      }
      &-right {
        flex: 1;
        width: 0;
      }
    }
  }
  .el-form-item {
    margin-bottom: 12px;
  }
  .not-bottom-margin {
    margin-bottom: 0;
    height: 30px;
    line-height: 30px;
  }
  .bounds-col {
    height: 30px;
    line-height: 38px;
  }
  .el-dialog__body {
    max-height: 500px;
    overflow-y: auto;
  }
}

</style>