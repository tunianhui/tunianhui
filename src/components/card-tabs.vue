<template>
  <section class="card-tabs">
    <div :class="['card-tabs-head', headBorder && 'card-tabs-head-border']">
      <div class="card-tabs-head-left">
        <div class="card-tabs-title">{{title}}</div>
        <ul class="card-tabs-tabs" v-if="tabs && tabs.length">
          <li
            v-for="tab in tabs"
            :key="tab.key"
            :class="value === tab.key && 'is-active'"
            @click="tabClick(tab)"
          >{{tab.label}}</li>
        </ul>
      </div>
      <div class="card-tabs-head-right">
        <slot name="right"></slot>
      </div>
    </div>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'CardTabs',
  props: {
    title: String,
    tabs: Array,
    value: String,
    headBorder: Boolean
  },
  data() {
    return {}
  },
  methods: {
    tabClick(tab) {
      this.$emit('input', tab.key)
      this.$emit('tab-click', tab)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-tabs {
  &-head {
    /* padding-bottom: 6px; */
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    &-border {
      border-bottom: 1px solid $grey6;
    }

    &-left {
      display: flex;

      height: 32px;
      line-height: 32px;
    }
  }

  &-tabs {
    display: flex;
    font-size: 12px;
    margin-left: 15px;
    margin-top: 2px;

    li {
      padding: 0 4px;
      color: $grey3;
      margin-right: 30px;
      position: relative;
      cursor: pointer;

      &::before {
        content: '';
        display: block;
        width: 0;
        height: 2px;
        background: $--color-primary;
        position: absolute;
        bottom: 0;
        left: 50%;
        transition: $transition;
      }

      &.is-active {
        color: $grey1;
        &::before {
          width: 100%;
          left: 0;
        }
      }
    }
  }
}
</style>
