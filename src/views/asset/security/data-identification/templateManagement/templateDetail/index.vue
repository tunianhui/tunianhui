<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-22 15:53:41
 * @LastEditTime: 2023-03-24 11:00:18
 * @Description:
-->
<template>
  <div class="detail-wrapper">
    <div class="tips">
      <span class="mr-10">当前正在使用模版: </span>
      <el-select v-model="searchForm.recognize_type" class="ml-10" @change="filterType">
        <el-option v-for="item in matchTypeList" :value="item.value" :label="item.name" :key="item.value" />
      </el-select>
    </div>

    <div class="tools mb-10 mt-20">
      <el-button type="primary" @click="handleAddFeature">添加模型</el-button>
      <el-select v-model="searchForm.recognize_type" class="ml-10" @change="filterType">
        <el-option v-for="item in matchTypeList" :value="item.value" :label="item.name" :key="item.value" />
      </el-select>
      <el-select v-model="searchForm.is_default" class="ml-10" @change="filterType">
        <el-option v-for="item in identifyList" :value="item.value" :label="item.name" :key="item.value" />
      </el-select>
    </div>

    <div class="content">
      <div class="left">
        <div class="mt-10">
          <span class="title">敏感分级</span>
          <el-button type="text" icon="el-icon-plus" @click="handleAddClassify">新建</el-button>
        </div>
        <el-tree :data="classifyData" node-key="id" :props="{label: 'name'}" default-expand-all show-checkbox :expand-on-click-node="false" @check-change="handleCheckChange">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div class="right">
        <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="model_name" label="规则名称">
            <template slot-scope="{row}">
              <span>{{row.model_name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="grade_abbr" label="敏感等级" width="200">
            <template slot-scope="{row}">
              <div class="lv-config-risk-color">
                <span class="icon" style="background: rgb(91, 110, 144); width: 28px; height: 28px; border-radius: 28px; line-height: 28px;">{{row.grade_abbr}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="200">
            <template slot-scope="{row}">
              <el-switch v-model="row.status">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320">
            <template slot-scope="scope">
              <el-button type="text">编辑</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text">详情</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :current-page.sync="pageFilters.pageNo" :page-sizes="pageSizes" :total="total" layout="total, sizes, prev, pager, next"></el-pagination>

      </div>
    </div>
  </div>
</template>

<script setup>
import { usehook } from './hooks/useData.js'
const {
  pageSizes,
  total,
  pageFilters,
  classifyData,
  tableData,
  searchForm,
  matchTypeList,
  identifyList,
  handleAddFeature,
  handleAddClassify,
  filterType,
  handleCheckChange,
  handleSelectionChange,
  handleCurrentChange,
  handleSizeChange
} = usehook()

</script>

<style scoped lang="less">
.detail-wrapper {
  .tips {
    padding: 10px 20px;
    background-color: #f5f5f5;
  }

  .tools {
    background-color: #fff;
    padding: 20px 10px;
  }

  .content {
    height: calc(100vh - 300px);
    display: flex;
    gap: 20px;
    .left {
      background-color: #fff;
      padding: 0 10px 20px;
      width: 280px;
      height: 100%;
      max-height: 660px;
      min-height: 0;
      overflow: auto;
      .title {
        font-size: 14px;
        font-weight: 500;
        margin-right: 10px;
      }
    }
    .right {
      flex: 1;
      .lv-config-risk-color {
        display: flex;
        .icon {
          border-radius: 20px;
          color: #fff;
          display: inline-block;
          font-style: italic;
          font-weight: 700;
          height: 20px;
          line-height: 20px;
          text-align: center;
          width: 20px;
        }
      }
    }
  }
}
</style>
