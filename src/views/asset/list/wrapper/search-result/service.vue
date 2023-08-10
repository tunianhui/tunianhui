<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-11-25 10:47:48
 * @LastEditTime: 2023-03-06 18:15:20
 * @Description:
-->
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
            <div class="label-title">分组</div>
            <el-select v-model="searchFormLeft.group_id" clearable placeholder="请选择分组" filterable @change="changeDataSource">
              <el-option v-for="item in groupList" :key="item.group_id" :label="item.group_name" :value="item.group_id"></el-option>
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
            <el-table-column show-overflow-tooltip label="数据API名称" width="350">
              <template slot-scope="{row}">
                <div class="flex-layout" @click="detailsCheckHandle(row)">
                  <div class="icons mr-10">
                    <i :class="['iconfont icon-nav_icon_fuwuqiguanl']"></i>
                  </div>
                  <div class="name">
                    <!-- <div>
                      <OverflowTooltip v-if="row.api_code">{{row.api_code}}</OverflowTooltip>
                    </div> -->
                    <div>
                      <OverflowTooltip class="item-detail">{{row.api_name}}</OverflowTooltip>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="group_name" label="分组"></el-table-column>
            <el-table-column show-overflow-tooltip prop="api_remark" label="描述"></el-table-column>
            <el-table-column show-overflow-tooltip prop="oper_user" label="服务情况">
              <template slot-scope="{row}">
                <div>应用数：{{row.app_num}}</div>
                <div>调用次数：{{row.call_num}}</div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="publish_person" label="负责人"></el-table-column>
            <el-table-column show-overflow-tooltip prop="publish_time" label="发布时间"></el-table-column>
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
  getGroupList,
  getServerList
} from '@/api/asset/list'
export default {
  name: 'SearchResult-Service',
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
      asset_basic_data: {},
      tableList: [],
      groupList: [],
      iconMapColor
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
      this.getProjectList()
      this.getTableList()
    },

    initParams () {
      return {
        pageNo: 1,
        pageSize: 10,
        group_id: ''
      }
    },

    // 左侧函数名称下拉
    async getProjectList () {
      const res = await this.$simpleAsyncTo(getGroupList({ keyword: this.keyword }), '获取函数名称失败')
      if (res) {
        this.groupList = res.data
      }
    },

    async changeDataSource (val) {
      this.getTableList()
    },

    resetHandle () {
      this.searchFormLeft = this.initParams()
      this.getTableList()
    },

    // 获取结果列表
    async getTableList () {
      const tempParams = {
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize,
        keyword: this.keyword,
        group_id: this.searchFormLeft.group_id
      }
      const res = await this.$simpleAsyncTo(getServerList(tempParams), '获取列表失败')
      if (res) {
        this.asset_basic_data = res.data.basic_data
        this.total = res.data.total_records
        this.tableList = res.data.service_data
      }
    },

    detailsCheckHandle (val) {
      localStorage.setItem('keyword', this.keyword)
      this.$router.push({ name: 'service-detail' })
      this.setCubeId(val.api_id)
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
      .refresh-opt {
        cursor: pointer;
      }
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
