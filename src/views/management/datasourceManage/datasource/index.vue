<template>
  <div class="datasource-main" ref="pageWrapper">
    <TabsHeader
      title="数据源"
      :tabs="[]"
      active=""
      height="40px"
      :borderBottomWrapper="false"
    >
      <div slot="right" style="display: flex;align-items: center;">
        <el-checkbox label="1" v-model="my">我负责的</el-checkbox>
        <span class="mr-10 ml-10">
          <el-input v-model="searchVal" placeholder="请输入搜索关键字" @input="inputSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </span>
        <!-- <el-button @click="showFileterItem = !showFileterItem">
          <i class="iconfont icon-filter"></i>
          {{showFileterItem ? '收起' : '筛选'}}
        </el-button> -->
        <!-- <el-button>
          管理标签
        </el-button> -->
        <el-button type="primary" @click="addDatasource">
          <i class="el-icon-plus"></i>
          新建数据源
        </el-button>
        <el-button @click="refresh">
          <i class="el-icon-refresh-right"></i>
        </el-button>
      </div>
    </TabsHeader>
    <SearchItemConfig
      @change="changeSearchItem"
      :style="{height: showFileterItem ? '' : '0', overflow: 'hidden'}"
      :filterOptions="filterOptions"
      :showMore="false"
      class="mb-5"
      ref="searchItemConfig"
      v-resize="resizeDom"
    ></SearchItemConfig>
    <div class="table-wrapper" :style="{height: `${height}px`}">
      <div class="list-wrapper" v-loading="loading">
        <el-row :gutter="10">
          <el-col :span="12" v-for="item in listData" :key="item.id">
            <div class="dataSrc-card-wrapper">
              <div class="dataSrc-card">
                <div class="dataSrc-card-header">
                  <div class="title-part">
                    <div class="card-title">
                      <OverflowTooltip style="width:calc(100% - 25px)">{{item.data_source_name}}</OverflowTooltip>
                      <div class="right-ops">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                          <el-button type="text" @click="editDataSource(item)">
                            <i class="el-icon-edit-outline"></i>
                          </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                          <el-button type="text" @click="deleteDatasource(item)">
                            <i class="el-icon-delete"></i>
                          </el-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>

                  <div class="card-desc">
                    <div class="data-src-type">
                      <div class="row-title">类型</div>
                      <div class="type-value">
                        <OverflowTooltip>{{item.data_source_type}}</OverflowTooltip>
                      </div>
                      <div class="application-scene-info">
                        <el-tooltip class="item" effect="dark" content="支持应用场景：离线集成、实时研发、数据服务、全域质量" placement="top">
                          <template>
                            <i class="iconfont icon-yingyongguanli"> 4</i>
                          </template>
                        </el-tooltip>
                      </div>
                    </div>
                    <!-- <div class="tag-system-info">
                      <div class="row-title">标签</div>
                      <div class="type-value no-tag">未配置</div>
                    </div> -->
                  </div>
                </div>

                <div class="dataSrc-card-content">
                  <div class="dataSrc-info-wrapper" v-if="JSON.stringify(item.connect_info_dev || {}) !== '{}'">
                    <el-card class="box-card">
                      <div slot="header" class="head-wrapper">
                        <div class="head-title">开发</div>
                        <div class="card-extra">
                          <div class="extra-info">
                            <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                              <el-button type="text" @click="editDev(item)">
                                <i class="el-icon-edit-outline"></i>
                              </el-button>
                            </el-tooltip> -->
                            <el-tooltip class="item" effect="dark" content="转移负责人" placement="top">
                              <el-button type="text">
                                <i class="iconfont icon-guanliyuan"></i>
                              </el-button>
                            </el-tooltip>
                            <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top">
                              <el-button type="text">
                                <i class="el-icon-delete"></i>
                              </el-button>
                            </el-tooltip> -->
                          </div>
                        </div>
                      </div>
                      <div class="dataSrc-info-content">
                        <div class="dataSrc-info-list">
                          <div class="dataSrc-info">
                            <span class="label">负责人：</span>
                            <OverflowTooltip>{{item.oper_user}}</OverflowTooltip>
                          </div>
                          <div class="dataSrc-info">
                            <span class="label">描述：</span>
                            <OverflowTooltip>{{item.data_source_desc}}</OverflowTooltip>
                          </div>
                          <div class="dataSrc-info">
                            <span class="label">更新时间：</span>
                            <OverflowTooltip>{{item.oper_time}}</OverflowTooltip>
                            <el-tooltip class="item" effect="dark" placement="top">
                              <template slot="content">
                                <div class="dataSrc-info mb-10">
                                  <span class="label mr-10">创建用户</span>
                                  <OverflowTooltip>{{item.oper_user}}</OverflowTooltip>
                                </div>
                                <div class="dataSrc-info">
                                  <span class="label mr-10">创建时间</span>
                                  <OverflowTooltip>{{item.oper_time}}</OverflowTooltip>
                                </div>
                              </template>
                              <i class="iconfont icon-chakan" style="color:rgba(0,0,0,0.5)"></i>
                            </el-tooltip>
                          </div>
                          <div class="url-info">
                            <span class="label">链接信息：</span>
                            <el-popover
                              placement="bottom-start"
                              title=""
                              popper-class="url-info-label"
                              trigger="click">
                              <div class="content">
                                <div class="header">
                                  <div class="title">链接信息</div>
                                </div>
                                <div class="info-list">
                                  <div>
                                    <div class="link-item">
                                      <label>JDBC：</label>
                                      <span>{{item.connect_info_dev.jdbcurl}}</span>
                                    </div>
                                    <div class="link-item">
                                      <label>用户名：</label>
                                      <span>{{item.connect_info_dev.jdbcuser}}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <el-button type="text" class="ml-10" slot="reference">查看</el-button>
                            </el-popover>
                            
                            <el-tooltip class="item" effect="dark" content="连接测试" placement="top">
                              <el-button type="text" class="ml-10">
                                测试
                              </el-button>
                            </el-tooltip>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>

                  <div class="dataSrc-info-wrapper" v-if="JSON.stringify(item.connect_info_pro || {}) !== '{}'">
                    <el-card class="box-card">
                      <div slot="header" class="head-wrapper">
                        <div class="head-title">生产</div>
                        <div class="card-extra">
                          <div class="extra-info">
                            <!-- <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                              <el-button type="text">
                                <i class="el-icon-edit-outline"></i>
                              </el-button>
                            </el-tooltip> -->
                            <el-tooltip class="item" effect="dark" content="转移负责人" placement="top">
                              <el-button type="text">
                                <i class="iconfont icon-guanliyuan"></i>
                              </el-button>
                            </el-tooltip>
                            <!-- <el-tooltip class="item" effect="dark" content="删除" placement="top">
                              <el-button type="text">
                                <i class="el-icon-delete"></i>
                              </el-button>
                            </el-tooltip> -->
                          </div>
                        </div>
                      </div>
                      <div class="dataSrc-info-content">
                        <div class="dataSrc-info-list">
                          <div class="dataSrc-info">
                            <span class="label">负责人：</span>
                            <OverflowTooltip>{{item.oper_user}}</OverflowTooltip>
                          </div>
                          <div class="dataSrc-info">
                            <span class="label">描述：</span>
                            <OverflowTooltip>{{item.data_source_desc}}</OverflowTooltip>
                          </div>
                          <div class="dataSrc-info">
                            <span class="label">更新时间：</span>
                            <OverflowTooltip>{{item.oper_time}}</OverflowTooltip>
                            <el-tooltip class="item" effect="dark" placement="top">
                              <template slot="content">
                                <div class="dataSrc-info mb-10">
                                  <span class="label mr-10">创建用户</span>
                                  <OverflowTooltip>{{item.oper_user}}</OverflowTooltip>
                                </div>
                                <div class="dataSrc-info">
                                  <span class="label mr-10">创建时间</span>
                                  <OverflowTooltip>{{item.oper_time}}</OverflowTooltip>
                                </div>
                              </template>
                              <i class="iconfont icon-chakan" style="color:rgba(0,0,0,0.5)"></i>
                            </el-tooltip>
                          </div>
                          <div class="url-info">
                            <span class="label">链接信息：</span>
                            <el-popover
                              placement="bottom-start"
                              title=""
                              popper-class="url-info-label"
                              trigger="click">
                              <div class="content">
                                <div class="header">
                                  <div class="title">链接信息</div>
                                </div>
                                <div class="info-list">
                                  <div>
                                    <div class="link-item">
                                      <label>JDBC：</label>
                                      <span>{{item.connect_info_pro.jdbcurl}}</span>
                                    </div>
                                    <div class="link-item">
                                      <label>用户名：</label>
                                      <span>{{item.connect_info_pro.jdbcuser}}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <el-button type="text" class="ml-10" slot="reference">查看</el-button>
                            </el-popover>
                            
                            <el-tooltip class="item" effect="dark" content="连接测试" placement="top">
                              <el-button type="text" class="ml-10">
                                测试
                              </el-button>
                            </el-tooltip>
                          </div>
                        </div>
                      </div>
                    </el-card>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <PageBottomTips></PageBottomTips>
    </div>
    <OuterDialog v-if="outerDialogVisible" @close="close" :currentEditItemData="currentEditItemData"></OuterDialog>
  </div>
