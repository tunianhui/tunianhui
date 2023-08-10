<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-05-17 09:59:58
 * @LastEditTime: 2023-05-22 14:33:58
 * @Description:
-->
<template>
  <section class="side-panel-view" :style="active.style || {}">
    <div class="spv-main">
      <div class="title">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="推荐" name="first"></el-tab-pane>
          <el-tab-pane label="数据表" name="second"></el-tab-pane>
          <el-tab-pane label="函数" name="third"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="node-data-edit-base">
        <div class="left">
          <div class="content">
            <el-input placeholder="请输入关键字搜索"></el-input>
            <div v-if="activeName === 'second'" class="mt-10">
              <span>我的收藏</span>
            </div>
            <ul v-if="activeName === 'first'" class="mt-10">
              <li v-for="(item, index) in list" :key="index">
                <div class="flex">
                  <i class="icon-weiduluojibiao1 iconfont font-18 icon-color ml-5"></i>
                  <span class="ml-10">{{item.field2}}</span>
                </div>
              </li>
            </ul>
            <ul v-if="activeName === 'second'" class="mt-10">
              <li v-for="(item, index) in list2" :key="index">
                <div class="flex">
                  <i class="icon-weiduluojibiao1 iconfont font-18 icon-color ml-5"></i>
                  <span class="ml-10">{{item.field2}}</span>
                </div>
              </li>
            </ul>
            <template v-if="activeName === 'third'">
              <!-- <el-tree class="sv-tree" ref="tree" v-loading="!!loading" highlight-current :node-key="nodeKey" :data="treeData" :current-node-key="curNodeKey" :default-expanded-keys="expandedKeys" :expand-on-click-node="false" :auto-expand-parent="true" :filter-node-method="filterNode" :render-content="renderContent" :current-change="currentChange" @node-click="nodeClick" :props="defaultProps"></el-tree> -->

              <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </template>
          </div>

        </div>
        <div class="right">
          <template v-if="activeName === 'first' || activeName === 'second'">
            <div class="flex-between">
              <div class="title">Id-res_dev.dim_area</div>
              <el-button type="text" title="查看详情"><i class="iconfont icon-shujutancha font-14 color-btn" @click="handleCheck()"></i></el-button>
            </div>
            <div class="desc">暂无描述</div>
            <el-table :data="tableData2" style="width: 100%" v-loading="!!loading">
              <el-table-column prop="field1" label="字段">
              </el-table-column>
              <el-table-column prop="field2" label="类型">
              </el-table-column>
              <el-table-column prop="field3" label="描述"></el-table-column>
            </el-table>
          </template>
          <template v-if="activeName === 'third'">
            <div class="func-detail-wrap">
              <div class="ant-descriptions">
                <div class="ant-descriptions-view">
                  <table>
                    <tbody>
                      <tr class="ant-descriptions-row">
                        <td class="ant-descriptions-item" colspan="1">
                          <div class="ant-descriptions-item-container"><span class="ant-descriptions-item-label">函数名称</span><span class="ant-descriptions-item-content">concat</span></div>
                        </td>
                      </tr>
                      <tr class="ant-descriptions-row">
                        <td class="ant-descriptions-item" colspan="1">
                          <div class="ant-descriptions-item-container"><span class="ant-descriptions-item-label">函数类型</span><span class="ant-descriptions-item-content">字符串函数</span></div>
                        </td>
                      </tr>
                      <tr class="ant-descriptions-row">
                        <td class="ant-descriptions-item" colspan="1">
                          <div class="ant-descriptions-item-container"><span class="ant-descriptions-item-label">命令格式</span><span class="ant-descriptions-item-content">
                              <div class="multi-lines-wrap">
                                <p>concat(string A, string B...)</p>
                              </div>
                            </span></div>
                        </td>
                      </tr>
                      <tr class="ant-descriptions-row">
                        <td class="ant-descriptions-item" colspan="1">
                          <div class="ant-descriptions-item-container"><span class="ant-descriptions-item-label">函数说明</span><span class="ant-descriptions-item-content">
                              <div class="multi-lines-wrap">
                                <p>返回值是将参数中的所有字符串连接在一起的结果。</p>
                              </div>
                            </span></div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import mixin from '../mixin'
