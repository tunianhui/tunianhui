<template>
  <section class="dispatch-config">
    <el-form
      :model="filter"
      ref="form"
      :rules="rules"
      label-width="130px"
      label-position="right"
      label-suffix="："
    >
      <SimpleHead name="基本信息"></SimpleHead>
      <el-form-item label="逻辑表名称" prop="job_name">{{filter.job_name}}</el-form-item>
      <el-form-item label="任务类型" prop="task_type">
        {{ filter.task_type }}
        <el-link
          :underline="false"
          type="info"
          class="iconfont icon-tiaoduxiangqing"
        ></el-link>
      </el-form-item>
      <el-form-item label="描述" prop="job_desc">
        <el-input
          type="textarea"
          v-model="filter.job_desc"
          placeholder="请输入描述信息"
          maxlength="128"
          show-word-limit
        ></el-input>
      </el-form-item>
      <SimpleHead name="调度配置"></SimpleHead>

      <OpsCycle :data="data.dispatchData" ref="cycle"></OpsCycle>
      <SimpleHead name="依赖关系"></SimpleHead>
      <el-form-item label-width="0">
        <div style="color: #bbb">上游依赖</div>
      </el-form-item>
      <UpperRely ref="upper" type="upper" :data="data"></UpperRely>
      <el-form-item label-width="0">
        <div style="color: #bbb">当前节点</div>
      </el-form-item>
      <UpperRely :data="data" ref="currentNode" type="current"></UpperRely>
      <!-- <el-form-item label="cron 表达式" prop="cron_expr">0 0 0 * * ?</el-form-item> -->
    </el-form>
  </section>
</template>

<script>
import OpsCycle from '@c/ops-cycle/index.vue'
// import UpperRely from './upper'
import UpperRely from '@c/upper.vue'
export default {
  name: 'DispatchConfig',
  components: {
    OpsCycle,
    UpperRely
  },
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      filter: {
        job_desc: '',
        job_name: '',
        task_type: ''
      },
      rules: {},
      disConfigData: {},
      currentNode: []
    }
  },
  created() {
    Object.assign(this.filter, this.data.dispatchData)
  },
  methods: {
    getData() {
      let data = null
      this.$refs.form.validate(valid => {
        if (valid) {
          let current = this.$refs.currentNode.getData('current')
          let currentNodeData
          if (current.currNodeData.length) {
            currentNodeData = current.currNodeData[0]
          } else {
            currentNodeData = {
              cube_id: '',
              cube_code: '',
              cube_name: '',
              oper_user: ''
            }
          }
          let upper = this.$refs.upper.getData('upper')
          let str = ''
          upper.upstreamRelyData.forEach(e => {
            str += `${e.cube_id}&&${e.cube_code}@@`
          })
          data = {
            ...this.filter,
            ...this.$refs.cycle.getData(),
            upstream_rely: str.slice(0, str.length - 2),
            ...currentNodeData}
        }
      })
      return data
    }
  }
}
</script>
