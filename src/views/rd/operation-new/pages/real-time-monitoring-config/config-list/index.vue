<template>
  <div class="config-list">
    <FilterHeader
      v-resize="resizeDom"
      :headerSearchList="headerSearchList"
      :showDody="false"
      :showInput="true"
    ></FilterHeader>
    <div class="table-body mt-10" ref="tableBody" :style="{height}">
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        height="calc(100% - 40px)"
        style="width: 100%">
        <el-table-column prop="logicalTable" label="任务名称&ID">
          <template slot-scope="scoped">
            <el-checkbox v-model="scoped.row.select" @change="val => selectLogicalTable(val, scoped.row)"></el-checkbox>
            <span class="ml-10">{{scoped.row.taskName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reasonForAlarm" label="报警原因">
          <template slot-scope="scoped">
            <el-checkbox v-model="scoped.row.selectSub" @change="val => selecReasonForAlarmSub(val, scoped.row)"></el-checkbox>
            <span class="ml-10">{{scoped.row.reasonForAlarm}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="reasonForAlarm" label="报警原因">
        </el-table-column> -->
        <el-table-column prop="founder" label="创建人">
        </el-table-column>
        <el-table-column prop="receiveMode" label="接收方式">
        </el-table-column>
        <el-table-column prop="recipient" label="接收人（类型）">
        </el-table-column>
        <el-table-column prop="lastModified" label="最后修改时间">
        </el-table-column>
        <el-table-column prop="monitorSswitch" label="监控开关">
          <template slot-scope="scoped">
            <el-switch
              v-model="scoped.row.monitorSswitch"
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
import Foolter from '../../../component/foolter.vue'
import Recipient from '../../offline-monitoring-config/task-monitoring/recipient.vue'
export default {
  name: 'ConfigList',
  components: {
    FilterHeader,
    Foolter,
    Recipient
  },
  data() {
    return {
      height: '',
      headerSearchList: [
        {
          label: '报警原因',
          type: 'select',
          vModelValue: [],
          key: 'logicalTable',
          multiple: true,
          options: []
        },
        {
          label: '接收方式',
          type: 'select',
          vModelValue: [],
          key: 'receiveMode',
          multiple: true,
          options: []
        },
        {
          label: '接收人',
          type: 'select',
          vModelValue: [],
          key: 'receiver',
          multiple: true,
          options: []
        },
        {
          label: '创建人',
          type: 'select',
          vModelValue: [],
          key: 'creator',
          multiple: true,
          options: []
        }
      ],
      tableData: [
        { taskName: '任务名称', taskId: '1234', select: false, selectSub: false, reasonForAlarm: '报警原因' },
        { taskName: '任务名称', taskId: '1234', select: false, selectSub: false, reasonForAlarm: '报警原因' },
        { taskName: '任务名称112', taskId: '1234112', select: false, selectSub: false, reasonForAlarm: '报警原因' },
      ],
      visibleRecipient: false,
      handType: '',
      titleRecipient: ''
    }
  },
  methods: {
    resizeDom(data) {
      const { height } = data
      this.$nextTick(_ => {
        this.height = `calc(100% - ${height} - 10px)`
      })
    },
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
          if (item.taskName === arr[index - 1].taskName) {
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
    selectLogicalTable(val, row) {
      this.tableData.filter(item => {
        if (item.categorize === row.categorize) {
          item.select = val
        }
        return false
      })
    },
    selecReasonForAlarmSub(val, row) {
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
.config-list {
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