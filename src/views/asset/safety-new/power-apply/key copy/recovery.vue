<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-05-24 14:30:36
 * @LastEditTime: 2023-05-25 09:28:39
 * @Description:
-->
<template>
  <el-dialog :title="`续期密钥权限：${info.secretKeyName}`" :visible.sync="dialogVisible" @close="close" width="45%" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="100px">
      <el-form-item label="权限类型" prop="permissionType">
        <el-checkbox-group v-model="form.permissionType">
          <el-checkbox label="1">查看密钥值</el-checkbox>
          <el-checkbox label="2">数据集成加密</el-checkbox>
          <el-checkbox label="3">数据集成解密</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="有效期至" prop="validUntilType">
        <div class="flex">
          <div>
            <el-select v-model="form.day" placeholder="请选择" class="days-select">
              <el-option v-for="item in daysList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div>
            <el-date-picker v-model="form.time" type="date" placeholder="选择日期" class="time-select">
            </el-date-picker>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="续期原因" prop="recycleReason">
        <el-input type="textarea" v-model="form.recycleReason" maxlength="128" show-word-limit placeholder="请填写续期原因，包含使用场景，使用频率等信息"></el-input>
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
  name: 'Recovery',
  props: {
    info: Object
  },
  data () {
    return {
      form: {
        account: '',
        permissionType: [],
        recycleReason: ''
      },
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
      userList: [
        {
          value: '1',
          label: '用户一'
        },
        {
          value: '2',
          label: '用户二'
        }
      ],
      daysList: [
        {
          label: '30天',
          value: '1'
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    close () {
      this.$emit('recoveryClose')
    }
  }
}
</script>
