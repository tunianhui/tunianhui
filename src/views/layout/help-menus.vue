<!--
 * @Author: 大炸鹅
 * @Date: 2023-07-25 11:42:55
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-25 15:04:20
 * @FilePath: \智能数据构建\src\views\layout\help-menus.vue
-->
<template>
  <el-popover
    placement="top-start"
    title=""
    width="200"
    trigger="hover"
    popper-class="help-popover-menus">
    <span slot="title"></span>
    <template>
      <div class="nav-helper-content">
        <div class="nav-helper-cell" v-for="item in list" :key="item.text" @click="clickHandle(item)">
          <i :class="item.icon" :style="{color: item.color}"></i>
          {{item.text}}
        </div>
      </div>
    </template>
    <i class="icon iconfont icon-wenhao1" slot="reference"></i>
  </el-popover>
</template>

<script>
export default {
  name: 'HelpMenus',
  data() {
    return {
      list: [
        {
          icon: 'iconfont icon-peizhiyindao',
          text: '新手引导',
          color: '#0ac448',
          command: 'guide'
        },
        {
          icon: 'iconfont icon-guize',
          text: '帮助文档',
          color: '#2e74ff',
          command: 'help'
        },
        {
          icon: 'iconfont icon-liebiao4',
          text: '工单系统',
          color: '#2e74ff',
          command: 'workOrder'
        }
      ]
    }
  },
  methods: {
    clickHandle(item) {
      this.$emit('click', item.command)
    }
  }
}
</script>

<style lang="scss">
.help-popover-menus.el-popper {
  margin-top: 20px!important;
  width: auto;
  padding: 2px 0;
  min-width: 80px !important;
  border-radius: 0;
  background-color: $headerBg;
  border-color: $headerHover;
}
.help-popover-menus.el-popper[x-placement^=bottom] .popper__arrow::after {
  border-bottom-color: $headerBg;
}
.help-popover-menus.el-popper[x-placement^=bottom] .popper__arrow {
  border-bottom-color: $headerBg;
}
.nav-helper-content {
  display: flex;
  justify-content: space-around;
  width: 100%;
  .nav-helper-cell {
    width: 70px;
    height: 70px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0 10px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    > i {
      font-size: 20px;
      cursor: pointer;
      margin-top: -6px;
      margin-bottom: 5px;
    }
  }
}
</style>
