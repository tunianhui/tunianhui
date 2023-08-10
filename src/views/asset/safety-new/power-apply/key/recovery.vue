<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-05-24 14:30:36
 * @LastEditTime: 2023-05-25 09:28:39
 * @Description:
-->
<template>
  <el-dialog :title="info.length > 1 ? '批量续期密钥权限' : `续期密钥权限：${info[0].secretKeyName}`" :visible.sync="dialogVisible" @close="close" width="45%" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item v-if="info.length === 1" label="权限类型" prop="permissionType">
        <el-checkbox-group v-model="form.permissionType" :disabled="info.length === 1">
          <el-checkbox v-for="item in permissionTypeList" :key="item.value" :label="item.value">{{ item.name }}</el-checkbox>
          <!-- <el-checkbox label="1">查看密钥值</el-checkbox>
          <el-checkbox label="2">数据集成加密</el-checkbox>
          <el-checkbox label="3">数据集成解密</el-checkbox> -->
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="有效期至" prop="validUntilType">
        <div class="flex">
          <div>
            <el-select v-model="form.day" placeholder="请选择" class="days-select" @change="selectTime">
              <el-option v-for="item in daysList" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div>
            <el-date-picker v-model="form.time" type="date" placeholder="选择日期" class="time-select"  :disabled="customData !== 'custom'">
            </el-date-picker>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="续期原因" prop="renewalReason">
        <el-input type="textarea" v-model="form.renewalReason" maxlength="128" show-word-limit placeholder="请填写续期原因，包含使用场景，使用频率等信息"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="SubmitEvent">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getPermissionTypeData, getValidUntilData, permissionRenewal } from '@/api/asset/security.js'
import {dateFormat} from '@/libs/util.js'
export default {
  name: 'Recovery',
  props: {
    info: Array
  },
  data () {
    return {
      permissionTypeList: [],
      form: {
        account: '',
        permissionType: [],
        renewalReason: '',
        day: '',
        time: ''
      },
      dialogVisible: true,
      rules: {
        account: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        permissionType: [
          { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
        ],
        renewalReason: [
          { required: true, message: '请填写续期原因', trigger: 'blur' }
        ]
      },
      daysList: [],
      customData: '',
    }
  },
  watch: {
    info: {
      immediate: true,
      handler(val) {
        if (val.length === 1) {
          this.form.permissionType.push(val[0].permissionType)
          this.form.day = val[0].validUntilType
          this.form.time = val[0].validUntil
        }
      }
    }
  },
  mounted () {
    this.getPermissionTypeData()
    this.getValidUntilData()
  },
  methods: {
    selectTime() {
      this.customData = this.form.day.split('d')[0]
      const start = new Date()
      this.form.time = start.setTime(start.getTime() + 3600 * 1000 * 24 * this.customData)
    },
    close () {
      this.$emit('recoveryClose')
    },
    SubmitEvent() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.$emit('submitRecovery')
          this.permissionRenewal()
        }
      })
    },
    async getPermissionTypeData() {
      const res = await getPermissionTypeData()
      if (res) {
        this.permissionTypeList = res.data
      }
    },
    async getValidUntilData() {
      const res = await getValidUntilData() 
      if (res) {
        this.daysList = res.data
      }
    },
    async permissionRenewal() {
      const secretAccountId = this.info.map(item => item.secretAccountId)
      let time = ''
      if (this.customData !== 'all') {
          time = dateFormat(new Date(this.form.time)) 
      } else {
          time = 'all'
      }
      const param = {
        secretAccountId: secretAccountId + '',
        validUntilType: this.form.day,
        // validUntil: this.form.time,
        validUntil: time,
        renewalReason: this.form.renewalReason
      }
      const res = await permissionRenewal(param)
      if (res) {
        this.$message({
          type: 'success',
          message: '续期成功'
        })
      }
    }
  }
}
</script>
