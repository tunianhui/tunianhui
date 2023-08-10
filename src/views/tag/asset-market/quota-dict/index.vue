<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-06 09:22:32
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-02-06 10:48:06
 * @FilePath: \数据智能构建\src\views\tag\asset-market\quota-dict\index.vue
-->
<template>
  <div class="quota-dict" v-if="showHome">
    <div class="public-market-top">
      <div class="total-card">
        <div class="top-title">指标字典<i class="el-icon-arrow-down arrow"></i></div>
        <div class="total-cont">
          <p class="title">指标总量</p>
          <p class="value">228</p>
        </div>
      </div>
      <el-divider direction="vertical" class="top-divider"></el-divider>
      <div class="top-tag-view">
        <el-tabs v-model="activeName" class="tag-view-tabs">
          <el-tab-pane label="新上指标" name="new">
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
          <el-tab-pane label="最受欢迎指标" name="most">
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
        </el-tabs>
      </div>
    </div>
    <div class="view-wrapper">
      <div class="side-menu-wrapper">
        <div class="menu-title">指标类目</div>
        <el-divider class="menu-divider"></el-divider>
        <SideMenu :categoryList="categoryList"></SideMenu>
      </div>
      <div class="table-list-wrapper">
        <ListHeader title="指标"></ListHeader>
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
              label="指标标准名称"
            >
              <template slot-scope="scope">
                <Cell :data="scope.row" nameKey="tagName" codeKey="code"></Cell>
              </template>
            </el-table-column>
            <el-table-column prop="desc" label="展示名称"></el-table-column>
            <el-table-column prop="desc" label="业务口径" width="250"></el-table-column>
            <el-table-column prop="desc" label="应用系统"></el-table-column>
            <el-table-column prop="desc" label="指标域"></el-table-column>
            <el-table-column label="操作" width="100">
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
                <el-tooltip content="删除" placement="top">
                  <el-button
                    size="mini"
                    type="text"
                    >
                      <i class="el-icon-delete" style="font-size: 14px"></i>
                  </el-button>
                </el-tooltip>
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
    <QuotaDictDetail @backHand="showHome = true"></QuotaDictDetail>
  </div>
</template>

<script>
import Cell from '../cell.js'
import SideMenu from '../sideMenu.js'
import ListHeader from '../list-header.vue'
import QuotaDictDetail from './detail'
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
  name: 'QuotaDict',
  components: {
    TagItem,
    Cell,
    SideMenu,
    ListHeader,
    QuotaDictDetail
  },
  data() {
    return {
      showHome: true,
      height: 0,
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
          name: '全部域',
          id: 'all'
        },
        {
          name: '用户域',
          id: 'user'
        },
        {
          name: 'POP域',
          id: 'POP'
        },
        {
          name: '促销域',
          id: '促销域'
        },
        {
          name: '仓储域',
          id: '仓储域',
          children: []
        },
        {
          name: '客服域',
          id: '客服域'
        },
        {
          name: '供应链',
          id: '供应链',
          children: [
            {
              name: '供应商',
              id: '供应商'
            },
            {
              name: '采购',
              id: '采购'
            },
            {
              name: '库存',
              id: '库存'
            },
            {
              name: '订单履约',
              id: '订单履约'
            },
            {
              name: '销量预测',
              id: '销量预测'
            },
          ]
        },
        {
          name: '内容域',
          id: '内容域'
        }
      ],
      tableData: [
        {
          tagName: '销售额占比'
        },
        {
          tagName: '日均三步引导销售额'
        },
        {
          tagName: 'App端销售额'
        },
        {
          tagName: '销售额'
        }
      ],
      curPageAllChecked: false
    }
  },
  methods: {
    resizeDom(data) {
      this.height = parseInt(data.height)
    }
  }
}
</script>