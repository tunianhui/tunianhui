<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    width="720px"
    custom-class="form-standard-data"
    top="10vh"
  >
    <h6 class="mb-15">所属标准集：数据安全标准集</h6>
    <el-form :model="form" ref="form" :label-width="formLabelWidth" :rules="rules" label-suffix="：">
      <h5 class="mb-10">属性信息</h5>
      <div class="attr-info">
        <div class="attr-info-left">
          <div class="item-wrapper">
            <div class="item" v-for="(item, index) in attrList" :key="item.value" @click="selectHandle(item, index)">
              <span>{{item.label}}</span>
              <span>
                <i class="iconfont icon-iconfontzhizuobiaozhun023117"></i>
              </span>
            </div>
          </div>
          <div class="line" :style="{top: `${top}px`}"></div>
        </div>
        <div class="attr-info-right">
          <div class="attr-info-right-wrapper" ref="rightWrapper" @scroll="scrollHandle">
            <el-collapse v-model="activeName">
              <el-collapse-item name="1">
                <template slot="title">
                  <i :class="['el-icon-caret-right mr-15', getExist('1') ? 'arrow' : 'arrow1']"></i>
                  <h5 ref="a1">业务属性</h5>
                </template>
                <el-form-item label="标准编码" prop="code">
                  <el-input v-model="form.code" autocomplete="off" placeholder="请输入标准编码" v-if="!disbled"></el-input>
                  <span v-else class="label">sjajg</span>
                </el-form-item>
                <el-form-item label="标准名称" prop="name">
                  <el-input v-model="form.name" autocomplete="off" placeholder="请输入标准名称" v-if="!disbled"></el-input>
                  <span v-else class="label">数据标准</span>
                </el-form-item>
                <el-form-item label="标准英文名" prop="En_name">
                  <el-input v-model="form.En_name" autocomplete="off" placeholder="请输入标准英文名" v-if="!disbled"></el-input>
                  <span v-else class="label">sj</span>
                </el-form-item>
                <el-form-item label="标准类型" prop="type">
                  <el-input v-model="form.type" autocomplete="off" placeholder="请输入标准类型" v-if="!disbled"></el-input>
                  <span v-else class="label">字符串</span>
                </el-form-item>
                <el-form-item label="标准主题" prop="theme">
                  <el-input v-model="form.theme" autocomplete="off" placeholder="请输入标准主题" v-if="!disbled"></el-input>
                  <span v-else class="label">buss</span>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template slot="title">
                  <i :class="['el-icon-caret-right mr-15', getExist('2') ? 'arrow' : 'arrow1']"></i>
                  <h5 ref="a2">技术属性</h5>
                </template>
                <el-form-item label="技术元数据" prop="metadata">
                  <el-input v-model="form.metadata" autocomplete="off" placeholder="请输入技术元数据" v-if="!disbled"></el-input>
                  <span v-else class="label">元数据</span>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template slot="title">
                  <i :class="['el-icon-caret-right mr-15', getExist('3') ? 'arrow' : 'arrow1']"></i>
                  <h5 ref="a3">管理属性</h5>
                </template>
                <el-form-item label="uu" prop="uu">
                  <el-input v-model="form.uu" autocomplete="off" placeholder="请输入uu" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template slot="title">
                  <i :class="['el-icon-caret-right mr-15', getExist('4') ? 'arrow' : 'arrow1']"></i>
                  <h5 ref="a4">质量属性</h5>
                </template>
                <el-form-item label="di" prop="di">
                  <el-input v-model="form.di" autocomplete="off" placeholder="请输入di" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="5">
                <template slot="title">
                  <i :class="['el-icon-caret-right mr-15', getExist('5') ? 'arrow' : 'arrow1']"></i>
                  <h5 ref="a5">主数据属性</h5>
                </template>
                <el-form-item label="uuu" prop="uuu">
                  <el-input v-model="form.uuu" autocomplete="off" placeholder="请输入uuu" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="整合规则" prop="rule">
                  <el-input v-model="form.rule" autocomplete="off" placeholder="请输入整合规则" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="置信度" prop="confidence">
                  <el-input v-model="form.confidence" autocomplete="off" placeholder="请输入置信度" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="是否主数据" prop="isMainData">
                  <el-radio-group v-model="form.isMainData" v-if="!disbled">
                    <el-radio :label="true">True</el-radio>
                    <el-radio :label="false">False</el-radio>
                  </el-radio-group>
                  <span v-else class="label"></span>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="6">
                <template slot="title">
                  <i :class="['el-icon-caret-right mr-15', getExist('6') ? 'arrow' : 'arrow1']"></i>
                  <h5 ref="a6">生命周期属性</h5>
                </template>
                <el-form-item label="dicc" prop="dicc">
                  <el-input v-model="form.dicc" autocomplete="off" placeholder="请输入dicc" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="销毁方案" prop="destroy_plan">
                  <el-input v-model="form.destroy_plan" autocomplete="off" placeholder="请输入销毁方案" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="销毁方式" prop="destroy_type">
                  <el-input v-model="form.destroy_type" autocomplete="off" placeholder="请输入销毁方式" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="归档模式" prop="archive_mode">
                  <el-input v-model="form.archive_mode" autocomplete="off" placeholder="请输入归档模式" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="归档方案" prop="archive_plan">
                  <el-input v-model="form.archive_plan" autocomplete="off" placeholder="请输入归档方案" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="归档方式" prop="archive_type">
                  <el-input v-model="form.archive_type" autocomplete="off" placeholder="请输入归档方式" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item name="7">
                <template slot="title">
                  <i :class="['el-icon-caret-right mr-15', getExist('7') ? 'arrow' : 'arrow1']"></i>
                  <h5 ref="a7">安全属性</h5>
                </template>
                <el-form-item label="uuu999" prop="uuu999">
                  <el-input v-model="form.uuu999" autocomplete="off" placeholder="请输入uuu999" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="敏感标签" prop="sensitive_labels">
                  <el-input v-model="form.sensitive_labels" autocomplete="off" placeholder="请输入敏感标签" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
                <el-form-item label="敏感等级" prop="sensitive_level">
                  <el-input v-model="form.sensitive_level" autocomplete="off" placeholder="请输入敏感等级" v-if="!disbled"></el-input>
                  <span v-else class="label"></span>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
      <h5 class="mb-10">其他信息</h5>
      <el-row>
        <el-col :span="16">
          <el-row>
            <el-col :span="12" v-if="!disbled">
              <el-form-item label="生效时间" prop="entryTime" label-width="93px">
                <el-radio-group v-model="form.entryTime" style="width: 150px">
                  <el-radio label="1">永久</el-radio>
                  <el-radio label="2">自定义</el-radio>
                </el-radio-group>
                
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!disbled">
              <el-form-item label="" prop="date" label-width="0" v-if="form.entryTime === '2'">
                <el-date-picker
                  v-model="form.date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-form-item label="生效时间" prop="entryTime" label-width="93px" v-else>
              <span>2022-01-01 12:12:45 - 2022-01-01 12:12:45</span>
            </el-form-item>
            
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-form-item label="负责人" prop="user" label-width="78px">
            <el-input v-model="form.user" autocomplete="off" placeholder="请输入负责人" v-if="!disbled"></el-input>
            <span v-else>admin</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.user" type="textarea" autocomplete="off" placeholder="请输入描述" rows="4" v-if="!disbled"></el-input>
        <span v-else></span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="save">保存并发布</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { scroll } from '@/libs/dom'
