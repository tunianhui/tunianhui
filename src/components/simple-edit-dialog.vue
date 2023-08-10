<template>
  <el-dialog custom-class="simple-edit-dialog" :title="title" :visible.sync="isVisible" :close-on-click-modal="false" :close-on-press-escape="false" @close="close" append-to-body :width="width" :top="top" v-draggable="{
      trigger: `${flag} .simple-edit-dialog .el-dialog__header`,
      body: `${flag} .simple-edit-dialog.el-dialog`,
      recover: false
    }">
    <div class="sed-body" :style="{'max-height': `${dialogBodyHeight}px`}">
      <slot></slot>
    </div>
    <div slot="footer" class="my-btn" v-if="footer">
      <el-button type="default" @click.stop="close" @keyup.native.stop :disabled="disabled">{{cancelText}}</el-button>
      <el-button type="primary" class="primary" @click.stop="confirm" :disabled="disabled">{{confirmText}}</el-button>
    </div>
    <div slot="footer" v-else>
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>
import { on, off } from '@/libs/dom'

export default {
  name: 'SimpleEditDialog',
  props: {
    visible: Boolean,
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '50%'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    top: {
      type: String,
      default: '10vh'
    },
    parentClass: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    footer: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      isVisible: this.visible,
      dialogBodyHeight: 0,
      dialogOtherHeight: 150
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler (val) {
        this.isVisible = val
      }
    }
  },
  computed: {
    flag () {
      let a = ''
      if (this.parentClass && this.parentClass.indexOf('.') > -1) {
        a = this.parentClass
      } else if (this.parentClass && this.parentClass.indexOf('.') <= -1) {
        a = `.${this.parentClass}`
      } else {
        a = ''
      }
      return a
    }
  },
  mounted () {
    this.setDialogBodyHeight()
    on(window, 'resize', this.setDialogBodyHeight)
  },
  beforeDestory () {
    off(window, 'resize', this.setDialogBodyHeight)
  },
  methods: {
    setDialogBodyHeight () {
      const gap = this.gap ? this.gap : 0
      this.dialogBodyHeight =
        window.innerHeight * 0.85 - this.dialogOtherHeight - gap
    },
    close () {
      // this.isVisible = false
      this.$emit('update:visible', false)
      // this.$message(`取消${this.title}`)
      this.$emit('close')
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss">
.simple-edit-dialog {
  .el-dialog__body {
    padding-bottom: 0;
    border-bottom: 1px solid $grey6;
  }
  .sed-body {
    padding-right: 10px;
    overflow: auto;
  }
}
</style>
