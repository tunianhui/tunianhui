<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-04-25 09:53:00
 * @LastEditTime: 2023-05-12 14:40:54
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="160px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-form-item label="命名空间(集群)" prop="taskPriority">
            <el-select v-model="form.taskPriority" placeholder="请选择">
              <el-option v-for="item in taskLevelList" :key="item.name" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最小CPU（核）" prop="cpuQuota">
            <el-input-number v-model="form.cpuQuota" :min="-1" :max="10000"></el-input-number>
          </el-form-item>
          <el-form-item label="最小内存（MB）" prop="memoryMax">
            <el-input-number v-model="form.memoryMax" :min="0" :max="10000"></el-input-number>
          </el-form-item>
          <el-form-item label="镜像" prop="resourceNameList">
            <el-input v-model="form.resourceNameList" placeholder="请输入"></el-input>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script>
import comMixins from './mixins'
export default {
  props: {
    id: String,
    nodeData: Object
  },
  mixins: [comMixins],
  data () {
    return {
      form: {},
      rules: {

      }
    }
  },
  created () {

  },
  methods: {
    configForm () {
      this.form = {
        cpuQuota: -1,
        memoryMax: 60,
        ...this.configData
      }
    }
  }
}
</script>
