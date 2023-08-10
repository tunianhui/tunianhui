<template>
  <el-dialog :title="`${title}：${user}`" :visible.sync="dialogVisible" @close="close" width="50%" class="empower-dialog-datasource" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules">
      <el-form-item v-if="activeName == '1' || activeName == '3'" label="账号类型：" label-width="100px" prop="powerType">
        <el-radio v-model="form.accountType" label="个人账号"></el-radio>
      </el-form-item>
      <el-form-item v-if="activeName == '1' || activeName == '3'" label="权限账号：" label-width="100px" prop="powerType">
        <el-select v-model="form.accessAccount" :placeholder="`请选择${optType == 1 ? '授权' : '回收'}的账号`" class="user-select">
          <el-option v-for="item in accountList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="activeName == '2' || activeName == '4'" label="权限账号：" label-width="100px" prop="powerType">
        <el-radio v-model="form.powerAccount" label="应用"></el-radio>
      </el-form-item>
      <el-form-item v-if="activeName == '2' || activeName == '4'" label="应用：" label-width="100px" prop="powerType">
        <el-select v-model="form.project" class="user-select">
          <el-option v-for="item in projectList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="form.group" placeholder="请选择应用分组" class="user-select">
          <el-option v-for="item in groupList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="form.application" placeholder="请选择应用" class="user-select">
          <el-option v-for="item in applicationList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="optType == 1" label="有效期：" label-width="100px" prop="powerType">
        <el-select v-model="form.day" placeholder="请选择" class="days-select">
          <el-option v-for="item in daysList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-date-picker v-model="form.time" type="date" placeholder="选择日期" class="time-select">
        </el-date-picker>
      </el-form-item>
      <el-form-item v-if="optType == 1" label="权限类型：" label-width="100px" prop="powerType">
        <div v-if="activeName === '1'">
          <el-radio v-model="form.powerType" label="使用权限"></el-radio>
        </div>
        <div v-else-if="activeName === '3'">
          <el-radio-group v-model="form.powerType">
            <el-radio label="使用权限"></el-radio>
            <el-radio label="开发权限"></el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item :label="`${optType == 1 ? '授权' : '回收'}原因：`" label-width="100px" prop="reason">
        <el-input type="textarea" v-model="form.reason" :placeholder="`请填写${optType == 1 ? '授权' : '回收'}原因`" maxlength="128" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EmpowerDialogDatasource',
  props: {
    user: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    activeName: {
      type: String,
      default: '1'
    },
    optType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogVisible: true,
      form: {
        accountType: '个人账号',
        powerAccount: '应用',
        accessAccount: '',
        project: '',
        group: '',
        application: '',
        day: '1',
        time: '',
        powerType: '使用权限',
        reason: ''
      },
      rules: {
        powerType: [
          { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
        ],
        reason: [
          { required: true, message: '请填写授权原因', trigger: 'blur' }
        ]
      },
      userList: [],
      daysList: [
        {
          label: '30天',
          value: '1'
        }
      ],
      accountList: [],
      projectList: [],
      groupList: [],
      applicationList: []
    }
  },
  mounted () {
  },
  methods: {
    close () {
      this.$emit('empowerClose')
    }
  }
}
</script>

<style lang="scss">
.empower-dialog-datasource {
  .el-dialog__body {
    padding: 30px 60px;
    .el-form-item {
      label {
        text-align: start;
      }
      .el-select {
        width: 180px;
        margin-right: 20px;
      }
    }
  }
}
</style>