export default {
  name: 'DataStandardEdit',
  props: {
    title: {
      type: String,
      default: '编辑标准'
    },
    viewType: {
      type: String,
      default: 'edit'
    },
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
    disbled() {
      return this.viewType === 'view'
    }
  },
  data() {
    return {
      top: 0,
      activeAttr: '1',
      dialogFormVisible: true,
      form: {
        code: '',
        name: '',
        En_name: '',
        type: '',
        theme: '',
        metadata: '',
        uu: '',
        di: '',
        uuu: '',
        rule: '',
        confidence: '',
        isMainData: true,
        dicc: '',
        destroy_plan: '',
        destroy_type: '',
        archive_mode: '',
        archive_plan: '',
        archive_type: '',
        uuu999: '',
        sensitive_labels: '',
        sensitive_level: '',
        entryTime: '1',
        user: '',
        date: ''
      },
      formLabelWidth: '110px',
      rules: {
        code: [
          { required: true, message: '请输入标准编码', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入标准名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        entryTime: [
          { required: true, message: '请选择生效时间', trigger: 'change' }
        ],
        user: [
          { required: true, message: '请输入负责人', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
      },
      activeName: ['1', '2', '3', '4', '5', '6', '7'],
      attrList: [
        {
          label: '业务属性',
          value: '1',
        },
        {
          label: '技术属性',
          value: '2',
        },
        {
          label: '管理属性',
          value: '3',
        },
        {
          label: '质量属性',
          value: '4',
        },
        {
          label: '主数据属性',
          value: '5',
        },
        {
          label: '生命周期属性',
          value: '6',
        },
        {
          label: '安全属性',
          value: '7',
        },
      ],
      isClick: false,
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    save() {
      this.$emit('save')
    },
    selectHandle(item, idex) {
      this.$nextTick(_ => {
        this.isClick = true
        const oldOffsetTop = this.$refs[`a${this.activeAttr}`].offsetTop
        const offsetTop = this.$refs[`a${item.value}`].offsetTop
        this.activeAttr = item.value
        this.top = idex * 30
        scroll(this.$refs.rightWrapper, oldOffsetTop, offsetTop, 50, () => {
          this.isClick = false
        })
      })
    },
    // 获取每个ref得offsetTop
    getOffsetTop() {
      const offsetTopList = []
      this.attrList.forEach(item => {
        offsetTopList.push(this.$refs[`a${item.value}`].offsetTop)
      })
      return offsetTopList
    },
    scrollHandle(e) {
      if (this.isClick) return
      this.$nextTick(_ => {
        console.log(this.getOffsetTop())
        const offsetTopList = this.getOffsetTop()
        const scrollTop = e.target.scrollTop
        offsetTopList.forEach((item, index) => {
          if (scrollTop >= item) {
            this.activeAttr = index + 1
            this.top = index * 30
          }
        })
      })
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .form-standard-data {
  h6 {
    font-weight: 400;
    color: rgba($color: #000000, $alpha: 0.85);
  }
  .attr-info {
    display: flex;
    height: 280px;
    .attr-info-left {
      border-right: 1px solid #e4e7ed;
      width: 135px;
      position: relative;
      .item-wrapper {
        height: 100%;
        overflow-y: auto;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          height: 30px;
          padding: 0 10px;
          cursor: pointer;
          &:hover {
            background-color: #f5f7fa;
            span:last-child {
              display: inline-block;
            }
          }
          span {
            &:first-child {
              color: rgba($color: #000000, $alpha: 0.65);
            }
            &:last-child {
              color: #1890ff;
              display: none;
            }
          }
        }
        
      }
      .line {
        position: absolute;
        right: -1px;
        width: 2px;
        height: 30px;
        background-color: #1890ff;
        transition: top 0.3s linear;
      }
    }
    .attr-info-right {
      flex: 1;
      width: 0;
      &-wrapper {
        height: 100%;
        overflow-y: auto;
        padding: 0px 20px;
        position: relative;
      }
    }
  }
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
  .el-form-item {
    margin-bottom: 13px;
  }
  .arrow {
    transform: rotate(90deg);
    transition: all 0.2s linear;
  }
  .arrow1 {
    transform: rotate(0deg);
    transition: all 0.2s linear;
  }
  .el-date-editor {
    width: 204px;
    padding: 3px 5px;
    .el-range-input {
      width: 35%;
    }
    .el-range__close-icon {
      width: 18px;
    }
    .el-range-separator {
      width: 10%;
      padding: 0;
    }
  }
  .el-radio {
    margin-right: 10px;
  }
  .label {
    color: rgba($color: #000000, $alpha: 0.65);
  }
}
</style>