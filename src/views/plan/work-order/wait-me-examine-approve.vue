<template>
  <div class="wait-me-examine-approve height-100per flex-column">
    <div class="wait-me-examine-approve-content">
      <div class="table-wrapper">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="date" label="工单编号" sortable width="120">
          </el-table-column>
          <el-table-column prop="name" label="工单类型"> </el-table-column>
          <el-table-column prop="province" label="工单操作对象">
          </el-table-column>
          <el-table-column prop="city" label="对象配置模式"> </el-table-column>
          <el-table-column prop="address" label="工单状态"> </el-table-column>
          <el-table-column prop="zip" label="工单信息"> </el-table-column>
          <el-table-column prop="zip2" label="创建时间" sortable>
          </el-table-column>
          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                @click="applyPowerHandle(scope.row)"
                type="text"
                size="small"
                >通过</el-button
              >
              <el-button type="text" size="small">驳回</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog title="更多" :visible.sync="opinionsPowerVisible">
      <el-form
        :model="abilityPowerForm"
        :rules="abilityPowerRules"
        ref="abilityPowerForm"
      >
        <el-form-item label="审批结果" prop="applyReason">
          <el-radio v-model="radio" label="1">通过</el-radio>
          <el-radio v-model="radio" label="2">驳回</el-radio>
        </el-form-item>
        <el-form-item label="审批意见" prop="applyReason">
          <el-input
            type="textarea"
            v-model="abilityPowerForm.applyReason"
            :rows="7"
            :maxlength="128"
            :minlength="5"
            resize="none"
            placeholder="请输入审批意见"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="opinionsPowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('abilityPowerForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pager from '@/mixins/pager'

export default {
  name: 'waitMeExamineApprove',
  mixins: [pager],
  components: {},
  data() {
    return {
      radio: '1',
      opinionsPowerVisible: false,

      abilityPowerForm: {
        quick: '',
        applyReason: '',
        date: '',
      },
      abilityPowerRules: {
        quick: [
          {required: true, message: '请选择', trigger: ['blur', 'change']},
        ],
        applyReason: [
          {required: true, message: '请选择', trigger: ['blur', 'change']},
        ],
      },
      tableData: [
        {
          date: '0001',
          name: '类型一',
          province: '对象一',
          city: '模式一',
          address: '已提交',
          zip: '信息一',
          zip2: '2022-01-01',
        },
        {
          date: '0002',
          name: '类型二',
          province: '对象二',
          city: '模式二',
          address: '已提交',
          zip: '信息二',
          zip2: '2022-01-02',
        },
        {
          date: '0003',
          name: '类型三',
          province: '对象三',
          city: '模式三',
          address: '已提交',
          zip: '信息三',
          zip2: '2022-01-03',
        },
        {
          date: '0004',
          name: '类型四',
          province: '对象四',
          city: '模式四',
          address: '已提交',
          zip: '信息四',
          zip2: '2022-01-04',
        },
      ],
    }
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    applyPowerHandle() {
      this.opinionsPowerVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        }
      })
    },
  },
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.wait-me-examine-approve {
  .wait-me-examine-approve-content {
  }
}
</style>
