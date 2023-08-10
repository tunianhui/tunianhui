<template>
  <el-dialog
    class="my-normal-config"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="850px">
    <div slot="title" class="title">
      <div class="mr-20">
        <span>ID归一化配置</span>
        <el-tooltip class="item" effect="dark" content="基于 ID 倒排表将不同 ID 类型的 ID 取值，归一为唯一值(OneID)，从而聚合行为数据，提高后续标签计算准确度。配置后全局生效！如您有 ID映射关系表，但不符合 ID 倒排表规则，建议先清洗加工来源表，将需要归一使用的 ID 添加至来源表" placement="top">
          <i class="el-icon-warning-outline font-14"></i>
        </el-tooltip>
      </div>
      <span class="font-12" style="color: #bfbfbf">仅超级管理员可配置，配置完成后全局生效</span>
    </div>
    <el-form :model="form" label-position="left" :rules="rules" ref="formName">
      <el-form-item label="选择ID倒排表：" label-width="120px" prop="cube_id">
        <el-select v-model="form.cube_id" style="width:260px" @change="changeCube">
          <el-option
            v-for="item in cubeList"
            :key="item.cube_id"
            :label="item.cube_code"
            :value="item.cube_id"
          ></el-option>
        </el-select>
        <!-- <el-select v-model="form.region" placeholder="请选择" style="width:260px">
        </el-select> -->
        <el-tooltip class="item" effect="dark" content="请在数据萃取对应的项目中开发上线 ID 倒排表，如选择的表加工方式不符合 ID 倒排表定义，可能会解析失败，或者 ID 无法归一" placement="top">
          <i class="el-icon-warning-outline font-14 ml-15"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="选择分区字段" label-width="110px">
      </el-form-item>
      <el-form-item>
        <MonacoEditor
          :style="{height: `${150}px`}"
          has-top-tools
          has-bottom-tools
          :isShowExample="false"
          :code.sync="activeEditFieldCode"
          @verification="sqlValidate"
          @save="saveFieldEditorCode"
        ></MonacoEditor>
      </el-form-item>
      <el-form-item label="ID归一化">
        <el-switch
          v-model="isOpenValue"
          active-color="#13ce66"
          inactive-color="#ccc"
          :active-text="activeText"
          :disabled="true"
          @change="changeHandle">
        </el-switch>
      </el-form-item>
    </el-form>
    <div class="behavior-preview">
      <p>ID归一规则预览</p>
      <div>
        <div class="behavior-config-preview">
          <div class="behavior-config-preview-top preview-item mb-20">
            <div class="behavior-config-item" v-for="item in fields" :key="item.name">
              <div class="config-perview-title">
                <span class="perview-title-content">{{item.name}}</span>
                <el-tooltip class="item" effect="dark" :content="item.tooltipContent" placement="top">
                  <i class="el-icon-warning-outline font-14 ml-15"></i>
                </el-tooltip>
              </div>
              <div class="config-perview-eg">{{item.content}}</div>
            </div>
            <div class="config-perview-last">行为规则结构</div>
          </div>
          <div class="behavior-config-preview-top preview-item">
            <div class="behavior-config-item" v-for="item in fieldsValue" :key="item.name">
              <div class="config-perview-title">
                <span class="perview-title-content">{{item.name}}</span>
              </div>
              <div class="config-perview-eg">{{item.content}}</div>
            </div>
            <div class="config-perview-last">ID倒排表结构</div>
          </div>
          <div class="behavior-config-tips">
            <div class="behavior-config-tips-icon">
              <i class="iconfont icon-tip"></i>
              <div>Tips</div>
            </div>
            <div class="behavior-config-tips-content ml-15 font-12">
              <p>1. 归一化配置后，对于归一化成功的 ID_type（ID 倒排表包含该 ID_type），ID 原始值将等于 OneID</p>
              <p>2. 对于归一化失败的 ID_type（无法映射到 ID 倒排表），则维持原定义的 ID_type 及 ID值组合生成的 ID原始值</p>
            </div>
          </div>
          <div class="behavior-config-preview-middle">
            <div class="middle-line">
              <div class="line-one line-style">
                <div class="dotted-line">
                  <span class="dotted-top">></span>
                  <span class="dotted-bottom">&gt;</span>
                </div>
              </div>
              <div class="line-two line-style">
                <div class="solid-line">
                  <span class="solid-top line-circle"></span>
                  <span class="solid-bottom line-circle"></span>
                </div>
              </div>
              <div class="line-two line-style">
                <div class="solid-line">
                  <span class="solid-top line-circle"></span>
                  <span class="solid-bottom line-circle"></span>
                </div>
              </div>
            </div>
            <div class="middle-content">
              <div class="content-color">归一关系：</div>
              <div class="font-12">
                <p>ID_Type <span class="content-color">join on</span> Key_Type</p>
                <p><span class="content-color">&</span>ID值 <span class="content-color">join on</span> Key_id</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer my-btn">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" class="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addIdNormalizeConfig, getIDCubes} from '@/api/rd/exreact/regular'
