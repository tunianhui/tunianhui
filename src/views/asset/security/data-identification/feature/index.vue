<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-20 11:55:04
 * @LastEditTime: 2023-05-16 09:29:47
 * @Description:
-->
<template>
  <div class="feature-wrapper">
    <div class="page-title mb-10">识别特征</div>

    <div class="tools mb-10">
      <el-button type="primary" @click="handleAddFeature">添加特征</el-button>
      <el-select v-model="searchForm.recognizeType" class="ml-10" @change="filterType">
        <el-option v-for="item in matchTypeList" :value="item.value" :label="item.name" :key="item.value" />
      </el-select>
      <el-select v-model="searchForm.featureFrom" class="ml-10" @change="filterType">
        <el-option v-for="item in identifyList" :value="item.value" :label="item.name" :key="item.value" />
      </el-select>
      <el-input v-model="searchForm.featureName" placeholder="请输入" class="name-input">
        <el-button slot="append" icon="el-icon-search" @click="filterType"></el-button>
      </el-input>
    </div>

    <el-table :data="tableData">
      <el-table-column prop="featureName" label="特征名称">
        <template slot-scope="{row}">
          <span>{{row.featureName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="recognizeTypeName" label="识别类型">
        <template slot-scope="{row}">
          <span>{{row.recognizeTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataTypeName" label="数据类型">
        <template slot-scope="{row}">
          <span>{{row.dataTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="featureFromName" label="来源">
        <template slot-scope="{row}">
          <span :class="{'color-gray': row.featureFrom === '1'}">{{row.featureFromName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="{row}">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="text" :disabled="row.featureFrom === '1'" @click="handleEdit(row.id)"><i class="el-icon-edit-outline font-16 color-btn" :class="{'color-gray': row.featureFrom === '1'}"></i></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="text" :disabled="row.featureFrom === '1'" @click="handleDel(row.id)"><i class="el-icon-delete font-16 color-btn" :class="{'color-gray': row.featureFrom === '1'}"></i></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="fr pt-10 pb-10" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-size="pageFilters.pageSize" :current-page.sync="pageFilters.pageNo" :page-sizes="pageSizes" :total="total" layout="total, prev, pager, next"></el-pagination>

    <!-- 编辑特征 -->
    <el-drawer :title="title" :visible.sync="showEdit" direction="rtl" :size="600">
      <div class="feature-edit">
        <el-form ref="form" :model='formData' :rules="rules" label-position="top">
          <el-form-item label="特征名称" prop="featureName">
            <el-input v-model="formData.featureName" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="匹配类型" prop="recognizeType">
            <el-radio-group v-model="formData.recognizeType" size="mini">
              <el-radio-button label="0">规则匹配</el-radio-button>
              <el-radio-button label="1">字典匹配</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数据类型" prop="dataType">
            <el-radio-group v-model="formData.dataType" size="mini">
              <el-radio-button label="0">结构化数据</el-radio-button>
              <!-- <el-radio-button label="1">非结构化数据</el-radio-button> -->
            </el-radio-group>
          </el-form-item>

          <template v-if="formData.recognizeType === '0'">
            <el-form-item label="特征规则" prop="">
              <div class="group-heard">
                <el-radio-group v-model="formData.feature_rules[0].operate" size="mini">
                  <el-radio-button label="AND"></el-radio-button>
                  <el-radio-button label="OR"></el-radio-button>
                </el-radio-group>
                <el-button type="text" icon="el-icon-plus" class="ml-10" @click="addRule(formData.feature_rules[0].children)">添加规则</el-button>
                <el-button type="text" class="ml-10" @click="addGroup(formData.feature_rules[0].children)">添加组</el-button>
                <el-button type="text" disabled class="ml-10" @click="delGroup">删除组</el-button>
              </div>
              <div class="rulesForm-item" v-for="(item, index) in formData.feature_rules[0].children.filter(ele => !ele.operate)" :key="item.key">
                <div class="rulesForm-item-relation">{{formData.feature_rules[0].operate}}</div>
                <el-select v-model="item.identify_item" placeholder="请选择" class="select-1">
                  <el-option v-for="item in ruleList1" :value="item.value" :label="item.name" :key="item.value" />
                </el-select>
                <el-select v-model="item.recognize_way" placeholder="请选择" class="select-2 ml-10">
                  <el-option v-for="item in ruleList2" :value="item.value" :label="item.name" :key="item.value" />
                </el-select>
                <el-select v-if="item.col_type === '数据类型'" v-model="item.match_rule" placeholder="请选择" class="name-input">
                  <el-option v-for="item in ruleList3" :value="item" :label="item" :key="item" />
                </el-select>
                <el-input v-else v-model="item.col_name" placeholder="请输入内容" class="name-input"></el-input>
                <el-button type="text" icon="el-icon-delete" @click="delDule(formData.feature_rules[0].children, index)"></el-button>
              </div>

              <!-- 分组 -->
              <template v-if="formData.feature_rules[0].children.filter(ele => ele.operate).length">
                <div class="group-collapse-assets-form group-line" v-for="(itemGroup, index) in formData.feature_rules[0].children.filter(ele => ele.operate)" :key="itemGroup.key">
                  <div class="group-heard">
                    <div class="group-relation">{{formData.feature_rules[0].operate}}</div>
                    <el-radio-group v-model="itemGroup.operate" size="mini">
                      <el-radio-button label="AND"></el-radio-button>
                      <el-radio-button label="OR"></el-radio-button>
                    </el-radio-group>
                    <el-button type="text" icon="el-icon-plus" class="ml-10" @click="addGroupRule(itemGroup)">添加规则</el-button>
                    <el-button disabled type="text" class="ml-10">添加组</el-button>
                    <el-button type="text" class="ml-10" @click="delGroup(formData.feature_rules[0].children, index)">删除组</el-button>
                  </div>
                  <div class="group-wrapper">
                    <div class="rulesForm-item" v-for="(item, index) in itemGroup.children" :key="item.key">
                      <div class="rulesForm-item-relation">{{itemGroup.operate}}</div>
                      <el-select v-model="item.identify_item" placeholder="请选择" class="select-1">
                        <el-option v-for="item in ruleList1" :value="item.value" :label="item.name" :key="item.value" />
                      </el-select>
                      <el-select v-model="item.recognize_way" placeholder="请选择" class="select-2 ml-10">
                        <el-option v-for="item in ruleList2" :value="item.value" :label="item.name" :key="item.value" />
                      </el-select>
                      <el-select v-if="item.col_type === '数据类型'" v-model="item.match_rule" placeholder="请选择" class="name-input">
                        <el-option v-for="item in ruleList3" :value="item" :label="item" :key="item" />
                      </el-select>
                      <el-input v-else v-model="item.col_name" placeholder="请输入内容" class="name-input"></el-input>
                      <el-button v-if="itemGroup.children.length > 1" type="text" icon="el-icon-delete" @click="delGroupRule(itemGroup.children, index)"></el-button>
                    </div>
                  </div>
                </div>
              </template>
            </el-form-item>

            <div>
              <el-checkbox v-model="checked">例外规则</el-checkbox>
            </div>
            <div class="group-heard">
              <el-radio-group v-model="formData.feature_rules[1].operate" size="mini">
                <el-radio-button label="AND"></el-radio-button>
                <el-radio-button label="OR"></el-radio-button>
              </el-radio-group>
              <el-button type="text" icon="el-icon-plus" class="ml-10" @click="addRule(formData.feature_rules[1].children)">添加规则</el-button>
              <el-button type="text" class="ml-10" @click="addGroup(formData.feature_rules[1].children)">添加组</el-button>
              <el-button type="text" disabled class="ml-10" @click="delExceptionGroup">删除组</el-button>
            </div>
            <div class="rulesForm-item" v-for="(item, index) in formData.feature_rules[1].children.filter(ele => !ele.operate)" :key="item.key">
              <div class="rulesForm-item-relation">{{formData.feature_rules[1].operate}}</div>
              <el-select v-model="item.identify_item" placeholder="请选择" class="select-1">
                <el-option v-for="item in ruleList1" :value="item.value" :label="item.name" :key="item.value" />
              </el-select>
              <el-select v-model="item.recognize_way" placeholder="请选择" class="select-2 ml-10">
                <el-option v-for="item in ruleList2" :value="item.value" :label="item.name" :key="item.value" />
              </el-select>
              <el-select v-if="item.col_type === '数据类型'" v-model="item.match_rule" placeholder="请选择" class="name-input">
                <el-option v-for="item in ruleList3" :value="item" :label="item" :key="item" />
              </el-select>
              <el-input v-else v-model="item.col_name" placeholder="请输入内容" class="name-input"></el-input>
              <el-button type="text" icon="el-icon-delete" @click="delDule(formData.feature_rules[1].children, index)"></el-button>
            </div>

            <!-- 分组 -->
            <template v-if="formData.feature_rules[1].children.filter(ele => ele.operate).length">
              <div class="group-collapse-assets-form group-line" v-for="(itemGroup, index) in formData.feature_rules[1].children.filter(ele => ele.operate)" :key="itemGroup.key">
                <div class="group-heard">
                  <div class="group-relation">{{formData.feature_rules[1].operate}}</div>
                  <el-radio-group v-model="itemGroup.operate" size="mini">
                    <el-radio-button label="AND"></el-radio-button>
                    <el-radio-button label="OR"></el-radio-button>
                  </el-radio-group>
                  <el-button type="text" icon="el-icon-plus" class="ml-10" @click="addGroupRule(itemGroup)">添加规则</el-button>
                  <el-button disabled type="text" class="ml-10">添加组</el-button>
                  <el-button type="text" class="ml-10" @click="delExceptionGroup(formData.feature_rules[1].children,index)">删除组</el-button>
                </div>
                <div class="group-wrapper">
                  <div class="rulesForm-item" v-for="(item, index) in itemGroup.children" :key="item.key">
                    <div class="rulesForm-item-relation">{{itemGroup.operate}}</div>
                    <el-select v-model="item.identify_item" placeholder="请选择" class="select-1">
                      <el-option v-for="item in ruleList1" :value="item.value" :label="item.name" :key="item.value" />
                    </el-select>
                    <el-select v-model="item.recognize_way" placeholder="请选择" class="select-2 ml-10">
                      <el-option v-for="item in ruleList2" :value="item.value" :label="item.name" :key="item.value" />
                    </el-select>
                    <el-select v-if="item.col_type === '数据类型'" v-model="item.match_rule" placeholder="请选择" class="name-input">
                      <el-option v-for="item in ruleList3" :value="item" :label="item" :key="item" />
                    </el-select>
                    <el-input v-else v-model="item.col_name" placeholder="请输入内容" class="name-input"></el-input>
                    <el-button v-if="itemGroup.children.length > 1" type="text" icon="el-icon-delete" @click="delGroupRule(itemGroup.children, index)"></el-button>
                  </div>
                </div>
              </div>
            </template>
          </template>

          <template v-if="formData.recognizeType === '1'">
            <div class="mb-10 mt-20">
              <span class="font-14 mr-20">字典匹配</span>
              <el-checkbox v-model="checked">模糊匹配</el-checkbox>
            </div>
            <el-form-item label="匹配类型" prop="dic_type">
              <el-radio-group v-model="formData.dic_type" size="mini">
                <el-radio-button label="1">输入字典</el-radio-button>
                <el-radio-button label="2">导入字典</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <template v-if="formData.dic_type === '1'">
              <div>
                <el-input></el-input>
              </div>
              <div class="remark">
                支持多个输入 “换行符” 区隔；单个特征值的长度 128 字符，注意单个词典中的词语不要包含逗号，否则可能会被分割成多个关键词。
              </div>
            </template>
            <template v-else>
              <div class="mt-20">
                <span>字典文件</span>
                <el-button class="ml-10" @click="handleUpload">导入文件<i class="el-icon-upload el-icon--right"></i></el-button>
              </div>
              <div class="remark">
                字典文件要求为txt文件；每行一个特征值，单个特征值的长度最大128字符，注意单个词典中的词语不要包含逗号，否则可能会被分割成多个关键词。
              </div>
            </template>
          </template>
        </el-form>
      </div>
      <div class="button-wrapper">
        <el-button type="primary" class="mr-10" @click="handleSure(form)">确定</el-button>
        <el-button @click="handleCancle">取消</el-button>
      </div>
    </el-drawer>
    <!-- <Modal v-if=""></Modal> -->
  </div>
</template>

<script setup>
// import Model form './comps/export'
import {
  ref
} from 'vue'

import { usehook } from './hooks/useData.js'
import { Model } from 'echarts/core.js'
const {
  pageSizes,
  total,
  tableData,
  matchTypeList,
  identifyList,
  rules,
  searchForm,
  pageFilters,
  formData,
  title,
  showEdit,
  ruleList1,
  ruleList2,
  ruleList3,
  filterType,
  handleAddFeature,
  handleDel,
  handleEdit,
  handleCancle,
  handleCurrentChange,
  handleSizeChange,
  addRule,
  delDule,
  addGroup,
  delGroup,
  addGroupRule,
  delGroupRule,
  delExceptionGroup,
  handleSure
} = usehook()

const form = ref(null)
const checked = ref(false)

// 导入文件 一次一个
const handleUpload = () => {

}
</script>

<style scoped lang="less">
.color-gray {
  color: #c0c4cc;
}
.feature-wrapper {
  .name-input {
    width: 200px;
    margin-left: 10px;
  }
}
.feature-edit {
  height: calc(100% - 69px);
  padding: 0 20px 40px;
  overflow: auto;
  .group-heard {
    margin: 10px 0;
  }
  .rulesForm-item {
    display: flex;
    .rulesForm-item-relation {
      background-color: #fff;
      border: 1px solid #d1d5d9;
      border-radius: 2px;
      color: #999;
      font-size: 12px;
      font-weight: 400;
      height: 18px;
      letter-spacing: 0;
      line-height: 16px;
      margin: 8px 10px;
      position: relative;
      text-align: center;
      width: 30px;
      z-index: 99;
      &:before {
        background: #c0c6cc;
        content: '';
        height: 1px;
        position: absolute;
        right: -11px;
        top: calc(50% - 1px);
        width: 10px;
      }
      &:after {
        background: #c0c6cc;
        content: '';
        height: 18px;
        left: calc(50% - 1px);
        position: absolute;
        top: -18px;
        width: 1px;
      }
    }
    .select-1 {
      width: 120px;
    }
    .select-2 {
      width: 120px;
    }
    .name-input {
      width: 200px;
      margin: 0 10px;
    }
  }
  .remark {
    font-size: 12px;
    color: rgb(136, 136, 136);
    margin-top: 10px;
  }
}
.button-wrapper {
  padding: 20px;
  border-top: 1px solid #e3e4e6;
}

.group-collapse-assets-form {
  background-color: #fff;
  padding: 16px 0;
  position: relative;
  .group-heard {
    display: flex;
    .group-relation {
      background-color: #fff;
      border: 1px solid #d1d5d9;
      border-radius: 2px;
      color: #999;
      font-size: 12px;
      font-weight: 400;
      height: 18px;
      letter-spacing: 0;
      line-height: 16px;
      margin: 3px 10px;
      position: relative;
      text-align: center;
      width: 30px;
      z-index: 10;
      &::before {
        background: #c0c6cc;
        content: '';
        height: 1px;
        position: absolute;
        right: -11px;
        top: calc(50% - 1px);
        width: 10px;
      }
    }
  }
}

.group-line {
  &::after {
    background: #c0c6cc;
    content: '';
    height: calc(100% + 16px);
    left: 24px;
    position: absolute;
    top: -14px;
    width: 1px;
    z-index: 9;
  }
}

.group-wrapper {
  margin-left: 56px;
}
</style>
