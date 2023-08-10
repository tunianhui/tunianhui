<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-31 11:11:47
 * @LastEditTime: 2023-02-20 15:56:38
 * @Description:
-->
<template>
  <section class="schedule-config">
    <el-form :model="filter"
             ref="form"
             :rules="rules"
             label-width="130px"
             label-position="right"
             label-suffix="：">
      <SimpleHead name="基本信息"></SimpleHead>
      <el-form-item label="名称"
                    prop="name">{{filter.name}}</el-form-item>
      <el-form-item label="任务类型"
                    prop="task_type">
        开发任务
      </el-form-item>
      <SimpleHead name="调度配置"></SimpleHead>
      <OpsCycle :data="data"
                ref="cycle"></OpsCycle>
    </el-form>
  </section>
</template>

<script>
import OpsCycle from '@c/ops-cycle/index.vue'
export default {
  name: 'ScheduleConfig',
  components: {
    OpsCycle
  },
  props: {
    data: Object
  },
  data () {
    return {
      filter: {
        'id': '7b2d29da74fe4b70bbabe37bdf6067b5',
        'name': 'flow111',
        'job_type': '0',
        'job_cycle': '天',
        'date_begin': '',
        'date_end': '',
        'specific_time': '00:00',
        'choice_date': ''
      },
      rules: {}
    }
  },
  created () {
    Object.assign(this.filter, this.data)
  },
  methods: {
    getData () {
      return { ...this.filter, ...this.$refs.cycle.getData() }
    }
  }
}
</script>
