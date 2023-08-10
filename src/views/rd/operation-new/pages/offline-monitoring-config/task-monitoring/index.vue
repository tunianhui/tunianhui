<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-21 10:13:10
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-23 09:48:46
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\offline-monitoring-config\task-monitoring\index.vue
-->
<template>
  <div class="task-monitoring-wrapper">
    <FilterHeader
      v-resize="resizeDom"
      :headerSearchList="headerSearchList"
      :showDody="false"
    ></FilterHeader>

    <div class="table-body mt-10" ref="tableBody" :style="{height}">
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        height="calc(100% - 40px)"
        style="width: 100%">
        <el-table-column prop="monitoring" label="监控项">
          <template slot-scope="scoped">
            <el-checkbox v-model="scoped.row.select" @change="val => selectMonitoring(val, scoped.row)"></el-checkbox>
            <span class="ml-10">{{scoped.row.monitoring}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reasonForAlarm" label="报警原因">
          <template slot-scope="scoped">
            <el-checkbox v-model="scoped.row.selectSub" @change="val => selectReasonForAlarmSub(val, scoped.row)"></el-checkbox>
            <span class="ml-10">{{scoped.row.reasonForAlarm}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="founder" label="创建人">
        </el-table-column>
        <el-table-column prop="recipient" label="接收人(类型)">
        </el-table-column>
        <el-table-column prop="receiveMode" label="接收方式">
        </el-table-column>
        <el-table-column prop="lastModified" label="最后修改时间">
        </el-table-column>
        <el-table-column prop="monitoringDev" label="监控开发">
          <template slot-scope="scoped">
            <el-switch
              v-model="scoped.row.monitoringDev"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="monitoringItemOper" label="监控项操作">
          <template slot-scope="scoped">
            <el-button
              type="text"
              size="mini"
              @click="handleDeleteItem(scoped.row)">
              <i class="el-icon-delete font-16"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="monitoringItemOper" label="操作" width="90">
          <template slot-scope="scoped">
            <el-button
              type="text"
              size="mini"
              @click="handleEditItem(scoped.row)">
              <i class="el-icon-edit font-16"></i>
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="handleDeleteItem(scoped.row)">
              <i class="el-icon-delete font-16"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <Foolter @commandHandle="commandHandle"></Foolter>
    </div>
    <Recipient
      v-if="visibleRecipient"
      @close="visibleRecipient = false"
      :title="titleRecipient" :handType="handType"
    ></Recipient>
  </div>
</template>

<script>
import FilterHeader from '../../../component/filter-header.vue'
import Recipient from './recipient.vue'
import Foolter from '../../../component/foolter.vue'
export default {
  name: 'TaskMonitoring',
  components: {
    FilterHeader,
    Recipient,
    Foolter
  },
  data() {
    return {
      headerSearchList: [
        {
          label: '报警原因',
          type: 'select',
          vModelValue: [],
          key: 'reasonForAlarm',
          multiple: true,
          options: [
            { label: '出错', value: 'error' },
            { label: '完成', value: 'complete' },
            { label: '运行超时', value: 'runTimeout' },
            { label: '未完成', value: 'incomplete' },
            { label: '未完成', value: 'incomplete1' },
          ]
        },
        {
          label: '接收方式',
          type: 'select',
          vModelValue: [],
          key: 'receiveMode',
          multiple: true,
          options: [
            { label: '电话', value: '1' }
          ]
        },
        {
          label: '创建人',
          type: 'select',
          vModelValue: [],
          key: 'creator',
          multiple: true,
          options: [
            { label: 'dazhae', value: '1' }
          ]
        },
        {
          label: '接收人',
          type: 'select',
          vModelValue: [],
          key: 'receiver',
          multiple: true,
          options: [
            { label: 'dazhae', value: '1' }
          ]
        },
      ],
      height: '',
      tableData: [
        {
          monitoring: 'test_bj_WWC',
          reasonForAlarm: '未完成',
          founder: 'dazhae',
          recipient: 'dazhae(电话)',
          receiveMode: '电话',
          lastModified: '2020-12-12 12:12:12',
          monitoringDev: false,
          categorize: '1',
          select: false,
          selectSub: false
        },
        {
          monitoring: 'test_bj_CS',
          reasonForAlarm: '完成',
          founder: 'dazhae',
          recipient: 'dazhae(电话)',
          receiveMode: '电话',
          lastModified: '2020-12-12 12:12:12',
          monitoringDev: false,
          categorize: '2',
          select: false,
          selectSub: false
        },
        {
          monitoring: 'test_bj_CC',
          reasonForAlarm: '出错',
          founder: 'dazhae',
          recipient: 'dazhae(电话)',
          receiveMode: '电话',
          lastModified: '2020-12-12 12:12:12',
          monitoringDev: false,
          categorize: '2',
          select: false,
          selectSub: false
        }
      ],
      currentPageAllCheck: false,
      visibleRecipient: false,
      titleRecipient: '',
      handType: ''
    }
  },
  methods: {
    resizeDom(data) {
      const { height } = data
      this.$nextTick(_ => {
        this.height = `calc(100% - ${height} - 10px)`
      })
    },
    // 删除监控项
    handleDeleteItem(row) {
      this.$confirm('此操作将永久删除该监控项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(_ => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEditItem(row) {},
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 || columnIndex === 8) {
        const _row = this.flitterData(this.tableData).one[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    },
    flitterData(arr) {
      let spanOneArr = []
      let concatOne = 0
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1)
        } else {
          if (item.categorize === arr[index - 1].categorize) {
            spanOneArr[concatOne] += 1
            spanOneArr.push(0)
          } else {
            spanOneArr.push(1)
            concatOne = index
          }
        }
      })
      return {
        one: spanOneArr
      }
    },
    selectMonitoring(val, row) {
      this.tableData.filter(item => {
        if (item.categorize === row.categorize) {
          item.select = val
        }
        return false
      })
    },
    selectReasonForAlarmSub(val, row) {
      row.selectSub = val
    },
    commandHandle(data) {
      this.visibleRecipient = true
      this.titleRecipient = data.title
      this.handType = data.val
    },
  }
}
</script>

<style lang="scss" scoped>
.task-monitoring-wrapper {
  height: 100%;
  position: relative;
  .table-body {
    background: rgb(248, 248, 250);
  }
  ::v-deep .el-table th.el-table__cell {
    background: rgb(248, 248, 250);
  }
}
</style>