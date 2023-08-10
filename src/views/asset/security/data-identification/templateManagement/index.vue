<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-03-21 09:53:09
 * @LastEditTime: 2023-03-23 17:42:41
 * @Description:
-->
<template>
  <div class="template-wrapper">
    <div class="page-title mb-10">模板管理</div>
    <el-radio-group v-model="type" class="mb-20">
      <el-radio-button label="1">模板配置</el-radio-button>
      <el-radio-button label="2">模板详情</el-radio-button>
      <el-radio-button label="3">级别配置</el-radio-button>
    </el-radio-group>

    <template v-if="type === '1'">
      <div class="tips">{{ tips }}</div>
      <div class="template-title">参考模板</div>
      <div class="item-wrapper">
        <el-card shadow="hover" class="box-card" v-for="item in list" :key="item.id">
          <div class="item">
            <div>
              <img src="@/assets/images/asset/security/temp-1.png" alt="" />
            </div>
            <div class="content-text">
              <div class="title">{{ item.template_name }}</div>
              <div class="description">{{ item.remark }}</div>
              <div>
                <el-button type="text" @click="handleMaster(item)">主用</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="showDetail(item)">详情</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="handleCopy(item)">复制</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="handleFreeze(item)">冻结</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <el-divider></el-divider>
      <div class="template-title">自定义模板</div>
      <div class="item-wrapper">
        <el-card shadow="hover" class="box-card" v-for="item in list" :key="item.id">
          <div class="item">
            <div>
              <img src="@/assets/images/asset/security/temp-2.png" alt="" />
            </div>
            <div class="content-text">
              <div class="title">{{ item.template_name }}</div>
              <div class="description">{{ item.remark }}</div>
              <div>
                <el-button type="text" @click="handleMaster(item)">主用</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="handleMaster(item)">编辑</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="showDetail(item)">详情</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="showDetail(item)">删除</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="handleCopy(item)">复制</el-button>
                <el-divider direction="vertical"></el-divider>
                <el-button type="text" @click="handleFreeze(item)">激活</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </template>

    <template v-if="type === '2'">
      <Detail></Detail>
    </template>

    <template v-if="type === '3'">
      <Level></Level>
    </template>

    <!-- 查看详情 -->
    <el-drawer :title="title" :visible.sync="showDrawer" direction="rtl">
      <div class="template-detail-wrapper">
        <el-tree :data="templateDetail" node-key="id" :props="{label: 'name'}" default-expand-all :expand-on-click-node="false">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="mr-5">S3</span>
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
      <div class="button-wrapper">
        <el-button @click="handleCancle">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import {
  ref
} from 'vue'
import Detail from './templateDetail'
import Level from './levelDispose'
import { usehook } from './hooks/useData.js'
const {
  title,
  showDrawer,
  list,
  templateDetail,
  showDetail,
  handleCancle,
  handleMaster,
  handleCopy,
  handleFreeze
} = usehook()
// 最多包含一个主模板、两个活跃模板，其它模板为冻结状态
const tips = '当前主模板: 内置金融分类分级模版 参考JRT 0197-2020 金融数据安全数据安全分级指南Copy; 活跃模板: 互联网行业分类分级模板,主模板、活跃模板可用于识别任务'

const type = ref('1')
</script>

<style scoped lang="less">
.template-wrapper {
  padding: 10px 0;
  .tips {
    height: 40px;
    padding: 10px 20px;
    background-color: #f8f8f9;
  }
  .template-title {
    color: #333;
    font-size: 14px;
    font-weight: 500;
    margin: 24px 0 16px;
  }
  .item-wrapper {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
    .box-card {
      flex: 0 0 32.5%;
      .item {
        display: flex;
        img {
          width: 48px;
          aspect-ratio: auto 48 / 48;
          height: 48px;
        }
        .content-text {
          margin-left: 16px;
          .description {
            color: #666;
            font-size: 12px;
            font-weight: 400;
            height: 36px;
            line-height: 18px;
            margin: 8px 0 16px;
          }
        }
      }
    }
  }
}

.template-detail-wrapper {
  height: calc(100% - 69px);
  padding: 0 20px 40px;
  overflow: auto;
}

.button-wrapper {
  padding: 20px;
  border-top: 1px solid #e3e4e6;
}
</style>
