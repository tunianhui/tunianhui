<template>
  <section class="search-result flex-layout">
    <div class="left-condition">
      <div class="condition-box">
        <div class="screen">
          <span>筛选</span>
          <span @click="resetHandle"><i class="el-icon-refresh-right"></i> 重置</span>
        </div>
        <div class="screen-list">
          <span class="screen-item active" v-for="item in currentList" :key="item.parent">
            <span>{{item.parent_value}}：</span>
            <OverflowTooltip>{{item.value}}</OverflowTooltip>
            <div class="close">
              <i class="el-icon-close" @click="closeHandle(item)"></i>
            </div>
          </span>
        </div>
        <!-- 业务属性 -->
        <div class="attr-items">
          <div class="attr-item" v-for="item in attrItemList" :key="item.key">
            <div class="screen">
              <span>{{item.value}}</span>
              <span @click="toggleHandle(item)">
                {{item.toggle?'展开':'收起'}}
                <i :class="[item.toggle?'iconfont icon-shousuoxiajiantou':'iconfont icon-shousuoshangjiantou']"></i>
              </span>
            </div>
            <div :class="{'sub-item-height':item.toggle}">
              <div v-for="o in item.children" :key="o.key">
                <div class="type-title font-12 mb-10">
                  <span>{{o.value}}</span>
                </div>
                <div class="screen-list" :ref="`screen-${o.key}`">
                  <div class="sub-toggle">
                    <!-- <i class="iconfont icon-shousuoxiajiantou"></i> -->
                  </div>
                  <span :class="['screen-item', i.is_select?'active':'']" v-for="(i) in o.children" :key="i.code" @click="selectItemHandle(i, o)" :ref="`selectItem-${i.value}`">
                    <!-- <span>业务板块：</span> -->
                    <OverflowTooltip>{{i.value}}</OverflowTooltip>
                    <div class="close" v-if="i.is_select" @click.stop="closeSubItemHandle(i)">
                      <i class="el-icon-close"></i>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right-result flex-1">
      <div class="list-title flex-layout">
        <div class="flex-1">
          搜索结果
        </div>
        <div class="sort">
          <span>排序：</span>
          <span v-for="(item, index) in sortList" :key="item.id" :class="[sortClass===index?'active':'']" @click="sortClick(index, item.id)">{{item.label}}</span>
        </div>
      </div>
      <div class="table-list">
        <el-row v-loading="!!loading">
          <el-col :span="24" class="flex-layout list-item" v-for="item in tableList" :key="item.cube_id" @click.native="detailsCheckHandle(item)">
            <div class="flex-layout">
              <div class="icons mr-15">
                <i :class="['mr-10', iconMapColor[item.object_type]]"></i>
              </div>
              <div class="name">
                <h4>
                  <OverflowTooltip>{{item.cube_code}}</OverflowTooltip>
                  <OverflowTooltip v-if="item.cube_name">({{item.cube_name}})</OverflowTooltip>
                </h4>
                <div class="desc mt-10">{{item.desc}}</div>
              </div>
            </div>
            <div class="flex-1 flex-layout info">
              <div class="Person flex-1">
                <div class="color">负责人</div>
                <OverflowTooltip class="mt-10">{{item.oper_user}}</OverflowTooltip>
              </div>
              <div class="module flex-1">
                <div class="color">所属项目</div>
                <OverflowTooltip class="mt-10">{{item.project_name}}</OverflowTooltip>
              </div>
              <div class="module flex-1">
                <div class="color">创建时间</div>
                <OverflowTooltip class="mt-10">{{item.create_time}}</OverflowTooltip>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-pagination class="fr pt-10" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :page-sizes="pageSizes" :current-page.sync="pageFilters.pageNo" layout="total, prev, pager, next" :total="total"></el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
