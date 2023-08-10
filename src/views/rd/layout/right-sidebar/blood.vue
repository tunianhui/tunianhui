<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-05-16 15:56:32
 * @LastEditTime: 2023-07-21 13:46:11
 * @Description:
-->
<template>
  <section class="side-panel-view">
    <div class="mark" v-loading="!!loading">
      <div class="drawer-header">
        <div class="drawer-title-wrapper">
          <h1 class="title">血缘关系</h1>
        </div>
        <span>
          <i class="el-icon-close" @click="cancel"></i>
        </span>
      </div>

      <div class="drawer-content">
        <div class="blood-config">
          <template v-if="!(groupList && groupList.length)">
            <el-empty :image="img" description="当前任务类型支持自定义血缘配置，您可点击开始配置">
              <el-button type="primary" @click.stop="addGroup">开始配置</el-button>
            </el-empty>
          </template>

          <template v-else>
            <div class="blood-config-wrapper">
              <div class="content">
                <div class="add-new-config">
                  <div>血缘输入</div>
                  <span class="delimiter">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                  <div>血缘输出</div>
                  <div>
                    <el-button type="primary" icon="el-icon-plus" :disabled="groupList.length === 20" @click="addGroup">新增血缘组</el-button>
                    <span class="count">{{groupList.length}}/20</span>
                  </div>
                </div>

                <template>
                  <div class="blood-group-wrapper" v-for="(item, index) in groupList" :key="item.id">
                    <div class="blood-group">
                      <!-- 血缘输入 -->
                      <div class="input">
                        <div class="top">
                          <span class="group-name">{{item.name}}</span>
                          <div class="right">
                            <span :class="['add-new', isInputNameofNull || item.input.length >= 5 ? 'add-new-empty' : '']">
                              <span @click.stop="!(isInputNameofNull || item.input.length >= 5) && addInput(item)">
                                <i class="el-icon-plus"></i>
                                新增输入
                              </span>
                            </span>
                            <span class="count">{{item.input.length || 1}} / 5</span>
                          </div>
                        </div>
                        <template v-for="subInputItem in item.input">
                          <div class="empty-blood-group-item" :key="subInputItem.id" v-if="!subInputItem.tableName">
                            <div class="bottom" @click.stop="addInput(item, subInputItem)">
                              <div class="">点击配置输出表</div>
                            </div>
                          </div>
                          <div class="blood-group-item" :key="subInputItem.id" v-else>
                            <div class="title">
                              <OverflowTooltip>{{subInputItem.tableName}}</OverflowTooltip>
                            </div>
                            <div class="content">
                              <div class="left">
                                <div class="auto-env-tag">{{subInputItem.env == 'AUTO' ? 'AUTO' : subInputItem.env == 'DEV' ? 'DEV' : 'PROD'}}</div>
                                <span class="item-icon mr-10">
                                  <i :class="getIcon(subInputItem.projectId)"></i>
                                </span>
                                {{subInputItem.range == '0' ? '全表' : '指定字段'}}
                              </div>
                              <div class="right">
                                <i class="el-icon-edit-outline" @click="editInput(item, subInputItem)"></i>
                                <el-tooltip class="item" effect="dark" :content="item.input.length <= 1 ? '至少配置一个输入' : '删除'" placement="top">
                                  <i :class="['el-icon-delete', item.input.length <= 1 ? 'disabled' : '']" @click="!(item.input.length <= 1) && deleteInputItem(index, item)"></i>
                                </el-tooltip>
                                
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                      <!-- 血缘输出 -->
                      <div class="output">
                        <div class="top">
                          <div class="right">
                            <span :class="['add-new', isOutputNameofNull || item.output.length >= 5 ? 'add-new-empty' : '']">
                              <span @click.stop="!(isOutputNameofNull || item.output.length >= 5 ) && addOuput(item)">
                                <i class="el-icon-plus"></i>
                                新增输出
                              </span>
                            </span>
                            <span class="count">{{item.output.length || 1}} / 5</span>
                          </div>
                        </div>
                        <template v-for="subOutputItem in item.output">
                          <div class="empty-blood-group-item" v-if="!subOutputItem.tableName" :key="subOutputItem.id">
                            <div class="bottom" @click.stop="addOuput(item, subOutputItem)">
                              <div class="">点击配置输出表</div>
                            </div>
                          </div>
                          <div class="blood-group-item" :key="subOutputItem.id" v-else>
                            <div class="title">
                              <OverflowTooltip>{{subOutputItem.tableName}}</OverflowTooltip>
                            </div>
                            <div class="content">
                              <div class="left">
                                <div class="auto-env-tag">{{subOutputItem.env == 'AUTO' ? 'AUTO' : subOutputItem.env == 'DEV' ? 'DEV' : 'PROD'}}</div>
                                <span class="item-icon mr-10">
                                  <i :class="getIcon(subOutputItem.projectId)"></i>
                                </span>
                                {{subOutputItem.range == '0' ? '全表' : '指定字段' }}
                              </div>
                              <div class="right">
                                <i class="el-icon-edit-outline" @click="editOutput(item, subOutputItem)"></i>
                                <el-tooltip class="item" effect="dark" :content="item.output.length <= 1 ? '至少配置一个输出' : '删除'" placement="top">
                                  <i :class="['el-icon-delete', item.output.length <= 1 ? 'disabled' : '']" @click="!(item.output.length <= 1) && deleteOutputItem(index, item)"></i>
                                </el-tooltip>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                    <div class="delete-group-btn" @click.stop="deleteGroup(index)">
                      <i class="el-icon-delete"></i>
                    </div>
                  </div>
                </template>
               
              </div>
               <div class="footer">
                  <div class="blue-info-tip">
                    <i class="iconfont icon-tip font-16"></i>
                    <div class="msg-wrapper">1. 血缘在任务提交和发布时进行解析，如所属环境选择“自动”，则提交成功后自动解析开发表，发布成功后自动解析生产表。2. 选中范围选择“全表”，则以提交发布时对应表的全部字段为准生成血缘关系，后续表结构变更不会自动刷新血缘。</div>
                  </div>
                </div>
            </div>
          </template>
        </div>
      </div>

      <div class="drawer-footer my-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" class="primary" @click="confirm">确定</el-button>
      </div>
    </div>
    <el-dialog
      :visible="dialogVisible"
      :append-to-body="true"
      width="50%"
    >
      <span slot="title">{{dialogTitle}}</span>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="所属环境" prop="env">
          <el-radio-group v-model="form.env">
            <el-radio label="AUTO">自动</el-radio>
            <el-radio label="DEV">开发</el-radio>
            <el-radio label="PROD">生产</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="输入表" prop="table">
          <el-select v-model="form.table" placeholder="输入表" @change="changeTable">
            <el-option :label="item.label" :value="item.value" v-for="item in tableList" :key="item.value">
              <span style="float: left">
                <i :class="iconMapColor[item.type_code]"></i>
                {{ item.label }}
              </span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选中范围">
          <el-col :span="8">
            <el-radio-group v-model="form.rangeType">
              <el-radio :label="0">全表</el-radio>
              <el-radio :label="1">指定字段</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="11">
            <el-select v-model="form.field" placeholder="指定字段" :disabled="form.rangeType != 1" multiple>
              <el-option :label="item.label" :value="item.value" v-for="item in fieldList" :key="item.id"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdd">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
