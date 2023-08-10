<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:43:26
 * @LastEditTime: 2023-05-18 17:05:18
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="100px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="状态" prop="status1">
                <el-select v-model="form.status1" disabled placeholder="请选择">
                  <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分支流转" prop="successNode">
                <el-select v-model="form.successNode" clearable placeholder="请选择">
                  <el-option v-for="item in form.branchList" :key="item.id" :label="item.label" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status2">
                <el-select v-model="form.status2" disabled placeholder="请选择">
                  <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分支流转" prop="failedNode">
                <!-- 校验 不能与上面的相同 -->
                <el-select v-model="form.failedNode" clearable placeholder="请选择">
                  <el-option v-for="item in form.branchList" :key="item.id" :label="item.label" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item title="检查条件" name="2">
          <el-button v-if="form.dependence && form.dependence.dependTaskList && !form.dependence.dependTaskList.length" type="text" @click="handleAddDependTask" class="button-action">添加前置检查条件</el-button>

          <template v-if="form.dependence.dependTaskList && form.dependence.dependTaskList.length">
            <div class="relationship-wrapper">
              <div class="relationship">
                <div class="relationship-switch" :style="{'padding-top': `${itemLength * 30}px`}">
                  <el-select v-model="form.dependence.relation" placeholder="请选择">
                    <el-option label="且" value="AND"></el-option>
                    <el-option label="或" value="OR"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="content">
                <div v-for="(dependTask,taskIndex) in form.dependence.dependTaskList" :key="taskIndex" class="mt-10">
                  <div class="relationship-wrapper">
                    <div class="relationship">
                      <div class="relationship-switch" :style="{'padding-top': `${dependTask.dependItemList.length * 23}px`}">
                        <el-select v-model="dependTask.relation" placeholder="请选择">
                          <el-option label="且" value="AND"></el-option>
                          <el-option label="或" value="OR"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="content">
                      <div v-for="(item,index) in dependTask.dependItemList" :key="index">
                        <el-form-item label="" :key="`${index}dateValue`" label-width="10px">
                          <el-row :gutter="10">
                            <el-col :span="9">
                              <el-select v-model="item.depTaskCode" placeholder="请选择">
                                <el-option v-for="item in form.preList" :key="item.id" :label="item.label" :value="item.code"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="9">
                              <el-select v-model="item.status" placeholder="请选择">
                                <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="6">
                              <!-- 第2级 -->
                              <el-button id="6666" type="text" icon="el-icon-delete" @click="delDependItem(dependTask,index,taskIndex)"></el-button>
                              <!-- 第1级 -->
                              <el-button id="6666" type="text" icon="el-icon-delete" @click="delDependTask(item,index)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </div>
                      <!-- 第2级 -->
                      <el-button type="text" class="ml-10" @click="handleAddDependItem(dependTask)">添加规则</el-button>
                    </div>
                  </div>
                  <!-- 第1级 -->
                  <el-button v-if="form.dependence.dependTaskList.length - 1 === taskIndex" type="text" @click="handleAddDependTask" class="mt-10 ml-10">添加规则</el-button>
                </div>
              </div>
            </div>
          </template>
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
        name: [{ required: true, message: '请输入名称(必填)', trigger: ['blur', 'change'] }],
        taskPriority: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        workerGroup: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }]
      }
    }
  },
  created () { },
  computed: {
    itemLength () {
      let num = 0
      this.form.dependence && this.form.dependence.dependTaskList.forEach(element => {
        num += element.dependItemList.length
      })
      return num
    }
  },
  methods: {
    configForm () {
      this.form = {
        status1: 'SUCCESS',
        status2: 'FAILURE',

        // 依赖
        dependence: {
          relation: 'AND',
          dependTaskList: [
            // {
            //   relation: 'AND',
            //   dependItemList: [
            //     {
            //       depTaskCode: '',
            //       status: '',
            //     }
            //   ]
            // }
          ]
        },
        ...this.configData
      }
    },
    // 添加依赖
    handleAddDependTask () {
      const data = {
        relation: 'AND',
        dependItemList: [
          {
            depTaskCode: '',
            status: ''
          }
        ]
      }
      this.form.dependence.dependTaskList.push(data)
    },

    // 删除依赖
    delDependTask (item, index) {
      this.form.dependence.dependTaskList.splice(index, 1)
    },

    // 添加依赖项
    handleAddDependItem (dependTask) {
      const data = {
        depTaskCode: '',
        status: ''
      }
      dependTask.dependItemList.push(data)
    },

    // 删除依赖项
    delDependItem (dependTask, index, taskIndex) {
      dependTask.dependItemList.splice(index, 1)
      if (!dependTask.dependItemList.length) {
        this.form.dependence.dependTaskList.splice(taskIndex, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.relationship-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  &::before {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    background-color: #1890ff;
    // border-radius: 4px;
    position: absolute;
    top: 0px;
  }
}
.relationship-wrapper {
  position: relative;
  display: flex;
  gap: 10px;
  .relationship {
    width: 60px;
  }
  .content {
    flex: 1;
  }
}
</style>
