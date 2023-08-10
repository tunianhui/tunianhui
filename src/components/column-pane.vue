<template>
  <transition name="el-fade-in-linear">
    <section class="column-pane" v-show="visible">
      <i class="el-icon-close" @click="$emit('update:visible', false)"></i>
      <h4>物理化节点：</h4>
      <p>{{ data.nodeName }}</p>
      <h4>字段：</h4>
      <p v-for="column in data.columns" :key="column.columnId">
        {{ column.columnName }}
      </p>
    </section>
  </transition>
</template>

<script>
export default {
  name: 'column-pane',
  props: {
    data: Object,
    visible: Boolean
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
.column-pane {
  position: fixed;
  top: $headerHeight;
  height: calc(100vh - #{$headerHeight});
  z-index: 1000;
  width: 275px;
  padding: 20px 25px;
  background: $sideMenuActive;

  .el-icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: $grey6;
    cursor: pointer;

    &:hover {
      color: $grey10;
    }
  }
  h4 {
    color: $info;
    line-height: 32px;
    font-size: 14px;
  }

  p {
    color: $grey8;
    line-height: 28px;
    font-size: 12px;
  }
}
</style>