</template>

<script>
import TabsHeader from '@c/tabs-header'
import SearchItemConfig from '../../component/filter.vue'
import mixin from '../mixin'
import OuterDialog from './outerDialog.vue'
import {
  getDataSourceList,
  delDataSource
} from '@/api/management/datasource.js'
export default {
  name: 'Datasource',
  mixins: [mixin],
  components: {
    TabsHeader,
    SearchItemConfig,
    OuterDialog
  },
  data() {
    return {
      my: false,
      searchVal: '',
      showFileterItem: false,
      filterOptions: [
        {
          label: '数据源类型',
          key: 'datasourceType',
          dataType: '',
          type: 'select-one',
          options: []
        },
        {
          label: '数据源标签',
          key: 'jobType',
          jobType: [],
          type: 'select-one',
          checkboxShow: true,
          checkboxLabel: '为空',
          checkbox: false,
          options: [
            { label: '正常调度', value: '0' },
            { label: '暂停调度', value: '1' }
          ]
        },
        {
          label: '负责人',
          key: 'user',
          user: '',
          type: 'select-one',
          options: []
        },
      ],
      listData: [],
      outerDialogVisible: false,
      loading: false,
      currentEditItemData: {}
    }
  },
  created() {
    this.getDataSourceList()
  },
  methods: {
    inputSearch(val) {
      console.log(val)
      this.getDataSourceList()
    },
    changeSearchItem(val) {
      console.log(val)
    },
    refresh() {
      console.log('refresh')
      this.getDataSourceList()
    },
    addDatasource() {
      this.outerDialogVisible = true
      this.currentEditItemData = {}
    },
    // 数据源列表
    async getDataSourceList() {
      this.loading = true
      const res = await this.$simpleAsyncTo(getDataSourceList({
        keyword: this.searchVal,
      }), '获取数据源列表数据失败')
      if (res) {
        this.listData = res.data
      }
      this.loading = false
    },
    close(data) {
      this.outerDialogVisible = false
      if (data) {
        this.refresh()
      }
    },
    // 编辑
    editDataSource(item) {
      this.currentEditItemData = item
      this.outerDialogVisible = true
    },
    // 删除
    async deleteDatasource(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$simpleAsyncTo(delDataSource({id: item.id}), '删除失败')
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.refresh()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.datasource-main {
  padding: 10px 15px 0 15px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(229, 228, 233);
  .table-wrapper {
    padding-bottom: 56px;
    position: relative;
    .list-wrapper {
      height: 100%;
      overflow: auto;
      overflow-x: hidden;
      .el-row {
        display: flex;
        flex-flow: row wrap;
        margin-left: -5px;
        margin-right: -5px;
        row-gap: 10px;
      }
      .dataSrc-card-wrapper {
        .dataSrc-card {
          padding: 12px 20px 20px;
          background: #f8f8fa;
          &-header {
            display: flex;
            flex-direction: column;
            font-size: 12px;
            .title-part {
              display: flex;
              align-items: center;
              .card-title {
                flex: 1;
                width: 0;
                display: flex;
                height: 28px;
                align-items: center;
                font-size: 14px;
                .right-ops {
                  display: flex;
                  align-items: center;
                  i {
                    font-size: 16px;
                    color: rgba(0, 0, 0, 0.45);
                  }
                }
              }
            }
            .card-desc {
              display: flex;
              .data-src-type {
                margin-top: 8px;
                display: flex;
                flex: 1;
                color: rgba(0, 0, 0, 0.85);
              }
              .tag-system-info {
                margin-top: 8px;
                display: flex;
                flex: 1;
                color: rgba(0, 0, 0, 0.85);
              }
            }
            .row-title {
              color: rgba(0, 0, 0, 0.65);
              margin-right: 12px;
              white-space: nowrap;
            }
            .type-value {
              &.no-tag {
                color: rgba(0, 0, 0, 0.45);
              }
            }
          }
          &-content {
            background: #fff;
            border-radius: 2px;
            margin-top: 16px;
            padding: 16px 0;
            display: flex;
            .dataSrc-info-wrapper {
              flex: 1;
              padding: 0 12px;
              ::v-deep {
                .el-card {
                  border-radius: 0;
                  background: none;
                  border: none;
                  box-shadow: none;
                  .el-card__header {
                    margin: 0;
                    padding: 0;
                    min-height: 22px;
                    height: 22px;
                    border-bottom: none;
                    color: #1b2126;
                    font-weight: 500;
                    font-size: 14px;
                    border-radius: 4px 4px 0 0;
                    .head-wrapper {
                      height: 22px;
                      display: flex;
                      align-items: center;
                      .head-title {
                        font-size: 14px;
                        color: rgba(0, 0, 0, 0.85);
                        font-weight: 400;
                        line-height: 28px;
                        padding: 0;
                        display: inline-block;
                        flex: 1;
                      }
                      .card-extra {
                        float: right;
                        margin-left: auto;
                        padding: 0;
                        color: #333;
                        font-weight: 400;
                        font-size: 12px;
                        .extra-info {
                          i {
                            font-size: 16px;
                            color: rgba(0, 0, 0, 0.45);
                          }
                        }
                      }
                    }
                  }
                  .el-card__body {
                    padding: 0;
                    margin: 0;
                    flex: 1;
                    font-size: 12px;
                    .dataSrc-info-content {
                      .dataSrc-info-list {
                        .dataSrc-info {
                          margin-top: 12px;
                          height: 20px;
                          display: flex;
                          align-items: center;
                          .label {
                            color: rgba(0, 0, 0, 0.65);
                            white-space: nowrap;
                          }
                          i {
                            font-size: 18px;
                            margin-left: 20px;
                            cursor: pointer;
                          }
                        }
                        .url-info {
                          margin-top: 12px;
                          height: 20px;
                          display: flex;
                          align-items: center;
                        }
                      }
                    }
                  }
                }
              }
              & + .dataSrc-info-wrapper {
                border-left: 1px solid rgba(0, 0, 0, 0.1);
              }
            }
          }
        }
      }
    }
  }
  .application-scene-info {
    color: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    i {
      font-size: 14px;
      margin-left: 8px;
    }
  }
}
</style>
<style lang="scss">
.url-info-label {
  padding: 0;
  border-radius: 0;
  border: none;
  &.el-popper[x-placement^=bottom] {
    margin-top: 0;
  }
  .header {
    height: 38px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    .title {
      font-size: 14px;
      color: rgba(0,0,0,.9);
    }
  }
  .info-list {
    padding: 12px;
    color: rgba(0,0,0,.9);
    >div {
      .link-item {
        line-height: 24px;
        > label {
          color: rgba(0,0,0,.5);
          font-size: 12px;
        }
        >span {
          font-size: 12px;
        }
      }
    }
  }
}
</style>