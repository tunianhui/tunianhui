<template>
  <section class="table-cell">
    <div class="mr-5">
      <i :class="logicTypeMapIcon[data.tableType]" v-if="!icon"></i>
      <i :class="icon" v-else></i>
    </div>
    <div style="width: calc(100% - 30px)">
      <div><OverflowTooltip style="width:calc(100% - 1px)">{{data.tableName}}</OverflowTooltip></div>
      <div><OverflowTooltip style="width:calc(100% - 1px)">{{data.tableDesc}}</OverflowTooltip></div>
    </div>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'TableCell',
  props: {
    data: Object,
    icon: String
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
      logicTypeMapIcon: {
        // 维度逻辑表
        16: 'iconfont icon-weiduluojibiao',
        // 事实逻辑表
        17: 'iconfont icon-shishiluojibiao1',
        // 汇总逻辑表
        18: 'iconfont icon-huizongluojibiao1',
        // 物理表
        100: 'iconfont icon-code-wulibiao'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-cell {
  display: flex;
  align-items: center;
  >div:first-child {
    font-size: 30px;
    color: $user2;
  }
}
</style>
