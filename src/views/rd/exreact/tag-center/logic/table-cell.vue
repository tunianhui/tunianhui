<template>
  <section class="table-cell">
    <div class="mr-10">
      <i :class="['iconfont', icon]"></i>
    </div>
    <div style="width: calc(100% - 30px)">
      <div><OverflowTooltip style="width:calc(100% - 1px)">{{data.name}}</OverflowTooltip></div>
      <div><OverflowTooltip style="width:calc(100% - 1px)">{{data.code}}</OverflowTooltip></div>
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
