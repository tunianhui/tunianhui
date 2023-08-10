<template>
  <section class="limit-atom-edit">
    <div class="creat-content emphasize-class" ref="container">
      <buildMeterWorkOrder :data="flag"/>
    </div>
  </section>
</template>

<script>

import buildMeterWorkOrder from './build-meter-work-order.vue'

export default {
  name: 'CreatTable',
  components: {buildMeterWorkOrder},
  props: {
    data: Object,
  },
  data() {
    const creatClick = this.data.creatClick
    return {
      creatClick,
      flag: {creatClick: true},
    }
  },
  created() {
    if (this.creatClick) {
      this.flag.creatClick = true
    } else {
      this.flag = this.data
    }
  },
  methods: {
  },
}
</script>

<style lang="less" scoped>
.limit-atom-edit {
  .creat-content.emphasize-class {
    padding-top: 15px;
    padding-bottom: 15px;
  }
}
</style>