import pager from '@/mixins/pager'
import './common.scss'

export default {
  components: {},
  name: 'HistoryView',
  mixins: [mixin, pager],
  inject: ['attrStore'],
  data () {
    return {
      activeName: 'first',
      loading: 0,
      list: [
        {
          field2: 'Id-res_dev.dim_area'
        },
        {
          field2: 'Id-res_dev.dim_area'
        }
      ],
      list2: [
        {
          field2: 'Id-res_dev.dim_area'
        },
        {
          field2: 'Id-res_dev.dim_area'
        },
        {
          field2: 'Id-res_dev.dim_area'
        }
      ],
      tableData2: [
        {
          field1: 'ds',
          field2: 'string',
          field3: '1级区域'
        },
        {
          field1: 'ds2',
          field2: 'string',
          field3: '1级区域'
        },
        {
          field1: 'ds3',
          field2: 'string',
          field3: '2级区域'
        }
      ],
      treeData: [
        {
          label: '字符串函数',
          children: [
            {
              label: 'chr'
            },
            {
              label: 'concat'
            },
            {
              label: 'get_json_object'
            }
          ]
        },
        {
          label: '数学函数',
          children: [
            {
              label: 'abs'
            },
            {
              label: 'acos'
            }
          ]
        },
        {
          label: '聚合函数',
          children: [{
            label: 'avg'
          },
          {
            label: 'count'
          }]
        }],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    active () {
      return (this.attrStore && this.attrStore.states.active) || {}
    },
    histories () {
      return (this.attrStore && this.attrStore.states.list.slice(0, 25)) || []
    }
  },
  methods: {
    handleNodeClick (data) {
      console.log(data)
    },

    handleClick (val) {

    },

    handleCheck () {

    },

    handleEdit () {

    },

    // 关闭侧边栏
    cancel () {
      this.$root.eventEmitter.emit('hideSidebar')
    },

    confirm () {
      this.cancel()
    },

    setActiveAttr (attr) {
      this.attrStore.commit('setActive', attr)
    },
    setActiveToFirst (attr) {
      this.attrStore.commit('setActiveToFirst', attr)
    }
  }
}
</script>
<style lang="scss" scoped>
.name {
  font-size: 14px;
  font-weight: bold;
}
.side-modal-footer {
  margin: 15px 15px;
  float: right;
}
.node-data-edit-base {
  display: flex;
  .left {
    display: flex;
    flex-direction: column;
    padding-top: 12px;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    width: 50%;
    .content {
      padding: 10px;
      ul {
        li {
          cursor: pointer;
          margin-bottom: 10px;
        }
      }
    }
    .icon-color {
      color: rgba(10, 196, 72, 1);
    }
  }
  .right {
    padding: 10px;
    width: 50%;
    .title {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.9);
    }
    .desc {
      line-height: 18px;
      color: rgba(0, 0, 0, 0.5);
      margin-bottom: 10px;
    }
  }
}

.func-detail-wrap {
  padding: 16px 10px 0;
}

.func-detail-wrap .ant-descriptions-item {
  display: flex;
}

.func-detail-wrap .ant-descriptions-item-label {
  color: rgba(0, 0, 0, 0.5);
  word-break: keep-all;
}

.func-detail-wrap .multi-lines-wrap {
  display: flex;
  flex-direction: column;
}

.func-detail-wrap .multi-lines-wrap p {
  margin: 0;
}
.ant-descriptions-item-container {
  display: flex;
  margin-bottom: 20px;
}
.ant-descriptions-item-container .ant-descriptions-item-content,
.ant-descriptions-item-container .ant-descriptions-item-label {
  display: inline-flex;
  align-items: baseline;
  margin-right: 10px;
}
</style>
