<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-07-20 15:40:46
 * @LastEditTime: 2021-07-20 18:03:49
 * @Description:
-->
<template>
  <SimpleEditDialog :visible="visible" title="查看" :footer="false" @close="close" @confirm="confirm" width="40%">
    <el-form :model="row" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-suffix="：">
      <el-form-item label="表中文名">
        {{row.cube_name}}
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="项目名称">
            {{row.project_name}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务板块">
            {{row.business_field_name}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="表类型">
            {{row.tableType}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="数据类型">
            {{row.dataType}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建人">
            {{row.oper_user}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            {{row.create_time}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </SimpleEditDialog>
</template>

<script>
export default {
  name: 'CatalogueDataTableInfo',
  props: {
    visible: Boolean,
    row: Object
  },
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.demo-ruleForm {
  height: 100%;
  width: 100%;
  padding-bottom: 30px;
}
</style>
