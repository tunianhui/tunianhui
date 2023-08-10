<!--
 * @Author: cxm
 * @LastEditors: 大炸鹅
 * @Date: 2021-06-18 09:08:36
 * @LastEditTime: 2023-07-11 10:10:13
 * @Description:
-->
<template>
  <SimpleEditDialog
    title="告警信息编辑"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    width="530px"
    top="25vh"
    class="add-rule-dialog"
    confirmText="确定"
  >
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="告警接收人" prop="receive_person">
        <el-select v-model="ruleForm.receive_person" placeholder="请选择最多5个告警接收人" clearable multiple style="width:calc(100% - 10px)">
          <el-option :label="item.receive_person" :value="item.receive_person" v-for="item in alarmPersonList" :key="item.receive_person"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="告警方式" prop="alarm_type">
        <el-checkbox-group v-model="ruleForm.alarm_type">
          <el-checkbox v-for="item in alarmModeList" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
import {
  editAlarmInstance,
  queryAlarmPersonList
} from '@/api/asset/quality/tableRules'
export default {
  name: 'AlarmEdit',
  props: {
    visible: Boolean,
    baseId: String,
    alarm: Object
  },
  data() {
    var receivePerson = (rule, value, callback) => {
      if (value.length > 5) {
        callback(new Error('最多5个告警接收人'))
      } else {
        callback()
      }
    }
    return {
      isVisible: false,
      ruleForm: {
        base_id: '',
        receive_person: [],
        alarm_type: []
      },
      rules: {
        receive_person: [
          { required: true, message: '必填项', trigger: 'change' },
          { validator: receivePerson, trigger: 'change' }
        ],
        alarm_type: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      alarmPersonList: [],
      alarmModeList: [
        {label: '邮件', value: '0'},
        {label: '短信', value: '1'},
        {label: '微信', value: '2'},
        {label: '电话', value: '3'}
      ]
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.isVisible = val
      }
    },
    baseId: {
      immediate: true,
      handler(val) {
        this.ruleForm.base_id = val
      }
    },
    alarm: {
      deep: true,
      immediate: true,
      handler(val) {
        this.ruleForm.receive_person = val.receive_person.split(',')
        const arr = val.alarm_type.split(','), alarmType = []
        arr.forEach(label => {
          const item = this.alarmModeList.find(item => item.label === label)
          if (item) {
            alarmType.push(item.value)
          }
        })
        this.ruleForm.alarm_type = alarmType
      }
    }
  },
  created() {
    this._queryAlarmPersonList()
  },
  methods: {
    confirm() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this._editAlarmInstance()
        }
      })
    },
    async _editAlarmInstance() {
      let params = {
        base_id: this.ruleForm.base_id,
        receive_person: JSON.stringify(this.ruleForm.receive_person),
        alarm_type: JSON.stringify(this.ruleForm.alarm_type)
      }
      const res = await this.$simpleAsyncTo(editAlarmInstance(params), '获取失败')
      if (res) {
        this.$emit('refresh')
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }
    },
    async _queryAlarmPersonList() {
      const res = await this.$simpleAsyncTo(queryAlarmPersonList(), '获取失败')
      if (res) {
        this.alarmPersonList = res.data
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.alarm-setting {
  padding: 16px 20px;
  background-color: #f8f8f8;
  .alarm-setting-header {
    margin-bottom: 5px;
  }
  .basic-info {
    display: flex;
    .info-item {
      font-size: 12px;
      .basic-label {
        color: rgba($color: #000000, $alpha: 0.5);
      }
      .basic-value {
        color: rgba($color: #000000, $alpha: 0.8);
        width: 160px;
      }
    }
  }
}
</style>
