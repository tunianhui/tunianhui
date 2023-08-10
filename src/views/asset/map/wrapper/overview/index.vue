<template>
  <section class="map-overview">
    <el-card class="business-layout mb-10" v-loading="businLoading">
      <div slot="header" class="clearfix">
        <span>业务板块</span>
      </div>
      <div class="business-content">
        <el-tabs v-model="topTabsValue" type="card" class="top-tabs" @tab-click="topTabClickHandle">
          <el-tab-pane :key="item.busin_id" v-for="item in tabList" :label="item.busin_name" :name="item.busin_id + ''" :id="item.busin_id">
            <div slot="label" class="tab-title">
              <p class="text-center">
                <span>
                  <OverflowTooltip style="width: 200px">{{item.busin_name}}</OverflowTooltip>
                </span>
              </p>
              <span class="desc font-12">
                <OverflowTooltip style="width: 200px;">{{item.comments}}</OverflowTooltip>
              </span>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="sub-tabs">
          <el-tabs v-model="subTabsactiveName" @tab-click="subTabClickHandle">
            <el-tab-pane :label="businTitle" name="second" disabled class="business-title"></el-tab-pane>
            <el-tab-pane label="数据域" name="datayu" disabled></el-tab-pane>
            <el-tab-pane v-for="(item, index) in dataDomainList" :label="item.data_field_name" :name="index+''" :key="item.data_field_id" :id="item.data_field_id" v-loading="dataFieldLoading">
              <div class="data-yu-content">
                <div class="flex-2">
                  <div class="title ml-20">维度</div>
                  <div class="dimension">
                    <ul>
                      <li v-for="i in dimensionList" :key="i.dim_id" @click="linkSearchResultHandle(i)">
                        {{i.dim_name}}
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="flex-1">
                  <div class="title ml-20">业务过程</div>
                  <div class="business">
                    <ul>
                      <li v-for="o in businList" :key="o.process_id" @click="linkSearchResultHandle(o)">
                        {{o.process_name}}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>
    <el-card class="foot-collect-hot">
      <div class="foot-collect flex-2 mr-10">
        <el-tabs v-model="footCollectActiveName" @tab-click="footCollectTabHandle">
          <el-tab-pane label="我的" name="first" disabled>我的</el-tab-pane>
          <el-tab-pane v-for="item in footCollectTabs" :key="item.name" :label="item.label" :name="item.name" v-loading="footCollectLoading">
            <div class="foot-collect-item" v-for="o in trailList" :key="o.object_code" @click="detailsCheckHandle(o)">
              <div>
                <div>
                  <span>
                    <i :class="['mr-10', iconMapColor[o.object_type]]"></i>
                  </span>
                  <OverflowTooltip class="foot-collect-info">{{o.object_code}}({{o.object_name}})</OverflowTooltip>
                  <i :class="['iconfont', o.is_collect===1?'icon-wujiaoxingxingxingshoucang bgc':'icon-xingxing']" @click.stop="setCollect(o)" v-if="o.is_collect===1||o.is_collect===0"></i>
                  <!-- <i class="iconfont icon-wujiaoxingxingxingshoucang bgc" v-if="o.is_collect===1"></i>
                  <i class="iconfont icon-xingxing" v-if="o.is_collect===0"></i> -->
                </div>
                <!-- <OverflowTooltip class="foot-collect-info">{{o.object_desc}}</OverflowTooltip> -->
              </div>
            </div>
          </el-tab-pane>
          <div class="text-right pt-20" v-if="footCollectActiveName==='shoucang'">
            <el-pagination background layout="prev, pager, next" @current-change="currentChangePageHandle" :page-size="pagefilter.pageSize" :pager-count="5" :current-page.sync="pagefilter.pageNo" :small="true" :total="total">
            </el-pagination>
          </div>
        </el-tabs>
      </div>
      <div class="hot flex-1">
        <div class="hot-title font-14">热门</div>
        <div class="foot-collect-item hot-item" v-for="o in hotList" :key="o.object_code" v-loading="hotLoading" @click="detailsCheckHandle(o)">
          <div>
            <div>
              <span>
                <i :class="['mr-10', iconMapColor[o.object_type]]"></i>
              </span>
              <OverflowTooltip class="foot-collect-info">{{o.object_code}}({{o.object_name}})</OverflowTooltip>
              <!-- <i
                :class="['iconfont', o.is_collect===1?'icon-wujiaoxingxingxingshoucang bgc':'icon-xingxing']"
                @click="setCollect(o)"
                v-if="o.is_collect===1||o.is_collect===0"
              ></i> -->
              <!-- <i class="iconfont icon-wujiaoxingxingxingshoucang bgc" v-if="o.is_collect===1"></i>
              <i class="iconfont icon-xingxing" v-if="o.is_collect===0"></i> -->
            </div>
            <!-- <OverflowTooltip class="foot-collect-info">{{o.object_desc}}</OverflowTooltip> -->
          </div>
        </div>
      </div>
    </el-card>
  </section>
