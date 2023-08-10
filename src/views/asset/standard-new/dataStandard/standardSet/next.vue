<template>
  <div class="next-detail" v-resize="resizeDom">
    <el-breadcrumb separator-class="el-icon-arrow-right" ref="breadcrumb">
      <el-breadcrumb-item @click.native="backHand"><a href="#" style="font-weight:600;color:#66b1ff" >标准集列表</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content-box mt-10" :style="{height: `${height}px`}">
      <div class="left">
        <div :class="['item-wrapper', active === 'base' ? 'active' : '']" @click="selectClickHandle('base')">
          <div class="item-content">
            <i class="el-icon-warning-outline"></i>
            基本信息
          </div>
        </div>
        <div :class="['item-wrapper', active === 'all' ? 'active' : '']" @click="selectClickHandle('all')">
          <div class="item-content">
            <i class="iconfont icon-tiaoyong"></i>
            全部属性
          </div>
        </div>
        <div
          :class="['item-wrapper leaf', index === 0 ? 'index-top' : 'top', active === index ? 'active-sub' : '']"
          v-for="(item, index) in allAttrList" :key="index"
          @click="selectClickHandle(index)"
        >
          <div class="item-content">
            {{item.label}}({{item.count}})
          </div>
        </div>
      </div>
      <div class="right">
        <template v-if="active === 'base'">
          <el-form :model="form" ref="form" :label-width="formLabelWidth" :rules="rules">
            <h5>基本信息</h5>
            <el-form-item label="标准集名称" prop="name">
              <el-input v-model="form.name" autocomplete="off" placeholder="请输入标准集名称, 最多128个字符"></el-input>
            </el-form-item>
            <el-form-item label="标准集编码" prop="code">
              <el-input v-model="form.code" autocomplete="off" placeholder="请输入标准集名称, 最多12个字符，仅支持英文字母或数字"></el-input>
            </el-form-item>
            <el-form-item label="归属目录" prop="catalogue">
              <el-select v-model="form.catalogue" placeholder="请选择所属上级目录">
                <el-option label="目录一" value="1"></el-option>
                <el-option label="目录二" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="维护人员" prop="maintainUser">
              <el-select v-model="form.maintainUser" placeholder="请选择维护人员">
                <el-option label="人员1" value="1"></el-option>
                <el-option label="人员2" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成员" prop="user">
              <el-select v-model="form.user" placeholder="请选择维护人员">
                <el-option label="人员1" value="1"></el-option>
                <el-option label="人员2" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input type="textarea" rows="4" v-model="form.desc" placeholder="请输入标准集描述"></el-input>
            </el-form-item>
            <el-form-item label="可见范围" prop="visibleRange">
              <el-radio-group v-model="form.visibleRange">
                <el-row>
                  <el-col :span="24" class="mb-5">
                    <el-radio label="1">公开: 非当前标准集人员仅可查看已发布过的标准（已生效，待生效，已失效）</el-radio>
                  </el-col>
                  <el-col :span="24" class="mb-5">
                    <el-radio label="2">私有： 仅标准集人员可见（包括维护人员和成员）</el-radio>
                  </el-col>
                  <el-col :span="24" class="mb-5">
                    <el-radio label="3">标准集人员&指定人可见</el-radio>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <div class="examine">
              <h5>审批配置</h5>
              <div class="tip">
                <i class="iconfont icon-tip"></i>
                <span>修改审批配置，不影响当前已生成的审批任务</span>
              </div>
            </div>
            <el-form-item label="标准审批流程" prop="flowPath">
              <el-radio-group v-model="form.flowPath">
                <el-row>
                  <el-col :span="24" class="mb-5">
                    <el-radio label="1">超级管理员和数据标准管理员，任一通过通过，任一驳回即驳回</el-radio>
                  </el-col>
                  <el-col :span="24" class="mb-5">
                    <el-radio label="2">指定审批模板</el-radio>
                  </el-col>
                </el-row>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
        <template v-if="active === 'all'">
          <div class="list-header">
            <div>全部属性</div>
            <div>
              <el-checkbox v-model="meChecked">必填属性</el-checkbox>
              <el-input placeholder="请输入规则名称" style="width:140px" class="ml-10 mr-10" v-model="keywork">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-dropdown @command="commandAttrHandle">
                <el-button type="primary">
                  <i class="el-icon-plus mr-10"></i> 新建属性
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">新建自定义属性</el-dropdown-item>
                  <el-dropdown-item command="import">引用公共属性</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div class="table-body">
             <el-table
              :data="tableData"
              height="calc(100% - 40px)"
              style="width: 100%">
              <el-table-column prop="name" label="属性名称"></el-table-column>
              <el-table-column prop="code" label="属性编码"></el-table-column>
              <el-table-column prop="type" label="属性类型"></el-table-column>
              <el-table-column prop="required" label="是否必填"></el-table-column>
              <el-table-column prop="fieldType" label="字段类型"></el-table-column>
              <el-table-column prop="fieldLength" label="字段长度"></el-table-column>
              <el-table-column prop="value" label="取值"></el-table-column>
              <el-table-column prop="bounds" label="取值约束"></el-table-column>
              <el-table-column prop="defaultValue" label="默认值"></el-table-column>
              <el-table-column prop="desc" label="描述"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scoped">
                  <el-tooltip placement="top" content="编辑">
                    <el-button type="text" size="small" @click="editHandle(scoped.row)">
                      <i class="el-icon-edit-outline"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip placement="top" content="克隆">
                    <el-button type="text" size="small">
                      <i class="el-icon-copy-document"></i>
                    </el-button>
                  </el-tooltip>
                  <el-tooltip placement="top" content="删除">
                    <el-button type="text" size="small" @click="delhandle(scoped.row)">
                      <i class="el-icon-delete"></i>
                    </el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </div>
    </div>
    <div class="foolter">
      <el-button @click="cancelHandle">取消</el-button>
      <el-button type="primary" @click="submitHandle">确定</el-button>
    </div>
    <StandardSetAttr v-if="visible" :title="StandardSetAttrTitle" @close="visible = false"></StandardSetAttr>
  </div>
