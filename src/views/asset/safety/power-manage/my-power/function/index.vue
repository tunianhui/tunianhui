<template>
  <section class="function-authority monitor-filter table-authority">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div>功能权限</div>
      <div>
        <!-- 功能权限页面没有申请权限的入口。在浏览其他版块时，如果该板块在注册权限时设置了访问权限管理，则浏览相应版块会有没有权限的提示。 -->
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
    <el-card class="table-record" v-if="tableData.length">
      <el-table :data="tableData" style="width: 100%" ref="table">
        <el-table-column prop="project_name" label="数据对象">
          <template slot-scope="scope">
            <div class="color">
              <OverflowTooltip style="width:150px">
                {{scope.row.project_name}}
              </OverflowTooltip>
            </div>
            <OverflowTooltip style="width:150px">{{scope.row.project_id}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="trem" label="有效期至" show-overflow-tooltip>
          <template slot-scope="scope">
            <OverflowTooltip>{{scope.row.trem}}</OverflowTooltip>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="权限高低" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="tag" v-if="scope.row.level">
              <OverflowTooltip>{{scope.row.level}}</OverflowTooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ownership" label="权限归属" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <OverflowTooltip style="width:150px">{{scope.row.ownership}}</OverflowTooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="授权信息" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>
              <OverflowTooltip style="width:150px">{{scope.row.gave_info}}</OverflowTooltip>
            </div>
            <div class="font" v-if="scope.row.gave_info">
              <OverflowTooltip style="width:150px">({{scope.row.gave_info}})</OverflowTooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <NoData v-else title="功能权限"></NoData>
  </section>
</template>

<script>
import { getFilterList } from './data.js'
import OverflowTooltip from '@c/overflow-tooltip'
import safety from '@/mixins/safety'
import NoData from '@c/no-data'
export default {
  name: 'FunctionAuthority',
  mixins: [safety],
  inject: ['tabStore', 'components'],
  components: {
    OverflowTooltip,
    NoData
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
  created () {
    this.getFilterList()
  },
  methods: {
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

    // apply () {
    //   this.tabStore.commit('add', {
    //     label: `申请功能权限`,
    //     name: safetyType.FUNCTIONPOWER,
    //     component: 'ApplyFunc'
    //   })
    // }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
</style>
