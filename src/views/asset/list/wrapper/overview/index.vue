
<template>
  <section class="list-overview" @click="closeSearch">
    <el-row :gutter="20" class="h100">
      <el-col :span="4" :offset="2" class="h100">
        <div class="business-layout mb-10 h100">
          <div class="header-wrapper">
            <div>数据板块/主题域</div>
            <div class="space-between">
              <span class="business-detail">快速直达主题域</span>
              <el-pagination background layout="pager" @current-change="currentChangePageHandle" :page-size="pagefilter1.pageSize" :pager-count="5" :current-page.sync="pagefilter1.pageNo" small :total="total1">
              </el-pagination>
            </div>
          </div>
          <div class="business-content">
            <div class="content-item" v-for="item in tabList" :key="item.busin_id">
              <el-popover placement="right" width="300" trigger="hover">
                <div>
                  <div class="count" style="font-size: 15px; margin-bottom: 10px;">({{ item.data_field_count }})</div>
                  <div class="item-info">
                    <span v-for="(item,index) in item.data_field_list" :key="index" style=" padding: 5px 0; color: #999;">
                      <span>{{ item.data_name }}</span>
                      <el-divider v-if="index !== item.data_field_count - 1" direction="vertical"></el-divider>
                    </span>
                  </div>
                </div>
                <template slot="reference">
                  <div class="flex-between">
                    <div>{{item.busin_name}}({{ item.data_field_count }})</div>
                    <i class="el-icon-arrow-right icon-font"></i>
                  </div>
                </template>
              </el-popover>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="16" class="h100">
        <div class="user-wrapper">
          <div class="business-layout">
            <img class="user" src="@/assets/images/icon_user.png" alt="" />
            <div class="mt-10 tip">
              <!-- <img class="weather" src="@/assets/images/weather.png" alt="" /> -->
              <span>{{ welcomeInfo }}</span>
            </div>
          </div>
        </div>
        <el-card class="foot-wrapper">
          <div class="foot-collect">
            <div class="collect-item-box space-between">
              <div class="hot-title font-14">最近使用</div>
              <el-pagination background layout="pager" @current-change="currentChangePageHandle" :page-size="pagefilter2.pageSize" :pager-count="5" :current-page.sync="pagefilter2.pageNo" small :total="total2">
              </el-pagination>
            </div>
            <div class="collect-all-cont">
              <div class="foot-collect-item" v-for="o in hotList" :key="o.id" @click="detailsCheckHandle(o)">
                <div>
                  <span>
                    <i :class="[iconMapColor[o.object_type]]"></i>
                  </span>
                  <OverflowTooltip class="foot-collect-info">{{o.object_code}}({{o.object_name}})</OverflowTooltip>
                  <i :class="['iconfont', o.is_collect===1?'icon-wujiaoxingxingxingshoucang bgc':'icon-xingxing-copy']" @click.stop="setCollect(o)"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="foot-collect">
            <div class="collect-item-box space-between">
              <div class="hot-title font-14">最近浏览</div>
              <el-pagination background layout="pager" @current-change="currentChangePageHandle" :page-size="pagefilter3.pageSize" :pager-count="5" :current-page.sync="pagefilter3.pageNo" small :total="total3">
              </el-pagination>
            </div>
            <div class="collect-all-cont">
              <div class="foot-collect-item" v-for="o in trailList" :key="o.id" @click="detailsCheckHandle(o)">
                <div>
                  <span :style="o.object_type == 42 ? {'width': '39px'} : null">
                    <i :class="[iconMapColor[o.object_type]]" :style="o.object_type == 42 ? {'font-size': '26px', 'margin-left': '3px'} : null"></i>
                  </span>
                  <OverflowTooltip class="foot-collect-info">{{o.object_code}}({{o.object_name}})</OverflowTooltip>
                  <i :class="['iconfont', o.is_collect===1?'icon-wujiaoxingxingxingshoucang bgc':'icon-xingxing-copy']" @click.stop="setCollect(o)" v-if="o.is_collect===1||o.is_collect===0"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="foot-collect">
            <div class="collect-item-box space-between">
              <div class="hot-title font-14">最近收藏</div>
              <el-pagination background layout="pager" @current-change="currentChangePageHandle" :page-size="pagefilter4.pageSize" :pager-count="5" :current-page.sync="pagefilter4.pageNo" small :total="total4">
              </el-pagination>
            </div>
            <div class="collect-all-cont">
              <div class="foot-collect-item" v-for="o in collectList" :key="o.id" @click="detailsCheckHandle(o)">
                <div>
                  <span>
                    <i :class="[iconMapColor[o.object_type]]"></i>
                  </span>
                  <OverflowTooltip class="foot-collect-info">{{o.object_code}}({{o.object_name}})</OverflowTooltip>
                  <i :class="['iconfont', o.is_collect===1?'icon-wujiaoxingxingxingshoucang bgc':'icon-xingxing-copy']" @click.stop="setCollect(o)" v-if="o.is_collect===1||o.is_collect===0"></i>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import {
  getListTrail,
  getListCollect,
  setCollect,
  getListHot,
  getWelcomeInfo,
  getListBusinessNew
} from '@/api/asset/map'
import { iconMapColor } from '@/config/rd-config'
import { mapMutations } from 'vuex'
export default {
  name: 'List',
  data () {
    return {
      searchList: [],
      welcomeInfo: '',
      tabList: [],
      businList: [],
      trailList: [
        {
          'object_name': '元表',
          'object_code': 'in quis deserunt amet L',
          'object_type': 19,
          'is_collect': 0,
          'id': 'pariatur proident2',
          'cube_id': '2'
        }
      ],
      hotList: [],
      collectList: [
        {
          'object_name': '元表',
          'object_code': 'in quis deserunt amet L',
          'object_type': 19,
          'is_collect': 1,
          'id': 'pariatur proident2',
          'cube_id': '2'
        },
        {
          'object_name': '镜像表',
          'object_code': 'in quis deserunt amet L',
          'object_type': 20,
          'is_collect': 1,
          'id': 'pariatur proident3',
          'cube_id': '2'
        },
        {
          'object_name': '字段',
          'object_code': 'in quis deserunt amet L',
          'object_type': 21,
          'is_collect': 1,
          'id': 'pariatur proident4',
          'cube_id': '2'
        },
        {
          'object_name': '函数',
          'object_code': 'in quis deserunt amet L',
          'object_type': 22,
          'is_collect': 1,
          'id': 'pariatur proident5',
          'cube_id': '2'
        },
        {
          'object_name': '项目',
          'object_code': 'in quis deserunt amet L',
          'object_type': 23,
          'is_collect': 1,
          'id': 'pariatur proident6',
          'cube_id': '2'
        },
        {
          'object_name': '数据源',
          'object_code': 'in quis deserunt amet L',
          'object_type': 24,
          'is_collect': 1,
          'id': 'pariatur proident7',
          'cube_id': '2'
        },
        {
          'object_name': '数据服务',
          'object_code': 'in quis deserunt amet L',
          'object_type': 25,
          'is_collect': 1,
          'id': 'pariatur proident8',
          'cube_id': '2'
        },
        {
          'object_name': '指标',
          'object_code': 'in quis deserunt amet L',
          'object_type': 26,
          'is_collect': 1,
          'id': 'pariatur proident9',
          'cube_id': '2'
        }
      ],
      iconMapColor,
      pagefilter1: {
        pageSize: 10,
        pageNo: 1
      },
      total1: 0,
      pagefilter2: {
        pageSize: 10,
        pageNo: 1
      },
      total2: 0,
      pagefilter3: {
        pageSize: 10,
        pageNo: 1
      },
      total3: 0,
      pagefilter4: {
        pageSize: 10,
        pageNo: 1
      },
      total4: 0
    }
  },
  created () {
    this.getWelcome()
    this.getListBusiness()
    this.getListTrail()
    this.getHotList()
    this.getListCollectList()
  },
  methods: {
    ...mapMutations({
      setCubeId: 'SET_CUBE_ID'
    }),

    closeSearch () {
      this.$emit('closeSearch')
    },

    // 首页-欢迎信息
    async getWelcome () {
      const res = await this.$simpleAsyncTo(getWelcomeInfo(), '获取欢迎信息')
      if (res) {
        this.welcomeInfo = res.data
      }
    },

    // 获取业务板块列表
    async getListBusiness () {
      const res = await this.$simpleAsyncTo(getListBusinessNew({
        pageSize: this.pagefilter1.pageSize,
        pageNo: this.pagefilter1.pageNo
      }), '获取业务板块列表失败')
      if (res) {
        this.tabList = res.data
        this.total1 = res.totalRecords
      }
    },

    // 获取热门
    async getHotList () {
      const res = await this.$simpleAsyncTo(getListHot({
        pageSize: this.pagefilter2.pageSize,
        pageNo: this.pagefilter2.pageNo
      }), '获取热门失败')
      if (res) {
        this.hotList = res.data
        this.total2 = res.totalRecords
      }
    },

    // 获取足迹
    async getListTrail () {
      const res = await this.$simpleAsyncTo(getListTrail({
        pageSize: this.pagefilter3.pageSize,
        pageNo: this.pagefilter3.pageNo
      }), '获取足迹失败')
      if (res) {
        this.trailList = res.data
        this.total3 = res.totalRecords
      }
    },

    // 获取收藏
    async getListCollectList () {
      const res = await this.$simpleAsyncTo(getListCollect({
        pageSize: this.pagefilter4.pageSize,
        pageNo: this.pagefilter4.pageNo
      }), '获取收藏失败')
      if (res) {
        this.collectList = res.data
        this.total4 = res.totalRecords
      }
    },

    // 4个列表
    currentChangePageHandle (val) {
      this.getListCollectList()
    },

    // 设置收藏
    async setCollect (val) {
      let isCollect = val.is_collect === 1 ? 0 : 1
      const params = { id: val.id, isCollect, source_type: val.source_type, project_code: val.project_code }
      const res = await this.$simpleAsyncTo(setCollect(params), '设置失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '设置成功'
        })
        this.getListTrail()
        this.getHotList()
        this.getListCollectList()
      }
    },

    // 跳转到详情
    detailsCheckHandle (val) {
      this.$router.push({ name: 'dataTable-detail', query: {source_type: val.source_type, project_code: val.project_code} })
      this.setCubeId(val.cube_id)
      // switch (val.object_type) {
      //   case 18: // 数据表
      //     this.$router.push({ name: 'dataTable-detail' })
      //     break
      //   case 26: // 指标
      //     this.$router.push({ name: 'indicator-detail' })
      //     break
      //   case 21: // 字段
      //     localStorage.setItem('activeName', '3')
      //     this.$router.push({ name: 'list-search' })
      //     break
      //   case 24: // 数据源
      //     this.$router.push({ name: 'dataSource-detail' })
      //     break
      //   case 25: // 服务
      //     this.$router.push({ name: 'service-detail' })
      //     break
      //   case 23: // 项目
      //     this.$router.push({ name: 'project-detail' })
      //     break
      //   case 22: // 函数
      //     this.$router.push({ name: 'function-detail' })
      //     break
      //   default:
      //     break
      // }
    }
  }
}
</script>

