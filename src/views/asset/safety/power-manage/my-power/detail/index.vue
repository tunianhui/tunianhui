<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-05-07 15:54:23
 * @Description: 详情
-->
<template>
  <section class="logic-table-authority monitor-filter table-authority">
    <div class="space-between header mb-10 pr-20 pl-10">
      <div class="left">
        <div class="title-wrapper mr-20">
          <i class="iconfont icon-shenqingjilu"></i>
          <div class="title">{{data.title}}</div>
        </div>
        <div class="detail">
          <div class="mt-10">{{info.cube_code}}</div>
          <div class="info">
            <span>项目：<span class="value">{{info.project_name}}</span></span>
            <span>权限账号：<span class="value">{{info.account_type_name}}</span></span>
            <span>环境：<span class="value">{{info.environment}}</span></span>
            <span>是否 Owner：<span class="value">{{info.isOwner}}</span></span>
          </div>
        </div>
      </div>
      <div>
        <el-button type="primary"
                   @click="returnAuthority">交还{{data.title}}</el-button>
      </div>
    </div>
    <el-card class="box-card mb-10"
             ref="card">
      <div slot="header"
           class="current flex-layout">
        <span class="search">
          <el-input v-model="keyword"
                    prefix-icon="el-icon-search"
                    placeholder="请输入关键字"
                    @input.native="searchFilterTable"></el-input>
        </span>
        <div class="list flex-layout">
          <div class="item active"
               v-for="(item, index) in current"
               :key="item.value">
            <span>{{item.large_class}}：</span>
            <OverflowTooltip style="max-width:100px">{{item.type}}</OverflowTooltip>
            <div class="close"
                 @click="closeCurrentHandle(index, item)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>
      </div>
      <section>
        <div class="group flex-layout pt-10 pb-10"
             v-for="(v) in filterList"
             :key="v.id"
             v-show="toggle">
          <div class="label"><span>{{v.des}}</span></div>
          <div class="options">
            <div class="flex-wrap"
                 v-if="v.id!=='dateList'">
              <div :class="['item', {'active':item.is_select}]"
                   v-for="item in v.options"
                   :key="item.value"
                   @click="selectHandle(v,item)">
                <OverflowTooltip style="max-width:100px">{{item.des}}</OverflowTooltip>
                <div class="close"
                     v-if="item.is_select"
                     @click.stop="closeSelect(item)">
                  <i class="el-icon-close"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="toggle"
           @click="toggle=!toggle">
        <i :class="['icon iconfont', toggle?'icon-shousuoxiajiantou':'icon-shousuoshangjiantou']"></i>
      </div>
    </el-card>

    <el-card class="table-record"
             v-if="tableData.length">
      <el-table :data="tableData"
                style="width: 100%"
                ref="table"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column type="index"
                         label="序号"
                         width="55">
        </el-table-column>
        <el-table-column prop="cube_code"
                         label="字段名">
        </el-table-column>
        <el-table-column prop="desc"
                         label="字段描述"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="element_type"
                         label="数据类型"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="auth_type"
                         label="权限类型"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="tag"
                  v-if="scope.row.auth_type">
              <OverflowTooltip>{{scope.row.auth_type}}</OverflowTooltip>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="valid_end_time"
                         label="有效期至"
                         show-overflow-tooltip>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>
import {
  getLogicTableDetail,
  getPhysicsTableDetail,
  returnLogicTableAuthority
} from '@/api/asset/authority.js'
import OverflowTooltip from '@c/overflow-tooltip'
import { getFilterList } from '../logic/data.js'
import safety from '@/mixins/safety'
export default {
  name: 'TableAuthorityDetail',
  mixins: [safety],
  inject: ['tabStore', 'components'],
  components: {
    OverflowTooltip
  },
  props: {
    data: Object
  },
  data () {
    return {
      keyword: '',
      info: {},
      tableData: [],
      multipleSelection: [],
      id: '',
      cube_codes: ''
    }
  },
  computed: {},
  created () {
    this.getFilterList()
  },
  mounted () {
    this.id = this.data.id
    this.getTableList()
  },
  methods: {
    // 交还权限
    returnAuthority () {
      this.$confirm(`是否交还${this.data.title}权限`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async _ => {
        const res = await this.$simpleAsyncTo(
          returnLogicTableAuthority({
            id: this.id,
            cube_codes: this.cube_codes,
            type: this.data.type
          })
        )
        if (res) {
          // 刷新列表 --->
          this.getTableList()
          this.$message({
            showClose: true,
            message: '交还成功！',
            type: 'success'
          })
        }
      })
    },

    handleSelectionChange (val) {
      this.cube_codes = val.map(ele => ele.cube_code).join(',')
    },

    async getTableList () {
      const fn = this.data.title === '逻辑表权限' ? getLogicTableDetail : getPhysicsTableDetail
      const res = await this.$simpleAsyncTo(
        fn({ id: this.id, keyword: this.keyword }),
        '获取列表失败'
      )
      if (res) {
        this.info = res.data
        this.tableData = res.data.columns
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
    },

    selectHandle (v, item) {
      this.currentValue = item.value
      v.options.forEach(e => {
        e.is_select = false
      })
      item.is_select = true
      let index = this.current.findIndex(e => e.large_value === v.id)
      if (index > -1) {
        this.current.splice(index, 1, { large_class: v.des, large_value: v.id, type: item.des, value: item.value })
      } else {
        this.current.push({
          large_class: v.des,
          large_value: v.id,
          type: item.des,
          value: item.value
        })
      }
    },

    closeSelect (v) {
      v.is_select = false
      this.currentValue = ''
      let index = this.current.findIndex(e => {
        return v.value === e.value
      })
      this.current.splice(index, 1)
    },

    searchFilterTable () {
      this.getTableList()
    },

    closeCurrentHandle (index, item) {
      this.current.splice(index, 1)
      this.filterList.forEach(e => {
        if (e.id === item.large_value) {
          e.options.forEach(v => {
            if (v.value === item.value) {
              v.is_select = false
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/monitor.scss';
</style>

<style lang="scss" scoped>
// .tag {
//   display: inline-block;
//   width: 50px;
//   text-align: center;
//   line-height: 25px;
//   background: $screenItemTag;
// }

.header {
  height: 80px;
  .left {
    display: flex;
    height: 100%;
    .title-wrapper {
      width: 80px;
      background-color: #ff8746;
      text-align: center;
      padding-top: 20px;
      .icon-shenqingjilu {
        font-size: 24px;
        color: #fff;
      }
      .title {
        font-size: 12px;
        color: #fff;
        margin-top: 10px;
      }
    }
    .detail {
      .info {
        margin-top: 15px;
        font-size: 12px;
        color: #999;
        .value {
          font-size: 13px;
          color: #000;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
