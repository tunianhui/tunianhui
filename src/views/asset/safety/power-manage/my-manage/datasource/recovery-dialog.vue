<template>
  <el-dialog
    :title="`数据源权限回收：${user}`"
    :visible.sync="dialogVisible"
    @close="close"
    width="45%"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules">
      <el-form-item label="回收用户：" :label-width="formLabelWidth" prop="name">
        <el-select v-model="form.name" placeholder="搜索用户">
          <el-option
            v-for="item in userList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限类型：" prop="powerType" :label-width="formLabelWidth">
        <el-checkbox-group v-model="form.powerType">
          <el-checkbox label="同步读"></el-checkbox>
          <el-checkbox label="同步写"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="回收原因：" :label-width="formLabelWidth" prop="reason">
        <el-input type="textarea" v-model="form.reason" maxlength="128" show-word-limit placeholder="回收原因"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'RecoveryDialogDatasource',
  props: {
    user: String
  },
  data() {
    return {
      form: {
        name: '',
        powerType: [],
        reason: ''
      },
      dialogVisible: true,
      formLabelWidth: '100px',
      rules: {
        name: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        powerType: [
          { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请填写回收原因', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    close() {
      this.$emit('recoveryClose')
    }
  }
}
</script>