import {mapGetters} from 'vuex'
import { filterVerification } from '@/api/rd/limit'
export default {
  name: 'NormalConfig',
  data() {
    return {
      visible: true,
      form: {
        cube_id: ''
      },
      activeEditFieldCode: '',
      isOpenValue: true,
      activeText: '已经开启',
      fields: [
        {
          name: 'ID原始值',
          content: '包含id_type,id_person_ids',
          tooltipContent: '归一后的 ID 原始值字段的取值，全局唯一标识用户'
        },
        {
          name: 'ID_Type',
          content: '如Tel',
          tooltipContent: '识别 ID 类型，与 ID 值组合为关联键，以识别并转化已配置的【ID_Type:ID 值】'
        },
        {
          name: 'ID值',
          content: '如abc',
          tooltipContent: '获取 ID 值，与 ID_type 组合为关联键，以识别并转化已配置的【ID_Type:ID 值】'
        }
      ],
      fieldsValue: [
        {
          name: 'ONEID',
          content: '如0001',
          tooltipContent: '归一后的 ID 原始值字段的取值，全局唯一标识用户'
        },
        {
          name: 'Key_Type',
          content: '如User_ID',
          tooltipContent: '识别 ID 类型，与 ID 值组合为关联键，以识别并转化已配置的【ID_Type:ID 值】'
        },
        {
          name: 'Key_Id',
          content: '如abc',
          tooltipContent: '获取 ID 值，与 ID_type 组合为关联键，以识别并转化已配置的【ID_Type:ID 值】'
        }
      ],
      cubeList: [],
      rules: {
        cube_id: [
          { required: true, message: '请选择表', trigger: 'change' }
        ]
      },
      isRules: false
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  created() {
    this._getIDCubes()
  },
  methods: {
    // 获取来源主表列表
    async _getIDCubes() {
      const res = await this.$simpleAsyncTo(getIDCubes({project_id: this.project.project_id}), '获取来源主表失败')
      if (res) {
        this.cubeList = res.data
      }
    },
    changeCube(val) {
      const obj = this.cubeList.find(item => item.cube_id === val)
      Object.assign(this.form, obj)
    },
    async sqlValidate() {
      if (this.activeEditFieldCode === '') return this.$message({type: 'error', message: '请填写字段'})
      const res = await this.$simpleAsyncTo(filterVerification({filter: this.encrypt(this.activeEditFieldCode)}), '校验失败')
      if (res) {
        this.isRules = res.flag
        this.$message({
          type: 'success',
          message: '校验成功'
        })
      }
    },
    saveFieldEditorCode() {},
    changeHandle(val) {
      if (val) {
        this.activeText = '已经开启'
      } else {
        this.activeText = '尚未开启'
      }
    },
    submit() {
      this.$refs['formName'].validate(async (valid) => {
        if (valid) {
          if (!this.isRules) {
            return this.$message({
              type: 'error',
              message: '请进行规范校验'
            })
          }
          // if (this.activeEditFieldCode === '') return this.$message({type: 'error', message: '请填写字段'})
          const params = {
            sourceMappingCode: this.form.cube_code,
            projectCode: this.project.project_code,
            sourceMappingId: this.form.cube_id,
            sourceMappingName: this.form.cube_name,
            projectId: this.project.project_id,
            sql_display_context: this.activeEditFieldCode
          }
          const res = await this.$simpleAsyncTo(addIdNormalizeConfig(params), '配置失败')
          if (res) {
            this.$message({
              type: 'success',
              message: '配置成功'
            })
            this.close()
          }
        }
      })
    },
    close() {
      this.visible = false
      this.$emit('normalConfigClose')
    }
  }
}
</script>

<style lang="scss">
.my-normal-config {
  .el-dialog__body {
    overflow: auto;
    max-height: 480px;
  }
  .title {
    display: flex;
    align-items: center;
  }
  .behavior-preview {
    width: 816px;
    height: 318px;
    padding: 20px;
    background: #f2f3f5;
    position: relative;
    >p {
      margin-bottom: 12px;
    }
    >div {
      .behavior-config-preview {
        .preview-item {
          height: 93px;
          background: $grey7;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .behavior-config-item {
            background-color: $grey10;
            .config-perview-title {
              width: 218px;
              height: 34px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-bottom: 1px solid rgba($grey1, .1);
              border-right: 2px solid rgba($grey1, .1);
              .perview-title-content {
                margin-right: 6px;
              }
            }
            .config-perview-eg {
              height: 34px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-right: 2px solid rgba($grey1, .1);
            }
          }
          .config-perview-last {
            text-align: center;
            width: 122px;
          }
        }
        .behavior-config-tips {
          margin-top: 12px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .behavior-config-tips-icon {
            width: 40px;
            height: 36px;
            border-right: 1px solid $grey6;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            i {
              font-size: 20px;
              color: $tabTitleColor;
            }
          }
          .behavior-config-tips-content {

          }
        }
        .behavior-config-preview-middle {
          position: absolute;
          top: 96px;
          left: 30px;
          width: 654px;
          height: 110px;
          .middle-line {
            display: flex;
            justify-content: center;
            > div {
              width: 218px;
            }
            .line-style {
              display: flex;
              align-items: center;
              justify-content: center;
              .line-circle {
                width: 6px;
                height: 6px;
                background: $tabTitleColor;
                border-radius: 50%;
              }
              &.line-one {
                height: 82px;
                .dotted-line {
                  width: 0;
                  height: 100%;
                  border-right: 1px dotted $grey1;
                  opacity: .5;
                  position: relative;
                  .dotted-top {
                    position: absolute;
                    left: -4px;
                    top: -6px;
                    transform: rotate(-90deg);
                  }
                  .dotted-bottom {
                    position: absolute;
                    left: -2px;
                    bottom: -6px;
                    transform: rotate(90deg);
                  }
                }
              }
              &.line-two {
                height: 110px;
                .solid-line {
                  position: relative;
                  width: 0;
                  height: 100%;
                  border-right: 1px solid $tabTitleColor;
                  .solid-top {
                    position: absolute;
                    left: -3px;
                    top: -3px;
                  }
                  .solid-bottom {
                    position: absolute;
                    left: -3px;
                    bottom: -6px;
                  }
                }
              }
            }
          }
          .middle-content {
            position: absolute;
            top: 34px;
            left: 265px;
            width: 332px;
            height: 44px;
            border-radius: 20px;
            border: 1px solid $tabTitleColor;
            display: flex;
            align-items: center;
            justify-content: center;
            background: $grey10;
            .content-color {
              color: $tabTitleColor;
              padding: 0 6px;
            }
          }
        }
      }
    }
  }
}
</style>
