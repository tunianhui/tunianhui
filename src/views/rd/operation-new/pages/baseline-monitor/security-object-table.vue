<template>
  <div class="security-object-tabale-wrapper">
    <el-table
      ref="table"
      :data="tableData"
      max-height="300px"
      style="width: 100%"
      :class="['security-object-tabale']"
      :header-cell-class-name="headerCellClassName"
    >
      <el-table-column
        type="selection"
        width="45"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="securityObject" label="保障对象"  min-width="300">
        <div class="tesk-obj" slot-scope="scope">
          <div class="table-icon">
            <i class="iconfont icon-Vi"></i>
          </div>
          <div class="name-code">
            <span class="name">{{scope.row.securityObject}}</span>
            <span class="code">{{scope.row.code}}</span>
          </div>
        </div>
      </el-table-column>
      <el-table-column prop="securityDetails" label="保障详情"></el-table-column>
      <el-table-column prop="schedulingCycle" label="调度周期"></el-table-column>
      <el-table-column prop="timing">
        <template slot="header">
          <span class="mr-5">定时/预计产出时间</span>
          <el-tooltip class="item" effect="dark" content="对于逻辑表，展示已选字段的最早定时开始时间和最晚预计产出时间。如果选中对象没有历史运行记录，则无法计算预计完成时间。" placement="top">
            <i class="iconfont icon-info" style="cursor: pointer; color: rgba(0,0,0,.5); margin-left: 4px;margin-top:3px"></i>
          </el-tooltip>
        </template>
        <template>
          <div class="timing">
            <span>日,00:00</span>
            <span>当日 00:00</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="schedulingCycle" label="归属项目/板块"></el-table-column>
      <el-table-column prop="head" label="负责人"></el-table-column>
      <el-table-column label="操作" width="60">
        <template slot-scope="scope">
          <i class="el-icon-delete cursor font-14" @click="delHandle(scope.row, scope.$index)"></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="dp-table-layout-bar">
      <div class="bottom-tips-check">
        <span>
          <el-checkbox v-model="checked"></el-checkbox>
          <span>选中0个</span>
        </span>
        <span>
          <i class="el-icon-delete cursor font-14"></i>
          <span>删除</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SecurityObjectTable',
  data() {
    return {
      checked: false,
      tableData: [
        {
          securityObject: '节点1',
          code: 'n_1111222244442',
          securityDetails: '-',
          schedulingCycle: '日',
          timing: ''
        }
      ]
    }
  },
  methods: {
    headerCellClassName({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'custom--header-cell-style'
      } else {
        return ''
      }
    },
    delHandle(row, index) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.tesk-obj {
  display: flex;
  align-items: center;
  height: 100%;
  .table-icon {
    i {
      font-size: 18px;
      color: #2D73FF;
      margin-right: 8px;
      display: flex;
    }
  }
  .name-code {
    display: flex;
    flex-direction: column;
    .name {
      color: rgba(0,0,0,0.85);
    }
    .code {
      color: rgba(0,0,0,0.45);
    }
  }
}
.timing {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cursor {
  cursor: pointer;
}
.security-object-tabale-wrapper {
  position: relative;
  padding-bottom: 52px;
  .dp-table-layout-bar {
    width: 100%;
    height: 52px;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    box-shadow: 0 -5px 10px 0 rgba(0,0,0,.15);
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
}
</style>

<style lang="scss">
.security-object-tabale {
  th.el-table__cell {
    background: #fafafa!important;
    border-bottom: 1px solid #f0f0f0!important;
    padding: 16px 0;
  }
  .custom--header-cell-style {
    .cell {
      label {
        display: none;
      }
    }
  }
}
</style>