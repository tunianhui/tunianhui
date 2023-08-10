<template>
  <div class="api-option">
    <el-form
      label-position="top"
      label-width="80px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="节点ID：">
        <el-input v-model="form.name" placeholder="请输入节点ID"></el-input>
      </el-form-item>
      <el-form-item label="选择API：" prop="region">
        <el-select v-model="form.region" placeholder="请选择API">
          <el-option label="API1" value="api1"></el-option>
          <el-option label="API2" value="api2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请求参数：">
        <el-input
          v-model="form.type"
          type="textarea"
          placeholder="请输入请求参数"
          :rows="6"
        ></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-checkbox v-model="checked">设置输出结果 ：</el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        type: ''
      },
      rules: {
        region: [{required: true, message: '请选择API', trigger: 'blur'}]
      },
      checked: false
    }
  }
}
</script>

<style lang="scss" scoped>
.api-option {
  height: 400px;
}
</style>

<style lang="scss">
.api-option {
  .el-form-item__label {
    color: #666666;
    padding-bottom: 0;
  }
}
</style>
