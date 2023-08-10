<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-27 14:40:59
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-27 15:54:21
 * @FilePath: \数据智能构建\src\views\rd\operation-new\component\monitor-task-select.vue
-->
<template>
  <el-select :value="valueTitle" ref="treeSelect" class="monitor-task-select" popper-class="popper-class-custom">
    <el-option class="options" :value="valueTitle" :label="valueTitle" v-show="false"></el-option>
    <el-tabs v-model="activeName" @tab-click="handleClick" :class="[customTabs ? '' : 'custom-tabs']">
      <el-tab-pane label="逻辑表字段" name="first"></el-tab-pane>
      <el-tab-pane label="周期物理任务" name="second"></el-tab-pane>
      <el-tab-pane label="手动物理任务" name="third"></el-tab-pane>
    </el-tabs>
    <div class="select-content-wrapper">
      <el-input v-model="keyworkLeft" placeholder="请输入关键字搜索" class="mb-10"></el-input>
      <ul>
        <li v-for="item in datalist.filter(d => d.name.indexOf(keyworkLeft) > -1)" :key="item.id" @click="selectItem(item)">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </el-select>
</template>

<script>
export default {
  name: 'MonitorTaskSelect',
  data() {
    return {
      valueTitle: '',
      activeName: 'first',
      keyworkLeft: '',
      customTabs: false, // 由于el-tabs的样式问题，需要自定义样式，强制默认选中第一个tab得width为60px。只要点击一次tab，就会触发tab-click事件，将customTabs设置为true，就会使用element自带样式
      datalist: [
        { name: 'tab1', id: 1, checkbox: false, type: '手动物理任务' },
        { name: 'tab2', id: 2, checkbox: false, type: '手动物理任务' },
        { name: 'tab3', id: 3, checkbox: false, type: '手动物理任务' },
        { name: 'tab4', id: 4, checkbox: false, type: '手动物理任务' },
        { name: 'tab5', id: 5, checkbox: false, type: '手动物理任务' },
        { name: 'tab6', id: 6, checkbox: false, type: '手动物理任务' },
        { name: 'tab7', id: 7, checkbox: false, type: '手动物理任务' },
        { name: 'tab8', id: 8, checkbox: false, type: '手动物理任务' }
      ],
    }
  },
  methods: {
    handleClick(tab, event) {
      this.customTabs = true
    },
    selectItem(item) {
      this.valueTitle = item.name
      this.$refs.treeSelect.blur()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .el-tabs__item {
    padding-right: 0!important;
    font-size: 12px;
  }
  .el-tabs__nav-scroll {
    padding: 0 15px;
  }
}
</style>

<style lang="scss">
.custom-tabs {
  .el-tabs__active-bar {
    width: 60px!important;
  }
}
.select-content-wrapper {
  background: #fff;
  padding: 15px;
  > ul {
    li {
      height: 28px;
      line-height: 28px;
      padding: 0 15px;
      cursor: pointer;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
.popper-class-custom {
}
</style>