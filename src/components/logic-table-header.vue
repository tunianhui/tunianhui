<template>
  <section class="logic-table-header">
    <div class="logic-table-header-left" :style="{background: data.color}">
      <i :class="['icon iconfont', data.icon]"></i>
      <p>{{data.title}}</p>
    </div>
    <div class="logic-table-header-right">
      <p>
        {{data.code}}
        <el-tooltip content="表计算逻辑" placement="top" v-if="data.visibleSql">
          <!-- @click="visible" -->
          <i class="icon iconfont icon-yewuliu"></i>
        </el-tooltip>
      </p>
      <p>{{data.name}}</p>
      <ul class="clearfix" v-if="data.list && data.list.length">
        <li v-for="item in data.list" :key="item.label">
          <span class="label">{{item.label}}：</span>
          <span class="value">{{item.value}}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'LogicTableHeader',
  props: {
    data: Object
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.logic-table-header {
  $size: 80px;
  display: flex;
  height: $size;
  font-size: 12px;
  .logic-table-header-left {
    width: $size;
    color: $grey8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .iconfont {
      line-height: 30px;
      font-size: 28px;
    }
  }
  .logic-table-header-right {
    flex: 1;
    background: $grey10;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
      &:first-child {
        margin-bottom: 5px;
        font-size: 16px;
        i {
          font-size: 14px;
          margin-right: 10px;
          cursor: pointer;
        }
      }
    }
    ul {
      margin-top: 8px;
      li {
        margin-right: 30px;
        float: left;
        span {
          font-size: 12px;
        }
        .label {
          color: $grey4;
        }
      }
    }
  }
}
</style>
