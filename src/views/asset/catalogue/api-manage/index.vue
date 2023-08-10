<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-07-20 10:13:03
 * @LastEditTime: 2022-11-02 17:27:13
-->
<template>
  <div class='api-manage'>
    <section class="head" ref="head">
      <div class="head-title font-18">API管理</div>
    </section>
    <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="搜索API名或ID" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
      <el-table-column prop="api_name" label="API名">
        <template slot-scope="scope">
          <OverflowTooltip class="width">
            <div class="name">
              <el-tag v-if="scope.row.status === '1'" type="success" size="mini">上线</el-tag>
              <el-tag v-if="scope.row.status === '0'" type="danger" size="mini">下线</el-tag>
              <el-button type="text" class="ml-5" @click="_seeHandle(scope.row)">{{scope.row.api_name}}</el-button>
            </div>
          </OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="负责人">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.creator}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="update_time" label="更新时间">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.update_time}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="_editHandle(scope.row)"></i></el-button>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" :content="scope.row.status == '0' ? '上线' : '下线'" placement="top">
            <el-button type="text"><i class="el-icon-warning-outline font-16 color-btn" title="下线" @click="_offlineHandle(scope.row)"></i></el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
    <Edit :visible="visibleEdit" :row="row" @close="closeEdit" :categoryList="categoryList" @refresh="refresh"></Edit>
  </div>
</template>

<script>
import mixin from '../mixin'
import pager from '@/mixins/pager'
import Edit from './edit'
import {
  getApiList
} from '@/api/asset/catalogue'
export default {
  name: 'CatalogueApiManage',
  props: {},
  mixins: [mixin, pager],
  components: { Edit },
  data () {
    return {
      fixed: false,
      loading: 0,
      tableData: [],
      filterData: []
    }
  },
  async created () {
    await this._getCategoryList()
    this.filterData = [
      {
        label: '所属类目',
        id: '所属类目',
        options: this.categoryList
      },
      {
        label: 'API状态',
        id: 'API状态',
        options: [
          {
            id: '0',
            label: '下线'
          }, {
            id: '1',
            label: '上线'
          }
        ]
      }
    ]
    await this.getTableList()
  },
  methods: {
    async getTableList (curFilter = [], keyword = '') {
      this.loading++
      let params = {
        api_name: keyword,
        catalog_id: '',
        status: '',
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case 'API状态':
            params.status = e.value
            break
          case '所属类目':
            params.catalog_id = e.value
            break
        }
      })
      // await this.$sleep(2000)
      const res = await this.$simpleAsyncTo(getApiList(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    }
  }
}
</script>

<style lang="scss">
.api-manage {
  height: 100%;
  position: relative;
  overflow-y: overlay;
  .head {
    padding-top: 10px;
    padding-bottom: 8px;
  }
}

</style>