</template>

<script>
import StandardSetAttr from './attr'
export default {
  name: 'NextDetail',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  components: {
    StandardSetAttr
  },
  data () {
    return {
      height: 0,
      allAttrList: [
        {
          label: '业务属性',
          parent: 2,
          count: 22
        },
        {
          label: '技术属性',
          parent: 2,
          count: 40
        },
        {
          label: '管理属性',
          parent: 2,
          count: 40
        },
        {
          label: '质量属性',
          parent: 2,
          count: 40
        },
        {
          label: '主数据属性',
          parent: 2,
          count: 40
        },
        {
          label: '生命周期属性',
          parent: 2,
          count: 40
        },
        {
          label: '安全属性',
          parent: 2,
          count: 40
        }
      ],
      active: 'base',
      form: {
        name: '',
        code: '',
        catalogue: '',
        maintainUser: '',
        user: '',
        desc: '',
        visibleRange: '1',
        flowPath: '1'
      },
      formLabelWidth: '110px',
      rules: {
        name: [
          { required: true, message: '请输入标准集名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入标准集编码', trigger: 'blur' }
        ],
        catalogue: [
          { required: true, message: '请选择标准集目录', trigger: 'change' }
        ],
        maintainUser: [
          { required: true, message: '请选择维护人员', trigger: 'change' }
        ],
        user: [
          { required: true, message: '请选择成员', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请输入标准集描述', trigger: 'blur' }
        ],
        visibleRange: [
          { required: true, message: '请选择可见范围', trigger: 'change' }
        ],
        flowPath: [
          { required: true, message: '请选择标准审批流程', trigger: 'change' }
        ]
      },
      meChecked: false,
      tableData: [
        {
          name: '标准编码',
          code: 'code',
          type: '基础属性',
          required: '是',
          fieldType: 'STRING',
          fieldLength: '20',
          value: '自动生成',
          bounds: '无',
          defailtValue: '无',
          desc: '标准编码'
        }
      ],
      keywork: '',
      visible: false,
      StandardSetAttrTitle: ''
    }
  },
  methods: {
    backHand () {
      this.$emit('back')
    },
    resizeDom (data) {
      this.$nextTick(_ => {
        const { height } = data
        this.height = parseInt(height) - 48 - this.$refs.breadcrumb.$el.clientHeight
      })
    },
    selectClickHandle (type) {
      this.active = type
    },
    commandAttrHandle (type) {
      console.log(type)
      this[`${type}Handle`]()
    },
    addHandle () {
      this.visible = true
      this.StandardSetAttrTitle = '新增标准集属性'
    },
    // 编辑
    editHandle (row) {
      this.visible = true
      this.StandardSetAttrTitle = '编辑标准集属性'
    },
    // 删除
    delhandle(row) {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 保存
    submitHandle () {
      this.$message({
        message: '保存成功',
        type: 'success'
      })
    },
    // 取消
    cancelHandle() {
      this.backHand()
    }
  }
}
</script>

<style lang="scss" scoped>
.next-detail {
  position: relative;
  height: 100%;
  .content-box {
    display: flex;
    height: 100%;
    .left {
      width: 190px;
      background: #f5f5f5;
      height: 100%;
      overflow: overlay;
      .item-wrapper {
        height: 40px;
        line-height: 40px;
        padding: 0 15px 0 0px;
        margin-bottom: 10px;
        :hover {
          cursor: pointer;
        }
        &.active {
          background: #fff;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 3px;
            height: 100%;
            background: #66b1ff;
          }
        }
        &.leaf {
          padding-left: 25px;
          position: relative;
          :before {
            content: '';
            position: absolute;
            left: 15px;
            top: 50%;
            width: 10px;
            height: 0px;
            border: none;
            border-bottom: 1px dashed #ccc;
          }
          ::after {
            content: '';
            position: absolute;
            left: 15px;
            bottom: 50%;
            width: 1px;
            border: none;
            border-left: 1px dashed #ccc;
          }
        }
        &.index-top {
          ::after {
            height: calc(50% + 10px);
          }
        }
        &.top {
          ::after {
            height: calc(100% + 10px);
          }
        }
        .item-content {
          width: 100%;
          height: 100%;
          background: #fff;
          padding-left: 15px;
        }
        &.active-sub {
          position: relative;
          padding-right: 0;
          &::after {
            content: '';
            position: absolute;
            left: 25px;
            top: 0;
            width: 3px;
            height: 100%;
            background: #66b1ff;
          }
        }
      }
    }
    .right {
      flex: 1;
      width: 0;
      background: #fff;
      padding: 16px;
      .examine {
        padding: 0px 20px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        h5 {
          margin-right: 20px;
        }
        > div {
          background: #E7F1FF;
          padding: 5px 10px;
          > span {
            color: rgba($color: #000000, $alpha: 0.8);
            font-size: 12px;
          }
          i {
            color: #66B1FF;
            margin-right: 5px;
          }
        }
      }
      .list-header {
        display: flex;
        align-items: center;
        height: 40px;
        justify-content: space-between;
      }
      .table-body {
        height: calc(100% - 40px);
      }
    }
  }
  .foolter {
    height: 48px;
    line-height: 48px;
    background: #fff;
    bottom: -10px;
    right: 0;
    position: absolute;
    width: 100%;
    text-align: center;
  }
}
</style>