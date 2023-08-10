<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-22 15:47:26
 * @LastEditTime: 2023-03-23 10:35:44
 * @Description:
-->

<template>
  <div class="level-wrapper">
    <div class="tips">
      <div>
        当前为【内置金融分类分级模版 参考JRT 0197-2020 金融数据安全数据安全分级指南Copy】，最多可设置10级
      </div>
      <div class="color-list">
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(186, 35, 1);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(243, 52, 46);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(255, 106, 0);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" data-spm-anchor-id="0.12865136.0.i108.170bWNwdWNwdwg" style="background: rgb(255, 175, 54);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(255, 228, 0);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(34, 129, 48);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(133, 211, 0);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(99, 185, 255);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(18, 126, 214);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(91, 110, 144);"></span></div>
        <div class="lv-config-risk-color"><span class="icon" style="background: rgb(216, 216, 216);"></span></div>
      </div>
      <div>高 —————————————————— 低</div>
    </div>

    <el-button type="primary" class="mb-10 mt-10">敏感分级</el-button>
    <el-table :data="tableData">
      <el-table-column prop="grade_level" label="级别ID" width="240">
        <template slot-scope="{row}">
          <span>{{row.grade_level}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recognize_type_name" label="图例颜色" width="160">
        <template slot-scope="scope">
          <div class="lv-config-risk-color"><span class="icon" :style="{background: colorList[scope.$index]}"></span></div>
        </template>
      </el-table-column>
      <el-table-column prop="reference_count" label="引用次数" width="160">
        <template slot-scope="{row}">
          <span>{{row.reference_count}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述">
        <template slot-scope="{row}">
          <span>{{row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text"><i class="el-icon-edit-outline font-16 color-btn" @click="handleEdit(row)"></i></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.$index === tableData.length - 1" class="item" effect="dark" content="删除" placement="top">
            <el-button type="text"><i class="el-icon-delete font-16 color-btn" @click="handleDel(row)"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>

const tableData = [
  {
    'id': '',
    'template_id': '',
    'grade_level': 'S1',
    'remark': '1级敏感数据',
    'reference_count': 10
  },
  {
    'id': '',
    'template_id': '',
    'grade_level': 'S1',
    'remark': '1级敏感数据',
    'reference_count': 10
  },
  {
    'id': '',
    'template_id': '',
    'grade_level': 'S1',
    'remark': '1级敏感数据',
    'reference_count': 10
  },
  {
    'id': '',
    'template_id': '',
    'grade_level': 'S1',
    'remark': '1级敏感数据',
    'reference_count': 10
  },
  {
    'id': '',
    'template_id': '',
    'grade_level': 'S1',
    'remark': '1级敏感数据',
    'reference_count': 10
  },
  {
    'id': '',
    'template_id': '',
    'grade_level': 'S1',
    'remark': '1级敏感数据',
    'reference_count': 10
  }
]

const colorList = [
  'rgb(216, 216, 216)',
  'rgb(91, 110, 144)',
  'rgb(18, 126, 214)',
  'rgb(99, 185, 255)',
  'rgb(133, 211, 0)',
  'rgb(34, 129, 48)',
  'rgb(255, 228, 0)',
  'rgb(255, 175, 54)',
  'rgb(255, 106, 0)',
  'rgb(243, 52, 46)',
  'rgb(186, 35, 1)'
]
</script>

<style scoped lang="less">
.level-wrapper {
  .tips {
    padding: 10px 20px;
    background-color: #f5f5f5;
    .color-list {
      display: flex;
      gap: 4px;
      margin: 10px 0;
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
</style>
