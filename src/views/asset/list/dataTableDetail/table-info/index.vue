<template>
  <div class="tab-info no-hover animated " v-loading="!!loading">
    <div class="animated fadeInRight table-box" v-if="sourceType !== 'es'">
      <Table
        :tableData="tableData"
        :tableType="tableType"
        :maxHeight="isNaN(parseFloat(widthHeightData.height)) ? null : parseFloat(widthHeightData.height) / 2"
        @zoneDetail="zoneDetailHandle" @dataSearch="dataSearchClickHandle" @bloodRel="bloodClickHandle"
      >
      </Table>
      <div style="font-size:12px;color:#8c8c8c" class="mt-10 mb-10 pl-20">以下字段为分区</div>
      <Table
        :showHeader="false"
        :tableType="tableType"
        :tableData="majorKeyData"
        :maxHeight="isNaN(parseFloat(widthHeightData.height)) ? null : parseFloat(widthHeightData.height) / 2"
        @zoneDetail="zoneDetailHandle"
        @dataSearch="dataSearchClickHandle"
        @bloodRel="bloodClickHandle" :isPrimary="true"
      >
      </Table>
    </div>
    <div class="animated fadeInRight table-box" v-else>
      <EsTable
        :tableData="tableData"
        :tableType="tableType"
        :maxHeight="isNaN(parseFloat(widthHeightData.height)) ? null : parseFloat(widthHeightData.height) / 2"
        @zoneDetail="zoneDetailHandle" @dataSearch="dataSearchClickHandle" @bloodRel="bloodClickHandle"
      >
      </EsTable>
    </div>
    <!-- 分区详情 -->
    <ZoneDateilDialog @close="close" v-if="zoneVisible" :rowData="zoneRowData"></ZoneDateilDialog>
    <!-- 数据探查 -->
    <DataSearchDialog @close="close" v-if="dataSearchVisible" :rowData="searchRowData"></DataSearchDialog>
    <!-- 血缘关系 -->
    <BloodRelDialog @close="close" v-if="bloodVisible" :rowData="bloodRelData"></BloodRelDialog>
  </div>
</template>
<script>
import pager from '@/mixins/pager'
import { treeTypes, types } from '@/config/rd-config'
import ZoneDateilDialog from './zone-detail-dialog'
import DataSearchDialog from './data-search-dialog'
import BloodRelDialog from './blood-rel-dialog'
import Table from './table'
import EsTable from './esTable'
// import { getTableInfo } from '@/api/asset/map-detail'
export default {
  name: 'TabInfo',
  mixins: [pager],
  components: {
    ZoneDateilDialog,
    DataSearchDialog,
    BloodRelDialog,
    Table,
    EsTable
  },
  props: {
    tableInfo: {
      type: Object
    },
    tableStructure: {
      type: Array
    },
    primarysTables: {
      type: Array
    },
    tableType: {
      type: [String, Number],
      default: ''
    },
    widthHeightData: Object
  },
  watch: {
    tableInfo: {
      handler (val) {
        this.tableInfoData = val
      },
      deep: true,
      immediate: true
    },
    tableStructure: {
      deep: true,
      immediate: true,
      handler (val) {
        this.tableData = val
      }
    },
    primarysTables: {
      deep: true,
      immediate: true,
      handler (val) {
        this.majorKeyData = val
      }
    }
  },
  data () {
    return {
      tableData: [],
      majorKeyData: [],
      zoneFieldData: [],
      zoneVisible: false,
      dataSearchVisible: false,
      bloodVisible: false,
      loading: 0,
      tableInfoData: {},
      zoneRowData: {},
      searchRowData: {},
      bloodRelData: {},
      sourceType: ''
    }
  },
  created () {
    // this.getTableInfo()
    this.sourceType = this.$route.query.source_type
  },
  methods: {
    // 获取表结构信息
    async getTableInfo () {
      // this.loading++
      // const params = {id: this.tableInfoData.id}
      // const res = await this.$simpleAsyncTo(getTableInfo(params), '获取表结构信息失败')
      // if (res) {
      //   this.tableData = res.data
      //   res.data.forEach(e => {
      //     if (e.major_key === 1) {
      //       this.majorKeyData.push(e)
      //     }
      //     if (e.zone_field === 1) {
      //       this.zoneFieldData.push(e)
      //     }
      //   })
      //   this.loading--
      // }
    },
    // 分区详情
    zoneDetailHandle (row) {
      this.zoneVisible = true
      this.zoneRowData = row
    },
    // 数据探查
    dataSearchClickHandle (row) {
      this.dataSearchVisible = true
      this.searchRowData = row
    },
    // 血缘关系
    bloodClickHandle (row) {
      this.bloodVisible = true
      this.bloodRelData = row
    },
    // 跳转关系维度逻辑表
    jumpLocation (row) {
      this.tableData = [
        {
          en_name: 'aaaa',
          name: 'id_1',
          data_type: 'ABC',
          heat: 2,
          tableType: 'logic'
        }
      ]
    },
    close (type) {
      if (type === 'zone') {
        this.zoneVisible = false
      }
      if (type === 'dataSearch') {
        this.dataSearchVisible = false
      }
      if (type === 'blood') {
        this.bloodVisible = false
      }
    }
  }
}
</script>

<style lang="scss">
.tab-info {
  .table-box {
    .el-table__row {
      td:first-child {
        border-right: 1px solid $grey7;
      }
      .heat {
        span {
          display: inline-block;
          width: 4px;
          height: 17px;
          background: $grey7;
          margin-right: 3px;
          &.active {
            background: $warning;
          }
        }
      }
    }
  }
  .animated {
    animation-duration: 0.3s;
  }
  .size-16 {
    font-size: 16px;
  }
  .has-gutter {
    > tr {
      th:first-child {
        > div {
          display: none;
        }
      }
    }
  }
  .el-dialog {
    background: $grey10;
  }
  .color {
    color: $grey5;
  }
}
</style>
