<!--
 * @Author: 大炸鹅
 * @Date: 2023-06-16 11:29:25
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-13 17:16:22
 * @FilePath: \智能数据构建\src\views\rd\operation-new\component\flow\node-detail.vue
-->
<template>
<div>
  <el-descriptions class="margin-top" :column="3" size="medium" border v-if="pageType === 'cycle' || pageType === 'manual'">
    <template>
      <el-descriptions-item>
        <template slot="label">
          节点名称：
        </template>
        <span>{{currentNode.name}}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          节点ID：
        </template>
        <span>{{currentNode.id}}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          节点类型：
        </template>
        <span>{{currentNode.task_type}}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          所在项目：
        </template>
        <span>{{currentNode.project}}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          负责人：
        </template>
        <span>{{currentNode.user_name}}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          最近更新时间：
        </template>
        {{currentNode.update_time}}
      </el-descriptions-item>
    </template>
  </el-descriptions>
  <template v-if="pageType === 'cycleInstance' || pageType === 'manualInstance'">
    <el-descriptions class="margin-top" :column="3" size="medium" border title="基本信息">
      <template>
        <el-descriptions-item>
          <template slot="label">
            节点名称：
          </template>
          <span>{{currentNode.name}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            节点ID：
          </template>
          <span>{{currentNode.id}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            实例ID：
          </template>
          <span>{{currentNode.taskInstanceId}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            节点类型：
          </template>
          <span>{{currentNode.task_type}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            所属项目：
          </template>
          <span>{{currentNode.project}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            负责人：
          </template>
          {{currentNode.user_name}}
        </el-descriptions-item>
      </template>
    </el-descriptions>
    <el-descriptions class="margin-top" :column="3" size="medium" border title="运行信息">
      <template>
        <el-descriptions-item>
          <template slot="label">
            运行状态：
          </template>
          <span>
            <i :class="[nodeStatusIcon[currentNode.state]]" :style="{color: nodeStatusColors[currentNode.state]}"></i>
            {{nodeStatus[currentNode.state]}}
          </span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            开始运行时间：
          </template>
          <span>{{currentNode.start_time}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            结束运行时间：
          </template>
          <span>{{currentNode.end_time}}</span>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            运行时长：
          </template>
          <span>{{currentNode.duration}}</span>
        </el-descriptions-item>
      </template>
    </el-descriptions>
  </template>
</div>
  
</template>

<script>
import { nodeStatus, nodeStatusIcon, nodeStatusColors } from './config'
export default {
  name: 'NodeDetail',
  props: {
    currentNode: {
      type: Object,
      default: () => {}
    },
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      nodeStatus,
      nodeStatusIcon,
      nodeStatusColors,
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  text-align: center;
  padding: 3px 0px;
  background: #F5F1FF;
  border: 1px solid #9772FF;
  font-size: 12px;
  color: #9772FF;
  width: 55px;
}
::v-deep {
  .el-descriptions-item__label {
    font-size: 13px;
    background: transparent!important;
    border: none!important;
    width: 110px;
    padding-right: 0!important;
  }
  .el-descriptions-item__cell  {
    font-size: 13px;
    background: transparent!important;
    border: none!important;
  }
}
</style>