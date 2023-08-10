<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-18 14:32:32
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-18 14:57:52
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\example-statistics\offline-example\view-note.vue
-->
<template>
  <el-dialog title="指标注释" :visible.sync="dialogFormVisible" width="40%">
    <el-form>
      <h5 class="mb-5">运行详情</h5>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>实例总数(按运行日期查看)：</span>
        </template>
        <div style="font-weight: 600">
          已生成的开始运行日期为选中日期的实例数+预计开始运行日期为选中日期的实例数(未运行状态)
        </div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>实例总数(按业务日期查看)：</span>
        </template>
        <div style="font-weight: 600">
          实例总数（按业务日期查看）
        </div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>实例详情-周期实例：</span>
        </template>
        <div style="font-weight: 600">
          实例详情-周期实例
        </div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>实例详情-手动实例：</span>
        </template>
        <div style="font-weight: 600">
          已选运行状态下，调度类型为一次性调度的所有业务类型实例总数
        </div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>实例详情-补数据实例：</span>
        </template>
        <div style="font-weight: 600">
          已选运行状态下，所有业务类型补数据实例总数
        </div>
      </el-form-item>
      <h5 class="mb-5">运行趋势：历史日期取每日24点的统计数据，当日取最近整点的统计数据</h5>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>已运行实例总数（按运行日期查看）：</span>
        </template>
        <div style="font-weight: 600">
          已选实例调度类型和业务类型下，运行成功，运行失败，运行中3种运行状态实例总数
        </div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>运行成功（按运行日期查看）：</span>
        </template>
        <div style="font-weight: 600">
          已选实例调度类型和业务类型下，运行成功的实例总数
        </div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>运行失败（按运行日期查看）：</span>
        </template>
        <div style="font-weight: 600">
          已选实例调度类型和业务类型下，运行失败的实例总数
        </div>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <template slot="label">
          <span>历史15天失效实例均值（按运行日期查看）：</span>
        </template>
        <div style="font-weight: 600">
          已选实例调度类型和业务类型下，从选中运行日期往倒推15天内所有运行失败实例总数/15
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'ViewNote',
  data() {
    return {
      dialogFormVisible: true,
      formLabelWidth: '190px'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
