<template>
  <el-table
    ref="table"
    :data="tableData"
    :height="height"
    row-key="id"
    style="width: 100%"
    :class="['record-table-example', showDag ? 'active' : '']"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    :cell-class-name="cellClassName"
    :span-method="objectSpanMethod"
    :header-cell-class-name="headerCellClassName"
  >
    <el-table-column
      type="selection"
      width="55"
      align="center"
    >
      <template slot-scope="scope">
        <span v-if="!scope.row.isLeaf">
          <el-checkbox v-model="scope.checked"></el-checkbox>
        </span>
        <div v-if="scope.row.isLeaf" class="tesk-obj">
          <SubRecordTableExample v-on="$listeners"></SubRecordTableExample>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="cycle" label="补数据名称-业务日期" min-width="300">
      <template slot-scope="scope">
        <span v-if="!scope.row.isLeaf">
          {{scope.row.name}}
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="runStatus" label="补数据状态" width="120">
      <template slot-scope="scope">
        <i :class="['mr-5', statusList[scope.row.runStatus] && statusList[scope.row.runStatus].icon]" :style="{color: statusList[scope.row.runStatus] && statusList[scope.row.runStatus].color}"></i>
        <span>{{statusList[scope.row.runStatus] && statusList[scope.row.runStatus].name}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="submitter" label="补数据提交人" width="160"></el-table-column>
    <el-table-column prop="nodeCount" label="节点数据" width="160"></el-table-column>
    <el-table-column prop="businessDate" label="业务日期" width="160"></el-table-column>
    <el-table-column prop="submitTime" label="提交时间" width="160"></el-table-column>
    <el-table-column prop="runTime" label="运行时长" width="80"></el-table-column>
    <el-table-column label="操作" align="right" width="150">
      <el-tooltip class="item" effect="dark" content="一键终止" placement="top">
        <i class="iconfont icon-zhongzhi font-14 cursor mr-15"></i>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="一键重跑失败实例" placement="top">
        <i class="iconfont icon-zhongpao font-14 cursor"></i>
      </el-tooltip>
    </el-table-column>
  </el-table>
</template>

<script>
import SubRecordTableExample from './sub-table.vue'
export default {
  name: 'RecordTableExample',
  components: {
    SubRecordTableExample
  },
  props: {
    height: {
      type: Number,
      default: 0
    },
    showDag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableData: [
        {
          id: 11,
          name: 'ces_2023-02-03 12:12:33',
          checked: false,
          runStatus: 1,
          submitter: '张三',
          nodeCount: 1,
          businessDate: '2020-12-12',
          submitTime: '2020-12-12 12:12:12',
          runTime: '12s',
          children: [
            {
              id: 22,
              name: 'ces_2023-02-04 12:12:33',
              code: 'n_1115522266',
              checked: false,
              runStatus: 2,
              submitter: '李四',
              nodeCount: 1,
              businessDate: '2020-12-12',
              submitTime: '2020-12-12 12:12:12',
              runTime: '12s',
              children: [
                {
                  id: 33,
                  name: '测试数据3',
                  code: 'n_122333522ffff',
                  isLeaf: true,
                  runStatus: 3,
                  submitter: '王五',
                  nodeCount: 1,
                  businessDate: '2020-12-12',
                  submitTime: '2020-12-12 12:12:12',
                  runTime: '12s',
                }
              ]
            }
          ]
        },
        {
          id: 111,
          name: 'ces_2023-02-03 12:12:33',
          checked: false,
          runStatus: 3,
          submitter: '张三',
          nodeCount: 1,
          businessDate: '2020-12-12',
          submitTime: '2020-12-12 12:12:12',
          runTime: '12s',
          children: [
            {
              id: 222,
              name: 'ces_2023-02-04 12:12:33',
              code: 'n_1115522266',
              checked: false,
              runStatus: 4,
              submitter: '李四',
              nodeCount: 1,
              businessDate: '2020-12-12',
              submitTime: '2020-12-12 12:12:12',
              runTime: '12s',
              children: [
                {
                  id: 333,
                  name: '测试数据3',
                  code: 'n_122333522ffff',
                  isLeaf: true,
                  runStatus: 1,
                  submitter: '王五',
                  nodeCount: 1,
                  businessDate: '2020-12-12',
                  submitTime: '2020-12-12 12:12:12',
                  runTime: '12s',
                }
              ]
            }
          ]
        }
      ],
      statusList: {
        1: { name: '未运行', color: '#ccc', icon: 'iconfont icon-weikaiqi' },
        2: { name: '运行中', color: '#2d73ff', icon: 'iconfont icon-wait' },
        3: { name: '失败', color: '#FF7474', icon: 'el-icon-error' },
        4: { name: '成功', color: '#4AC059', icon: 'iconfont icon-yikaiqi' },
      },
    }
  },
  methods: {
    cellClassName({row, column, rowIndex, columnIndex}) {
      if (!row.children && columnIndex === 0) {
        return 'custom-cell-style'
      } else {
        return ''
      }
    },
    headerCellClassName({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'custom--header-cell-style'
      } else {
        return ''
      }
    },
    showDagHande(row) {
      this.$emit('showDagHande', row)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!row.children) {
        if (columnIndex === 0) {
          return [1, 9];
        } else {
          return [0, 0];
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.tesk-obj {
  width: 100%;
}
::v-deep {
  .custom-cell-style {
    padding: 0;
    .cell {
      padding-left: 0;
      padding-right: 0;
    }
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