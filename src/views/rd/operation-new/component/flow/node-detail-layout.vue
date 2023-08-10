<!--
 * @Author: 大炸鹅
 * @Date: 2023-06-15 17:06:56
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-06-16 14:14:58
 * @FilePath: \dataphin\src\views\rd\operation-new\component\flow\node-detail-layout.vue
-->
<template>
  <el-drawer
    title="我是标题"
    :visible.sync="drawer"
    direction="btt"
    :modal="false"
    :size="height"
    :withHeader="false"
    style="position:absolute"
    :modal-append-to-body="false"
    @close="handleClose">
    <div class="wrapper">
      <div class="header">
        <div class="tabs">
          <div
            :class="['tab-item', activeIndex === index ? 'active' : '']"
            v-for="(item, index) in tabs"
            :key="item.value"
            @click="tabClick(index)"
          >
            {{item.label}}
          </div>
        </div>
        <div class="btns">
          <i class="el-icon-d-arrow-left" @click="height = 600"></i>
          <i class="el-icon-d-arrow-left" @click="height = 350"></i>
          <i class="el-icon-close" @click="handleClose"></i>
        </div>
      </div>
      <div class="content" :style="{height: `calc(100% - 40px)`}">
        <slot :name="tabs[activeIndex].value"></slot>
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'NodeDetaillayout',
  props: {
    tabs: {
      type: Array,
      default: () => [
        { label: '节点详情', value: 'detail' },
        { label: '运行日志', value: 'runLog' },
        { label: '操作日志', value: 'handLog' },
        { label: '物化代码', value: 'code' },
      ]
    }
  },
  data() {
    return {
      drawer: true,
      activeIndex: 0,
      height: 350
    }
  },
  methods: {
    handleClose() {
      this.$emit('close', false)
    },
    tabClick(index) {
      this.activeIndex = index
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  .header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #F0F0F3;
    .tabs {
      display: flex;
      align-items: center;
      height: 100%;
      font-size: 12px;
      .tab-item {
        padding: 0 15px;
        cursor: pointer;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        color: rgba($color: #000000, $alpha: 0.8);
        &.active {
          background: #fff;
          &::after {
            content: '';
            position: absolute;
            top: 0;
            height: 3px;
            background: #3964D8;
            left: 0;
            width: 100%;
            transition: all 3s;
          }
        }
      }
    }
    .btns {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 10px;
      > i {
        padding: 0 10px;
        cursor: pointer;
      }
      > i:first-child {
        transform: rotate(90deg);
      }
      > i:nth-child(2) {
        transform: rotate(-90deg);
      }
    }
  }
  .content {
    padding: 15px 15px 0 15px;
    // overflow: auto;
  }
}
::v-deep {
  .el-drawer__body {
    overflow: hidden;
  }
}
</style>