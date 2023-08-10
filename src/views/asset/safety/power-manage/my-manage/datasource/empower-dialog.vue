<template>
  <el-dialog
    :title="`授权用户：${user}`"
    :visible.sync="dialogVisible"
    @close="close"
    width="45%"
    class="empower-dialog-datasource"
    :close-on-click-modal="false"
  >
    <el-form :model="form" :rules="rules">
      <el-form-item label=" " class="user">
        <template>
          <div slot="label"><span>*</span>授权用户：</div>
          <el-row class="mb-10">
            <el-col :span="12">
              <span class="mr-10 font-12 label-width">个人账号</span>
              <span>
                <el-select v-model="form.name" placeholder="请选择" class="user-select">
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </span>
            </el-col>
            <el-col :span="12">
              <span class="mr-10 font-12 label-width">有效期至</span>
              <span>
                <el-select v-model="form.day" placeholder="请选择" class="days-select">
                  <el-option
                    v-for="item in daysList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </span>
              <span>
                <el-date-picker
                  v-model="form.time"
                  type="date"
                  placeholder="选择日期" class="time-select">
                </el-date-picker>
              </span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <span class="mr-10 font-12 label-width">生产账号</span>
              <span>
                <el-select v-model="form.name" placeholder="请选择" class="user-select">
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </span>
            </el-col>
          </el-row>
        </template>
      </el-form-item>
      <el-form-item label="权限类型：" label-width="100px" prop="powerType">
        <el-checkbox-group v-model="form.powerType">
          <el-checkbox label="同步读"></el-checkbox>
          <el-checkbox label="同步写"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="授权原因：" label-width="100px" prop="reason">
        <el-input type="textarea" v-model="form.reason" maxlength="128" show-word-limit></el-input>
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
  name: 'EmpowerDialogDatasource',
  props: {
    user: String
  },
  data() {
    return {
      dialogVisible: true,
      form: {
        name: '',
        user: '',
        day: '1',
        time: '',
        powerType: [],
        reason: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
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
      ]
    }
  },
  methods: {
    close() {
      this.$emit('empowerClose')
    }
  }
}
</script>

<style lang="scss">
.empower-dialog-datasource {
  .user {
    label {
      width: 100px;
      text-align: start;
      display: contents;
      span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        color: red;
      }
    }
    .user-select {
      width: calc(100% - 90px);
    }
    .days-select {
      width: 90px;
      margin-right: 5px;
    }
    .time-select {
      width: 130px;
      margin: 0;
    }
    .label-width {
      width: 100px;
    }
  }
  .el-form-item {
    label {
      text-align: start;
    }
  }
}
</style>
