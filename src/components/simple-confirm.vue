<!--
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-05-28 10:00:03
 * @LastEditTime: 2023-01-31 14:55:32
 * @Description:
-->
<template>
  <el-popover
    v-model="visibleDeletePopover"
    placement="top-end"
    :offset="-20"
    popper-class="simple-confirm"
  >
    <template tag="div" slot="reference">
      <slot>
        <el-button
          v-if="defaultDelete"
          type="text"
          class="simple-confirm-btn"
          title="删除"
          :disabled="disabled"
          icon="font-16 el-icon-delete"
          @click.stop
        />
        <el-switch
          v-else
          :value="s_switchValue"
          :disabled="disabled"
          active-value="on"
          inactive-value="off"
          @click.stop
          @change="changeContent"
        ></el-switch>
      </slot>
    </template>

    <div class="mb-15">
      <i class="warning el-icon-warning"></i>
      <span v-if="defaultDelete"> &nbsp;&nbsp;{{ content }} </span>
      <span v-else> &nbsp;&nbsp;{{ s_switchContent }} </span>
    </div>
    <div class="fr">
      <el-button type="default" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </div>
  </el-popover>
</template>

<script>
export default {
  name: 'SimpleConfirm',
  props: {
    content: {
      type: String,
      default: '确认删除吗？',
    },
    disabled: {
      type: Boolean,
    },
    defaultDelete: {
      type: Boolean,
      default: true,
    },
    switchValue: {
      type: String,
      default: 'off',
    },
    switchContent: {
      type: Object,
      default: () => {
        return {
          on: '打开？',
          off: '关闭？',
        }
      },
    },
  },
  data() {
    return {
      visibleDeletePopover: false,
      s_switchContent: '',
    }
  },
  computed: {
    s_switchValue: {
      get: function () {
        return this.switchValue
      },
      set: function (n) {},
    },
  },
  methods: {
    confirm() {
      this.visibleDeletePopover = false
      this.$emit('confirm', {
        flag: this.s_switchValue == 'off' ? 'on' : 'off',
      })
    },
    cancel() {
      this.visibleDeletePopover = false
      this.$emit('cancel')
    },
    changeContent() {
      if (this.s_switchValue == 'on') {
        this.s_switchContent = this.switchContent.off
      } else {
        this.s_switchContent = this.switchContent.on
      }
    },
  },
}
</script>

<style lang="scss">
.simple-confirm {
  .el-button {
    padding: 4px 7px;
  }
}
</style>
