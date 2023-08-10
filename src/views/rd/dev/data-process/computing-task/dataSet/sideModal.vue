<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2023-05-09 14:51:40
 * @LastEditTime: 2023-05-16 17:35:48
 * @Description:
-->
<template>
  <section :class="['side-modal', {'is-visible': visible}]">
    <h4>
      <span>{{title}}</span>
      <i class="el-icon-close" @click="close"></i>
    </h4>
    <div class="side-modal-main">
      <div class="side-modal-body">
        <slot></slot>
      </div>
      <div class="side-modal-footer my-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" class="primary" @click="confirm">确定</el-button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'SideModal',
  props: {
    title: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    },
    type: String
  },
  data () {
    return {}
  },
  mounted () {
    // this.$el.parentNode.style.position
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    cancel () {
      this.$emit('cancel')
      this.close()
    },
    confirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style lang="scss" scoped>
$width: 600px;
.side-modal {
  position: absolute;
  width: 0;
  height: 100%;
  right: -$width;
  top: 0;
  transition: $transition;
  overflow: hidden;
  border-left: 1px solid $grey7;
  box-shadow: -1px 0 0 0 rgba($grey7, 0.2);
  background: $grey8;
  z-index: 10;
  overflow-y: hidden;
  overflow-x: auto;

  &.is-visible {
    // width: 60%;
    min-width: $width;
    right: 0;
  }

  > h4 {
    padding: 15px 0 15px 15px;
    font-size: 16px;
    color: $grey3;
    border-bottom: 1px solid $grey7;
    i {
      float: right;
      font-size: 16px;
      color: $grey5;
      cursor: pointer;
      margin-right: 15px;

      &:hover {
        color: $grey3;
      }
    }
  }
  .side-modal-main {
    height: calc(100% - 52px);
    overflow: auto;
  }
  .side-modal-body {
    padding: 15px;
    height: calc(100% - 52px);
    overflow: auto;
  }
  .side-modal-footer {
    margin: 10px 15px;
    float: right;
  }
}
</style>
