<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-19 10:43:35
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-19 17:27:08
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\example-statistics\offline-example\ranking.vue
-->
<template>
  <el-table
    class="rankings-table"
    :data="tableDataList"
    style="width: 100%"
  >
    <template v-for="(item, index) in columns">
      <el-table-column
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :align="item.align"
        v-if="item.slots"
      >
        <template slot-scope="scope">
          <div class="index" v-if="item.slots.name === 'index'">
            <template v-if="scope.row[item.prop] <= 3">
              <i class="iconfont icon-paixing3" :style="{color: colors[scope.row[item.prop]]}">
                <span>{{ scope.row[item.prop] }}</span>
              </i>
            </template>
            <template v-else>{{ scope.row[item.prop] }}</template>
          </div>
          <div class="project" v-if="item.slots.name === 'project'">
            <OverflowTooltip :style="{width: 'calc(100% - 5px)', color: '#225EC5'}">
              {{ scope.row[item.prop]}}
            </OverflowTooltip>
          </div>
          <div class="manageUser" v-if="item.slots.name === 'manageUser'">
            <OverflowTooltip :style="{width: 'calc(100% - 5px)'}">
              {{ scope.row[item.prop]}}
            </OverflowTooltip>
          </div>
          <div class="progress" v-if="item.slots.name === 'progress'">
            <el-progress :percentage="scope.row[item.prop]" :stroke-width="10" :format="format" stroke-linecap="butt"></el-progress>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :key="index"
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
import OverflowTooltip from '@c/overflow-tooltip'
import { cloneDeep } from 'lodash'
export default {
  components: { OverflowTooltip },
  name: 'RankingTable',
  props: {
    tableData: {
      type: Array,
      default: () => [
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 90,
          taskNum: 90
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 75,
          taskNum: 75
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 60,
          taskNum: 60
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 55,
          taskNum: 55
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 50,
          taskNum: 50
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 77,
          taskNum: 77
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 50,
          taskNum: 50
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 50,
          taskNum: 50
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 30,
          taskNum: 30
        },
        {
          project: '项目名称',
          manageUser: '项目负责人',
          errorNum: 40,
          taskNum: 40
        }
      ]
    },
    columns: {
      type: Array,
      default: () => [
        {
          label: '排序',
          prop: 'index',
          width: '50px',
          slots: {
            name: 'index'
          }
        },
        {
          label: '项目',
          prop: 'project',
          slots: {
            name: 'project'
          }
        },
        {
          label: '管理员',
          prop: 'manageUser',
          slots: {
            name: 'manageUser'
          }
        },
        {
          label: '失败实例数',
          prop: 'errorNum',
          slots: {
            name: 'progress'
          }
        },
        {
          label: '失败实例对应任务数',
          prop: 'taskNum',
          align: 'right'
        }
      ],
    }
  },
  watch: {
    tableData: {
      handler(val) {
        this.tableDataList = this.sortTableData(cloneDeep(val), 'errorNum')
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      colors: {
        1: '#E25460',
        2: '#D96A34',
        3: '#EBC846'
      },
      tableDataList: []
    }
  },
  mounted() {
    console.log(this.columns, this.tableData)
  },
  methods: {
    format(percentage) {
      return percentage
    },
    sortTableData(arr, key) {
      const data = arr.sort((a, b) => {
        return b[key] - a[key]
      })
      return data.map((item, index) => {
        item.index = index + 1
        return item
      })
    }
  }
}
</script>

<style lang="scss">
.rankings-table {
  .el-table__body-wrapper {
    overflow: auto;
  }
  th.el-table__cell {
    background-color: #fff!important;
    .cell {
      font-weight: 400;
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.67);
    }
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
  .project, .manageUser {
    width: 100%;
  }
  .project {
    cursor: pointer;
  }
  .el-progress-bar__inner {
    border-radius: 0!important;
  }
  .el-progress-bar__outer {
    border-radius: 0!important;
  }
  .el-progress__text {
    font-size: 12px!important;
    color: rgba($color: #000000, $alpha: 0.67);
    margin-left: 40px;
  }
  .el-progress-bar {
    padding-right: 20px;
  }
}
</style>
