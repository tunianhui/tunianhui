<!--
 * @Author: 大炸鹅
 * @Date: 2023-06-06 16:00:26
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-06 17:30:17
 * @FilePath: \数据智能构建\src\views\tag\asset-market\table.vue
-->
<template>
  <div class="table-wrapper">
    <el-table
      :data="tableData"
      :show-header="false"
      :height="height"
      :default-expand-all="true"
      style="width: 100%;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column type="expand" width="1">
        <template slot-scope="props">
          <div class="expand">
            <div class="left">
              <div class="title">实体ID覆盖量</div>
              <div class="content">0</div>
            </div>
            <div class="right">
              <el-descriptions>
                <el-descriptions-item label="标签类型">kooriookami</el-descriptions-item>
                <el-descriptions-item label="上架时间">2020-10-10 12:12:12</el-descriptions-item>
                <el-descriptions-item label="实体">金融产品</el-descriptions-item>
                <el-descriptions-item label="实体ID">编号</el-descriptions-item>
                <el-descriptions-item label="所属类目">金融产品</el-descriptions-item>
                <el-descriptions-item label="描述">-</el-descriptions-item>
            </el-descriptions>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template>
          <div class="name-wrapper1" style="display: flex">
            <i class="iconfont icon-cengjiduixiang mr-5" style="font-size: 16px;color: #59B5B6;"></i>
            <span style="font-size:14px;font-weight:600" class="mr-5">decimal_005</span>
            <span class="mr-5">decimal_005</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="170">
        <template>
          <el-button type="text" size="small" class="text">
            <i class="iconfont icon-xiangmu"></i>
            <span>查看详情</span>
          </el-button>
          <el-button type="text" size="small" class="text">
            <i class="iconfont icon-shenqingquanxian"></i>
            <span>申请权限</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="bottom-wrapper">
      <div class="bottom-left">
        <el-checkbox v-model="checked"></el-checkbox>
        <span>本页全选</span>
      </div>
      <div class="bottom-right">
        <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        @current-change="currentChange"
      >
      </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: {
    height: String
  },
  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      },
      {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      checked: false,
      total: 100,
      pageSizes: [10, 20, 30, 40],
      pageSize: 10
    }
  },
  methods: {
    currentChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table__expand-column {
    // display: none;
    .cell {
      display: none;
    }
  }
  td.el-table__cell {
    border-bottom: none;
  }
  td.el-table__expanded-cell {
    border-bottom: 1px solid #EBEEF5;
    padding: 0;
  }
  .el-table__body tr:hover>td.el-table__cell {
    background: #fff;
  }
  .el-descriptions__header {
    display: none;
  }
  .el-descriptions__body {
    background: transparent;
    .el-descriptions-row {
      background: transparent;
    }
  }
}
.expand {
  width: calc(100% - 56px);
  background: #FAFAFB;
  margin-left: 56px;
  // height: 40px;
  margin-bottom: 10px;
  padding: 10px 15px;
  display: flex;
  // align-items: center;
  justify-content: space-between;
  .left {
    width: 130px;
    border-right: 1px solid #EBEEF5;
    margin-right: 10px;
    .content {
      font-weight: 600;
    }
  }
  .right {
    flex: 1;
    width: 0;
  }
  .divider {
    height: 100%;
  }
}
.text {
  color: rgba($color: #000000, $alpha: 0.8);
  font-size: 12px;
  i {
    font-size: 14px;
    margin-right: 5px;
  }
}
.table-wrapper {
  position: relative;
}
.bottom-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .bottom-left {
    > span:last-child {
      font-size: 14px;
      color: rgba($color: #000000, $alpha: 0.8);
      margin-left: 10px;
    }
  }
}
</style>