<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-10 14:35:18
 * @LastEditTime: 2023-07-21 17:45:41
 * @Description: Shell
-->
<template>
  <div style="height: 100%;">
    <!-- 流程图 集成任务 -->
    <DataSet ref="dataSet" :data="data"></DataSet>
  </div>
</template>

<script>
import comMixins from './mixins'
// 集成任务画布 节点是个画布
import DataSet from '../../../../../integrate/dataSet/index.vue'

export default {
  props: {
    id: String,
    nodeData: Object
  },
  mixins: [comMixins],
  components: {
    DataSet
  },
  data () {
    return {
      data: {},
      nodeType: 'integration',
      form: {}
    }
  },
  created () {

  },
  methods: {
  }
}
</script>