import mixin from '../mixin'
import './common.scss'
import OverflowTooltip from '@/components/overflow-tooltip'
import {
  getLineageConfig,
  getLineageTableList,
  getLineageFieldList,
  saveBlood
} from '@/api/rd/integrate.js'
import {mapGetters} from 'vuex'
import { logicTypeMapIcon, iconMapColor } from '@/config/rd-config.js'

export default {
  name: 'BloodView',
  mixins: [mixin],
  inject: ['attrStore', 'tabStore'],
  components: {
    OverflowTooltip
  },
  data () {
    return {
      logicTypeMapIcon,
      iconMapColor,
      groupList: [],
      loading: 0,
      img: require('@/assets/images/quanxian.png'),
      dialogVisible: false,
      dialogTitle: '',
      form: {
        env: 'AUTO',
        table: '',
        rangeType: 0,
        field: []
      },
      rules: {
        env: [
          { required: true, message: '请选择所属环境', trigger: 'change' }
        ],
        table: [
          { required: true, message: '请选择输入表', trigger: 'change' }
        ],
        rangeType: [
          { required: true, message: '请选择选中范围', trigger: 'change' }
        ]
      },
      tableList: [],
      fieldList: [],
      currentGroup: {},
      handType: '',
      blood: {}
    }
  },
  watch: {
    dialogVisible: {
      handler (val) {
        if (!val) {
          this.form = {
            env: 'AUTO',
            table: '',
            rangeType: 0,
            field: []
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['project']),
    active () {
      return (this.attrStore && this.attrStore.states.active) || {}
    },
    histories () {
      return (this.attrStore && this.attrStore.states.list.slice(0, 25)) || []
    },
    visibleEmpty () {
      return this.attrStore && !this.histories.length
    },
    isInputNameofNull() {
      return this.groupList.some(item => {
        return item.input.some(subItem => {
          return !subItem.tableName
        })
      })
    },
    isOutputNameofNull() {
      return this.groupList.some(item => {
        return item.output.some(subItem => {
          return !subItem.tableName
        })
      })
    },
    activeTab() {
      return (this.tabStore && this.tabStore.states.active) || {}
    }
  },
  async created() {
    this.loading++
    await this._getLineageTableList()
    this.getBloodConfig(true)
    this.loading--
  },
  methods: {
    addGroup () {
      const name = `血缘组${this.groupList.length + 1}`
      const id = this.groupList.length + 1 + Math.random()
      this.groupList.push({
        name: name,
        id,
        input: [
          {
            id: 1,
            tableName: '',
            range: '0',
            env: 'AUTO',
            projectId: '',
            columns: []
          }
        ],
        output: [
          {
            id: 1,
            tableName: '',
            range: '0',
            env: 'AUTO',
            projectId: '',
            columns: []
          }
        ]
      })
    },
    handleDelGroup (index) {
      this.groupList.splice(index, 1)
    },
    addInput (item, subItem) {
      if (subItem) {
        this.currentGroup = {
          inputId: subItem.id,
          ...item
        }
      } else {
        const id = item.input.length + 1 + Math.random()
        item.input.push({
          id,
          tableName: '',
          range: '0',
          env: 'AUTO',
          projectId: '',
          columns: []
        })
        this.currentGroup = {
          inputId: id,
          ...item
        }
      }
      this.dialogTitle = '配置输入表'
      this.dialogVisible = true
      this.handType = 'input'
    },
    editInput(item, subInputItem) {
      this.currentGroup = {
        inputId: subInputItem.id,
        ...item
      }
      this.dialogTitle = '配置输入表'
      this.dialogVisible = true
      this.handType = 'input'
      this.form.env = subInputItem.env
      this.form.rangeType = subInputItem.range
      this.form.table = subInputItem.projectId
    },
    addOuput (item, subItem) {
      if (subItem) {
        this.currentGroup = {
          outputId: subItem.id,
          ...item
        }
      } else {
        const id = item.output.length + 1 + Math.random()
        item.output.push({
          id,
          tableName: '',
          range: '0',
          env: 'AUTO',
          projectId: '',
          columns: []
        })
        this.currentGroup = {
          outputId: id,
          ...item
        }
      }
      this.dialogTitle = '配置输出表'
      this.dialogVisible = true
      this.handType = 'output'
    },
    editOutput(item, subOutputItem) {
      this.currentGroup = {
        outputId: subOutputItem.id,
        ...item
      }
      this.dialogTitle = '配置输出表'
      this.dialogVisible = true
      this.handType = 'output'
      this.form.env = subOutputItem.env
      this.form.rangeType = subOutputItem.range
      this.form.table = subOutputItem.projectId
    },
    confirmAdd() {
      if (this.handType == 'output') {
        const data = this.currentGroup.output.find(item => {
          return item.id === this.currentGroup.outputId
        })
        data.env = this.form.env
        data.range = this.form.rangeType
        const currentProject = this.tableList.find(item => {
          return item.value === this.form.table
        })
        data.projectId = currentProject.value
        data.tableName = currentProject.label
        const columns = []
        this.form.field.forEach(item => {
          const field = this.fieldList.find(d => {
            return d.value === item
          })
          columns.push({
            element_code: field.value,
            element_type: field.type
          })
        })
        data.columns = columns
      } else {
        const data = this.currentGroup.input.find(item => {
          return item.id === this.currentGroup.inputId
        })
        data.env = this.form.env
        data.range = this.form.rangeType
        const currentProject = this.tableList.find(item => {
          return item.value === this.form.table
        })
        data.projectId = currentProject.value
        data.tableName = currentProject.label
        const columns = []
        this.form.field.forEach(item => {
          const field = this.fieldList.find(d => {
            return d.value === item
          })
          columns.push({
            element_code: field.value,
            element_type: field.type
          })
        })
        data.columns = columns
      }
      this.dialogVisible = false
    },
    deleteGroup(index) {
      this.$confirm('将删除组内所有的输入、输出配置，不可撤销。', '删除整个血缘组', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.groupList.splice(index, 1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 删除输入表
    deleteInputItem(index, item) {
      item.input.splice(index, 1)
    },
    deleteOutputItem(index, item) {
      item.output.splice(index, 1)
    },
    // 关闭侧边栏
    cancel () {
      this.$root.eventEmitter.emit('hideSidebar')
    },

    setActiveAttr (attr) {
      this.attrStore.commit('setActive', attr)
    },
    setActiveToFirst (attr) {
      this.attrStore.commit('setActiveToFirst', attr)
    },
    async confirm() {
      const params = {
        taskId: this.active.data.id,
        bloodTies: JSON.stringify(this.groupList),
        bloodId: this.blood.bloodId
      }
      const res = await this.$simpleAsyncTo(saveBlood(params), '保存失败')
      if (res) {
        this.$message.success('保存成功')
        this.cancel()
      }
    },
    // 获取血缘配置
    async getBloodConfig(flag) {
      this.loading++
      console.log(this.active)
      const res = await this.$simpleAsyncTo(getLineageConfig({
        taskId: this.active.data.id
      }), '获取血缘配置失败')
      if (res) {
        if (res.data.bloodTies) {
          this.groupList = JSON.parse(res.data.bloodTies || '[]').map((d, index) => {
            return {
              id: index + 1 + Math.random(),
              name: `血缘组${index + 1}`,
              input: d.input.map((item, subIndex) => {
                return {
                  id: subIndex + 1 + Math.random(),
                  tableName: item.tableName,
                  env: item.env,
                  range: item.range,
                  projectId: item.projectId,
                  columns: item.columns
                }
              }),
              output: d.output.map((item, subIndex) => {
                return {
                  id: subIndex + 1 + Math.random(),
                  tableName: item.tableName,
                  env: item.env,
                  range: item.range,
                  projectId: item.projectId,
                  columns: item.columns
                }
              })
            }
          })
        } else {
          this.groupList = []
        }
        if (flag) {
          this.blood = {
            bloodId: res.data.bloodId,
            taskId: res.data.taskId
          }
        }
      }
      this.loading--
    },
    // 获取表列表
    async _getLineageTableList() {
      const res = await this.$simpleAsyncTo(getLineageTableList({
        projectId: this.project.project_id,
        taskId: this.active.data.id
      }), '获取表列表失败')
      if (res) {
        this.tableList = res.data.map(item => {
          return {
            label: item.cube_code,
            value: item.cube_id,
            source_type: item.source_type,
            type: item.type,
            type_code: item.type_code
          }
        })
      }
    },
    getIcon(id) {
      const item = this.tableList.find(item => {
        return item.value === id
      })
      if (item) {
        return this.iconMapColor[item.type_code]
      } else {
        return ''
      }
    },
    // 获取字段列表
    async _getLineageFieldList(cube_id, source_type) {
      const res = await this.$simpleAsyncTo(getLineageFieldList({
        cube_id,
        source_type
      }), '获取字段列表失败')
      if (res) {
        this.fieldList = res.columns.map(item => {
          return {
            label: item.element_name,
            value: item.element_code,
            type: item.element_type
          }
        })
      }
    },
    changeTable(val) {
      const item = this.tableList.find(d => d.value == val)
      if (item) {
        this._getLineageFieldList(item.value, item.source_type)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.side-panel-view {
  background-color: #fff;
  color: #000;
  height: 100%;
  padding: 0;
  .mark {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
  .drawer-header {
    display: flex;
    height: 56px;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    border-bottom: 1px rgba($color: #000000, $alpha: 0.1) solid;
    line-height: 36px;
    .drawer-title-wrapper {
      display: flex;
      align-items: center;
    }
    .title {
      margin-bottom: 0;
      font-weight: 500;
      font-size: 14px;
      color: rgba($color: #000000, $alpha: 0.85);
      margin-right: 5px;
      user-select: none;
    }
    > span > i {
      font-size: 18px;
      cursor: pointer;
      color: rgba($color: #000000, $alpha: 0.85);
    }
  }

  .drawer-content {
    flex-grow: 1;
    overflow-x: hidden;
    padding: 10px 0 0;
    .blood-config {
      height: 100%;
      ::v-deep {
        .el-empty {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .el-empty__image {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          img {
            width: 258px;
            height: 205px;
          }
        }
      }
      &-wrapper {
        min-height: 100%;
        display: flex;
        flex-direction: column;
        .content {
          flex: 1;
          margin-bottom: 20px;
          .add-new-config {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 46px;
            margin: 0 20px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            .delimiter {
              span:not(:last-child) {
                display: inline-block;
                width: 2px;
                height: 2px;
                border-radius: 2px;
                margin-right: 2px;
              }
              span:first-child {
                background: rgba(230, 240, 255, 1);
              }
              span:nth-child(2) {
                background: rgba(148, 184, 255, 1);
              }
              span:nth-child(3) {
                background: rgba(71, 148, 255, 1);
              }
              span:last-child {
                display: inline-block;
                width: 9.4px;
                height: 9.4px;
                color: rgba(46, 116, 255, 1);
                border-top: 2px solid rgba(46, 116, 255, 1);
                border-right: 2px solid rgba(46, 116, 255, 1);
                transform: rotate(45deg) translate(-2px, 7px);
              }
            }
            .count {
              font-size: 12px;
              color: var(--black45);
              margin-left: 12px;
            }
          }
          .blood-group-wrapper {
            position: relative;
            border-right: 2px solid transparent;
            .blood-group {
              display: flex;
              margin: 0 20px;
              padding-bottom: 12px;
              border-bottom: 1px solid rgba(0, 0, 0, 0.1);
              .input {
                display: flex;
                flex-basis: 50%;
                flex-direction: column;
                max-width: 50%;
                padding-right: 10px;
              }
              .output {
                display: flex;
                flex-basis: 50%;
                flex-direction: column;
                max-width: 50%;
                padding-left: 10px;
                .top {
                  justify-content: flex-end;
                }
              }
              .top {
                display: flex;
                justify-content: space-between;
                padding: 16px 0;
                font-size: 12px;
                .group-name {
                  color: rgba($color: #000000, $alpha: 0.85);
                }
                .right {
                  color: rgba(46, 116, 255, 1);
                  .add-new {
                    cursor: pointer;
                    &.add-new-empty {
                      cursor: not-allowed;
                      color: rgba($color: #000000, $alpha: 0.25);
                    }
                  }
                }
                .count {
                  color: rgba($color: #000000, $alpha: 0.45);
                  margin-left: 12px;
                }
              }
              .empty-blood-group-item {
                .bottom {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  width: 100%;
                  height: 56px;
                  border: 1px dotted rgba($color: #000000, $alpha: 0.15);
                  border-radius: 2px;
                  color: rgba($color: #000000, $alpha: 0.45);
                  font-size: 12px;
                  &:hover {
                    border: 1px solid rgba(46, 116, 255, 1);
                    cursor: pointer;
                  }
                  > div {
                    user-select: none;
                  }
                }
              }
              .blood-group-item {
                height: 56px;
                padding: 8px 12px;
                border: 1px solid rgba($color: #000000, $alpha: 0.15);
                border-radius: 2px;
                display: flex;
                flex-direction: column;
                &:not(:last-child) {
                  margin-bottom: 12px;
                }
                .content {
                  display: flex;
                  justify-content: space-between;
                  flex: 1;
                  margin-bottom: 20px;
                  .left {
                    display: flex;
                    > div {
                      margin-right: 10px;
                    }
                  }
                  .right {
                    display: flex;
                    i {
                      font-size: 14px;
                      color: rgba($color: #000000, $alpha: 0.5);
                      cursor: pointer;
                      padding: 4px;
                      &.disabled {
                        cursor: not-allowed;
                        color: rgba($color: #000000, $alpha: 0.25);
                      }
                    }
                  }
                  .auto-env-tag {
                    height: 20px;
                    color: rgba(46, 116, 255, 1);
                    border: 1px solid rgba(46, 116, 255, 1);
                    border-radius: 2px;
                    background-color: rgba(230, 240, 255, 1);
                    padding: 0 8px;
                  }
                }
                .item-icon {
                  height: 20px;
                  display: flex;
                  align-items: center;
                  i {
                    font-size: 18px;
                  }
                }
              }
            }
            .delete-group-btn {
              display: none;
              width: 28px;
              height: 28px;
              background: rgba(46, 116, 255, 1);
              border-radius: 2px 0 0 2px;
              text-align: center;
              vertical-align: middle;
              line-height: 28px;
              position: absolute;
              right: 0;
              bottom: 0;
              cursor: pointer;
              > i {
                color: #fff;
                font-size: 14px;
              }
            }
            &:hover {
              border-right: 2px solid rgba(46, 116, 255, 1);
              .delete-group-btn {
                display: block;
              }
            }
          }
          
        }
        .footer {
          background: #fff;
          position: sticky;
          bottom: 0;
          margin-bottom: 20px;
          .blue-info-tip  {
            background-color: rgba(230, 240, 255, 1);
            display: flex;
            padding: 5px 10px;
            line-height: 22px;
            border-radius: 2px;
            margin: 0 20px;
          }
          .msg-wrapper {
            margin-left: 10px;
            white-space: pre-wrap;
          }
        }
      }
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    padding: 14px 20px;
    border-top: 1px rgba($color: #000000, $alpha: 0.1) solid;
  }
}
</style>
