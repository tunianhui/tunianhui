<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2022-10-18 10:37:53
 * @LastEditTime: 2023-01-07 16:13:16
 * @Description:
-->
<template>
  <section class="output-info animated fadeInRight">
    <!-- <div class="flex-between">
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
    </div> -->
    <el-table :data="tableData"
              :max-height="tableHeight"
              style="width: 100%"
              class="b-r animated fadeInRight">
      <!-- <el-table-column type="index"
                       width="50"></el-table-column> -->
      <el-table-column show-overflow-tooltip
                       width="150"
                       prop="field1"
                       label="任务名称"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="field2"
                       label="来源表"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="field3"
                       label="目标表"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="field4"
                       label="来源数据源"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="field5"
                       label="负责人"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="field6"
                       label="写入次数"></el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="field7"
                       label="最近访问时间"></el-table-column>
    </el-table>
    <el-pagination class="fr pt-10"
                    background
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   :page-size="pageFilters.pageSize"
                   :page-sizes="pageSizes"
                   :current-page.sync="pageFilters.pageNo"
                   layout="total, prev, pager, next, jumper"
                   :total="total"></el-pagination>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import pager from '@/mixins/pager'
export default {
  name: 'OutputInfo',
  mixins: [pager],
  data () {
    return {
      tableData: [
        {
          field1: 'zg_test3',
          field2: 'test_nj_01',
          field3: 'moyi_tets_001',
          field4: 'v2_7_max',
          field5: 'SuperAdmin',
          field6: '26',
          field7: '2022-09-08 00:07:06'
        }
      ],
      tableHeight: 100,
      key_search: '',
      pageFilters: {
        pageSize: 10,
        pageNo: 1 // 前台分页使用
      }
    }
  },
  computed: {
    ...mapGetters(['asset_basic_data'])
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
