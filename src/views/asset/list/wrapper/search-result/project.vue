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
            <div class="label-title">业务板块</div>
            <el-select v-model="searchFormLeft.busin_id" clearable placeholder="请选择业务板块" filterable @change="changeBusin">
              <el-option v-for="item in businInfoList" :key="item.busin_id" :label="item.busin_name" :value="item.busin_id"></el-option>
            </el-select>
            <div class="label-title">空间类型</div>
            <el-select v-model="searchFormLeft.space_type_id" clearable placeholder="请选择空间类型" filterable @change="changeSpaceType">
              <el-option v-for="item in spaceTypeInfoList" :key="item.space_type_id" :label="item.space_type_name" :value="item.space_type_id"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="right-result flex-1">
        <div class="list-title flex-layout">
          <div class="flex-1">
            结果列表
          </div>
          <!-- <i class="el-icon-refresh-left" @click="refreshVisible = true" title="刷新"></i> -->
        </div>
        <div class="table-list">
          <el-table :data="tableList" style="width: 100%">
            <el-table-column show-overflow-tooltip label="项目名称" width="350">
              <template slot-scope="{row}">
                <div class="flex-layout" @click="detailsCheckHandle(row)">
                  <div class="icons mr-10">
                    <i :class="['iconfont icon-xiangmu']"></i>
                  </div>
                  <div class="name">
                    <div>
                      <OverflowTooltip v-if="row.project_code">{{row.project_code}}</OverflowTooltip>
                    </div>
                    <div>
                      <OverflowTooltip class="item-detail" v-if="row.project_code">({{row.project_name}})</OverflowTooltip>
                      <OverflowTooltip class="item-detail" v-else>{{row.project_name}}</OverflowTooltip>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="busin_name" label="业务板块"></el-table-column>
            <el-table-column show-overflow-tooltip prop="space_type" label="空间类型"></el-table-column>
            <el-table-column show-overflow-tooltip prop="table_count" label="表数量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="project_user_count" label="成员数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="create_time" label="创建时间"></el-table-column>
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
  getBusinessFieldInfo,
  getSpaceTypeInfo,
  getProjectList
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
      searchFormLeft: this.initParams(),
      tableList: [],
      businInfoList: [],
      spaceTypeInfoList: [],
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
      this.getBusinessList()
      this.getSpaceTypeList()
      this.getTableList()
    },

    initParams () {
      return {
        pageNo: '1',
        pageSize: '10',
        busin_id: ''
      }
    },

    // 左侧业务板块下拉
    async getBusinessList () {
      const res = await this.$simpleAsyncTo(getBusinessFieldInfo({ keyword: this.keyword }), '获取业务板块失败')
      if (res) {
        this.businInfoList = res.data
      }
    },

    // 左侧空间类型下拉
    async getSpaceTypeList () {
      const res = await this.$simpleAsyncTo(getSpaceTypeInfo({ keyword: this.keyword }), '获取空间类型失败')
      if (res) {
        this.spaceTypeInfoList = res.data
      }
    },

    async changeBusin (val) {
      this.getTableList()
    },

    async changeSpaceType (val) {
      this.getTableList()
    },

    resetHandle () {
      this.searchFormLeft = this.initParams()
      this.getTableList()
    },

    // 获取结果列表
    async getTableList () {
      const tempParams1 = {
        pageNo: this.pageFilters.pageNo,
        pageSize: this.pageFilters.pageSize,
        keyword: this.keyword,
        busin_id: this.searchFormLeft.busin_id,
        space_type_id: this.searchFormLeft.space_type_id
      }
      const res = await this.$simpleAsyncTo(getProjectList(tempParams1), '获取列表失败')
      if (res) {
        this.total = res.data.total_records
        this.tableList = res.data.project_data
      }
    },

    detailsCheckHandle (val) {
      localStorage.setItem('keyword', this.keyword)
      this.$router.push({ name: 'project-detail' })
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
