<template>
  <el-dialog
    title="添加物理任务"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    custom-class="add-phy-task-dialog"
    width="50%">
    <div class="content-wrapper">
      <div class="mb-10" style="display: flex; align-items: center; justify-content: space-between;">
        <span>节点列表</span>
        <span>
          <MultipleSelect v-model="selectValue" :options="options"></MultipleSelect>
          <el-input
            class="ml-10"
            style="width: 170px;"
            placeholder="请输入节点名称或ID"
            v-model="keywork">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </span>
      </div>
      <el-table
        :data="tableData"
        max-height="280"
        style="width: 100%">
        <el-table-column prop="node_name" label="节点名称"></el-table-column>
        <el-table-column prop="node_id" label="节点名称"></el-table-column>
        <el-table-column prop="node_type" label="节点类型"> </el-table-column>
        <el-table-column prop="node_type" label="归属项目"> </el-table-column>
      </el-table>
      <div class="dp-table-layout-bar">
        <div class="bottom-tips-check">
          <span>
            <el-checkbox v-model="checked"></el-checkbox>
            <span>选中0个</span>
          </span>
        </div>
        <div class="right">
          <el-pagination
            layout="prev, pager, next"
            :page-size="5"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import MultipleSelect from '../../component/check-select.vue'
export default {
  name: 'AddPhyTask',
  components: {
    MultipleSelect
  },
  data() {
    return {
      dialogVisible: true,
      selectValue: [],
      options: [],
      keywork: '',
      tableData: [],
      total: 50
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {}
  }
}
</script>

<style lang="scss">
.add-phy-task-dialog {
  .content-wrapper {
    position: relative;
  }
  .dp-table-layout-bar {
    width: 100%;
    height: 52px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    .bottom-tips-check {
      padding-left: 15px;
      font-size: 12px;
      >span:first-child {
        margin-right: 20px;
        >span:last-child {
          margin-left: 5px;
        }
      }
      >span:last-child {
        cursor: pointer;
        > i {
          margin-right: 5px;
        }
      }
    }
  }
  .el-dialog__body {
    padding-bottom: 20px;
  }
}

</style>