<template>
  <section class="apply">
    <div class="ml-10">权限申请</div>
    <div class="ml-10 mt-10">
      <el-form
        :model="submitForm"
        ref="submitForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        label-suffix="："
      >
        <el-form-item label="类型" prop="type">
          <el-select v-model="submitForm.type" placeholder="全部">
            <el-option label="逻辑表" value="1"></el-option>
            <el-option label="物理表" value="2"></el-option>
            <el-option label="数据源" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务板块" v-if="!isApply">
          <el-select v-model="submitForm.module" placeholder="全部">
            <el-option
              v-for="item in moduleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请内容" prop="content">
          <el-autocomplete
            v-model="submitForm.content"
            :fetch-suggestions="querySearchAsync"
            clearable
            placeholder="请选择申请内容"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="权限类型" v-if="!isApply">
          <el-radio-group v-model="submitForm.permissionType">
            <el-radio :label="1">查询</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限类型" v-if="isApply">
          <el-checkbox-group v-model="submitForm.permissionType">
            <el-checkbox label="1">同步读</el-checkbox>
            <el-checkbox label="2">同步写</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="权限归属账号">
          <el-radio-group v-model="submitForm.account">
            <el-radio :label="1">个人账号</el-radio>
            <el-radio :label="2">统一生产账号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="validTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <div class="radio-class">
            <span>快速选择</span>
            <el-radio-group v-model="submitForm.quickSelect" size="mini">
              <el-radio-button label="30"></el-radio-button>
              <el-radio-button label="90"></el-radio-button>
              <el-radio-button label="180"></el-radio-button>
              <el-radio-button label="365"></el-radio-button>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="申请说明" prop="explain">
          <el-input v-model="submitForm.explain" class="explain-input" size="mini"></el-input>
        </el-form-item>
        <el-form-item prop="">
          <el-button type="primary" @click="submitClick()">提交申请</el-button>
        </el-form-item>
      </el-form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Apply',
  data() {
    return {
      submitForm: {
        type: '1',
        module: '',
        content: '',
        permissionType: 1,
        account: 1,
        validStartTime: '',
        validEndTime: '',
        quickSelect: 30,
        explain: ''
      },
      moduleList: [],
      applyList: [],
      timeout: null,
      validTime: [],
      rules: {
        type: [{required: true, message: '请选择类型', trigger: 'change'}],
        content: [
          {required: true, message: '申请内容不能为空', trigger: 'blur'}
        ],
        explain: [
          {required: true, message: '申请说明不能为空', trigger: 'blur'}
        ]
      },
      isApply: true
    }
  },
  mounted() {
    this.applyList = [
      {value: 'asdaasd'},
      {value: 'fdgbsdf'},
      {value: 'sdfsdff'}
    ]
    if (this.$route.params.actionType && this.$route.params.actionType === 2) {
      this.isApply = true
      this.submitForm.permissionType = ['1', '2']
    } else {
      this.isApply = false
    }
  },
  methods: {
    submitClick() {
      this.$refs['submitForm'].validate(valid => {
        if (valid) {
          this.$confirm(
            '提交成功！ 已提交1个申请流程，请前往权限列表查看！',
            '提交',
            {
              confirmButtonText: '知道了',
              cancelButtonText: '',
              type: 'success'
            }
          ).then(() => {
            if (
              this.$route.params.actionType &&
              this.$route.params.actionType === 2
            ) {
              this.submitForm = {
                type: '1',
                module: '',
                content: '',
                permissionType: [],
                account: 1,
                validStartTime: '',
                validEndTime: '',
                quickSelect: 30,
                explain: ''
              }
            }
            this.$router.push({name: 'authority-list'})
          })
        } else {
          return false
        }
      })
    },
    querySearchAsync(queryString, callback) {
      var list = this.applyList
      var results = queryString
        ? list.filter(this.createStateFilter(queryString))
        : list
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        callback(results)
      }, 1000)
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    }
  }
}
</script>

<style lang="scss">
.apply {
  .el-form {
    .el-input--mini {
      width: 200px;
    }
    .el-form-item__label {
      color: #999;
    }
    .radio-class {
      margin-top: 10px;
      & > span {
        margin-right: 10px;
      }
    }
    .explain-input {
      width: 100%;
    }
  }
}
</style>
