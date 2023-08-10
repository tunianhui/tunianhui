<template>
  <div class="search-wrapper">
    <section class="search-result flex-layout">
      <div class="left-condition">
        <div class="condition-box">
          <div>
            <div class="screen">
              <span class="filter-text">条件筛选</span>
              <span @click="resetHandle" class="refresh-opt"><i class="el-icon-refresh-right"></i> 重置</span>
            </div>
            <div class="label-title">存储类型</div>
            <el-select v-model="searchFormLeft.data_source_type" clearable placeholder="请选择存储类型" filterable @change="changeFunc">
              <el-option v-for="item in dataSourceTypeList" :key="item.data_source_type" :label="item.data_source_type_name" :value="item.data_source_type"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="right-result flex-1">
        <div class="list-title flex-layout">
          <div class="flex-1">
            结果列表
          </div>
        </div>
        <div class="table-list">
          <el-table :data="tableList" style="width: 100%">
            <el-table-column show-overflow-tooltip label="数据源名称" width="350">
              <template slot-scope="{row}">
                <div class="flex-layout" @click="detailsCheckHandle(row)">
                  <div class="icons mr-10">
                    <i :class="['iconfont icon-yuanshuju']"></i>
                  </div>
                  <div class="name">
                    <div>
                      <OverflowTooltip v-if="row.data_source_code">{{row.data_source_code}}</OverflowTooltip>
                    </div>
                    <div>
                      <OverflowTooltip class="item-detail" v-if="row.data_source_code">({{row.data_source_name}})</OverflowTooltip>
                      <OverflowTooltip class="item-detail" v-else>{{row.data_source_name}}</OverflowTooltip>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="data_source_type" label="存储类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="data_source_use" label="数据源用途"></el-table-column>
            <el-table-column show-overflow-tooltip prop="oper_user" label="负责人"></el-table-column>
            <el-table-column show-overflow-tooltip prop="data_source_desc" label="描述"></el-table-column>
            <el-table-column show-overflow-tooltip prop="connect_info" label="备注">
              <template slot-scope="row">
                <el-tooltip placement="top">
                  <div slot="content">
                    <div v-html="getConnectIfo(row)"></div>
                  </div>
                  <span>连接信息<i class="el-icon-question"></i></span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="oper_time" label="更新时间"></el-table-column>
          </el-table>
        </div>
        <el-pagination class="fr pt-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { iconMapColor } from '@/config/rd-config.js'
import pager from '@/mixins/pager'
import {
  getDataSourceList,
  getDataSourceType
} from '@/api/asset/list'
export default {
  name: 'SearchResult',
  mixins: [pager],
  props: {
    keyword: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: false,
      searchFormLeft: {
        data_source_name: ''
      },
      dataSourceTypeList: [],
      tableList: [],
      iconMapColor
    }
  },
  watch: {
  },
  computed: {
    getConnectIfo () {
      return function (val) {
        if (val.row.connect_info) {
          let str = ''
          Object.entries(val.row.connect_info).map(([key, value]) => {
            str += `${key}: ${value}<br/>`
          })
          return str
        }
      }
    }
  },

  created () {
    this.updateData()
  },
  methods: {
    ...mapMutations({
      setAssetBasicData: 'SET_ASSET_BASIC_DATA',
      setCubeId: 'SET_CUBE_ID'
    }),

    updateData () {
      this.getTableList()
      this.getDataSourceTypeList()
    },

    initParams () {
      return {
        pageNo: '1',
        pageSize: '10',
        data_source_type: ''
      }
    },

    changeDataSource () {
      this.getTableList()
    },

    async changeFunc (val) {
      this.getTableList()
    },

    resetHandle () {
      this.searchFormLeft = this.initParams()
      this.getTableList()
    },

    // 数据源-存储类型
    async getDataSourceTypeList () {
      const res = await this.$simpleAsyncTo(getDataSourceType({ keyword: this.keyword }), '获取列表失败')
      if (res) {
        this.dataSourceTypeList = res.data
      }
    },

    // 获取结果列表
    async getTableList () {
      const params = {
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize,
        keyword: this.keyword,
        data_source_type: this.searchFormLeft.data_source_type
      }
      const res = await this.$simpleAsyncTo(getDataSourceList(params), '获取列表失败')
      if (res) {
        this.total = res.data.total_records
        this.tableList = res.data.source_data
      }
    },

    detailsCheckHandle (val) {
      localStorage.setItem('keyword', this.keyword)
      this.$router.push({ name: 'dataSource-detail' })
      this.setCubeId(val.id)
      this.setAssetBasicData(val)
    },

    handleCurrentChange (val) {
      this.pageFilters.pageNo = val
      this.getTableList()
    }
  }
}
</script>
<style lang="scss" scoped>
$leftWidth: 360px;
.search-wrapper {
  height: 100%;
}
.search-result {
  padding: 0 10px 10px 10px;
  min-height: calc(100% - 100px);
  background-color: $grey8;
  height: 100%;
  .iconfont {
    margin-right: 5px;
    color: #39c254;
  }
  .left-condition {
    width: $leftWidth;
    background: #fff;
    padding: 20px;
    .screen {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      font-size: 14px;
    }
  }
  .right-result {
    padding: 0 0 0 10px;
    .list-title {
      height: 28px;
      line-height: 28px;
      display: flex;
      align-items: center;
      margin: 10px 0;
      i {
        font-size: 16px;
        cursor: pointer;
      }
    }
    .table-list {
      background: $grey10;
      padding: 20px 20px 0 20px;
      margin-bottom: 10px;
      height: calc(100% - 160px);
      overflow: auto;
      .icons {
        display: flex;
        align-items: center;
        i {
          font-size: 28px;
          // color: $warning;
        }
      }
      .name {
        font-size: 14px;
        cursor: pointer;
        width: calc(100% - 20px);
        > h4 {
          span {
            width: calc(100% - 20px);
          }
        }
      }
      .info {
        font-size: 12px;
        > div {
          width: 33.33333%;
          span {
            width: calc(100% - 80px);
            color: $grey2;
          }
        }
      }
    }
    .color {
      color: $grey4;
    }
  }
}
</style>
