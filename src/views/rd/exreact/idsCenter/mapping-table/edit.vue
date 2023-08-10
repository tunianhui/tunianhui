<!--
 * @Author: 大炸鹅
 * @Date: 2023-02-07 15:57:38
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-03-08 09:32:10
 * @FilePath: \数据智能构建\src\views\rd\exreact\idsCenter\mapping-table\edit.vue
-->
<template>
  <SimpleEditDialog
    :title="title"
    :visible="isVisible"
    @close="close"
    @confirm="confirm"
    :confirmText="confirmText"
    :disabled="disabled"
    width="60%"
    class="my-normal-config"
  >
    <el-form :model="form" label-position="right" :rules="rules" ref="formName">
      <el-form-item label="选择ID映射表" label-width="140px" prop="sourceMappingId">
        <el-select v-model="form.sourceMappingId" style="width:260px" @change="changeSourceMappingId" :disabled="data.isEdit" filterable>
          <el-option
            v-for="item in cubeList"
            :key="item.cube_id"
            :label="item.cube_name"
            :value="item.cube_id"
          ></el-option>
        </el-select>
        <el-tooltip class="item" effect="dark" content="如选择的表加工方式不符合 ID 倒排表定义，可能会解析失败，或者 ID 无法归一" placement="top">
          <i class="el-icon-warning-outline font-14 ml-15"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="选择映射表调度节点" label-width="140px">
        <el-select v-model="form.sourceJobId" style="width:260px" filterable>
          <el-option
            v-for="item in jobsList"
            :key="item.id"
            :label="item.job_code"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否分区表" label-width="140px">
        <el-switch
          v-model="isOpenValue"
          active-color="#13ce66"
          inactive-color="#ccc"
          :active-text="activeText"
          disabled
          @change="changeHandle">
        </el-switch>
      </el-form-item>
      <el-form-item label="分区字段" label-width="140px" v-if="isOpenValue">
        <el-input v-model="form.sqlDisplayContext"></el-input>
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
  </SimpleEditDialog>
</template>

<script>
import editDialog from '@/mixins/edit-dialog'
import { getJobs, getIdMapping, insertJobs, editJobs } from '@/api/rd/exreact/mapping-id'
export default {
  name: 'MappingTableIdEdit',
  mixins: [editDialog],
  data() {
    return {
      confirmText: '确定',
      disabled: false,
      form: {
        sourceMappingId: '',
        sourceJobId: '',
        sqlDisplayContext: ''
      },
      rules: {
        sourceMappingId: [
          {required: true}
        ],
        sourceJobId: [
          {required: true}
        ]
      },
      cubeList: [],
      jobsList: [],
      isOpenValue: false,
      activeText: '否',
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
    }
  },
  async created() {
    await this._getIDCubes()
    await this._getJobs()
    this.form.sqlDisplayContext = '${yyyyMMdd}'
    if (this.data.isEdit) {
      this.form.sourceMappingId = this.data.sourceMappingId
      this.form.sourceJobId = this.data.sourceJobId
      this.form.sqlDisplayContext = this.data.sqlDisplayContext || '${yyyyMMdd}'
      this.changeSourceMappingId(this.form.sourceMappingId)
    }
  },
  methods: {
    confirm() {
      this.$refs['formName'].validate(async (valid) => {
        if (valid) {
          const Obj = this.cubeList.find(d => d.cube_id === this.form.sourceMappingId) || {}
          const params = {
            sourceMappingCode: Obj.cube_code,
            sourceMappingId: Obj.cube_id,
            sourceMappingName: Obj.cube_name,
            projectCode: this.data.project_code,
            projectId: this.data.project_id,
            sqlDisplayContext: this.form.sqlDisplayContext,
            sourceJobId: this.form.sourceJobId
          }
          let fn = null
          if (this.data.isEdit) {
            fn = editJobs
            params.id = this.data.id
          } else {
            fn = insertJobs
          }
          const res = await this.$simpleAsyncTo(fn(params), '保存失败')
          if (res) {
            this.$root.eventEmitter.emit('refresh')
            this.close()
            this.$message({
              type: 'success',
              message: '保存成功'
            })
          }
        }
      })
    },
    changeHandle(val) {
      if (val) {
        this.activeText = '是'
      } else {
        this.activeText = '否'
      }
    },
    // 获取来源主表列表
    async _getIDCubes() {
      const res = await this.$simpleAsyncTo(getIdMapping({project_id: this.data.project_id}), '获取来源主表失败')
      if (res) {
        this.cubeList = res.data
      }
    },
    // 调度节点
    async _getJobs() {
      const res = await this.$simpleAsyncTo(getJobs(), '获取来源主表失败')
      if (res) {
        this.jobsList = res.data
      }
    },
    changeSourceMappingId(val) {
      const data = this.cubeList.find(d => d.cube_id === val)
      if (data && data.is_partition + '' === '1') {
        this.isOpenValue = true
      } else {
        this.isOpenValue = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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