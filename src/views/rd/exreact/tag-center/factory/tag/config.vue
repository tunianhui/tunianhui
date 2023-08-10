<template>
  <TableEditLayout :tabs="tabs" :buttons="btns" v-loading="!!loading">
    <div class="tag-config">
      <div class="tag-config-wrapper">
        <div class="tag-config-wrapper-left">
          <div>
            <div class="information-overview">
              <div class="left-information">
                <div class="label-info-item">
                  标签名称：<span>{{data.label_name}}</span>
                </div>
                <div class="label-info-item">
                  标签类目：<span>{{data.category_name}}</span>
                </div>
                <div class="label-info-item">
                  公开状态：<span>{{ getDicsValue('status_tag', data.status) || '测试' }}</span>
                </div>
                <div class="label-info-item">
                  标签输出表：<OverflowTooltip style="width: calc(100% - 80px)">{{data.label_table}}</OverflowTooltip>
                </div>
              </div>
              <div class="right-edit-icon">
                <!-- <i class="el-icon-edit-outline" @click.stop="labelBasicEdit"></i> -->
              </div>
            </div>
            <div class="label-btns my-btn">
              <el-button type="primary" icon="el-icon-view" @click="previewConfig">标签配置预览</el-button>
              <el-button type="primary" icon="el-icon-tickets">标签报告</el-button>
            </div>
            <div class="large-steps-position">
              <div class="positioning-icon">
                Step1 <i class="el-icon-location-outline"></i>
              </div>
              <div class="">
                <div></div>
              </div>
              <div class="positioning-icon ml-5">
                Step2 <i class="el-icon-location-outline"></i>
              </div>
            </div>
          </div>
          <div class="tag-config-left-main">
            <StepConfig
              :data="stepCard"
              class="mb-10"
              @editHandle="editHandle"
              @add="addConfig"
              :isConfiguring="isConfiguring"
              ref="stepConfig"
              @refresh="_queryLabelConfigurationPreview()"
            ></StepConfig>
          </div>
        </div>
        <ConfigRight
          v-if="isConfiguring&&step==='step1'"
          @cancel="cancelConfig"
          :data="data"
          @confirm="confirmConfig"
          :isAddOrEdit="isAddOrEdit"
          :currentData="currentData"
          ></ConfigRight>
        <ConfigStep2
          v-if="isConfiguring&&step==='step2'"
          :data="stepCard"
          :data1="data"
          @confirm="confirmConfig"
          @cancel="cancelConfig"></ConfigStep2>
        <PreviewConfig v-if="isConfiguring&&step==='preview'" :data="data" @confirm="confirmConfig"></PreviewConfig>
        <div class="tag-config-wrapper-right" v-if="!isConfiguring&&step!=='step1'&&step!=='step2'&&step!=='preview'">
          <div style="text-align:center">
            <img :src="require('@/assets/images/rd/exreact/no-config.gif')" alt="" style="margin:100px 0 15px">
            <p v-if="stepCard.step1 !== undefined && stepCard.step1.length === 0 && !complete">请开始配置</p>
            <p v-if="stepCard.step1 !== undefined && stepCard.step1.length !== 0 && !complete">
              您可以新增或修改 Step 1 的配置项，也可以直接进行 Step 2 的配置
            </p>
            <div v-if="stepCard.step1 !== undefined && stepCard.step1.length !== 0 && complete" style="color:rgba(0,0,0,0.6)">
              <h4>恭喜您完成配置！</h4>
              <p>已为您保存标签配置，提交前建议您先进行测试运行获取标签报告，以预览标签值分布及标签结果表数据抽样</p>
              <p>如无需测试运行，您也可以直接提交，直接提交需要通过标签补数据以生成标签结果表数据</p>
              <div class="mt-10">
                <el-button type="primary" @click.stop="submitHandle">快捷提交</el-button>
                <el-button type="primary">快捷测试运行</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SideModal
      :visible.sync="sideModelOption.visible"
      :title="sideModelOption.title"
      @confirm="sideModelOption.confirm"
    >
      <component
        ref="sideComponent"
        :is="sideModelOption.component"
        :data="sideModelOption"
      ></component>
    </SideModal>
  </TableEditLayout>
</template>

