<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-21 16:59:39
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-23 10:32:42
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\offline-monitoring-config\task-monitoring\recipient.vue
-->
<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="请选择接收对象" :label-width="formLabelWidth" prop="radio" v-if="handType === 'edit'">
        <el-radio-group v-model="form.radio">
          <el-row>
            <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
              <el-radio label="1">责任人</el-radio>
            </el-col>
            <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
              <el-radio label="2">自定义</el-radio>
              <el-select v-model="value" placeholder="请选择" style="width: 220px" v-if="form.radio === '2'">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="24" style="height: 30px;display: flex;align-items: center;">
              <el-radio label="3">值班表</el-radio>
            </el-col>
          </el-row>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="请选择接收人" :label-width="formLabelWidth" prop="value" v-if="handType === 'add'">
        <el-select v-model="form.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择需删除的接收人" :label-width="formLabelWidth" prop="value" v-if="handType === 'del'" multiple>
        <el-select v-model="form.value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <template  v-if="handType === 'replace'">
        <el-row>
          <el-col :span="11">
            <el-form-item label="历史接收人" label-width="100px" prop="historyValue">
              <el-select v-model="form.historyValue" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <span style="width: 100%; height: 30px; display: flex; align-items: center; justify-content: center;">
              替换为
              <i class="el-icon-d-arrow-right ml-5"></i>
            </span>
          </el-col>
          <el-col :span="10">
            <el-form-item label="新接收人" label-width="90px" prop="newValue">
              <el-select v-model="form.newValue" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-form-item label=" " :label-width="formLabelWidth" v-if="handType === 'edit'">
        <span style="font-size:12px;">提示：确认修改后，所有已选监控规则的报警接收人都将更新未当前最新配置，请确认是否修改</span>
      </el-form-item>
      <el-form-item label=" " :label-width="formLabelWidth" v-if="handType === 'add'">
        <span style="font-size:12px;">提示：已选接收人将添加值所有已选监控规则的接收对象列表，每个监控规则最多添加5个接口对象</span>
      </el-form-item>
      <el-form-item label=" " :label-width="formLabelWidth" v-if="handType === 'del'">
        <span style="font-size:12px;">提示：已选接收人将从所有已选监控规则的接收对象列表删除，每个监控规则最至少保留1个监控对象</span>
      </el-form-item>
      <el-form-item label=" " :label-width="formLabelWidth" v-if="handType === 'replace'">
        <span style="font-size:12px;">提示：历史接收人将从所有已选监控规则的接收对象列表删除，新接收人将添加到所有已选监控规则的接收对象列表，每个监控规则最至少保留1个监控对象</span>
      </el-form-item>
    </el-form>
    <el-dialog title="提示" :visible.sync="visible" append-to-body>
      <div class="wraning-icon">
        <i class="el-icon-warning-outline"></i>
        <span>
          <p>删除接收人成功：0条监控规则</p>
          <p>删除接收人失败：2条监控规则</p>
        </span>
      </div>
      <p style="font-size: 12px;rgba(0,0,0,0.65);margin-bottom:20px;margin-top:20px;">删除后，以下监控规则接收人将为空，不符合配置约束，请修改</p>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column prop="date" label="监控项"></el-table-column>
        <el-table-column prop="name" label="报警原因"></el-table-column>
        <el-table-column prop="address" label="当前接收人"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="close">确 定</el-button>
      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="subOItem">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Recipient',
  props: {
    title: String,
    handType: String
  },
  data() {
    return {
      dialogFormVisible: true,
      visible: false,
      form: {
        radio: '1',
        value: '',
        historyValue: '',
        newValue: ''
      },
      formLabelWidth: '170px',
      rules: {
        radio: [
          { required: true, message: '请选择接收对象', trigger: 'change' }
        ],
        value: [
          { required: true, message: '请选择接收人', trigger: 'change' }
        ],
        historyValue: [
          { required: true, message: '请选择历史接收人', trigger: 'change' }
        ],
        newValue: [
          { required: true, message: '请选择新接收人', trigger: 'change' }
        ]
      },
      value: '',
      options: [],
      tableData: []
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    subOItem() {
      this.$refs['form'].validate((valid) => {
        if (!valid) {
          if (this.handType !== 'del') {
            this.$emit('subOItem', this.form)
          } else {
            this.visible = true
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.wraning-icon {
  display: flex;
  > i {
    font-size: 60px;
    color: red;
    margin-right: 20px;
  }
  > span {
    p {
      line-height: 30px;
      color: rgba($color: #000000, $alpha: 0.8);
      font-weight: 600;
      font-size: 12px;
    }
  }
}
</style>