</template>
<script>
import OverflowTooltip from '@c/overflow-tooltip'
import {
  getListBusiness,
  getMetaDataField,
  getMetaDimension,
  getMetaBusinessProcess,
  getListTrail,
  getListCollect,
  setCollect,
  getListHot
} from '@/api/asset/map'
import { iconMapColor } from '@/config/rd-config'
import { mapMutations } from 'vuex'
export default {
  name: 'MapIndex',
  components: {
    OverflowTooltip
  },
  data () {
    return {
      businLoading: false,
      footCollectLoading: false,
      hotLoading: false,
      dataFieldLoading: false,
      topTabsValue: '',
      subTabsactiveName: '0',
      footCollectActiveName: 'zuji',
      tabList: [],
      dataDomainList: [],
      businTitle: '',
      dimensionList: [],
      businList: [],
      trailList: [],
      hotList: [],
      currentbusinId: '',
      currentDataFieldId: '',
      footCollectTabs: [
        {
          label: '足迹',
          name: 'zuji'
        },
        {
          label: '收藏',
          name: 'shoucang'
        }
      ],
      iconMapColor,
      pagefilter: {
        pageSize: 4,
        pageNo: 1
      },
      total: 0
    }
  },
  watch: {
    footCollectActiveName: {
      immediate: true,
      handler (val) {
        // if (val === 'zuji') {
        //   this.getListTrail()
        // } else {
        //   this.getListCollect()
        // }
      }
    }
  },
  created () {
    this.getListBusiness()
    this.getHotList()
    this.getListTrail()
  },
  methods: {
    ...mapMutations({
      setCubeId: 'SET_CUBE_ID'
    }),
    // 获取业务板块列表
    async getListBusiness () {
      this.businLoading = true
      const res = await this.$simpleAsyncTo(getListBusiness(), '获取业务板块列表失败')
      if (res) {
        this.tabList = res.data
        if (res.data && res.data.length) {
          this.topTabsValue = res.data[0].busin_id + ''
          this.businTitle = res.data[0].busin_name
          this.currentbusinId = res.data[0].busin_id
          this.getMetaDataField(res.data[0].busin_id)
        }
        this.businLoading = false
      }
    },
    topTabClickHandle (tab) {
      this.businTitle = tab.label
      this.subTabsactiveName = '0'
      this.currentbusinId = tab.$attrs.id
      this.getMetaDataField(tab.$attrs.id, tab.name)
    },
    // 获取数据域
    async getMetaDataField (busin_id, curName) {
      const res = await this.$simpleAsyncTo(getMetaDataField({ busin_id }), '获取数据域失败')
      if (res) {
        this.dataDomainList = res.data
        if (res.data.length && res.data) {
          // this.subTabsactiveName = res.data[0].data_field_code
          // this.subTabsactiveName = curName
          this.currentDataFieldId = res.data[0].data_field_id
          this.getMetaDimension(res.data[0].data_field_id)
          this.getMetaBusinessProcess(res.data[0].data_field_id)
        }
      }
    },
    async subTabClickHandle (tab) {
      this.dataFieldLoading = true
      this.currentDataFieldId = tab.$attrs.id
      await this.getMetaDimension(tab.$attrs.id)
      await this.getMetaBusinessProcess(tab.$attrs.id)
      this.dataFieldLoading = false
    },
    // 获取维度
    async getMetaDimension (data_field_id) {
      const res = await this.$simpleAsyncTo(getMetaDimension({ data_field_id }), '获取维度失败')
      if (res) {
        this.dimensionList = res.data
      }
    },
    // 获取业务过程
    async getMetaBusinessProcess (data_field_id) {
      const res = await this.$simpleAsyncTo(getMetaBusinessProcess({ data_field_id }), '获取业务过程失败')
      if (res) {
        this.businList = res.data
      }
    },
    // 获取足迹
    async getListTrail () {
      this.footCollectLoading = true
      const res = await this.$simpleAsyncTo(getListTrail(), '获取足迹失败')
      if (res) {
        this.trailList = res.data
      }
      this.footCollectLoading = false
    },
    // 获取收藏
    async getListCollect () {
      this.footCollectLoading = true
      const res = await this.$simpleAsyncTo(getListCollect({
        pageSize: this.pagefilter.pageSize,
        pageNo: this.pagefilter.pageNo
      }), '获取收藏失败')
      if (res) {
        this.trailList = res.data
        this.total = res.totalRecords
      }
      this.footCollectLoading = false
    },
    currentChangePageHandle (val) {
      this.pagefilter.pageNo = val
      this.getListCollect()
    },
    // 设置收藏
    async setCollect (o) {
      let isCollect = o.is_collect === 1 ? 0 : 1
      const params = { id: o.cube_id, isCollect, project_code: o.project_code }
      const res = await this.$simpleAsyncTo(setCollect(params), '设置失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '设置成功'
        })
        this.getListTrail()
      }
    },
    // 获取热门
    async getHotList () {
      this.hotLoading = true
      const res = await this.$simpleAsyncTo(getListHot(), '获取热门失败')
      if (res) {
        this.hotList = res.data
      }
      this.hotLoading = false
    },
    linkSearchResultHandle (data) {
      this.$router.push({
        name: 'search',
        query: {
          data: JSON.stringify(
            {
              currentDataFieldId: this.currentDataFieldId,
              currentbusinId: this.currentbusinId,
              currenDimension: data.dim_id || '',
              currenBusinessProcess: data.process_id || ''
            }
          )
        }
      })
    },
    footCollectTabHandle (tab) {
      if (tab.name === 'zuji') {
        this.getListTrail()
      } else {
        this.getListCollect()
      }
    },
    detailsCheckHandle (o) {
      // this.$router.push({name: 'detail', query: {data: JSON.stringify({cube_id: o.cube_id})}})
      this.$router.push({ name: 'detail' })
      this.setCubeId(o.cube_id)
    }
  }
}
</script>

