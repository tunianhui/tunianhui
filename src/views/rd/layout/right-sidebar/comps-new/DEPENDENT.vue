<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:42:55
 * @LastEditTime: 2023-05-18 16:53:54
 * @Description:
-->
<template>
  <div class="node-data-edit-base">
    <el-form ref="form" :model="form" :rules="rules" label-suffix=":" label-position="right" label-width="100px" class="form-content">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="基本参数" name="1">
          <el-button id="6666" v-if="form.dependence && form.dependence.dependTaskList && !form.dependence.dependTaskList.length" type="text" @click="handleAddDependTask">添加依赖</el-button>
          <template v-if="form.dependence.dependTaskList && form.dependence.dependTaskList.length">
            <div class="relationship-wrapper">
              <div class="relationship">
                <div class="relationship-switch" :style="{'padding-top': `${itemLength * 170}px`}">
                  <el-select v-model="form.dependence.relation" placeholder="请选择">
                    <el-option label="且" value="AND"></el-option>
                    <el-option label="或" value="OR"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="content">
                <div v-for="(dependTask, taskIndex) in form.dependence.dependTaskList" :key="taskIndex" class="mt-10">
                  <div class="relationship-wrapper">
                    <div class="relationship">
                      <div class="relationship-switch" :style="{'padding-top': `${dependTask.dependItemList.length * 170}px`}">
                        <el-select v-model="dependTask.relation" placeholder="请选择">
                          <el-option label="且" value="AND"></el-option>
                          <el-option label="或" value="OR"></el-option>
                        </el-select>
                      </div>
                    </div>
                    <div class="content">
                      <div v-for="(item,index) in dependTask.dependItemList" :key="index">
                        <el-form-item label="项目名称" :key="`${index}projectCode`" :prop="'dependence.dependTaskList.'+ taskIndex + '.dependItemList.' + index + '.projectCode'" :rules="{required: true, message: '项目名称（必填）', trigger: ['blur','change']}">
                          <el-select v-model="item.projectCode" placeholder="请选择" @change="projectCodeChange">
                            <el-option v-for="item in projectList" :key="item.project_code" :label="item.project_name" :value="item.skd_prj_id"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="工作流名称" :key="`${index}definitionCode`" :prop="'dependence.dependTaskList.'+ taskIndex + '.dependItemList.' + index + '.definitionCode'" :rules="{required: true, message: '工作流名称（必填）', trigger: ['blur','change']}">
                          <el-select v-model="item.definitionCode" placeholder="请选择" @change="definitionCodeChange">
                            <el-option v-for="item in definitionList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="任务名称" :key="`${index}depTaskCode`" :prop="'dependence.dependTaskList.'+ taskIndex + '.dependItemList.' + index + '.depTaskCode'" :rules="{required: true, message: '任务名称（必填）', trigger: ['blur','change']}">
                          <el-select v-model="item.depTaskCode" placeholder="请选择">
                            <el-option v-for="item in depTaskList" :key="item.code" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="时间周期" :key="`${index}dateValue`" :prop="'dependence.dependTaskList.'+ taskIndex + '.dependItemList.' + index + '.dateValue'" :rules="{required: true, message: '时间周期（必填）', trigger: ['blur','change']}">
                          <el-row :gutter="10">
                            <el-col :span="11">
                              <el-select v-model="item.taskCycleType" placeholder="请选择" @change="taskCycleTypeChange">
                                <el-option v-for="item in taskCycleTypeList" :key="item.key" :label="item.value" :value="item.key"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="11">
                              <el-select v-model="item.dateValue" placeholder="请选择">
                                <el-option v-for="item in taskCycleList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                              </el-select>
                            </el-col>
                            <el-col :span="2">
                              <!-- 第2级 -->
                              <el-button id="6666" type="text" icon="el-icon-delete" @click="delDependItem(dependTask,index,taskIndex)"></el-button>
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
              <el-col :span="2">
                <!-- 第1级 -->
                <el-button id="6666" type="text" icon="el-icon-delete" @click="delDependTask(item,index)"></el-button>
              </el-col>
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
      },
      // 工作流列表
      definitionList: [],
      taskCycleType: '',
      // 周期类型
      taskCycleTypeList: [],
      // 周期
      taskCycleList: [],
      projectCode: '',
      skd_prj_id: ''
    }
  },
  created () {
    this.getProjectData()
    this.getListData()
    this.getDictParamsData()
    this.getDictParamsByParentData()
  },
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
        // 依赖 二维数组
        dependence: {
          relation: 'AND',
          dependTaskList: [
            // {
            //   relation: 'AND',
            //   dependItemList: [
            //     {
            //       projectCode: '',
            //       definitionCode: '',
            //       depTaskCode: '',
            //       dateValue: ''
            //     }
            //   ]
            // }
          ]
        },
        ...this.configData
      }
    },

    projectCodeChange (val) {
      const data = this.projectList.find(ele => ele.project_code === val)
      const { skd_prj_id } = data
      this.skd_prj_id = skd_prj_id
      this.getListData({ skd_prj_id, processDefinitionCode: this.definitionCode })
    },

    definitionCodeChange (val) {
      // console.log('definitionCode', val)
      this.definitionCode = val
      this.getTaskData({ skd_prj_id: this.skd_prj_id, processDefinitionCode: this.definitionCode })
    },

    taskCycleTypeChange (val) {
      // console.log('taskCycleType', val)
      this.getDictParamsByParentData(val)
    },

    // 添加依赖
    handleAddDependTask () {
      const data = {
        relation: 'AND',
        dependItemList: [{
          projectCode: '',
          definitionCode: '',
          depTaskCode: '',
          dateValue: ''
        }]
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
        projectCode: '',
        definitionCode: '',
        depTaskCode: '',
        dateValue: ''
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
  padding-top: 170px;
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
