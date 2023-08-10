<template>
  <el-dialog :title="info.length > 1 ? '批量密钥授权' : `密钥授权：${info[0].secretKeyName}` " :visible.sync="dialogVisible" @close="close" width="45%" class="empower-dialog-datasource" :close-on-click-modal="false" label-width="100px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="权限类型" prop="permissionType">
        <el-checkbox-group v-model="form.permissionType">
          <el-checkbox v-for="item in permissionTypeList" :key="item.value" :label="item.value">{{ item.name }}</el-checkbox>
          <!-- <el-checkbox label="secret_watch">查看密钥值</el-checkbox>
          <el-checkbox label="integration_encryption">数据集成加密</el-checkbox>
          <el-checkbox label="integration_decryption">数据集成解密</el-checkbox> -->
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="账号类型" class="user" prop="account">
        <template>
          <el-row class="mb-10">
            <el-col :span="10">
              <div class="flex">
                <div class="font-12 label-width">个人账号</div>
                <div>
                  <el-select v-model="form.account" filterable placeholder="请搜索用户" class="user-select">
                    <el-option v-for="item in userList" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
            <el-col :span="14">
              <div class="flex ">
                <div class="font-12 label-width flex-item">有效期至</div>
                <div>
                  <el-form-item prop="day">
                    <el-select v-model="form.day" placeholder="请选择有效期" class="days-select" @change="selectTime">
                      <el-option v-for="item in daysList" :key="item.value" :label="item.name" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item prop="time">
                    <el-date-picker v-model="form.time" type="date" placeholder="选择日期" class="time-select" :disabled="customData !== 'custom'">
                    </el-date-picker>
                    <!-- <el-date-picker
                         v-model="form.time"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd">
                      </el-date-picker> -->
                  </el-form-item>
                </div>
              </div>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="10">
              <div class="flex">
                <div class="font-12 label-width">生产账号</div>
                <div>
                  <el-select v-model="form.name" filterable placeholder="搜索项目" class="user-select">
                    <el-option v-for="item in userList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-col>
          </el-row> -->
        </template>
      </el-form-item>
      <el-form-item label="授权原因" prop="authReason">
        <el-input type="textarea" v-model="form.authReason" placeholder="请填写授权原因，包含使用场景，使用频率等信息" maxlength="128" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRelationUsers, getValidUntilData, permissionAuth, getPermissionTypeData } from '@/api/asset/security.js'
import { dateFormat } from '@/libs/util.js'
export default {
  name: 'Empower',
  props: {
    // info: Object
    info: Array
  },
  data () {
    return {
      dialogVisible: true,
      form: {
        day: '',
        time: '',
        permissionType: [],
        authReason: ''
      },
      permissionTypeList: [],
      rules: {
        accountType: [
          { type: 'array', required: true, message: '请至少选择一个账号类型', trigger: 'change' }
        ],
        account: [
          { required: true, message: '请选择个人账号', trigger: 'change' }
        ],
        permissionType: [
          { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
        ],
        authReason: [
          { required: true, message: '请填写授权原因', trigger: 'blur' }
        ],
        day: [
          { required: true, message: '请选择个人账号有效期', trigger: 'change' }
        ]
      },
      userList: [],
      daysList: [],
      customData: ''
    }
  },
  mounted () {
    this.getRelationUsers()
    this.getValidUntilData()
    this.getPermissionTypeData()
  },
  methods: {
    selectTime () {
      this.customData = this.form.day.split('d')[0]
      const start = new Date()
      this.form.time = start.setTime(start.getTime() + 3600 * 1000 * 24 * this.customData)
    },
    submit () {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.permissionAuth()
          this.$emit('empowerFun')
          this.close()
        }
      })
    },

    close () {
      this.$emit('empowerClose')
    },
    async permissionAuth () {
      let time = ''
      if (this.customData !== 'all') {
        time = dateFormat(new Date(this.form.time))
      } else {
        time = 'all'
      }
      const secretKeyId = this.info.map(item => item.secretKeyId)
      const param = {
        secretKeyId: secretKeyId + '',
        account: this.form.account,
        permissionSource: 1,
        authReason: this.form.authReason,
        personValidUntilType: this.form.day,
        personValidUntil: time,
        permissionType: this.form.permissionType + '',
        persionAccountEnable: 1,
        produceAccountEnable: 0,
        produceValidUntilType: '',
        produceValidUntil: ''
      }
      const res = await permissionAuth(param)
      if (res) {
        this.$message({
          type: 'success',
          message: '授权成功'
        })
      }
    },
    async getRelationUsers () {
      const res = await getRelationUsers()
      if (res) {
        this.userList = res.data
      }
    },
    async getValidUntilData () {
      const res = await getValidUntilData()
      if (res) {
        this.daysList = res.data
      }
    },
    async getPermissionTypeData () {
      const res = await getPermissionTypeData()
      if (res) {
        this.permissionTypeList = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.empower-dialog-datasource {
  min-width: 592px;
  .user {
    label {
      width: 100px;
      text-align: start;
      // display: contents;
      span {
        display: inline-block;
        vertical-align: middle;
        margin-right: 5px;
        color: red;
      }
    }
    .days-select {
      // width: 90px;
      min-width: 90px;
      margin-right: 5px;
    }
    .time-select {
      // width: 130px;
      width: 100%;
      min-width: 130px;
      margin: 0;
    }
    .label-width {
      width: 90px;
      min-width: 50px;
      text-align: center;
    }
    .flex-item {
      margin-top: -20px;
    }
  }
  .el-form-item {
    label {
      text-align: start;
    }
  }
  .mb-10 {
    .flex {
    }
  }
}
</style>
