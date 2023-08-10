<template>
  <section class="data-source-authority monitor-filter table-authority">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>数据源权限</div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="apply">申请数据源权限</el-button>
        <span class="new-btn ml-10">
          <i class="el-icon-refresh-right"></i>
        </span>
      </div>
    </div>
    <el-card class="box-card mb-10" ref="card">
      <div slot="header" class="current flex-layout">
        <span class="search">
          <el-input v-model="searchValue" prefix-icon="el-icon-search" placeholder="请输入关键字" @input.native="searchFilterTable"></el-input>
        </span>
        <div class="list flex-layout">
          <div class="item active" v-for="(item, index) in current" :key="item.value">
            <span>{{item.large_class}}：</span>
            <OverflowTooltip style="max-width:100px">{{item.type}}</OverflowTooltip>
            <div class="close" @click="closeCurrentHandle(index, item)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
      </div>
      <section>
        <div class="group flex-layout pt-10 pb-10" v-for="(v) in filterList" :key="v.id" v-show="toggle">
          <div class="label"><span>{{v.des}}</span></div>
          <div class="options">
            <div class="flex-wrap" v-if="v.id!=='dateList'">
              <div :class="['item', {'active':item.is_select}]" v-for="item in v.options" :key="item.value" @click="selectHandle(v,item)">
                <OverflowTooltip style="max-width:100px">{{item.des}}</OverflowTooltip>
                <div class="close" v-if="item.is_select" @click.stop="closeSelect(item)">
                  <i class="el-icon-close"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="toggle" @click="toggle=!toggle">
        <i :class="['icon iconfont', toggle?'icon-shousuoxiajiantou':'icon-shousuoshangjiantou']"></i>
      </div>
    </el-card>

    <dataSourceTableInfo type="dataSource" :tableData="tableData" v-if="tableData.length" @showDetail='returnAuthority'></dataSourceTableInfo>
    <NoData title="数据源权限" v-else></NoData>
  </section>
</template>

<script>
import {
  getDataSourceTable,
  returnLogicTableAuthority
} from '@/api/asset/authority.js'
import safety from '@/mixins/safety'
import OverflowTooltip from '@c/overflow-tooltip'
import NoData from '@c/no-data'
import dataSourceTableInfo from '../comps/tableInfo.vue'
import { getFilterList } from './data.js'
import { safetyType } from '@/config/safety-config'
export default {
  name: 'DataSoueceauthority',
  mixins: [safety],
  inject: ['tabStore', 'components'],
  components: {
    OverflowTooltip,
    NoData,
    dataSourceTableInfo
  },
  data () {
    return {
      tableData: [
        // {
        //   'cube_code': 'dws_phone_hour',
        //   'cube_name': '号码维度汇总表_小时',
        //   'auth_type': '1',
        //   'busin_name': '网络安全',
        //   'account_type': '0',
        //   'environment': '测试环境',
        //   'account_name': 'admin'
        // }
      ]
    }
  },
  computed: {
    tabs () {
      return JSON.parse(JSON.stringify(this.tabList)) || []
    }
  },
  created () {
    this.getFilterList()
    this.getTableList()
  },
  methods: {
    apply () {
      this.tabStore.commit('add', {
        label: `申请数据源权限`,
        name: safetyType.DATASOURCEPOWER,
        component: 'ApplyDatasource',
        data: { modelKey: 'service_ds_auth_flow', name: safetyType.DATASOURCEPOWER }
      })
    },

    // 交还权限
    returnAuthority (item) {
      this.$confirm(`是否交还数据源权限`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        const res = await this.$simpleAsyncTo(
          returnLogicTableAuthority({
            id: item.id,
            cube_codes: item.cube_codes,
            type: 2
          })
        )
        if (res) {
          this.$message({
            showClose: true,
            message: '交还成功！',
            type: 'success'
          })
        }
      })
    },

    async getTableList () {
      const res = await this.$simpleAsyncTo(
        getDataSourceTable(),
        '获取列表失败'
      )
      if (res) {
        this.tableData = res.data
        this.total = res.totalRecords
      }
    },

    async getFilterList () {
      const res = await this.$simpleAsyncTo(getFilterList(), '获取过滤条件失败')
      if (res) {
        this.filterList = res.data.map(e => {
          e.options.forEach(v => {
            v.is_select = false
          })
          return e
        })
      }
    }

  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
</style>
