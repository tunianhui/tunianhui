<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-01-14 17:42:55
 * @LastEditTime: 2023-04-21 10:27:00
 * @Description:
-->
<template>
  <div class="node-data-wrapper">
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item label="节点名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称(必填)"></el-input>
      </el-form-item>
      <el-form-item label="运行标志" prop="flag">
        <el-radio-group v-model="form.flag">
          <el-radio label="YES">正常</el-radio>
          <el-radio label="NO">禁止执行</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入描述"></el-input>
      </el-form-item>
      <el-form-item label="任务优先级" prop="taskPriority">
        <el-select v-model="form.taskPriority" placeholder="请选择">
          <el-option v-for="item in taskLevelList" :key="item.name" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="Worker分组" prop="workerGroup">
            <el-select v-model="form.workerGroup" placeholder="请选择">
              <el-option v-for="item in workersList" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环境名称" prop="environmentCode">
            <el-select v-model="form.environmentCode" placeholder="请选择">
              <el-option v-for="item in environmentsList" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务组名称" prop="taskGroupId">
            <el-select v-model="form.taskGroupId" placeholder="请选择">
              <el-option v-for="item in taskGroupList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="组内优先级" prop="taskGroupPriority">
            <el-input-number v-model="form.taskGroupPriority" :min="0" :max="10000" :disabled="!form.taskGroupId" placeholder="请输入"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失败重试次数（次）" prop="failRetryTimes">
            <el-input-number v-model="form.failRetryTimes" :min="0" :max="10000"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="失败重试间隔（分）" prop="failRetryInterval">
            <el-input-number v-model="form.failRetryInterval" :min="0" :max="10000"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="超时告警" prop="timeoutFlag">
        <el-switch v-model="form.timeoutFlag" active-value="OPEN" inactive-value="CLOSE">
        </el-switch>
      </el-form-item>
      <template v-if="form.timeoutFlag === 'OPEN'">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="超时策略" prop="timeoutNotifyStrategyList">
              <el-checkbox-group v-model="form.timeoutNotifyStrategyList">
                <el-checkbox label="WARN">超时告警</el-checkbox>
                <el-checkbox label="FAILED">超时失效</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="超时时长（分）" prop="timeout">
              <el-input-number v-model="form.timeout" :min="1" :max="9999999999"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-form-item label="添加依赖" prop="dependence">
        <el-button v-if="form.dependence && form.dependence.dependTaskList && !form.dependence.dependTaskList.length" type="primary" circle icon="el-icon-plus" @click="handleAddDependTask"></el-button>
      </el-form-item>
      <template v-if="form.dependence.dependTaskList && form.dependence.dependTaskList.length">
        <el-row :gutter="12">
          <el-col :span="3">
            <div class="relationship-switch" :style="{'padding-top': `${itemLength * 170}px`}">
              <el-switch v-model="form.dependence.relation" active-color="#188ffe" inactive-color="#dbdbdb" active-value="AND" inactive-value="OR">
              </el-switch>
            </div>
          </el-col>
          <el-col :span="18">
            <div v-for="(dependTask, taskIndex) in form.dependence.dependTaskList" :key="taskIndex" class="mt-10">
              <el-row :gutter="12">
                <el-col :span="3">
                  <div class="relationship-switch" :style="{'padding-top': `${dependTask.dependItemList.length * 170}px`}">
                    <el-switch v-model="dependTask.relation" active-color="#188ffe" inactive-color="#dbdbdb" active-value="AND" inactive-value="OR">
                    </el-switch>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div v-for="(item,index) in dependTask.dependItemList" :key="index">
                    <el-form-item label="项目名称" :key="`${index}projectCode`" :prop="'dependence.dependTaskList.'+ taskIndex + '.dependItemList.' + index + '.projectCode'" :rules="{required: true, message: '项目名称（必填）', trigger: ['blur','change']}">
                      <el-select v-model="item.projectCode" placeholder="请选择" @change="projectCodeChange">
                        <el-option v-for="item in projectList" :key="item.project_code" :label="item.project_name" :value="item.project_id"></el-option>
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
                          <el-button type="danger" icon="el-icon-delete" circle @click="delDependItem(dependTask,index,taskIndex)"></el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>
                  <!-- 第2级 -->
                  <el-button type="primary" circle icon="el-icon-plus" @click="handleAddDependItem(dependTask)"></el-button>
                </el-col>
              </el-row>
              <!-- 第1级 -->
              <el-button v-if="form.dependence.dependTaskList.length - 1 === taskIndex" type="primary" circle icon="el-icon-plus" @click="handleAddDependTask" class="mt-10 ml-10"></el-button>
            </div>
          </el-col>
          <el-col :span="2">
            <!-- 第1级 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="delDependTask(item,index)"></el-button>
          </el-col>
        </el-row>
      </template>
      <el-form-item label="前置任务" prop="task">
        <el-select v-model="form.task" multiple clearable placeholder="请选择">
          <el-option v-for="item in form.preTaskList" :key="item.id" :label="item.label" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
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
        workerGroup: [{ required: true, message: '请选择', trigger: ['blur', 'change'] }],
        timeoutNotifyStrategyList: [{ required: true, message: '超时策略必须选一个', trigger: ['blur', 'change'] }]
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
        failRetryTimes: 0,
        failRetryInterval: 1,
        delayTime: 0,
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
      // console.log('projectCode', val)
      const data = this.projectList.find(ele => ele.project_code === val)
      this.skd_prj_id = data.skd_prj_id
      this.getListData({ skd_prj_id: data.skd_prj_id, processDefinitionCode: this.definitionCode })
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
    width: 4px;
    height: 100%;
    background-color: #1890ff;
    border-radius: 4px;
    position: absolute;
    top: 0px;
  }
}
</style>
