<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-06 13:46:26
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-06 14:02:48
 * @FilePath: \数据智能构建\src\views\asset\standard-new\platform-management\attribute\modal.vue
-->
<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="600px"
    custom-class="attribute-modal"
  >
    <el-form :model="form" :label-width="formLabelWidth" :rules="rules">
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入属性名称"></el-input>
      </el-form-item>
      <el-form-item label="属性编码" prop="code">
        <el-input v-model="form.code" autocomplete="off" placeholder="请输入属性编码"></el-input>
      </el-form-item>
      <el-form-item label="属性类型" prop="type">
        <el-select v-model="form.use" placeholder="请选择属性类型">
          <el-option label="类型一" value="1"></el-option>
          <el-option label="类型二" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否必填" prop="required">
        <el-radio-group v-model="form.required">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="属性字段类型" prop="fildAttr">
            <el-select v-model="form.fildAttr" placeholder="请选择属性字段类型">
              <el-option label="类型一" value="1"></el-option>
              <el-option label="类型二" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="属性值长度" prop="fildLength">
            <el-input v-model="form.fildLength" autocomplete="off" placeholder="请输入属性值长度"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" prop="desc">
        <el-input type="textarea" v-model="form.desc" autocomplete="off" placeholder="请输入描述" :rows="5"></el-input>
      </el-form-item>
      <el-form-item label="属性字段取值" prop="fieldValue">
        <el-radio-group v-model="form.fieldValue">
          <el-radio label="1">自定义输入</el-radio>
          <el-radio label="2">枚举值(单选)</el-radio>
          <el-radio label="3">枚举值(多选)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="默认值" prop="defaultValue">
        <el-input v-model="form.defaultValue" autocomplete="off" placeholder="请输入默认值"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'AttributeModal',
  props: {
    title: {
      type: String,
      default: '新增'
    },
  },
  data () {
    return {
      dialogFormVisible: true,
      form: {
        name: '',
        type: '',
        desc: '',
        required: '1',
        fildAttr: '',
        fildLength: '',
        fieldValue: '1',
        defaultValue: '',
      },
      formLabelWidth: '110px',
      rules: {
        name: [
          { required: true, message: '请输入模板名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择使用场景', trigger: 'change' }
        ],
        fildAttr: [
          { required: true, message: '请选择属性字段类型', trigger: 'change' }
        ],
        fildLength: [
          { required: true, message: '请输入属性值长度', trigger: 'blur' }
        ],
        fieldValue: [
          { required: true, message: '请选择属性字段取值', trigger: 'change' }
        ],
      },
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('submit', this.form)
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.attribute-modal {
}
</style>