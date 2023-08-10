<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-02 13:19:50
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-06 10:40:42
 * @FilePath: \数据智能构建\src\views\tag\asset-market\public-market\index.vue
-->
<template>
  <div class="public-market" v-if="showHome">
    <div class="public-market-top">
      <div class="total-card">
        <div class="top-title">公共市场<i class="el-icon-arrow-down arrow"></i></div>
        <div class="total-cont">
          <p class="title">标签总量</p>
          <p class="value">228</p>
        </div>
      </div>
      <el-divider direction="vertical" class="top-divider"></el-divider>
      <div class="top-tag-view">
        <el-tabs v-model="activeName" class="tag-view-tabs">
          <el-tab-pane label="新上标签" name="new">
            <div class="new-tag-list">
              <div class="new-tag-count">
                <span>36</span><span>个</span>
              </div>
              <div class="tag-list">
                <template v-for="(item, index) in tagList" >
                  <TagItem :key="index" :name="item.name" :index="index + 1"></TagItem>
                </template>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="最受欢迎标签" name="most">
            <div class="new-tag-list">
              <div class="new-tag-count">
                <span>306</span><span>个</span>
              </div>
              <div class="tag-list">
                <template v-for="(item, index) in tagList" >
                  <TagItem :key="index" :name="item.name" :index="index + 1"></TagItem>
                </template>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="view-wrapper">
      <div class="side-menu-wrapper">
        <div class="menu-title">标签类目</div>
        <el-divider class="menu-divider"></el-divider>
        <div class="pl-10 pr-10">默认类目<span>(55)</span></div>
        <el-divider class="menu-divider"></el-divider>
        <SideMenu :categoryList="categoryList"></SideMenu>
      </div>
      <div class="table-list-wrapper">
        <ListHeader title="标签"></ListHeader>
        <div class="table" v-resize="resizeDom">
          <el-table
            :data="tableData"
            :height="height"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              prop="tagName"
              label="标签名称"
            >
              <template slot-scope="scope">
                <Cell :data="scope.row" nameKey="tagName" codeKey="code"></Cell>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="描述"></el-table-column>
            <el-table-column prop="desc" label="关联实体"></el-table-column>
            <el-table-column prop="desc" label="实体ID"></el-table-column>
            <el-table-column prop="desc" label="所属类目"></el-table-column>
            <el-table-column prop="desc" label="服务类型"></el-table-column>
            <el-table-column prop="desc" label="标签类型"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip content="详情" placement="top">
                  <el-button
                    size="mini"
                    type="text"
                    @click="showHome = false"
                  >
                    <i class="iconfont icon-yuanbiao-xianxing" style="font-size: 14px"></i>
                  </el-button>
                </el-tooltip>
                <el-button
                  size="mini"
                  type="text"
                  >
                    <i class="el-icon-key" style="font-size: 14px"></i>
                  </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="foot">
          <el-checkbox v-model="curPageAllChecked">本页全选</el-checkbox>
          <el-pagination
            layout="prev, pager, next, sizes, jumper"
            :pager-count="5"
            :page-sizes="[10, 20, 30, 40]"
            :total="1000">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
  <div v-else style="width:100%;height:100%">
    <PublicDetail @backHand="showHome = true"></PublicDetail>
  </div>
</template>

<script>
import ListHeader from '../list-header.vue'
import PublicDetail from './detail.vue'
import Cell from '../cell.js'
import SideMenu from '../sideMenu.js'
import '../style.scss'
const TagItem = {
  props: {
    name: String,
    index: [String, Number]
  },
  render(h) {
    return (
      <div>
        <span>{this.index}</span>
        <OverflowTooltip style="flex:1">{this.name}</OverflowTooltip>
      </div>
    )
  }
}

export default {
  name: 'PublicMarket',
  components: {
    TagItem,
    SideMenu,
    ListHeader,
    Cell,
    PublicDetail
  },
  data() {
    return {
      activeName: 'new',
      tagList: [
        { name: '最受欢饮产品' },
        { name: '性别' },
        { name: '最受欢迎的产品类型' },
        { name: '购买金额均值_演示' },
        { name: '长投偏好分层_高学历_用户' },
        { name: '出生年代' },
        { name: '合格投资者剩余有效天数' },
        { name: '是否合格投资着' },
        { name: '最受欢迎的产品' },
        { name: '最受欢迎的产品' },
        { name: '最受欢迎的产品' },
        { name: '最受欢迎的产品' }
      ],
      categoryList: [
        {
          name: '证券',
          count: 52,
          children: [
            {
              name: '客户信息',
              count: 22,
              children: [
                {
                  name: '人口学',
                  count: 2,
                },
                {
                  name: '社会学',
                  count: 12,
                }
              ]
            },
            {
              name: '账户总览',
              count: 25,
            }
          ]
        }
      ],
      tableData: [
        {
          desc: '1234',
          tagName: '2234'
        },
        {
          desc: '12334',
          tagName: ''
        },
        {
          desc: '',
          tagName: '3477745'
        }
      ],
      height: 0,
      curPageAllChecked: false,
      showHome: true
    }
  },
  methods: {
    resizeDom(data) {
      this.height = parseInt(data.height)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>