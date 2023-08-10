<template>
  <section class="head">
    <div class="head-title font-18">{{title}}</div>
    <div class="head-action">
      <el-button type="primary" icon="el-icon-upload2" class="action-btn" v-if="batchUpdate" @click="batchUpdateHandle">批量导入</el-button>
      <el-button type="primary" :icon="actionIcon" class="action-btn" v-if="btnVisible" @click="actionClick">{{actionText}}</el-button>
      <el-button type="primary" icon="el-icon-refresh-right" class="action-refresh" v-if="refeshBtnVisible" @click="refeshHandle"></el-button>
      <slot></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Head',
  props: {
    title: String,
    actionText: String,
    actionIcon: {
      type: String,
      default: _ => 'el-icon-plus'
    },
    batchUpdate: {
      type: Boolean,
      default: _ => false
    },
    btnVisible: {
      type: Boolean,
      default: _ => true
    },
    refeshBtnVisible: {
      type: Boolean,
      default: _ => true
    }
  },
  data () {
    return {}
  },
  methods: {
    actionClick () {
      this.$emit('action')
    },
    refeshHandle () {
      this.$emit('refesh')
    },
    batchUpdateHandle () {
      this.$emit('batchUpdate')
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, .05);
  margin-bottom: 12px;
  .head-title {
    color: rgba(0, 0, 0, .9);
  }
}

</style>

<style lang="scss">
.head {
  .el-button {
    border-radius: 0;
    background-color: $grey10;
    color: $--color-primary;
    border-color: $--color-primary;
  }
  .action-btn.el-button--primary {
    background-color: $--color-primary;
    border-color: $--color-primary;
    color: $grey10;
    &:hover {
      background-color: rgba($--color-primary, 0.8);
      border-color: rgba($--color-primary, 0.8);
    }
  }
  .action-refresh.el-button--primary {
    padding: 7px 12px;
    &:hover {
      background-color: rgba($--color-primary, 0.1);
      border-color: rgba($--color-primary, 0.7);
      color: $--color-primary;
    }
    &:focus {
      background-color: $grey10;
      border-color: rgba($--color-primary, 0.7);
      color: $--color-primary;
    }
  }
}

</style>
