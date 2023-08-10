<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-08-11 14:16:44
 * @LastEditTime: 2023-03-17 16:29:21
 * @Description:
-->
<template>
  <section class="table-cell">
    <div class="mr-5"
         v-if="icon !== ''">
      <i :class="logicTypeMapIcon[tableType]"
         v-if="!icon"></i>
      <i :class="icon"
         v-else></i>
    </div>
    <div style="width: calc(100% - 30px)">
      <div class="title">
        <i v-if="status"
           :class="status === '成功' ? 'iconfont icon-yikaiqi': status === '发布中' ? 'iconfont icon-weikaiqi' : 'el-icon-error font-14'"></i>
        <OverflowTooltip :style="{width: status ? 'calc(100% - 25px)': 'calc(100% - 1px)'}">{{title}}</OverflowTooltip>
      </div>
      <div>
        <OverflowTooltip style="width:calc(100% - 1px)">{{subTitle}}</OverflowTooltip>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TableCell',
  props: {
    title: String,
    subTitle: String,
    tableType: String,
    icon: String,
    status: String
  },
  data () {
    return {
      logicTypeMapIcon: {
        // 维度逻辑表
        16: 'iconfont icon-weiduluojibiao',
        // 事实逻辑表
        17: 'iconfont icon-shishiluojibiao1',
        // 汇总逻辑表
        18: 'iconfont icon-huizongluojibiao1',
        // 物理表
        100: 'iconfont icon-code-wulibiao'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-cell {
  display: flex;
  align-items: center;
  > div:first-child {
    font-size: 30px;
    color: $user2;
  }
  .title {
    i {
      margin-right: 5px;
    }
  }
  .icon-yikaiqi {
    color: $success;
  }
  .icon-weikaiqi {
    color: $warning;
  }
  .el-icon-error {
    color: $error;
  }
}
</style>
