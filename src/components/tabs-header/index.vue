<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-14 10:46:56
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-28 10:35:49
 * @FilePath: \智能数据构建\src\components\tabs-header\index.vue
-->
<template>
  <div :class="['tabs-header', borderBottomWrapper ? 'borderBottomWrapper' : '']" :style="{height: height}">
    <div class="wrapper">
      <div class="left">
        <slot name="title" v-if="$slots.title"></slot>
        <div class="title" v-if="!$slots.title && title">
          {{title}}
        </div>
        <div>
          <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name"></el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabsHeader',
  props: {
    title: {
      type: String,
      default: ''
    },
    tabs: {
      type: Array,
      default: () => []
    },
    active: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '40px'
    },
    borderBottomWrapper: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeTab: this.active
    }
  },
  methods: {
    handleTabClick (tab) {
      this.activeTab = tab.name
      this.$emit('tab-click', tab)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-header {
  .wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      .title {
        font-size: 18px;
        color: #333;
        margin-right: 20px;
        user-select: none;
      }
    }
  }
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__item {
      padding: 0 10px;
    }
  }
  &.borderBottomWrapper {
    ::v-deep {
      .el-tabs__nav-wrap::after {
        height: 0;
      }
    }
    .wrapper {
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