<script>
import TableEditLayout from '@c/table-edit-layout'
// import TagInfo from './tag-info'
import LabelBasicEdit from './label-basic-edit'
import SideModal from '@c/side-modal'
import PhysicalConfig from './physical-config'
import TagVersion from './tag-version'
import {loop} from '@/libs/util'
import StepConfig from './step-config'
import ConfigRight from './config-right'
import ConfigStep2 from './config-right-step2'
import PreviewConfig from './preview'
import { mapGetters } from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'
// import mixin from './mixin'
import {
  queryLabelConfigurationPreview,
  publish
} from '@/api/rd/exreact/tag-center'

export default {
  name: 'TagConfig',
  props: {
    data: Object
  },
  // mixins: [mixin],
  computed: {
    ...mapGetters(['project'])
  },
  inject: ['attrStore'],
  components: {
    TableEditLayout,
    StepConfig,
    ConfigRight,
    ConfigStep2,
    OverflowTooltip,
    PreviewConfig,
    SideModal
  },
  data() {
    return {
      loading: 0,
      tabs: [
        {
          label: '标签信息',
          title: '标签信息',
          handler: this.tabClick,
          confirm: this.tableConfirm,
          component: LabelBasicEdit,
          // key: 'ops',
          data: this.data
        },
        {
          label: '物理化配置',
          title: '物理化配置',
          handler: this.tabClick,
          confirm: this.physicalConfirm,
          component: PhysicalConfig,
          data: {
            cycle_day: 30
          }
        },
        {
          label: '标签版本',
          title: '标签版本',
          handler: this.tabClick,
          confirm: this.versionConfirm,
          component: TagVersion,
          data: {}
        }
      ],
      btns: [
        {
          icon: 'icon iconfont icon-fabu',
          handler: this.submitHandle,
          disabled: false,
          title: '提交'
        },
        {
          icon: 'icon iconfont icon-iconfontzhizuobiaozhun023117',
          handler: this.locationHandle,
          disabled: false,
          title: '定位'
        }
      ],
      sideModelOption: {
        title: '',
        visible: false,
        component: null,
        confirm: loop
      },
      stepCard: {},
      isConfiguring: false,
      handlerType: '',
      isAddOrEdit: null,
      currentData: {},
      step: '',
      complete: false
    }
  },
  created() {
    this.$nextTick(_ => {
      // console.log(this.data)
    })
  },
  mounted() {
    this._queryLabelConfigurationPreview()
  },
  methods: {
    async tabClick(tab) {
      if (tab.title === this.sideModelOption.title) {
        this.sideModelOption.visible = !this.sideModelOption.visible
        return
      }

      if (this.sideModelOption.visible) {
        this.sideModelOption.visible = false
        await this.$sleep(200)
      }

      if (tab.title === '物理化配置') {
        await this.getPhysicalData()
      }
      // this.sideModelOption.visible = true
      Object.assign(this.sideModelOption, tab, {visible: true})
    },
    async getPhysicalData() {},
    async submitHandle() {
      if (this.btns[0].disabled === true) return
      this.globalLoading()
      this.btns[0].disabled = true
      const res = await this.$simpleAsyncTo(publish({id: this.data.id}), '提交失败')
      if (res) {
        this.$message({
          type: res.flag ? 'success' : 'error',
          message: res.msg
        })
      }
      this.btns[0].disabled = false
      this.globalLoading().close()
    },
    locationHandle() {},
    // side--step1来源列表
    async _queryLabelConfigurationPreview() {
      const params = {
        label_id: this.data.id
      }
      const res = await this.$simpleAsyncTo(queryLabelConfigurationPreview(params), '获取数据失败')
      if (res) {
        this.stepCard = res.data
      }
    },
    editHandle(data, handlerType, step) {
      this.currentData = data
      this.isConfiguring = true
      this.step = step
      this.handlerType = 'edit'
      this.isAddOrEdit = 'edit'
    },
    addConfig(handlerType, step) {
      this.currentData = {}
      this.isConfiguring = true
      this.step = step
      this.handlerType = 'add'
      this.isAddOrEdit = 'add'
    },
    cancelConfig(data) {
      this.isConfiguring = false
      this.step = ''
      if (!data) {
        this.$refs.stepConfig.cancelConfig(this.handlerType)
      }
    },
    confirmConfig(data) {
      this._queryLabelConfigurationPreview()
      this.isConfiguring = false
      this.step = ''
      if (data !== 'preview') {
        this.$refs.stepConfig.cancelConfig(this.handlerType)
        if (data === '2') {
          this.complete = true
        }
        if (data === '1') {
          this.complete = false
        }
      }
    },
    previewConfig() {
      this.isConfiguring = true
      this.step = 'preview'
    },
    labelBasicEdit() {
      const attr = {
        title: '标签编辑',
        attrType: 'labelBasic',
        name: this.data.id + '',
        label: '标签编辑',
        data: this.data,
        width: '650px',
        hideTitle: true,
        style: {
          padding: 0
        }
      }
      this.attrStore.commit('add', attr)
    },
    tableConfirm() {
      this.sideModelOption.visible = false
    },
    physicalConfirm() {},
    versionConfirm() {}
  }
}
</script>

