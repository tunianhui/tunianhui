<template>
  <section class="data-source-authority monitor-filter table-authority">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>API权限</div>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="apiApply">申请API权限</el-button>
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
      <section v-if="filterList.length">
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
      <div class="toggle" @click="toggle=!toggle" v-if="filterList.length">
        <i :class="['icon iconfont', toggle?'icon-shousuoxiajiantou':'icon-shousuoshangjiantou']"></i>
      </div>
    </el-card>
    <ApiTableInfo v-if="tableData.length" :tableData="tableData"></ApiTableInfo>
    <NoData title="API权限" v-else></NoData>
  </section>
</template>

<script>
import safety from '@/mixins/safety'
import NoData from '@c/no-data'
import ApiTableInfo from '../comps/tableInfo.vue'
import { safetyType } from '@/config/safety-config'
export default {
  name: 'APIPower',
  mixins: [safety],
  inject: ['tabStore', 'components'],
  components: {
    NoData,
    ApiTableInfo
  },
  data () {
    return {
      tableData: [
        {
          'cube_code': 'dws_phone_hour',
          'cube_name': '号码维度汇总表_小时',
          'auth_type': '1',
          'busin_name': '网络安全',
          'account_type': '0',
          'environment': '测试环境',
          'account_name': 'admin'
        }
      ]
    }
  },
  methods: {
    apiApply () {
      // 新增弹窗
      this.tabStore.commit('add', {
        label: `申请API权限`,
        name: safetyType.APIPOWER,
        component: 'ApplyDatasource',
        data: { modelKey: 'service_api_auth_flow', name: safetyType.APIPOWER }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
</style>
