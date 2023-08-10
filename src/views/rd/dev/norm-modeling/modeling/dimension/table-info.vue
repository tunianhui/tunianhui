<template>
  <section class="dimension-table-info">
    <SimpleHead name="基本信息"></SimpleHead>
    <el-form
      :model="filter"
      ref="form"
      :rules="rules"
      label-width="120px"
      label-position="right"
      label-suffix="："
    >
      <el-form-item label="业务板块" prop="business_field_name">{{filter.business_field_name}}</el-form-item>
      <el-form-item label="所属项目" prop="project_name">{{filter.project_name}}</el-form-item>
      <el-form-item label="空间类型" prop="space_type_name">{{filter.space_type_name}}</el-form-item>
      <el-form-item label="数据域" prop="data_field">{{filter.data_field}}</el-form-item>
      <el-form-item label="维度" prop="dim_name">
        <el-button
          type="text"
          @click.stop="goToDim(filter)"
        >{{filter.dim_name}}({{filter.dim_code}})</el-button>
      </el-form-item>
      <el-form-item label="维度类型" prop="dim_type">{{getDicsValue('dim_type', filter.dim_type)}}</el-form-item>
      <el-form-item label="英文名" prop="dim_code">{{filter.dim_code}}</el-form-item>
      <el-form-item label="名称" prop="dim_name">{{filter.dim_name}}</el-form-item>
      <el-form-item label="描述" prop="dim_desc">
        <el-input type="textarea" v-model="filter.dim_desc" max="128" placeholder="最多输入128个字符"></el-input>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import {types} from '@/config/rd-config'

export default {
  name: 'DimensionTableInfo',
  props: {
    data: Object
  },
  inject: ['attrStore'],
  data() {
    return {
      filter: {
        business_field_name: '',
        project_name: '',
        space_type_name: '',
        data_field: '',
        dim_name: '',
        dim_type: '',
        dim_code: '',
        dim_desc: ''
      },
      rules: {}
    }
  },
  created() {
    Object.assign(this.filter, this.data)
  },
  watch: {
    data(val) {
    }
  },
  methods: {
    validate() {
      let v
      this.$refs.filter.validate(valid => {
        v = valid
      })
      return v
    },
    submit() {
      if (!this.validate()) return false
      return this.filter
    },
    getData() {
      let data = false
      this.$refs.form.validate(valid => {
        if (valid) {
          data = this.filter
        }
      })
      return data
    },
    goToDim(data) {
      data.label = data.dim_name
      data.id = data.dim_id + ''
      const attr = {
        title: '维度',
        attrType: types.DIMENSION,
        name: data.id,
        label: data.dim_name,
        data
      }
      this.attrStore.commit('add', attr)
      // this.attrStore.commit('setActiveToFirst', attr)
    }
  }
}
</script>

<style lang="scss">
</style>
