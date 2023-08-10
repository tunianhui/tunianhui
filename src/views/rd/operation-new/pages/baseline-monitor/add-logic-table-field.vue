<template>
  <el-dialog
    title="添加逻辑表字段"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close"
    custom-class="add-logic-field-dialog"
    width="60%">
    <div class="wrapper" style="display: flex;justify-content: space-between;">
      <div class="left" style="width:60%">
        <div class="mb-10" style="display: flex; align-items: center; justify-content: space-between;">
          <span>逻辑表列表</span>
          <span>
            <MultipleSelect v-model="selectValue" :options="options"></MultipleSelect>
            <el-input
              class="ml-10"
              style="width: 170px;"
              placeholder="请输入逻辑表名"
              v-model="keywork">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </span>
        </div>
        <el-table
          :data="logicTableData"
          max-height="280"
          style="width: 100%;border-right: 1px solid #ebeef5;"
          :header-cell-class-name="headerCellClassName"
        >
          <el-table-column type="selection" width="45" align="center"> </el-table-column>
          <el-table-column prop="tableName" label="表名"></el-table-column>
          <el-table-column prop="tableType" label="表类型"></el-table-column>
          <el-table-column prop="selectField" label="勾选字段"> </el-table-column>
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
              layout="prev, next"
              :page-size="5"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="right" style="width:40%">
        <div class="mb-10" style="display: flex; align-items: center; justify-content: space-between;">
          <span></span>
          <span>
            <el-input
              class="ml-10"
              style="width: 170px;"
              placeholder="请输入字段名"
              v-model="keywork">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </span>
        </div>
        <el-table
          :data="logicTableFieldData"
          max-height="280"
          style="width: 100%"
          :header-cell-class-name="headerCellClassName"
        >
          <el-table-column prop="fieldCode" label="字段英文名"></el-table-column>
          <el-table-column prop="fieldName" label="字段名"></el-table-column>
        </el-table>
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
  name: 'AddLogicField',
  components: {
    MultipleSelect
  },
  data() {
    return {
      dialogVisible: true,
      selectValue: [],
      options: [],
      keywork: '',
      logicTableData: [],
      logicTableFieldData: [],
      checked: false,
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {},
    headerCellClassName({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'custom--header-cell-style'
      } else {
        return ''
      }
    },
  }
}
</script>

<style lang="scss">
.add-logic-field-dialog {
  .left {
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
.custom--header-cell-style {
    .cell {
      label {
        display: none;
      }
    }
  }
</style>