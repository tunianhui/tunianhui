<template>
  <div class="list-wrapper">
    <section class="search-wrapper">
      <div class="mb-10 link-content">
        <el-button
          v-for="(item, index) in typeList"
          :key="index"
          type="plain"
          @click.stop="selectType(item.value)"
          class="type-btn"
          :icon="item.icon"
          >{{ item.name }}</el-button
        >
        <!-- <template v-for="(item) in typeList">
          <div :class="['link-item', activeName === item.value ? 'active' : '']" :key="item.value" @click.stop="selectType(item.value)">
            <i :class="['iconfont', item.icon]"></i>
            {{ item.name }}
            <div :class="['choose-item', activeName === item.value ? 'active' : '']"></div>
          </div>
        </template> -->
      </div>

      <div class="input">
        <el-input
          size="medium"
          ref="input"
          v-model="keyword2"
          placeholder="请输入搜索关键字"
          @input="inputHandle"
          @focus="focusHandle"
          @blur="blurHandle"
          @keyup.enter.native="searchClick"
        >
          <el-button slot="append" @click.stop="searchClick">搜索</el-button>
        </el-input>

        <transition name="el-fade-in-linear">
          <el-card class="box-card" v-if="isShow" v-loading="loading">
            <div v-if="!showSearchDataNew">
              <el-tabs
                v-model="activeName"
                @tab-click="handleClick"
                class="ml-10"
              >
                <el-tab-pane
                  v-for="(item, index) in typeList2"
                  :key="index"
                  :label="item.name"
                  :name="item.value"
                ></el-tab-pane>
              </el-tabs>
              <div v-show="true" class="type-cont-box">
                <template v-if="activeName !== '0'">
                  <el-empty description="未查到相关数据" v-if="!searchDataNew[activeName].length"></el-empty>
                  <div
                    class="type-info"
                    v-for="item in searchDataNew[activeName]"
                    :key="item._id"
                    @click="
                      showDetail(
                        item._id,
                        activeName,
                        item._source
                      )
                    "
                  >
                    <i class="iconfont icon-guize color1"></i>
                    <span>
                      <template>
                        <span v-if="item.highlight.object_code && item.highlight.object_code.length" v-html="item.highlight.object_code.join('')">
                        </span>
                        <span v-else>({{item._source.object_code}})</span>
                      </template>
                      <template>
                        <template v-if="item.highlight.object_name && item.highlight.object_name.length">
                          (<span v-html="item.highlight.object_name.join('')"></span>)
                        </template>
                        <span v-else>({{item._source.object_name}})</span>
                      </template>
                      
                    </span>
                  </div>
                </template>
                <template v-else>
                  <template v-for="item1 in typeList">
                    <div class="type-title" :key="item1.value" v-if="searchDataNew[item1.value] && searchDataNew[item1.value].length">
                      {{item1.name }}
                    </div>
                    <div :key="item1.name" v-if="item1.value !== '0'">
                      <div
                        class="type-info"
                        v-for="item in searchDataNew[item1.value]"
                        :key="item._id"
                        @click="
                          showDetail(
                            item._id,
                            item1.value,
                            item._source
                          )
                        "
                      >
                        <i class="iconfont icon-guize color1"></i>
                        <span>
                          <template>
                            <span v-if="item.highlight.object_code && item.highlight.object_code.length" v-html="item.highlight.object_code.join('')">
                            </span>
                            <span v-else>({{item._source.object_code}})</span>
                          </template>
                          <template>
                            <template v-if="item.highlight.object_name && item.highlight.object_name.length">
                              (<span v-html="item.highlight.object_name.join('')"></span>)
                            </template>
                            <span v-else>({{item._source.object_name}})</span>
                          </template>
                          
                        </span>
                      </div>
                    </div>
                  </template>
                </template>
                <!-- 数据表 -->
                <!-- <template
                  v-if="
                    ['1', '0'].includes(activeName) && listBtn.includes('1')
                  "
                >
                  <div class="type-title">
                    {{ searchData.cube_info.cubes_desc }}
                  </div>
                  <div
                    class="type-info"
                    v-for="item in searchData.cube_info.cubes_data"
                    :key="item.id"
                    @click="
                      showDetail(
                        item.id,
                        '1',
                        item.source_type,
                        item.project_code
                      )
                    "
                  >
                    <i class="iconfont icon-guize color1"></i>
                    <span :title="item.match_content">{{
                      item.match_content
                    }}</span>
                  </div>
                </template> -->

                <!-- 指标 -->
                <!-- <template
                  v-if="
                    ['2', '0'].includes(activeName) && listBtn.includes('2')
                  "
                >
                  <div class="type-title">
                    {{ searchData.derivate_info.derivate_desc }}
                  </div>
                  <div
                    class="type-info"
                    v-for="item in searchData.derivate_info.derivate_data"
                    :key="item.id"
                    @click="showDetail(item.id, '2')"
                  >
                    <i class="iconfont icon-tubiao-zhexiantu color2"></i>
                    <span :title="item.match_content">{{
                      item.match_content
                    }}</span>
                  </div>
                </template> -->

                <!-- 字段 -->
                <!-- <template
                  v-if="
                    ['3', '0'].includes(activeName) && listBtn.includes('3')
                  "
                >
                  <div class="type-title">
                    {{ searchData.field_info.field_desc }}
                  </div>
                  <div
                    class="type-info"
                    v-for="item in searchData.field_info.field_data"
                    :key="item.id"
                    @click="showDetail(item.id, '3', item.element_code)"
                  >
                    <i class="iconfont icon-code-guanjianci color3"></i>
                    <span :title="item.match_content">{{
                      item.match_content
                    }}</span>
                  </div>
                </template> -->

                <!-- 数据源 -->
                <!-- <template
                  v-if="
                    ['4', '0'].includes(activeName) && listBtn.includes('4')
                  "
                >
                  <div class="type-title">
                    {{ searchData.datasource_info.datasource_desc }}
                  </div>
                  <div
                    class="type-info"
                    v-for="item in searchData.datasource_info.datasource_data"
                    :key="item.id"
                    @click="showDetail(item.id, '4')"
                  >
                    <i class="iconfont icon-yuanshuju color4"></i>
                    <span :title="item.match_content">{{
                      item.match_content
                    }}</span>
                  </div>
                </template> -->

                <!-- 服务 -->
                <!-- <template
                  v-if="
                    ['5', '0'].includes(activeName) && listBtn.includes('5')
                  "
                >
                  <div class="type-title">
                    {{ searchData.service_info.services_desc }}
                  </div>
                  <div
                    class="type-info"
                    v-for="item in searchData.service_info.services_data"
                    :key="item.id"
                    @click="showDetail(item.id, '5')"
                  >
                    <i class="iconfont icon-nav_icon_fuwuqiguanl color5"></i>
                    <span :title="item.match_content">{{
                      item.match_content
                    }}</span>
                  </div>
                </template> -->

                <!-- 项目 -->
                <!-- <template
                  v-if="
                    ['6', '0'].includes(activeName) && listBtn.includes('6')
                  "
                >
                  <div class="type-title">
                    {{ searchData.project_info.project_desc }}
                  </div>
                  <div
                    class="type-info"
                    v-for="item in searchData.project_info.project_data"
                    :key="item.id"
                    @click="showDetail(item.id, '6')"
                  >
                    <i class="iconfont icon-xiangmu color6"></i>
                    <span :title="item.match_content">{{
                      item.match_content
                    }}</span>
                  </div>
                </template> -->

                <!-- 函数 -->
                <!-- <template
                  v-if="
                    ['7', '0'].includes(activeName) && listBtn.includes('7')
                  "
                >
                  <div class="type-title">
                    {{ searchData.func_info.func_desc }}
                  </div>
                  <div
                    class="type-info"
                    v-for="item in searchData.func_info.func_data"
                    :key="item.id"
                    @click="showDetail(item.id, '7')"
                  >
                    <i class="iconfont icon-functions color7"></i>
                    <span :title="item.match_content">{{
                      item.match_content
                    }}</span>
                  </div>
                </template> -->
              </div>
            </div>
            <div v-else>
              <el-empty description="未查到相关数据"></el-empty>
            </div>
          </el-card>
        </transition>
      </div>
    </section>

    <!-- wrapper -->
    <!-- 子路由 自动加载 -->
    <!-- <router-view ref="view"></router-view> -->
    <Overview @closeSearch="isShow = false"></Overview>
  </div>
