<template>
  <div class="work-order height-100per flex-column">
    <div class="work-order-content"></div>
  </div>
</template>

<script>
import pager from '@/mixins/pager'

export default {
  name: 'WorkOrder',
  mixins: [pager],
  components: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  methods: {},
}
</script>
<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  overflow: hidden;
  overflow-y: auto;
  padding-left: 10px;
}
.page-title {
  margin-bottom: 50px;
}
</style>
<style lang="scss">
.work-order {
  .work-order-content {
  }
}
</style>
