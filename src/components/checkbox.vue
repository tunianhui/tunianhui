<!--
 * @Autor: Gang
 * @LastEditors: YONG
 * @Date: 2020-08-08 21:08:00
 * @LastEditTime: 2022-08-27 15:33:47
 * @Description:
-->
<template>
  <span :class="['checkbox mb-10 mr-10', {'is-checked': value || checked}]"
        @click="clickHandle">
    <span v-if="label">{{ label }}</span>
    <!-- <OverflowTooltip v-if="label">{{ label }}</OverflowTooltip> -->
    <slot v-else></slot>
    <span class="check-icon"
          v-if="value">
      <i class="el-icon-close"
         @click.stop="close"></i>
    </span>
  </span>
</template>

<script>
export default {
  name: 'Checkbox',
  inheritAttrs: false,
  props: {
    value: Boolean,
    label: String,
    checked: Boolean
  },
  data () {
    return {}
  },
  methods: {
    clickHandle () {
      this.$emit('input', true)
      this.$emit('select')
    },
    close () {
      this.$emit('input', false)
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  display: inline-block;
  height: 28px;
  line-height: 26px;
  padding: 0 12px;
  border: 1px solid transparent;
  color: $grey4;
  background: $grey8;
  font-size: 12px;
  cursor: pointer;
  position: relative;
  user-select: none;

  &:hover {
    color: $grey3;
    border-color: transparent;
    background: $grey7;
  }

  .check-icon {
    @include triangle(bottom-right, $--color-primary, 14px);
    position: absolute;
    right: -1px;
    bottom: -1px;
    opacity: 0;
    transition: $transition;
    i {
      font-size: 12px;
      transform: scale(0.6);
      color: $grey10;
      position: absolute;
      left: -10px;
      top: 4px;
    }
  }
  &.is-checked:hover,
  &.is-checked {
    color: $grey2;
    border: 1px solid $--color-primary;
    background-color: $--color-primary-light-9;
    .check-icon {
      opacity: 1;
    }
  }
  & + & {
    margin-right: 10px;
  }
}
</style>
