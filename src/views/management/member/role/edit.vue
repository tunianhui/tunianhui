<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-17 09:17:18
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-17 10:43:35
 * @FilePath: \数据智能构建\src\views\management\role\edit.vue
-->
<template>
  <div class="custom-roel">
    <el-breadcrumb separator-class="el-icon-arrow-right" ref="breadcrumb" style="height:24px;line-height:24px">
      <el-breadcrumb-item @click.native="backHand"><a href="javascript:;" style="font-weight:600;color:#66b1ff" >项目角色管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <el-collapse v-model="activeName">
        <el-collapse-item name="1">
          <template slot="title">
            <i :class="['el-icon-caret-right mr-15', getExist('1') ? 'arrow' : 'arrow1']"></i>
            <h5 ref="a1">基础信息</h5>
          </template>
          <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="角色名称" label-width="100px" prop="name">
              <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
            </el-form-item>
            <el-form-item label="角色说明" label-width="100px" prop="roleExplain">
              <el-input v-model="form.roleExplain" placeholder="请输入角色说明" type="textarea" :rows="4"></el-input>
            </el-form-item>
          </el-form>
          
        </el-collapse-item>
        <el-divider></el-divider>
        <el-collapse-item name="2">
          <template slot="title">
            <i :class="['el-icon-caret-right mr-15', getExist('2') ? 'arrow' : 'arrow1']"></i>
            <h5 ref="a2">项目内权限点</h5>
          </template>
          <div class="tree-wrapper">
            <div class="item">
              <el-tree
                :data="data1"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :highlight-current="true"
                :current-node-key="currentNodeKey1"
                :default-expanded-keys="defaultExpandedKeys1"
                :default-checked-keys="defaultCheckedKeys1"
                @check-change="handleCheckChange">
              </el-tree>
            </div>
            <div class="item">
              <el-tree
                :data="data2"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :highlight-current="true"
                :current-node-key="currentNodeKey2"
                :default-expanded-keys="defaultExpandedKeys2"
                :default-checked-keys="defaultCheckedKeys2"
                @check-change="handleCheckChange">
              </el-tree>
            </div>
            <div class="item">
              <el-tree
                :data="data3"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :highlight-current="true"
                :current-node-key="currentNodeKey3"
                :default-expanded-keys="defaultExpandedKeys3"
                :default-checked-keys="defaultCheckedKeys3"
                @check-change="handleCheckChange">
              </el-tree>
            </div>
            <div class="item">
              <el-tree
                :data="data4"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :highlight-current="true"
                :current-node-key="currentNodeKey4"
                :default-expanded-keys="defaultExpandedKeys4"
                :default-checked-keys="defaultCheckedKeys4"
                @check-change="handleCheckChange">
              </el-tree>
            </div>
            <div class="item">
              <el-tree
                :data="data5"
                show-checkbox
                node-key="id"
                :default-expand-all="true"
                :highlight-current="true"
                :current-node-key="currentNodeKey5"
                :default-expanded-keys="defaultExpandedKeys5"
                :default-checked-keys="defaultCheckedKeys5"
                @check-change="handleCheckChange">
              </el-tree>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="foolter">
        <el-button @click="backHand">取消</el-button>
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomRole',
  props: {
    title: {
      type: String,
      default: '新建自定义角色'
    }
  },
  computed: {
    getExist() {
      return (item) => {
        if (this.activeName.includes(item)) {
          return true
        } else {
          return false
        }
      }
    },
  },
  data() {
    return {
      activeName: ['1', '2'],
      form: {
        name: '',
        roleExplain: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleExplain: [
          { required: true, message: '请输入角色说明', trigger: 'blur' }
        ]
      },
      data1: [
        {
          label: '规划',
          id: 1,
          children: [
            {
              label: '成员管理',
              id: 2,
              children: [
                {
                  label: '编辑',
                  id: 6
                }
              ]
            },
            {
              label: '配置项目信息',
              id: 3,
              children: [
                {
                  label: '查看',
                  id: 7
                }
              ]
            },
            {
              label: '调用JDBC Driver',
              id: 4,
              children: [
                {
                  label: '调用JDBC',
                  id: 8
                }
              ]
            },
            {
              label: '业务实体',
              id: 5,
              children: [
                {
                  label: '编辑',
                  id: 9
                }
              ]
            }
          ]
        }
      ],
      defaultExpandedKeys1: [],
      defaultCheckedKeys1: [],
      currentNodeKey1: 1,
      data2: [
         {
          label: '数据集成',
          id: 1,
          children: [
            {
              label: '数据集成',
              id: 2,
              children: [
                {
                  label: '访问目录',
                  id: 6
                },
                {
                  label: '查看详情',
                  id: 7
                },
                {
                  label: '编辑',
                  id: 8
                },
                {
                  label: '执行',
                  id: 9
                }
              ]
            },
          ]
         }
      ],
      defaultExpandedKeys2: [],
      defaultCheckedKeys2: [1],
      currentNodeKey2: 1,
      data3: [
         {
          label: '开发',
          id: 1,
          children: [
            {
              label: '规范建模',
              id: 2,
              children: [
                {
                  label: '访问目录',
                  id: 6
                },
                {
                  label: '查看详情',
                  id: 7
                },
                {
                  label: '编辑',
                  id: 8
                },
                {
                  label: '执行',
                  id: 9
                }
              ]
            },
            {
              label: '数据处理',
              id: 10,
              children: [
                {
                  label: '访问目录',
                  id: 16
                },
                {
                  label: '查看详情',
                  id: 17
                },
              ]
            },
          ]
         }
      ],
      defaultExpandedKeys3: [],
      defaultCheckedKeys3: [1],
      currentNodeKey3: 1,
      data4: [
         {
          label: '项目资产权限',
          id: 1,
          children: [
            {
              label: '物理表',
              id: 2,
              children: [
                {
                  label: '新建',
                  id: 6
                },
                {
                  label: '查表数据',
                  id: 7
                },
                {
                  label: '改表数据',
                  id: 8
                },
                {
                  label: '改表结构',
                  id: 9
                },
                {
                  label: '删除表',
                  id: 19
                }
              ]
            },
            {
              label: '逻辑表',
              id: 10,
              children: [
                {
                  label: '查表数据',
                  id: 16
                },
              ]
            },
          ]
         }
      ],
      defaultExpandedKeys4: [],
      defaultCheckedKeys4: [2],
      currentNodeKey4: 1,
      data5: [
         {
          label: '发布运维',
          id: 1,
          children: [
            {
              label: '发布',
              id: 2,
              children: [
                {
                  label: '查看',
                  id: 6
                },
                {
                  label: '移除',
                  id: 7
                }
              ]
            },
            {
              label: '运维',
              id: 10,
              children: [
                {
                  label: '访问目录',
                  id: 16
                },
                {
                  label: '查看基本信息',
                  id: 17
                },
                {
                  label: '查看详情',
                  id: 19
                },
                 {
                  label: '运维操作',
                  id: 22
                },
              ]
            },
          ]
         }
      ],
      defaultExpandedKeys5: [],
      defaultCheckedKeys5: [],
      currentNodeKey5: 1
    }
  },
  methods: {
    backHand() {
      this.$emit('backHand')
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(valid)
        if (valid) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.custom-roel {
  height: 100%;
  width: 100%;
  .content {
    height: calc(100% - 38px);
    margin-top: 12px;
    padding: 0px 20px 40px;
    background: #fff;
    position: relative;
    .foolter {
      height: 40px;
      // line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background: #fff;
      border-top: 1px solid #ebeef5;
      padding: 0px 20px;
      .el-button {
        margin-left: 10px;
      }
    }
  }
  ::v-deep {
    .el-collapse-item__header {
      background: transparent;
      border-bottom: none;
      height: 30px;
      line-height: 30px;
    }
    .el-collapse-item__wrap {
      background: transparent;
      border-bottom: none;
    }
    .el-collapse {
      border-top: none;
      border-bottom: none;
    }
    .el-collapse-item__arrow {
      display: none;
    }
    .el-collapse-item__content {
      padding: 0;
    }
    .el-tree-node__content {
      height: 40px;
    }
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background: #f5f7fa;
    }
  }
  .arrow {
    transform: rotate(90deg);
    transition: all 0.2s linear;
  }
  .arrow1 {
    transform: rotate(0deg);
    transition: all 0.2s linear;
  }
  .tree-wrapper {
    display: flex;
    flex-wrap: wrap;
    .item {
      width: 20%;
      // background: #f5f5f5;
      margin-bottom: 20px;
      border-right: 1px solid #DADADA;
      &:nth-child(5n) {
        border-right: none;
      }
    }
  }
}

</style>