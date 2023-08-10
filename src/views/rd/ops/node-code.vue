<template>
  <section class="node-code">
    <header class="pl-20">节点代码</header>
    <MonacoEditor :code.sync="code" readonly></MonacoEditor>
  </section>
</template>

<script>
import {getNodeCode} from '@/api/rd/ops'

export default {
  name: 'NodeCode',
  data() {
    return {
      code: ''
    }
  },
  created() {
    this.getCode()
  },
  methods: {
    async getCode() {
      const res = await this.$simpleAsyncTo(
        getNodeCode({
          cube_id: this.$route.query.id
        }),
        '获取数据失败'
      )
      if (res) {
        this.code = res.data
      }
    }
  }
}
</script>

<style lang="scss">
.node-code {
  height: calc(100% - 50px);
  header {
    height: 50px;
    line-height: 50px;
    border: 1px solid $grey5;
  }
}
</style>