<style lang="scss">
$tabsWidth: 230px;
$tabsHeight: 90px;
$activeTabHeight: 3px;
.map-overview {
  padding: 0 10px 10px 10px;
  // height: 100%;
  overflow-y: auto;
  .business-layout {
    background-color: $grey8;
    .el-card__header {
      border: none;
      padding: 10px 20px 0 20px;
    }
    .el-card__body {
      padding: 10px 20px;
    }
    .business-content {
      .top-tabs {
        .el-tabs__header {
          border: none;
          margin: 0;
          .el-tabs__item {
            width: $tabsWidth;
            height: $tabsHeight;
            margin-right: 10px;
            // border-top: 3px solid transparent;
            border: none;
            line-height: inherit;
            padding: 0;
            &.is-active {
              // border-top: 3px solid $tabTitleColor;
              box-shadow: inset 0 $activeTabHeight 0 0 $tabTitleColor;
              background-color: $grey10;
            }
            &:last-child {
              margin-right: 0;
            }
          }
          .el-tabs__nav-prev,
          .el-tabs__nav-next {
            height: $tabsHeight - 10px;
            line-height: $tabsHeight - 10px;
            background-color: $grey10;
            width: 15px;
            text-align: center;
            margin-top: $activeTabHeight;
          }
          .tab-title {
            padding: 10px 0;
            margin-top: $activeTabHeight;
            height: $tabsHeight - 10px;
            background-color: $grey10;
            text-align: center;
            .desc {
              color: $grey4;
            }
            p {
              margin: 10px;
            }
          }
        }
        .el-tabs__nav {
          border: none;
        }
      }
      .sub-tabs {
        background-color: $grey10;
        .el-tabs__header {
          margin: 0;
          .el-tabs__nav {
            .el-tabs__item {
              font-size: 12px;
              padding: 0 10px;
              font-family: Helvetica Neue, Helvetica, Arial, PingFang SC,
                Hiragino Sans GB, Microsoft YaHei, sans-serif;
              &:nth-of-type(2) {
                color: #000;
                // font-family: none;
                opacity: 1;
                font-size: 16px;
              }
              &:nth-of-type(3) {
                font-size: 12px;
                opacity: 0.6;
                color: #000;
              }
            }
          }
        }
        .el-tabs__content {
          padding: 10px 20px;
          min-height: 100px;
          .data-yu-content {
            height: 100px;
            display: flex;
            .title {
              font-size: 12px;
              color: $grey1;
              margin-bottom: 5px;
              opacity: 0.5;
            }
            > div:first-child {
              border-right: 1px solid $grey6;
            }
            .dimension,
            .business {
              padding: 0 20px;
              max-height: 80px;
              // height: 100px;
              overflow-y: auto;
              ul {
                display: flex;
                flex-wrap: wrap;
                padding: 0 10px;
                li {
                  padding: 0 5px;
                  font-size: 12px;
                  margin: 5px 0;
                  cursor: pointer;
                  &:hover {
                    color: $--color-primary;
                  }
                }
              }
            }
            .dimension {
              flex: 5;
              // border-right: 1px solid $grey6;
            }
            .business {
              flex: 2;
            }
          }
        }
      }
    }
  }
  .foot-collect-hot {
    background-color: $grey7;
    border: none;
    padding: 0;
    .el-card__body {
      width: 100%;
      display: flex;
      padding: 0px;
      min-height: 270px;
      .el-tabs__header {
        .el-tabs__item {
          padding: 0 10px;
          &:nth-of-type(2) {
            color: $grey2;
          }
        }
      }
      .foot-collect,
      .hot {
        background-color: $grey8;
      }
      .foot-collect {
        padding: 0 15px;
      }
      .el-tabs__nav-wrap::after {
        height: 0;
      }
      .el-tab-pane {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .foot-collect-item {
        width: 50%;
        padding-right: 10px;
        margin-bottom: 5px;
        height: 60px;
        > div {
          background-color: $grey10;
          height: 100%;
          padding: 10px 20px;
          > div {
            span {
            }
            .foot-collect-info {
              width: calc(100% - 60px);
              cursor: pointer;
            }
            .bgc {
              color: $warning;
            }
            > i {
              cursor: pointer;
            }
          }
          > span {
            font-size: 14px;
            color: $grey5;
          }
        }
      }
      .hot {
        padding-left: 10px;
        .hot-title {
          padding: 10px;
        }
        .hot-item {
          width: 100%;
        }
      }
    }
  }
}
</style>
