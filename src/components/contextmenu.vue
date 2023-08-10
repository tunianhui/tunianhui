<template>
  <section ref="contextmenu" class="contextmenu" :style="{width: `${width}px`, ...position}" v-show="visible">
    <div v-for="menu in menus" :key="menu.label" class="contextmenu-item">
      <div class="hr" v-if="menu.hr"></div>
      <template v-else>
        <template v-if="menu.children">
          <el-popover placement="right-start" width="130" popper-class="contextmenu-popper" trigger="hover" :visible-arrow="false" :open-delay="300" @show="popperShow(menu)" @hide="popperHide(menu)" ref="popper">
            <div :class="[
                'contextmenu-item-content',
                {'is-disabled': menu.disabled,
                hover: menu.hoverd}
              ]" slot="reference" @click.stop>
              <i :class="['icon', menu.icon]"></i>
              <span>{{ menu.label }}</span>
              <i class="el-icon-arrow-right"></i>
            </div>
            <ul class="menu">
              <li v-for="item in menu.children" :key="item.label" :class="{'is-disabled': item.disabled}" @click.stop="handleClick(item.command, item.disabled)">
                <i :class="['icon', item.icon]"></i>
                <span>{{ item.label }}</span>
              </li>
            </ul>
          </el-popover>
        </template>
        <div :class="['contextmenu-item-content', {'is-disabled': menu.disabled}]" @click.stop="handleClick(menu.command, menu.disabled)" v-else>
          <i :class="['icon', menu.icon]"></i>
          <span>{{ menu.label }}</span>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import { on, off } from '@/libs/dom'

export default {
  name: 'FlowContextmenu',
  props: {
    // icon: 'iconfont',
    // label: '修改责任人',
    // command: 'command'
    menus: {
      type: Array,
      required: true
    },
    data: {
      type: Object
      // required: true
    },
    node: {
      type: [Object, Element],
      default () {
        return {}
      }
    },
    width: Number,
    offset: {
      type: Array,
      default () {
        return [15, 5]
      }
    },
    // 固定在元素的边上(左右)，为true时不会使用offset的值
    fixedBoundary: Boolean
  },
  data () {
    return {
      visible: false,
      position: {}
    }
  },
  watch: {
    visible (value) {
      if (value) {
        on(document.body, 'click', this.domClick)
      } else {
        off(document.body, 'click', this.domClick)
      }
    }
  },
  methods: {
    domClick (ev) {
      this.hide()
    },
    popperShow (item) {
      this.$set(item, 'hoverd', true)
    },
    popperHide (item) {
      this.$set(item, 'hoverd', false)
    },
    // bbox = {left, top, width, height, x, y}
    // left 和 x 至少要提供其中之一的数据
    // top 和 y 至少要提供其中之一的数据
    async show (event, bbox) {
      if (!this.menus) return
      this.position = {
        left: '-1000px',
        top: '-1000px'
      }

      // 此处的延时用于防止 事件冒泡到 domcument 点击事件时，菜单隐藏
      await this.$sleep(10)
      this.visible = true
      await this.$sleep(20)
      const fullWidth = window.innerWidth,
        fullHeight = window.innerHeight,
        contextmenu = this.$refs.contextmenu,
        menuWidth = contextmenu.offsetWidth,
        menuHeight = contextmenu.offsetHeight,
        { width, height } = bbox,
        left = bbox.left || bbox.x,
        top = bbox.top || bbox.y

      let x = event.clientX,
        y = event.clientY
      if (this.fixedBoundary) {
        x = left + width
        y = top
        if (x + menuWidth > fullWidth) {
          x = left - menuWidth
        }
        if (y + menuHeight > fullHeight) {
          y -= menuHeight - height
        }
      } else {
        const [offsetX, offsetY] = this.offset
        x += x + offsetX + menuWidth > fullWidth ? -offsetX : offsetX
        y +=
          y + offsetY + menuHeight > fullHeight
            ? -offsetY - menuHeight
            : offsetY
      }
      this.position = {
        left: `${x}px`,
        top: `${y}px`
      }
    },
    hide () {
      this.visible = false
    },
    handleClick (command, disabled) {
      this.$refs.popper.forEach(popper => popper && popper.doClose())
      if (disabled) return
      this.$emit('command', { command, node: this.node, data: this.data })
      this.hide()
    }
  }
}
</script>

<style lang="scss">
$bg: $grey10; // #fff
$borderColor: $grey5; // #bfbfbf
$disabledBg: $grey6; // #d9d9d9  |  #ccc
$disabled: $grey3; // #d9d9d9  |  #ccc
$hover: $--color-primary; // #2253D4
$hoverBg: $grey7; // #e8e8e8  |  #dedede
$borderColor: $grey5; // #bfbfbf
$icon: $grey4; // #8c8c8c
$textColor: $grey1; // #000
.contextmenu {
  position: fixed;
  top: 100px;
  left: 400px;
  width: 172px;
  z-index: 9999;
  padding: 6px 0;
  /* border: 1px solid $borderColor; */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: $bg;
  color: $textColor;

  &-item {
    .hr {
      height: 1px;
      width: 100%;
      background-color: $disabledBg;
      margin: 1px 0;
    }
    &-content {
      line-height: 24px;
      padding: 0 30px 0 16px;
      font-size: 12px;
      position: relative;

      &.hover {
        color: $hover;
        cursor: pointer;
      }

      &:hover {
        color: $hover;
        background-color: $hoverBg;
        cursor: pointer;

        .el-icon-arrow-right {
          color: $hover;
        }
      }

      &.is-disabled,
      &.is-disabled:hover {
        cursor: not-allowed;
        background-color: $disabledBg;
        opacity: 0.75;
        color: $disabled;
      }
    }

    .icon {
      color: $icon;
      margin-right: 10px;
      font-size: 14px;
    }

    .el-icon-arrow-right {
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      font-weight: bold;
    }
  }
}
.contextmenu-popper {
  padding: 0;
  border-radius: 0;
  background: $bg;
  color: $textColor;

  &.el-popper[x-placement^='right'] {
    margin-left: 5px;
  }
  &.el-popper[x-placement^='left'] {
    margin-right: 5px;
  }

  .menu {
    padding: 6px 0;
    font-size: 12px;
    li {
      padding: 0 16px;
      line-height: 24px;
      &.is-disabled,
      &.is-disabled:hover {
        cursor: not-allowed;
        background-color: $disabled;
        opacity: 0.75;
      }
      &:hover {
        color: $hover;
        cursor: pointer;
      }

      &.is-active {
        background-color: $hoverBg;
      }
    }
  }
}

</style>
