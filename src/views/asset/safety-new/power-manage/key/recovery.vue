<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-05-24 14:30:36
 * @LastEditTime: 2023-05-24 18:44:41
 * @Description:
-->
<template>
  <el-dialog :title="info.length > 1 ? '批量密钥权限回收' : `密钥权限回收：${info[0].secretKeyName}`" :visible.sync="dialogVisible" @close="close" width="45%" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="账号" v-if="info[0].typeDialog === 'details' && info.length === 1">
        <div>个人账号{{info[0].account}}()</div>
      </el-form-item>
      <el-form-item v-if="info[0].typeDialog !== 'details'" label="回收用户" prop="account">
        <el-select v-model="form.account" filterable placeholder="请搜索用户">
          <el-option v-for="item in userList" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限类型" prop="permissionType">
        <el-checkbox-group v-model="form.permissionType">
          <el-checkbox v-for="item in permissionTypeList" :key="item.value" :label="item.value" :disabled="info[0].typeDialog === 'details'">{{ item.name }}</el-checkbox>
          <!-- <el-checkbox label="1">查看密钥值</el-checkbox>
          <el-checkbox label="2">数据集成加密</el-checkbox>
          <el-checkbox label="3">数据集成解密</el-checkbox> -->
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="回收原因" prop="recycleReason">
        <el-input type="textarea" v-model="form.recycleReason" maxlength="128" show-word-limit placeholder="请填写回收原因"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="SubmitEvent">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getPermissionTypeData, getRelationUsers, permissionRecycling } from '@/api/asset/security.js'
export default {
  name: 'Recovery',
  props: {
    // info: Object
    info: Array,
  },
  data () {
    return {
      form: {
        account: '',
        permissionType: [],
        recycleReason: ''
      },
      permissionTypeList: [],
      dialogVisible: true,
      rules: {
        account: [
          { required: true, message: '请选择用户', trigger: 'blur' }
        ],
        permissionType: [
          { type: 'array', required: true, message: '请至少选择一个权限类型', trigger: 'change' }
        ],
        recycleReason: [
          { required: true, message: '请填写回收原因', trigger: 'blur' }
        ]
      },
      userList: []
    }
  },
  watch: {
    info: {
      immediate: true,
      handler(val) {
        if (val[0].typeDialog === 'details') {
          // permissionType
          this.form.permissionType = val[0].permissionType.split(',')
          // this.form.permissionType = ['secret_watch ', 'integration_encryption', 'integration_decryption']
        }
      }
    }
  },
  mounted () {
    this.getRelationUsers()
    this.getPermissionTypeData()
  },
  methods: {
    close () {
      this.$emit('recoveryClose')
    },
    SubmitEvent() {
      this.$refs['formRef'].validate(valid => {
        if (valid) {
          this.permissionRecycling()
          this.$emit('recoverFun')
        }
      })
    },
    async permissionRecycling() {
      const secretKeyId = this.info.map(item => item.secretKeyId)
      const account = this.info.map(item => item.account)
      const param = {
        secretKeyId: secretKeyId + '',
        permissionType: this.form.permissionType + '',
        account: this.info[0].typeDialog === 'details' ? account + '' : this.form.account,
        recycleReason: this.form.recycleReason,
        invalidityReason: '回收'
      }
      const res = await permissionRecycling(param)
      if (res) {
        this.close()
      }
    },
    async getRelationUsers() {
      const res = await getRelationUsers() 
      if (res) {
        this.userList = res.data
      }
    },
    async getPermissionTypeData() {
      const res = await getPermissionTypeData()
      if (res) {
        this.permissionTypeList = res.data
      }
    }
  }
}
</script>
