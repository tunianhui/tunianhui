<template>
  <section class="table-bottom">
    <el-tooltip content="无可选字段" placement="top" :disabled="checkable">
      <el-checkbox v-model="checked" :disabled="!checkable" @change="checkChange">全选</el-checkbox>
    </el-tooltip>
    <SimpleConfirm content="确定要进行批量删除？" @confirm="confirm">
      <el-button type="text" class="ml-20" :disabled="!deleteable">
        <i class="el-icon-delete"></i>&nbsp;&nbsp;批量删除
      </el-button>
    </SimpleConfirm>
    <span class="fr">已选中 {{checkedCount}}</span>
  </section>
</template>

<script>
export default {
  name: 'TableBottom',
  props: {
    table: Object,
    selectAll: Boolean,
    checkedCount: {
      type: Number,
      default: 0
    },
    checkable: {
      type: Boolean,
      default: true
    },
    deleteable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // count: 0
    }
  },
  computed: {
    checked: {
      get() {
        return this.selectAll
      },
      set() {
        return this.selectAll
      }
    }
  },
  methods: {
    checkChange(val) {
      this.$emit('update:selectAll', val)
      this.$emit('selectChange', val)
    },
    confirm() {
      this.$emit('delete')
    }
  }
}
</script>

<style lang="scss">
.table-bottom {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 33px;
  line-height: 33px;
  background: $grey7;
  border-top: 1px solid $grey6;
  padding: 0 20px;
  z-index: 10;
  font-size: 12px;
  .el-button {
    color: $grey3;

    &:hover {
      color: $grey2;
    }
    &.is-disabled,
    &.is-disabled:hover {
      color: $grey5;
    }
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .fr {
    color: $grey3;
  }
}
</style>
