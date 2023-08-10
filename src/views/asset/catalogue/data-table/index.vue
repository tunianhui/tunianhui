<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-07-20 10:13:03
 * @LastEditTime: 2022-11-02 17:01:38
-->
<template>
  <div class='data-table' ref="dataTable">
    <section class="head" ref="head">
      <div class="head-title font-18">数据表管理</div>
    </section>
    <FilterFieldCard class="mb-10" ref="filterFieldCard" placeholder="搜索表名" @confirm="getTableList" :filterData="filterData"></FilterFieldCard>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
      <el-table-column prop="cube_code" label="表名">
        <template slot-scope="scope">
          <OverflowTooltip class="width">
            <div class="table-name">
              <el-tag size="mini">{{dics.status_tag.find(item => item.key === scope.row.status).value}}</el-tag>
              <span class="ml-5 cube_name" @click="_seeHandle(scope.row)">{{scope.row.cube_code}}</span>
            </div>
          </OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="oper_user" label="负责人">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.oper_user}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column prop="dataType" label="数据类型"></el-table-column>
      <el-table-column prop="project_code" label="所在数据库">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.project_code}}</OverflowTooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="tableAttribute" label="表属性">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.tableAttribute}}</OverflowTooltip>
        </template>
      </el-table-column> -->
      <el-table-column prop="create_time" label="更新时间">
        <template slot-scope="scope">
          <OverflowTooltip class="width">{{scope.row.create_time}}</OverflowTooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="_editHandle(scope.row)"></i></el-button>
          </el-tooltip>
          <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"><i class="el-icon-delete font-16 color-btn" title="删除" @click="_delHandle(scope.row)"></i></el-button>
          </el-tooltip> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
    <Dialog :visible="visible" :title="title" :data="curData" @close="close" :textTitle="textTitle" :textDes="textDes" :fn="fn">
    </Dialog>
    <Edit :visible="visibleEdit" :row="row" @close="closeEdit" :categoryList="categoryList" @refresh="refresh"></Edit>
    <Info :visible="visibleInfo" :row="row" @close="closeInfo"></Info>
  </div>
</template>

<script>
import mixin from '../mixin'
import pager from '@/mixins/pager'
import Edit from './edit'
import Info from './info'
import {
  getDataTableList
} from '@/api/asset/catalogue'
import {
  getProjectList
} from '@/api/plan/physical-datasource'
export default {
  name: 'CatalogueDataTable',
  props: {},
  mixins: [mixin, pager],
  components: {
    Edit,
    Info
  },
  data () {
    return {
      tableData: [],
      fixed: false,
      loading: 0,
      dataBaseList: [],
      filterData: []
    }
  },
  async created () {
    await this._getCategoryList()
    await this._getProjectList()
    this.filterData = [
      {
        label: '所属类目',
        id: '所属类目',
        options: this.categoryList
      },
      {
        label: '所属数据库',
        id: '所属数据库',
        options: this.dataBaseList
      },
      {
        label: '表状态',
        id: '表状态',
        options: this.dics.status_tag.map(item => {
          return {
            ...item,
            id: item.key,
            label: item.value
          }
        })
      }
    ]
    await this.getTableList()
  },
  methods: {
    async getTableList (curFilter = [], keyword = '') {
      this.loading++
      let params = {
        cube_name: keyword,
        catalog_id: '',
        project_id: '',
        status: '',
        pageSize: this.pageFilters.pageSize,
        pageNo: this.pageFilters.pageNo
      }
      curFilter.forEach(e => {
        switch (e.module) {
          case '所属数据库':
            params.project_id = e.value
            break
          case '表状态':
            params.status = e.value
            break
          case '所属类目':
            params.catalog_id = e.value
            break
        }
      })
      // await this.$sleep(2000)
      const res = await this.$simpleAsyncTo(getDataTableList(params), '获取数据失败')
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
      this.loading--
    },
    // 所属数据库
    async _getProjectList () {
      const res = await this.$simpleAsyncTo(getProjectList(), '获取失败')
      if (res) {
        this.dataBaseList = res.data.map(item => {
          return {
            id: item.id,
            label: item.project_code
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.data-table {
  height: 100%;
  position: relative;
  overflow-y: overlay;
  .head {
    padding-top: 10px;
    padding-bottom: 8px;
  }
  .width {
    width: calc(100% - 1px);
  }
  .cube_name {
    color: #2253d4;
  }
}

</style>
