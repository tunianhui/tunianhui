<template>
  <el-dialog :title="`功能权限归属${title}`" :visible.sync="dialogVisible" @close="close" :close-on-click-modal="false" width="400px" class="fun-setting">
    <el-form :model="form" :rules="rules">
      <template>
        <div class="mb-10">权限信息</div>
        <div class="function-info mb-10">
          <div>
            <span class="fun-title">权限名称：</span>
            <span class="font-12">资产全景</span>
          </div>
          <div>
            <span class="fun-title">权限ID：</span>
            <span class="font-12">sdjxsw</span>
          </div>
        </div>
      </template>
      <el-form-item label="审批用户：" :label-width="labelWidth" prop="user" v-if="type==='belong'">
        <el-select v-model="form.user" placeholder="搜索用户">
          <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="最长授权：" :label-width="labelWidth" prop="time" v-if="type==='belong'">
        <el-select v-model="form.time" placeholder=" " style="width：50%">
          <el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="转交：" :label-width="labelWidth" prop="deliver" v-if="type==='deliver'">
        <el-select v-model="form.deliver" placeholder=" " style="width：50%">
          <el-option v-for="item in deliverUserList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submtHandle">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'FunctionSettingDialog',
  props: {
    data: {
      type: Object
    },
    type: String
  },
  data () {
    return {
      dialogVisible: true,
      labelWidth: '100px',
      title: '',
      form: {
        user: '',
        time: '',
        deliver: ''
      },
      rules: {
        user: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择授权期限', trigger: 'blur' }
        ],
        deliver: [
          { required: true, message: '请选择转交用户', trigger: 'blur' }
        ]
      },
      userList: [],
      timeList: [],
      deliverUserList: []
    }
  },
  watch: {
    type: {
      immediate: true,
      handler (val) {
        if (val !== 'belong') {
          this.title = '转交'
        }
      }
    }
  },
  methods: {
    submtHandle () {
      this.close()
    },
    close () {
      this.$emit('funSettingDialogHandle')
    }
  }
}
</script>

<style lang="scss">
.fun-setting {
  .function-info {
    padding: 10px 0;
    background-color: $grey8;
    .fun-title {
      display: inline-block;
      width: 100px;
      text-align: end;
      margin-bottom: 10px;
    }
  }
}

</style>
