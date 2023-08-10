<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:41
 * @LastEditTime: 2023-05-13 18:00:40
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="120px">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本信息" name="1">
          <template v-if="form.switchResult.dependTaskList && form.switchResult.dependTaskList.length">
            <el-row :gutter="10">
              <el-col :span="8">
                <div class="item-title">条件</div>
              </el-col>
              <el-col :span="8">
                <div class="item-title">分支流转</div>
              </el-col>
            </el-row>
            <el-row :gutter="10" v-for="(item,index) in form.switchResult.dependTaskList" :key="index">
              <el-col :span="8">
                <el-form-item label="" :key="item.key" label-width="10px">
                  <el-input v-model="item.condition" placeholder="请输入"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="" label-width="10px">
                  <el-select v-model="item.nextNode" placeholder="请选择">
                    <el-option v-for="item in form.branchList" :key="item.id" :label="item.label" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button type="text" icon="el-icon-delete" @click="delCondition(item,index)"></el-button>
              </el-col>
            </el-row>
          </template>
          <el-button type="primary" @click="handleAddCondition">添加条件</el-button>
          <el-form-item label="分支流转" class="mt-20">
            <el-select v-model="form.switchResult.nextNode" placeholder="请选择">
              <el-option v-for="item in form.branchList" :key="item.id" :label="item.label" :value="item.code"></el-option>
            </el-select>
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
    nodeData: Object,
    edges: Array
  },
  mixins: [comMixins],
  data () {
    return {
      form: {},
      rules: {
        name: [{ required: true, message: '请输入名称(必填)', trigger: ['blur', 'change'] }],
        taskPriority: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        workerGroup: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        hiveSqlScript: [{ required: true, message: '请输入脚本（必填）', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () { },
  methods: {
    configForm () {
      this.form = {
        switchResult: {
          dependTaskList: []
        },
        ...this.configData
      }
    },
    // 添加条件
    handleAddCondition () {
      const data = { condition: '', nextNode: '', key: Date.now() }
      this.form.switchResult.dependTaskList.push(data)
    },
    // 删除条件
    delCondition (item, index) {
      this.form.switchResult.dependTaskList.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  padding: 20px 30px;
}
.item-title {
  text-align: center;
}
</style>
