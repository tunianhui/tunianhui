<template>
  <section class="schedule-config">
    <el-form :model="filter" ref="form" :rules="rules" label-width="120px" label-position="right">
      <SimpleHead name="基本信息"></SimpleHead>
      <el-form-item label="逻辑表名称：" prop></el-form-item>
      <el-form-item label="任务类型：" prop></el-form-item>
      <el-form-item label="描述：" prop></el-form-item>
      <el-form-item label="优先级：" prop>
        <el-select v-model="filter.priority">
          <el-option
            v-for="item in priorityList"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="参数配置：" prop="params">
        <el-input
          v-model="filter.params"
          placeholder="请输入配置的参数，支持自定义参数，以；区隔，如keyA=123；keyB=${yyyymmdd-7}；"
        ></el-input>
      </el-form-item>
      <SimpleHead name="调度周期"></SimpleHead>
      <el-form-item label="依赖上周期：" prop="dep">
        <el-radio-group v-model="filter.dep">
          <el-radio :label="0">不依赖</el-radio>
          <el-radio :label="1">依赖</el-radio>
        </el-radio-group>
      </el-form-item>
      <SimpleHead name="调度依赖"></SimpleHead>
      <el-form-item label="自动解析：" prop="autoParse">
        <el-radio :label="true" v-model="filter.autoParse">
          是
          <el-tooltip placement="top" content="打开自动解析，首次进入该配置页，将进行自动引入系统解析">
            <i class="el-icon-info"></i>
          </el-tooltip>
        </el-radio>
        <el-button type="primary" plain icon="icon iconfont icon-jiexishurushuchu">解析输入输出</el-button>
      </el-form-item>
    </el-form>
    <div class="flex-layout">
      <div class="sub-title">上游依赖</div>
      <div>
        <el-button type="primary" plain icon="el-icon-question">解析问题提示</el-button>
        <el-tooltip placement="top" content="未解析出与源物理表对应的上游依赖，可手动尝试">
          <i class="el-icon-info pl-5"></i>
        </el-tooltip>&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button type="primary" plain icon="el-icon-plus">新增上游依赖</el-button>
      </div>
    </div>
    <el-table :data="upstreamList" stripe>
      <el-table-column prop="parentName" label="父节点输出名称"></el-table-column>
      <el-table-column prop="name" label="节点名"></el-table-column>
      <el-table-column prop="id" label="节点ID（实例ID）"></el-table-column>
      <el-table-column prop="linkTable" label="关联源表"></el-table-column>
      <el-table-column prop="person" label="负责人"></el-table-column>
      <el-table-column label="操作">
        <!-- <template>
          <div>

          </div>
        </template>-->
      </el-table-column>
    </el-table>
    <p class="sub-title">逻辑表节点（本节点）</p>
    <el-table :data="tableList" stripe>
      <el-table-column prop="parentName" label="本节点输出名称"></el-table-column>
      <el-table-column prop="name" label="节点名"></el-table-column>
      <el-table-column prop="id" label="节点ID（实例ID）"></el-table-column>
      <el-table-column prop="person" label="负责人"></el-table-column>
      <el-table-column label="操作">
        <!-- <template>
          <div>

          </div>
        </template>-->
      </el-table-column>
    </el-table>
    <p class="sub-title">下游节点</p>
    <el-table :data="downstreamList" stripe>
      <el-table-column prop="name" label="下游节点名"></el-table-column>
      <el-table-column prop="id" label="下游节点ID"></el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  name: 'ScheduleConfig',
  data() {
    return {
      filter: {
        dep: 0,
        priority: '',
        params: '',
        autoParse: true
      },
      rules: {},
      priorityList: [],
      upstreamList: [],
      tableList: [],
      downstreamList: []
    }
  },
  methods: {
    getData() {
      let data = false
      this.$refs.form.validate(valid => {
        if (valid) {
          data = this.filter
        }
      })
      return data
    }
  }
}
</script>

<style lang="scss">
.schedule-config {
  .el-icon-info {
    font-size: 16px;
    color: $grey4;

    &:hover {
      color: $grey3;
    }
  }
  .sub-title {
    font-size: 12px;
    color: $grey3;
    margin: 10px;
  }
  .flex-layout {
    justify-content: space-between;
  }
}
</style>
