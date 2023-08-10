<template>
  <el-table
    :data="tableDataList"
    :span-method="arraySpanMethod"
    style="width: 100%"
    class="table-wrapper-error"
  >
    <template v-for="(item) in columns">
      <el-table-column
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align"
        v-if="item.slot"
      >
        <template slot-scope="scope">
          <div class="index" v-if="item.slot === 'index'">
            <template v-if="scope.row.index <= 3">
              <i class="iconfont icon-paixing3" :style="{color: colors[scope.row.index]}">
                <span>{{ scope.row.index }}</span>
              </i>
            </template>
            <template v-else>{{ scope.row.index }}</template>
          </div>
          <div class="nodeName" v-if="item.slot === 'nodeName'">
            <div class="node-name-icon">
              <i class="iconfont icon-shujuyuanquanxianguanli"></i>
            </div>
            <div class="node-name-info">
              <div class="node-name-info-top">
                <span>{{scope.row.nodeName}}</span>
                <span>{{scope.row.customValue}}</span>
              </div>
              <div class="node-name-info-bottom">
                <el-progress :percentage="scope.row.value" :stroke-width="8" stroke-linecap="butt" :show-text="false"></el-progress>
              </div>
            </div>
          </div>
          <div class="priority" v-if="item.slot === 'priority'">
            <span class="priority-text">{{scope.row.priority}}</span>
          </div>
          <slot :name="item.slot" v-else></slot>
        </template>
      </el-table-column>
      <el-table-column
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align"
        v-else
      ></el-table-column>
    </template>
  </el-table>
</template>

<script>
export default {
  name: 'RankingTable',
  props: {
    tableDataList: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => [
        {
          label: '排名',
          prop: 'index',
          width: 60,
          type: 'index',
          slot: 'index'
        },
        {
          label: '节点名称',
          prop: 'nodeName',
          slot: 'nodeName'
        },
        {
          label: '平均运行时长',
          prop: 'runFailCount',
          width: 130,
          align: 'right'
        },
        {
          label: '所属资源组',
          prop: 'resourceGroup',
          width: 130,
        },
        {
          label: '优先级',
          prop: 'priority',
          width: 130,
          slot: 'priority'
        },
        {
          label: '当前负责人',
          prop: 'currentOwner',
          width: 130,
        }
      ]
    },
    total: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      colors: {
        1: '#E25460',
        2: '#D96A34',
        3: '#EBC846'
      },
    }
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return [1, 2]
      } else if (columnIndex === 2) {
        return [0, 0]
      }
    }
  }
}
</script>

<style lang="scss">
.table-wrapper-error {
  &::before {
    height: 0;
  }
  .el-table__body-wrapper {
    overflow: auto;
  }
  th.el-table__cell {
    background-color: #fff!important;
    border-bottom: none!important;
    .cell {
      font-weight: 400;
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.67);
    }
  }
  td.el-table__cell {
    border-bottom: none;
  }
  .el-table__empty-text {
    line-height: 300px;
  }
  .index {
    display: flex;
    align-self: center;
    justify-content: center;
    i {
      font-size: 22px;
      position: relative;
      >span {
        color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
      }
    }
  }
  .nodeName {
    display: flex;
    align-items: center;
    .node-name-icon {
      font-size: 30px;
      margin-right: 20px;
      > i {
        color: #6697E9;
      }
    }
    .node-name-info {
      flex: 1;
      .node-name-info-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 5px;
        >span:first-child {
          font-size: 12px;
          color: rgba($color: #6697E9, $alpha: 0.85);
        }
      }
      .el-progress-bar__inner {
        border-radius: 0!important;
      }
      .el-progress-bar__outer {
        border-radius: 0!important;
      }
    }
  }
  .priority {
    width: 65px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    background: #E0F2FB;
    border-radius: 15px;
    color: #507ABF;
  }
}
</style>