import { mapMutations } from 'vuex'
import { iconMapColor } from '@/config/rd-config.js'
import pager from '@/mixins/pager'
import {
  getSearchParams,
  getSearchResult
} from '@/api/asset/map'
export default {
  name: 'SearchResult',
  components: {
    OverflowTooltip
  },
  mixins: [pager],
  data () {
    return {
      loading: false,
      attrItemList: [],
      currentList: [],
      tableList: [],
      sortClass: 0,
      sortId: 1,
      type: {
        businessPart: '业务属性',
        developPart: '开发属性',
        dataPart: '数据属性',
        dataField: '数据域',
        businessField: '业务板块',
        businessProcess: '业务过程',
        dimension: '维度',
        project: '所属项目',
        tableObjType: '表实体类型',
        tableType: '表类型'
      },
      sortList: [
        { label: '综合', id: 1 },
        { label: '创建时间', id: 2 },
        { label: '热门', id: 3 }
      ],
      iconMapColor
    }
  },
  watch: {
    deep: true,
    keyword: {
      handler (val) {
        let params = this.initParams()
        params.keyword = val
        this.pageFilters.pageNo = 1
        this.getParams(params)
        this.getTableList(params)
        this.getSearchParams(val)
      }
    },
    currentList: {
      deep: true,
      handler (val) {
        let params = this.initParams()
        params.keyword = this.keyword || ''
        this.pageFilters.pageNo = 1
        this.getParams(params)
        this.getTableList(params)
      }
    }
  },
  computed: {
    keyword () {
      return JSON.parse(this.$route.query.data).keyword
    }
  },
  async created () {
    await this.getSearchParams(this.keyword)
    let params = this.initParams()
    params.keyword = this.keyword || ''
    this.pageFilters.pageNo = 1
    this.getParams(params)
    await this.getTableList(params)
  },
  methods: {
    ...mapMutations({
      setCubeId: 'SET_CUBE_ID'
    }),
    initParams () {
      return {
        keyword: '',
        orderBy: '',
        pageSize: '',
        pageNo: '',
        business_field_id: '',
        data_field_id: '',
        process_id: '',
        dim_id: '',
        table_type: '',
        project_id: '',
        table_object_type: ''
      }
    },
    getParams (params) {
      params.pageSize = this.pageFilters.pageSize
      params.pageNo = this.pageFilters.pageNo
      params.orderBy = this.sortId
      this.currentList.forEach(e => {
        switch (e.parent_value) {
          case '表实体类型':
            params.table_object_type = e.code
            break
          case '所属项目':
            params.project_id = e.code
            break
          case '业务板块':
            params.business_field_id = e.code
            break
          case '数据域':
            params.data_field_id = e.code
            break
          case '维度':
            params.dim_id = e.code
            break
          case '业务过程':
            params.process_id = e.code
            break
          case '表类型':
            params.table_type = e.code
        }
      })
    },
    // 获取左侧检索条件
    async getSearchParams (keyword = '') {
      this.attrItemList = []
      let currentData = JSON.parse(this.$route.query.data)
      const res = await this.$simpleAsyncTo(getSearchParams({ keyword }), '获取检索条件失败')
      if (res) {
        let data = JSON.parse(JSON.stringify(res.data))
        for (let i in data) {
          let o = {}
          o.key = i
          o.value = this.type[i]
          o.toggle = true
          o.children = []
          for (let q in data[i]) {
            let w = {}
            w.key = q
            w.value = this.type[q]
            w.children = data[i][q]
            w.children.forEach(e => {
              e.parent = w.key
              e.is_select = false
              e.parent_parent = i
              if ((e.code === currentData.currentDataFieldId && currentData.currentDataFieldId) ||
                (e.code === currentData.currentbusinId && currentData.currentbusinId) ||
                (e.code === currentData.currenDimension && currentData.currenDimension) ||
                (e.code === currentData.currenBusinessProcess && currentData.currenBusinessProcess)
              ) {
                this.selectItemHandle(e, w)
              }
            })
            o.children.push(w)
          }
          this.attrItemList.push(o)
        }
      }
    },
    selectItemHandle (item, o) {
      o.children.forEach(e => {
        e.is_select = false
      })
      let w = {}
      w.code = item.code
      w.value = item.value
      w.parent = item.parent
      w.parent_value = this.type[item.parent]
      w.parent_parent = item.parent_parent
      if (this.currentList.length) {
        let current = this.currentList.filter(e => {
          return e.parent === item.parent
        })
        if (current.length) {
          current[0].code = item.code
          current[0].value = item.value
        } else {
          this.currentList.push(w)
        }
      } else {
        this.currentList.push(w)
      }
      item.is_select = true
    },
    closeHandle (item) {
      this.f(this.attrItemList, item.code)
      let index = this.currentList.findIndex(e => e.parent === item.parent)
      this.currentList.splice(index, 1)
    },
    f (arr, key) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].code === key) {
          arr[i].is_select = false
          break
        } else if (arr[i].children) {
          this.f(arr[i].children, key)
        }
      }
    },
    closeSubItemHandle (i) {
      i.is_select = false
      let index = this.currentList.findIndex(e => e.code === i.code)
      if (index > -1) {
        this.currentList.splice(index, 1)
      }
    },
    resetHandle () {
      this.currentList = []
      this.fItem(this.attrItemList)
    },
    fItem (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (!(arr[i].children)) {
          arr[i].is_select = false
        } else {
          this.fItem(arr[i].children)
        }
      }
    },
    toggleHandle (item) {
      item.toggle = !item.toggle
    },
    sortClick (index, id) {
      this.sortClass = index
      this.sortId = id
      let params = this.initParams()
      this.getParams(params)
      this.getTableList(params)
    },
    // 获取结果列表
    async getTableList (params = {}) {
      const res = await this.$simpleAsyncTo(getSearchResult(params), '获取列表失败')
      if (res) {
        this.total = res.totalRecords
        this.tableList = res.data
      }
    },
    detailsCheckHandle (val) {
      // this.$router.push({name: 'detail', query: {data: JSON.stringify({cube_id: val.cube_id})}})
      this.$router.push({ name: 'detail' })
      this.setCubeId(val.cube_id)
    },
    async handleCurrentChange (val) {
      await this.getSearchParams(this.keyword)
      let params = this.initParams()
      params.keyword = this.keyword || ''
      this.pageFilters.pageNo = val
      this.getParams(params)
      this.getTableList(params)
    }
  }
}
</script>
<style lang="scss">
$leftWidth: 360px;
.search-result {
  padding: 0 10px 10px 10px;
  min-height: 100%;
  .left-condition {
    width: $leftWidth;
    background: $grey8;
    padding: 20px;
    .screen {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      span:last-child {
        font-size: 14px;
        color: $grey5;
        cursor: pointer;
      }
    }
    .screen-list {
      font-size: 12px;
      position: relative;
      .sub-toggle {
        position: absolute;
        right: -10px;
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
      .screen-item {
        display: inline-flex;
        overflow: hidden;
        height: 28px;
        padding: 0px 12px;
        align-items: center;
        border: 1px solid transparent;
        // color: $--color-primary;
        background-color: rgba(33, 83, 212, 0.05);
        margin: 0 5px 5px 0;
        .close {
          position: relative;
          width: 14px;
          height: 14px;
          align-self: flex-end;
          margin-right: -20px;
          margin-left: 6px;
          background: #2153d4;
          cursor: pointer;
          transform: skewX(-45deg);
          i {
            color: $grey10;
            position: absolute;
            top: 3.5px;
            right: 3.5px;
            font-weight: bolder;
            transform: skewX(45deg) scale(0.45);
            transition: transform 0.2s ease;
          }
        }
        &:hover {
          background-color: $grey6;
        }
        &.active {
          border: 1px solid $--color-primary;
          color: $--color-primary;
          .close {
            background: #2153d4;
          }
          &:hover {
            background-color: $grey8;
          }
        }
      }
    }
    .attr-items {
      .type-title {
        color: $grey5;
      }
      .sub-item-height {
        display: none;
        transition: $transition;
      }
    }
  }
  .right-result {
    padding: 0 0 0 10px;
    .list-title {
      height: 28px;
      line-height: 28px;
      .sort {
        font-size: 12px;
        span.active {
          color: $grey4;
        }
        span:first-child {
          color: $grey4;
        }
        span:not(:first-child) {
          padding: 0 10px;
          cursor: pointer;
        }
        span:nth-child(3) {
          position: relative;
          &::before,
          &::after {
            content: '';
            width: 1px;
            height: 10px;
            position: absolute;
            top: 3px;
            background: $grey4;
          }
          &::before {
            left: 0;
          }
          &::after {
            right: 0;
          }
        }
      }
    }
    .table-list {
      .list-item {
        background: $grey10;
        padding: 20px 20px 0 20px;
        margin-bottom: 10px;
        height: 80px;
        > div:first-child {
          width: 300px;
        }
        .icons {
          i {
            font-size: 30px;
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
          .desc {
            font-size: 12px;
            color: $grey3;
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
}
</style>