</template>

<script>
import Overview from './overview/index.vue'
import {getGobalSerachList, getGobalSerachListNew} from '@/api/asset/map'
import cloneDeep from 'lodash/cloneDeep'
import {mapMutations} from 'vuex'
import store from '@/store'
import Template from '../../../plan/work-order/template.vue'
export default {
  name: 'List',
  components: {Overview, Template},
  data() {
    return {
      isShow: false,
      keyword2: '',
      // 全局搜索
      searchData: [],
      searchDataNew: {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [],
        '6': [],
        '7': [],
      },
      // 资产类型
      typeObj: {
        '1': 'table',
        '2': 'quota',
        '3': 'column',
        '4': 'datasource',
        '5': 'api',
        '6': 'project',
        '7': 'function',
      },
      typeList: [
        {
          name: '数据表',
          value: '1',
          icon: 'iconfont icon-guize',
        },
        {
          name: '指标',
          value: '2',
          icon: 'iconfont icon-tubiao-zhexiantu',
        },
        {
          name: '字段',
          value: '3',
          icon: 'iconfont icon-code-guanjianci',
        },
        {
          name: '数据源',
          value: '4',
          icon: 'iconfont icon-yuanshuju',
        },
        {
          name: '服务',
          value: '5',
          icon: 'iconfont icon-nav_icon_fuwuqiguanl',
        },
        {
          name: '项目',
          value: '6',
          icon: 'iconfont icon-xiangmu',
        },
        {
          name: '函数',
          value: '7',
          icon: 'iconfont icon-functions',
        },
      ],
      typeList2: [],
      activeName: '1',
      listBtn: [],
      loading: false,
      showSearchDataNew: false
    }
  },
  created() {
    const listBtn = store.getters.menuAuths['list'].btns.split('|') || []
    this.typeList = this.typeList.filter((d) => {
      if (listBtn.includes(d.value)) return d
    })

    this.typeList2 = cloneDeep(this.typeList)
    this.typeList2.unshift({
      name: '全部',
      value: '0',
      icon: 'iconfont icon-guize',
    })

    this.typeList2 = this.typeList2.filter((d) => {
      if (listBtn.includes(d.value)) return d
    })
    console.log(this.typeList2)
    this.listBtn = listBtn
    this.activeName = '0'
  },
  watch: {
    keyword2(value) {
      if (value) {
        this.activeName = '0'
        this.getSearchList()
      }
    },
    showSearchDataNew: {
      handler(val) {
        if (val) {
          const res = []
          for(let key in this.searchDataNew) {
            if (this.searchDataNew[key] && this.searchDataNew[key].length) {
              res.push(true)
            } else {
              res.push(false)
            }
          }
          this.showSearchDataNew = res.every(d => d === false)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapMutations({
      setCubeId: 'SET_CUBE_ID',
    }),

    handleClick() {},

    // 首页-全局搜索
    async getSearchList() {
      const keyword = this.keyword2
      // const res = await this.$simpleAsyncTo(
      //   getGobalSerachList({keyword}),
      //   '获取全局搜索'
      // )
      this.loading = true
      const res = await this.$simpleAsyncTo(
        getGobalSerachListNew({keyword}),
        '获取全局搜索'
      )
      if (res) {
        // this.searchData = res.data
        (res.data || []).map(d => {
          for(let key in this.typeObj) {
            if (d[this.typeObj[key]]) {
              this.searchDataNew[key] = d[this.typeObj[key]]
            }
          }
        })
      }
      this.loading = false
    },

    focusHandle(e) {
      // this.isShow = true
      if (this.keyword2) {
        this.isShow = true
        // this.activeName = '0'
        this.getSearchList()
      } else {
        this.isShow = false
      }
    },

    blurHandle(e) {},

    inputHandle(v) {
      if (v) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },

    // 跳转到详情
    showDetail(id, type, _source) {
      // 类型区分 --->
      this.setCubeId(_source.object_id)
      switch (type) {
        case '1':
          this.$router.push({
            name: 'dataTable-detail',
            query: {source_type: _source.db_type, project_code: _source.project_code, cube_id: _source.object_id},
          })
          break
        case '2':
          this.$router.push({name: 'indicator-detail'})
          break
        case '3':
          localStorage.setItem('activeName', '3')
          localStorage.setItem('keyword', _source.object_code)
          this.$router.push({
            name: 'list-search',
            query: {data: JSON.stringify({keyword: _source.object_code})},
          })
          break
        case '4':
          this.$router.push({name: 'dataSource-detail'})
          break
        case '5':
          this.$router.push({name: 'service-detail'})
          break
        case '6':
          this.$router.push({name: 'project-detail'})
          break
        case '7':
          this.$router.push({name: 'function-detail'})
          break
        default:
          break
      }
    },

    selectType(type) {
      localStorage.setItem('activeName', type)
      localStorage.removeItem('keyword')
      this.$router.push({name: 'list-search'})
    },

    async searchClick() {
      localStorage.setItem('keyword', this.keyword2)
      this.getSearchList()
      // this.$router.push({
      //   name: 'list-search',
      //   query: {data: JSON.stringify({keyword: this.keyword2})},
      // })
    },
  },
}
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 2px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: $grey4;
  border-radius: 10px;
}

.type-title {
  font-size: 14px;
  color: #999;
  padding: 5px 20px;
}

.type-info {
  padding: 5px 0px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    font-weight: bold;
  }
  .color1 {
    color: #f4ae35;
  }
  .color2 {
    color: #098c0e;
  }
  .color3 {
    color: #a7a0e1;
  }
  .color4 {
    color: #f87e73;
  }
  .color5 {
    color: #34a8af;
  }
  .color6 {
    color: #84a6e2;
  }
  .color7 {
    color: #fda61c;
  }
  span {
    width: calc(100% - 30px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
  }
}

.list-wrapper {
  background: $grey7;
  background: url('~@/assets/images/asset/list_bg.png') no-repeat center top /
    100% 55%;
  height: 100%;
  overflow-y: auto;

  .iconfont {
    margin-right: 5px;
  }

  .search-wrapper {
    width: 800px;
    padding-top: 40px;
    margin: 0 auto;
    $height: 40px;
    .type-btn {
      color: #fff;
      background-color: transparent;
      &:hover {
        background-color: #c2afd3;
      }
    }
    .link-content {
      display: flex;
      margin-bottom: 15px;
      .link-item {
        position: relative;
        padding: 0 16px;
        border: 1px solid hsla(0,0%,100%,.4);
        margin-right: 8px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        font-size: 12px;
        cursor: pointer;
        user-select: none;
        i {
          font-size: 13px;
          margin-right: 4px;
          color: inherit;
        }
        &.active {
          background: hsla(0,0%,100%,.67);
          border-bottom: none;
        }
        .choose-item.active {
          position: absolute;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          border-top-color: hsla(0,0%,100%,.67);
          transform: rotate(0deg);
          right: 38px;
          bottom: -16px;
        }
      }
    }
    .input {
      position: relative;
      height: $height;
      .el-input {
        height: 100%;
        .el-input__inner {
          border-radius: 0;
          height: 100%;
        }
        .el-input-group__append {
          border-radius: 0;
          background: $--color-primary;
          color: $grey10;
          border-color: $--color-primary;
        }
      }
      .box-card {
        width: calc(100% - 60px);
        margin-top: 5px;
        max-height: 500px;
        overflow-y: auto;
        position: absolute;
        z-index: 999;
        border-radius: 0;
        .el-card__body {
          padding: 12px 18px;
        }
        .group {
          font-size: 12px;
          color: $grey5;
          margin: 10px 0;
        }
        .item {
          font-size: 14px;
          padding: 5px 25px;
          cursor: pointer;
          &:hover {
            background: $grey7;
          }
        }
      }
    }
  }
}
</style>
