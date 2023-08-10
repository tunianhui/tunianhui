<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-10-18 10:37:53
 * @LastEditTime: 2023-01-03 09:26:12
 * @Description:
-->
<template>
  <section class="output-info animated fadeInRight">
    <div class="flex-between">
      <h4>数据表列表</h4>
      <div class="right-search">
        <el-input v-model="key_search"
                  prefix-icon="el-icon-search"
                  @input="searchChange"
                  clearable
                  placeholder="请输入搜索关键字"
                  class="ml-10 mr-10"></el-input>
        <el-button icon="iconfont icon-filter"></el-button>
      </div>
    </div>
    <el-table :data="tableData"
              :max-height="tableHeight"
              style="width: 100%"
              class="b-r animated fadeInRight">
      <el-table-column type="selection"
                       width="55"></el-table-column>
      <el-table-column show-overflow-tooltip
                       width="150"
                       prop="cube_name"
                       label="表名称">
        <template slot-scope="{row}">
          <div class="flex-layout">
            <div class="icons">
              <i class="iconfont icon-yuanbiao-xianxing"></i>
            </div>
            <div class="name">
              <div>
                <OverflowTooltip>{{row.cube_code}}</OverflowTooltip>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="source_type"
                       label="存储类型"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="oper_user"
                       label="负责人"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="cycle_day"
                       label="生命周期(天)"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="hdfs_size"
                       label="存储量"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="create_time"
                       label="创建时间"></el-table-column>
    </el-table>
    <el-pagination class="fr pt-10"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :page-size="pageFilters.pageSize"
                   :page-sizes="pageSizes"
                   :current-page.sync="pageFilters.pageNo"
                   layout="total, prev, pager, next"
                   :total="total"></el-pagination>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  getDataTableList
} from '@/api/asset/list'
import pager from '@/mixins/pager'
export default {
  name: 'OutputInfo',
  mixins: [pager],
  data () {
    return {
      tableData: [],
      tableHeight: 100,
      key_search: ''
    }
  },
  computed: {
    ...mapGetters(['asset_basic_data', 'cube_id'])
  },
  created () {
    this.getOutputInfo()
  },
  mounted () {
    this.$nextTick(_ => {
      this.tableHeight = window.innerHeight - 245
    })
  },
  methods: {
    searchChange () {
      this.getOutputInfo()
    },
    async getOutputInfo () {
      const params = {
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo,
        id: this.asset_basic_data.id,
        key_search: this.key_search
      }
      const res = await this.$simpleAsyncTo(getDataTableList(params))
      if (res) {
        this.tableData = res.data.table_data
        this.total = res.data.total_records
      }
    },
    handleCurrentChange (val) {
      this.pageFilters.pageNo = val
      this.getOutputInfo()
    }
  }
}
</script>
<style lang="scss" scoped>
.output-info {
  .right-search {
    .el-input {
      width: 180px !important;
    }
  }
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
}
</style>
