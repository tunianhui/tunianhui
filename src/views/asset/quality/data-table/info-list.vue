<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-08-06 15:09:13
 * @LastEditTime: 2021-08-06 15:42:11
 * @Description:
-->
<template>
  <div class="info-list mb-15">
    <div class="info-list-header">{{title}}</div>
    <div class="basic-info">
      <div class="info-item mr-20" v-for="(item, i) in list" :key="i">
        <span class="basic-label">{{item.label}}：</span>
        <OverflowTooltip class="basic-value">{{item.value}}</OverflowTooltip>
      </div>
      <el-tooltip class="item" effect="dark" content="编辑" placement="top">
        <el-button type="text" class="edit-btn">
          <i class="el-icon-edit-outline font-16 color-btn" title="编辑" @click="edit"></i>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'InfoList',
  props: {
    title: String,
    list: Array
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {}
  },
  methods: {
    edit() {
      this.$emit('edit')
    }
  }
}
</script>

<style lang="scss">
.info-list {
  padding: 16px 20px;
  background-color: #f8f8f8;
  .info-list-header {
    margin-bottom: 5px;
  }
  .basic-info {
    display: flex;
    position: relative;
    .info-item {
      font-size: 12px;
      .basic-label {
        color: rgba($color: #000000, $alpha: 0.5);
      }
      .basic-value {
        color: rgba($color: #000000, $alpha: 0.8);
        width: 180px;
      }
    }
  }
  .edit-btn {
    padding: 0px !important;
    position: absolute;
    right: 80px;
    top: -15px;
  }
}
</style>
