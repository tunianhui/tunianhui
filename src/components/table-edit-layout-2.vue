<template>
  <section class="table-edit-layout-2">
    <div :class="[
        'tel-head',
        type === 'ad-search' || type === 'code-task' ? 'bc-active' : ''
      ]">
      <div class="tel-head-tabs">
        <el-button type="text" v-for="(tab, index) in tabs" :class="[
            'tel-head-tab-item',
            tab.class,
            {'bottom-active': current === index && type === 'code-task'}
          ]" :key="tab.label + index" @click="tabClick(tab, index)">
          <i :class="tab.preicon" v-if="tab.preicon"></i>
          {{ tab.label }}
          <i :class="tab.icon" v-if="tab.icon"></i>
        </el-button>
      </div>
      <div class="tel-head-btns">
        <template v-for="(btn, index) in buttons">
          <el-button type="text" :class="['tel-head-btns-item', btn.class]" :key="(btn.title || btn.label) + index" @click="btnClick(btn)" :title="btn.title" :icon="btn.icon" :disabled="btn.disabled || false" v-if="!!btn.icon">
            <span class="btn-label" v-if="!!btn.label">{{ btn.label }}</span>
          </el-button>
        </template>
      </div>
    </div>
    <div class="tel-body" ref="telBody">
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TableEditLayout',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    buttons: {
      type: Array,
      default: _ => []
    },
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      current: 0
    }
  },
  methods: {
    tabClick (tab, index) {
      this.current = index
      this.handler(tab)
    },
    btnClick (btn) {
      this.handler(btn)
    },
    handler (params) {
      typeof params.handler === 'function'
        ? params.handler(params)
        : this.$emit('buttonClick', params)
    }
  }
}
</script>

<style lang="scss">
.table-edit-layout-2 {
  height: 100%;
  position: relative;
  overflow: hidden;
  $height: 33px;
  .tel-head {
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    height: $height;
    z-index: 1;
    background: #434959;
    box-shadow: 0 1px 0 0 rgba($grey5, .3);
    &.bc-active {
      background: $sideMenuActive;
      .tel-head-tabs, .tel-head-btns {
        .el-button {
          color: $grey5;
          height: $height;
        }
        .bottom-active {
          box-shadow: inset 0 -2px 0 0 $grey10;
          border-radius: 0;
        }
      }
    }
    @include clearfix;
    .tel-head-tabs {
      // margin: 1px 0;
      padding-left: 10px;
      float: left;
      margin-top: 2px;
      .el-button {
        margin: 0 10px;
      }
    }
    .tel-head-btns {
      padding-right: 10px;
      float: right;
    }
    .tel-head-btns-item {
      .btn-label {
        display: inline-block;
        margin: 2px 10px 0 4px;
        vertical-align: top;
      }
    }
    .el-button {
      color: #c3c7ce;
      margin: 0 5px;
      i {
        font-size: 14px;
        margin-right: 3px;
      }
      &.is-disabled, &.is-disabled:hover {
        color: $grey6;
      }
      &:hover {
        color: #fff;
      }
    }
  }
  .tel-body {
    width: 100%;
    height: 100%;
    padding-top: $height;
    overflow: hidden;
    position: relative;
  }
}

</style>
