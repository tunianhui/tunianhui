<!--
 * @Author: 大炸鹅
 * @Date: 2023-07-11 15:20:31
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-13 17:11:43
 * @FilePath: \智能数据构建\src\views\rd\operation-new\pages\log\index.vue
-->
<template>
  <div class="operation-new-log">
    <MonacoEditor
      :has-bottom-tools="true"
      :minimap="false"
      :readonly="true"
      :code.sync="curCode"
      theme="light"
      ref="monacoEditor"
      v-loading="loading"
    ></MonacoEditor>
  </div>
</template>

<script>
import { getLog } from '@/api/rd/operation-new/hand-example.js'
export default {
  name: 'OperationNewLog',
  data() {
    return {
      curCode: '',
      loading: false
    }
  },
  computed: {
  },
  methods: {
    // 获取日志
    async getLog() {
      this.loading = true
      const res = await this.$simpleAsyncTo(getLog({taskInstanceId: this.$route.query.id}), '获取日志失败')
      if (res) {
        this.curCode = res.data
      }
      this.loading = false
    },
  },
  created() {
    this.getLog()
  },
}
</script>

<style lang="scss" scoped>
.operation-new-log {
  width: 100%;
  height: 100%;
}
</style>