<!--
 * @Author: 大炸鹅
 * @Date: 2022-10-24 15:53:36
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2022-10-24 16:00:09
 * @FilePath: \智能数据构建\src\views\asset\safety-new\table-cell.vue
-->
<template>
  <section class="table-cell">
    <div class="mr-5">
      <i :class="icon" v-if="icon"></i>
    </div>
    <div style="width: calc(100% - 30px)">
      <div><OverflowTooltip style="width:calc(100% - 1px)" v-if="keyName">{{data[keyName]}}</OverflowTooltip></div>
      <div><OverflowTooltip style="width:calc(100% - 1px)" v-if="keyDesc">{{data[keyDesc]}}</OverflowTooltip></div>
    </div>
  </section>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'TableCell',
  props: {
    data: Object,
    icon: String,
    keyName: String,
    keyDesc: String
  },
  components: {
    OverflowTooltip
  },
  data() {
    return {
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
