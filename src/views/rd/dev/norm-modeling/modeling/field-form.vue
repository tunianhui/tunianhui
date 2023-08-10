<template>
  <el-form
    ref="form"
    class="field-form"
    :model="filter"
    :rules="rules"
    label-position="right"
    label-width="120px"
    label-suffix="："
  >
    <el-form-item label="字段英文名" prop="element_code">
      <el-input v-model="filter.element_code" :disabled="type!=='fact' && type !=='factnew'" maxlength="32" show-word-limit v-if="source_type==='0'"></el-input>
      <el-input v-model="filter.element_code" :disabled="true" maxlength="32" show-word-limit v-if="source_type==='1'"></el-input>
    </el-form-item>
    <el-form-item label="计算属性" prop="sql_context" v-if="type === 'factnew'">
      <el-input v-model="filter.sql_context" show-word-limit :disabled="source_type==='1'"></el-input>
    </el-form-item>
    <el-form-item label="字段名称" prop="element_name">
      <el-input v-model="filter.element_name" placeholder="请输入字段名称" maxlength="32" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="comment">
      <el-input
        type="textarea"
        maxlength="128"
        show-word-limit
        v-model="filter.comment"
        placeholder="请输入字段描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="数据类型" prop="element_type">
      <el-select v-model="filter.element_type" :disabled="type === 'dim' || type === 'fact'" v-if="source_type==='0'">
        <el-option
          v-for="item in dics.data_type"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-select v-model="filter.element_type" v-if="source_type==='1'">
        <el-option
          v-for="item in dics.data_type"
          :key="item.key"
          :label="item.value"
          :value="item.key"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="默认值" prop="default" v-if="type === 'fact' || type === 'factnew'">
      <el-input v-model="filter.default" v-if="source_type==='0'"></el-input>
      <el-input v-model="filter.default" :disabled="true" v-if="source_type==='1'"></el-input>
      <el-tooltip content="关联不到时该字段取值" placement="top" class="ml-10">
        <i class="el-icon-info"></i>
      </el-tooltip>
    </el-form-item>
    <el-form-item label="是否联合属性" prop="union_key_tag" v-if="type === 'dim'">
      <el-switch
        v-model="filter.union_key_tag"
        v-if="source_type==='0'"
        active-value="1"
        inactive-value="0"
        active-text="是"
        inactive-text="否">
      </el-switch>
      <el-switch
        v-model="filter.union_key_tag"
        v-if="source_type==='1'"
        :disabled="true"
        active-value="1"
        inactive-value="0"
        active-text="是"
        inactive-text="否">
      </el-switch>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item label="更新人/时间">{{getValue(filter.oper_user, filter.update_time)}}</el-form-item>
    <el-form-item label="创建人/时间">{{getValue(filter.oper_user, filter.oper_time)}}</el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FieldForm',
  props: {
    data: Object,
    type: String, // dim | fact
    source_type: {
      type: [String, Number],
      default: () => '0'
    }
  },
  data() {
    return {
      filter: {
        element_code: '',
        element_name: '',
        comment: '',
        element_type: 'string',
        default: '',
        update_person: '',
        update_time: '',
        create_person: '',
        create_time: '',
        union_key_tag: '',
        sql_context: ''
      },
      rules: {
        element_code: [
          {required: true, message: '请输入字段英文名'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          }
        ],
        element_name: {required: true, message: '请输入字段名称'}
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        Object.assign(this.filter, val)
      }
    }
  },
  methods: {
    getValue(val1, val2) {
      if (val1 && val2) {
        return val1 + '/' + val2
      }
      return '未找到'
    },
    getData() {
      let data
      this.$refs.form.validate(valid => {
        if (valid) {
          data = {...this.filter}
          this.$refs.form.resetFields()
        } else {
          data = false
        }
      })
      return data
    }
  }
}
</script>

<style lang="scss">
.field-form {
  .el-input {
    width: 60%;
  }
}
</style>
