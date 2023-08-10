<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-21 10:14:13
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-23 09:54:48
 * @FilePath: \数据智能构建\src\views\rd\operation-new\pages\offline-monitoring-config\field-monitoring\index.vue
-->
<template>
  <div class="field-monitoring-wrapper">
    <FilterHeader
      v-resize="resizeDom"
      :headerSearchList="headerSearchList"
      :showDody="false"
      :showInput="false"
    ></FilterHeader>

    <div class="table-body mt-10" ref="tableBody" :style="{height}">
      <el-table
        :data="tableData"
        :span-method="objectSpanMethod"
        height="calc(100% - 40px)"
        style="width: 100%">
        <el-table-column prop="logicalTable" label="逻辑表">
          <template slot-scope="scoped">
            <el-checkbox v-model="scoped.row.select" @change="val => selectLogicalTable(val, scoped.row)"></el-checkbox>
            <span class="ml-10">{{scoped.row.logicalTable}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="monitoringItems" label="监控项">
          <template slot-scope="scoped">
            <el-checkbox v-model="scoped.row.selectSub" @change="val => selecMonitoringItemsSub(val, scoped.row)"></el-checkbox>
            <span class="ml-10">{{scoped.row.monitoringItems}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="reasonForAlarm" label="报警原因">
        </el-table-column>
        <el-table-column prop="founder" label="创建人">
        </el-table-column>
        <el-table-column prop="receiveMode" label="接收方式">
        </el-table-column>
        <el-table-column prop="recipient" label="接收人">
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
import Recipient from '../task-monitoring/recipient.vue'
export default {
  name: 'FieldMonitoring',
  components: {
    FilterHeader,
    Foolter,
    Recipient
  },
  data() {
    return {
      headerSearchList: [
        {
          label: '逻辑表',
          type: 'select',
          vModelValue: [],
          key: 'logicalTable',
          multiple: true,
          options: []
        },
        {
          label: '监控项',
          type: 'select',
          vModelValue: [],
          key: 'monitoringItems',
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
          label: '创建人',
          type: 'select',
          vModelValue: [],
          key: 'creator',
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
      ],
      tableData: [
        {
          logicalTable: '逻辑表1',
          monitoringItems: '监控项1',
          reasonForAlarm: '报警原因1',
          founder: '创建人1',
          receiveMode: '接收方式1',
          recipient: '接收人1',
          lastModified: '最后修改时间1',
          monitorSswitch: true,
          categorize: false,
        },
        {
          logicalTable: '逻辑表1',
          monitoringItems: '监控项1',
          reasonForAlarm: '报警原因1',
          founder: '创建人1',
          receiveMode: '接收方式1',
          recipient: '接收人1',
          lastModified: '最后修改时间1',
          monitorSswitch: true,
          categorize: false,
        }
      ],
      height: '',
      visibleRecipient: false,
      titleRecipient: '',
      handType: '',
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
      if (columnIndex === 0 || columnIndex === 9) {
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
          if (item.logicalTable === arr[index - 1].logicalTable) {
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
    selecMonitoringItemsSub(val, row) {
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
.field-monitoring-wrapper {
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