<style lang="scss">
$tabsWidth: 230px;
$tabsHeight: 90px;
$activeTabHeight: 3px;
.list-overview {
  padding: 60px 50px 20px;
  height: calc(100% - 140px);
  .business-layout {
    background: rgba(2, 6, 16, 0.55);
    .header-wrapper {
      font-size: 16px;
      color: #fff;
      background: rgba(2, 6, 16, 0.25);
      padding: 15px 10px;
      .business-detail {
        font-size: 12px;
        color: #999;
      }
    }
    .business-content {
      height: calc(100% - 76px);
      overflow-y: auto;
      .content-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        font-size: 13px;
        line-height: 24px;
        padding: 15px 10px;
        border-bottom: 1px solid #999;
        cursor: pointer;
        &:hover {
          background-color: #fff;
          color: #333;
        }
        & > span {
          width: 100%;
        }
        .icon-font {
          margin-left: 5px;
          font-size: 20px;
        }
        .count {
          font-size: 15px;
          margin-bottom: 10px;
        }
        .item-info {
          padding: 5px 0;
          color: #999;
        }
      }
    }
  }
  .user-wrapper {
    height: 150px;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 50px;
    .business-layout {
      width: 30%;
      color: #fff;
      font-size: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .user {
        margin-top: 10px;
        width: 64px;
        height: 64px;
      }
      .tip {
        display: flex;
        align-items: center;
        .weather {
          width: 20px;
          height: 20px;
          margin-right: 6px;
        }
      }
    }
  }
  .foot-wrapper {
    background-color: $grey7;
    border: none;
    padding: 0;
    height: calc(100% - 200px);
    .el-card__body {
      width: 100%;
      display: flex;
      padding: 0;
      height: 100%;
      .foot-collect {
        background-color: #fff;
        border-right: 1px solid #dfdfdf;
        width: calc(100% / 3);
        &:last-child {
          border-right: none;
        }
        .collect-item-box {
          border-bottom: 1px solid #dfdfdf;
          padding: 10px 15px;
          .hot-title {
            font-size: 16px;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: #888888;
          }
        }
        .collect-all-cont {
          height: calc(100% - 48px);
          width: 100%;
          overflow-y: auto;
          .foot-collect-item {
            margin: 0 15px;
            border-bottom: 1px solid #dfdfdf;
            > div {
              background-color: $grey10;
              height: 100%;
              padding: 0 10px 0 0;
              display: flex;
              align-items: center;
              // justify-content: space-between;
              justify-content: flex-start;
              > span {
                font-size: 34px;
              }
              > i {
                cursor: pointer;
                font-size: 20px;
                margin-right: 0 !important;
              }
              .foot-collect-info {
                font-size: 16px;
                font-family: PingFangSC, PingFangSC-Regular;
                font-weight: 400;
                text-align: left;
                color: #333333;
                margin-right: 10px;
                width: calc(100% - 80px);
                cursor: pointer;
              }
              .bgc {
                color: $warning;
              }
            }
          }
        }
      }
    }
  }
}
</style>
