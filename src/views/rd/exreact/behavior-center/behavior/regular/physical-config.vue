<template>
  <div class="my-physical-config">
    <el-form
      :model="filter"
      ref="form"
      :rules="rules"
      label-width="140px"
      label-position="right"
      label-suffix="："
    >
      <SimpleHead name="物理化配置"></SimpleHead>
      <el-form-item label="存储生命周期" prop="life_cycle">
        <div class="mb-10">
          <el-input v-model="filter.life_cycle" autocomplete="off" disabled style="width:200px"></el-input>
        </div>
        <div class="fl custom-radio">
          <span>快速选择&nbsp;&nbsp;</span>
          <el-radio-group v-model="life_cycle" @change="cycleDayRadioChange">
            <el-radio-button v-for="item in cycleDayList" :key="item" :label="item">{{item}}</el-radio-button>
          </el-radio-group>
          天
        </div>
      </el-form-item>
      <el-form-item label="选择分区字段" prop="field" style="width:100%">
        <el-select v-model="filter.field" multiple placeholder="请选择" style="width:100%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'PhysicalConfig',
  data() {
    return {
      life_cycle: '36000',
      filter: {
        life_cycle: '36000',
        field: []
      },
      rules: {
        life_cycle: [
          { required: true, message: '请选择行为域', trigger: 'blur' }
        ],
        field: [
          { required: true, message: '请选择行为域', trigger: 'change' }
        ]
      },
      cycleDayList: [180, 365, 3600, 36000],
      options: []
    }
  },
  methods: {
    cycleDayRadioChange(val) {
      this.filter.life_cycle = val
    }
  }
}
</script>
