<template>
  <section class="cell-content">
    <div
      :class="['cell-content-main', {clickable: clickable}]"
      @click.stop="clickHandle"
    >
      <div class="cell-content-main-left">
        <i :class="data.icon"></i>
      </div>
      <div class="cell-content-main-right">
        <p :title="data.code" v-html="data.code"></p>
        <p :title="data.name" class="el-tooltip" v-html="data.name"></p>
      </div>
    </div>
    <div class="cell-content-icon" v-if="data.visibleSql">
      <el-popover
        popper-class="dark-popper"
        placement="right-start"
        width="400"
        trigger="click"
      >
        <div style="height:300px;">
          <MonacoEditor has-bottom-tools readonly :code="data.sql_content" />
        </div>
        <el-tooltip
          slot="reference"
          popper-class="dark-popper"
          effect="dark"
          content="计算逻辑"
          placement="top"
          @click.stop
        >
          <i class="iconfont icon-wangluoxitong"></i>
        </el-tooltip>
      </el-popover>
    </div>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'CellContent',
  props: {
    data: Object,
    clickable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  methods: {
    clickHandle() {
      this.clickable && this.$emit('click', this.data)
    }
  }
}
</script>

<style lang="scss">
.cell-content {
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  .cell-content-main {
    @include clearfix;
    display: flex;
    max-width: calc(100% - 21px);
    align-items: center;
    margin-right: 5px;

    &.clickable {
      .cell-content-main-right {
        &:hover {
          p,
          p span {
            color: lighten($--color-primary, 10%);
          }
        }
      }
    }

    .cell-content-main-left {
      float: left;
      width: 36px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      background: lighten($--color-primary, 20%);
      color: $grey10;
      font-size: 18px;
      margin-right: 10px;
    }
    .cell-content-main-right {
      float: right;
      display: flex;
      flex-direction: column;
      max-width: calc(100% - 46px);

      p {
        @include textEllipsis;
      }
      /*
      &:hover {
        p,
        p span {
          color: lighten($--color-primary, 10%);
        }
      } */
    }
  }
  .cell-content-icon {
    // display: flex;
    font-size: 16px;
  }
}
</style>