<style lang="scss">
.tag-config {
  overflow: overlay;
  height: 100%;
  background-color: #EBEAEF;
  font-size: 12px;

  $header-bg: #4c5671;
  $color: hsla(0,0%,100%,.7);

  .tag-config-wrapper {
    display: flex;
    overflow: overlay;
    height: 100%;
    padding: 10px 10px 0;
    &-left {
      display: flex;
      flex-direction: column;
      width: 338px;
      padding: 12px;
      margin-right: 10px;
      background: $grey10;
      .information-overview {
        display: flex;
        align-items: flex-start;
        padding: 10px 15px;
        background: $header-bg;
        .left-information {
          .label-info-item {
            color: $color;
            height: 20px;
            line-height: 20px;
          }
        }
        .right-edit-icon {
          margin: 0 0 auto auto;
          i {
            font-size: 20px;
            color: $color;
            cursor: pointer;
          }
        }
      }
      .label-btns {
        display: flex;
        align-items: center;
        height: 40px;
        .el-button {
          flex: 1;
        }
      }
      .large-steps-position {
        display: flex;
        align-items: center;
        color: rgba(0,0,0,.9);
        padding: 4px 0 6px;
        border-bottom: 1px solid rgba(0,0,0,.1);
        margin-bottom: 10px;
        .positioning-icon {
          margin-right: 7px;
        }
        >div:nth-child(2) {
          width: 80px;
          height: 20px;
          display: flex;
          align-items: center;
          >div {
            margin: 0 8px;
            border-bottom: 2px dotted $grey7;
            position: relative;
            top: 0px;
            flex: 1;
            &:before {
              content: '';
              position: absolute;
              right: -4.5px;
              bottom: -4px;
              width: 4px;
              height: 4px;
              background-color: $grey10;
              border: 1.5px solid $grey7;
              border-radius: 50%;
            }
          }
        }
      }
    }
  }
  .el-button {
    border-radius: 0;
    &--info {
      background: #cbcdd7;
      border-color: #cbcdd7;
    }
  }

  .step-btn {
    display: flex;
    margin: 10px 0;

    .el-button {
      flex: 1;
    }
  }

  .config-steps {
    display: flex;
    padding-bottom: 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid $grey8;
    .config-step {
      span {
        color: $grey1;
        font-size: 14px;
      }
      i {
        color: $grey6;
        margin-left: 5px;
      }

      &-line {
        width: 80px;
        height: 0;
        border-top: 2px dotted $grey7;
        margin: 0 6px;
        position: relative;
        top: 10px;

        &:after {
          content: '';
          position: absolute;
          right: 0px;
          top: -4px;
          width: 4px;
          height: 4px;
          border: 1.5px solid $grey7;
          background: $grey10;
          border-radius: 50%;
        }
      }
    }
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-top: -50px;
    img {
      width: 150px;
    }
    p {
      font-size: 12px;
      text-align: center;
      margin-top: 15px;
      color: $grey3;
    }
  }

  .config-setting {
    font-size: 12px;
    height: 100%;
    &-steps {
      padding: 10px 0 15px;
      background: $grey10;
      border-bottom: 1px solid $grey6;
      &-wrapper {
        width: 75%;
        margin: 0 auto;
        display: flex;
      }
    }
    &-step-item {
      display: flex;
      font-size: 12px;
      position: relative;

      &.is-active {
        i {
          color: $--color-primary;
        }

        &:before {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -16px;
          margin-left: -5px;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-bottom: 7px solid $grey6;
        }
        &:after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -17px;
          margin-left: -4px;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 6px solid $grey8;
        }
      }
      &.is-finished {
        i {
          color: $success;
        }
      }

      p {
        &:first-child {
          font-size: 13px;
        }
        &:last-child {
          margin-top: 5px;
          font-size: 12px;
        }
      }

      i {
        position: relative;
        top: 2px;
        margin-right: 6px;
        font-size: 16px;
        color: $grey5;
      }
    }
    &-step-line {
      flex: 1;
      position: relative;
      margin: 0 6px;
      top: 8px;
      border-top: 1.5px dashed $grey5;
    }

    &-main {
      padding: 20px;
      height: calc(100% - 112px);
      overflow: auto;
    }

    .config-title {
      font-size: 13px;
      line-height: 24px;
    }

    .label {
      color: $grey4;
    }

    .config-tab {
      color: $grey3;
      border-bottom: 1.5px solid $--color-primary-light-1;
    }

    .tips {
      display: flex;
      padding: 10px;
      background-color: $--color-primary-light-9;
      color: $grey3;

      &-icon {
        padding: 0 15px;
        border-right: 1px solid $grey6;
        text-align: center;

        .iconfont {
          color: $--color-primary;
        }
      }

      &-content {
        padding: 0 10px;
      }
    }

    .config-box {
      padding: 10px 15px;
      background-color: $grey10;

      &-item {
        display: flex;
        margin-bottom: 10px;

        &-prefix {
          display: flex;
          flex-direction: column;
          margin-right: 6px;
          position: relative;
          top: 6px;
          // border-left: 1.5px solid $grey6;
        }
        &-icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          line-height: 13px;
          color: $grey10;
          text-align: center;
          background-color: $--color-primary;
        }
        &-line {
          border-left: 1.5px dashed $grey6;
          position: relative;
          flex: 1;
          margin-left: 6px;

          &:before {
            content: '';
            position: absolute;
            width: 4px;
            height: 4px;
            border: 2px solid $grey6;
            border-radius: 50%;
            background: $grey10;
            left: -5px;
            bottom: 0;
          }
        }
        &-form {
          flex: 1;
          padding-bottom: 15px;
        }
        &-content {
          margin-top: 6px;
        }
      }
    }

    .weight-box {
      display: flex;
      justify-content: space-between;

      .weight-right {
        display: flex;
        align-items: center;
        text-align: center;
        margin-left: 20px;
        .strong {
          font-size: 30px;
        }
        .bar {
          width: 100%;
          height: 4px;
          background: $--color-primary-light-1;
        }
      }

      .weight-list {
        flex: 1;
        .weight-item {
          display: flex;
          align-items: center;
          margin-bottom: 3px;

          &-left {
            width: 145px;
          }

          .el-input__inner {
            padding: 0 10px;
          }

          .process {
            position: relative;
            // width: 320px;
            height: 14px;
            background: $--color-primary-light-9;
            overflow: hidden;

            &-bar {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              background: $--color-primary-light-1;
            }
          }
        }
      }
    }

    .timecurve {
      width: 140px;
      outline: 1px solid transparent;
      cursor: pointer;
      margin-left: 15px;

      &.is-active {
        outline-color: $--color-primary;
      }

      &-icon {
        font-size: 45px;
        background: $--color-primary-light-1;
        text-align: center;
        .iconfont {
          color: $grey10;
        }
      }

      &-content {
        background: $grey8;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        &-wrap {
        }
      }
    }

    .attr-preview {
      background: $grey8;
      padding: 15px;
      &-bar {
        width: 100%;
        height: 300px;
      }
      &-list {
        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
      &-title {
        span {
          cursor: pointer;
        }
      }
    }

    &-foot {
      padding: 10px;
      background: $grey10;
      text-align: right;
    }
  }
  .action-objects-filter-group {
    .group-content {
      >div {
        border: 1px solid transparent;
        &.act-color {
          border-color: $myError;
        }
      }
      display: inline-flex;
      .group-item {
        p {
          line-height: 20px;
        }
        .bus {
          color: rgba($color: #000000, $alpha: .6);
        }
      }
    }
  }
  .define-label-value {
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    .tab-num {

    }
  }
}
.edit-tag {
  &.el-drawer.rtl {
    right: 30px;
    top: 80px;
    height: calc(100% - 80px);
  }
}
.bus-select {
  .el-input__inner {
    border-radius: 0;

  }
  &.active {
    .el-input__inner {
      border-color: #F15533;
    }
  }
}
.bus-select-option {
  margin-top: 0!important;
  margin-bottom: 0!important;
  border-radius: 0!important;
  &[x-placement^=bottom] .popper__arrow::after {
    border-width: 0!important;
  }
  &[x-placement^=top] .popper__arrow::after {
    border-width: 0!important;
  }
  &[x-placement^=bottom] .popper__arrow {
    border-bottom-color: transparent!important;
  }
  &[x-placement^=top] .popper__arrow {
    border-top-color: transparent!important;
  }
}
</style>
