<template>
  <Section class="blood-relation animated fadeInRight">
    <div class="blood-specs flex-layout">
      <div class="filter">
        <span>是否过滤临时表：</span>
        <el-radio-group v-model="whetherFilter" size="mini" class="mr-20">
          <el-radio label="1">是</el-radio>
          <el-radio label="2">否</el-radio>
        </el-radio-group>
        <span class="ml-20 pl-20">直接上游表数：{{0}}</span>
        <span class="ml-20 pl-20">直接下游表数：{{0}}</span>
      </div>
      <div class="legend">
        <span class="field">字段</span>
        <span class="wuli">物理表</span>
        <span class="logic">逻辑表</span>
      </div>
    </div>
    <section class="content">
      <div class="img">
        <img src="@/assets/images/TB1.png" alt />
        <span>暂时没有血缘关系哦</span>
      </div>
    </section>
  </Section>
</template>

<script>
export default {
  name: 'BloodRelation',
  data() {
    return {
      whetherFilter: '1'
    }
  }
}
</script>

<style lang="scss">
.blood-relation {
  .blood-specs {
    justify-content: space-between;
    height: 30px;
    &:first-child {
      padding-left: 20px;
      span {
        font-size: 12px;
      }
    }
    .legend {
      .field,
      .wuli,
      .logic {
        position: relative;
        padding: 0 15px;
        font-size: 12px;
        &::after {
          content: '';
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: $warning;
          position: absolute;
          top: 50%;
          left: 0;
          margin-top: -5px;
        }
      }
      .wuli::after {
        border-radius: 0;
        background: $editorLightSelectionBg;
      }
      .logic::after {
        width: 8px;
        height: 8px;
        border-radius: 3px;
        background: none;
        margin-top: -6px;
        border: 2px solid $warning;
      }
    }
  }
  .content {
    height: 600px;
    .img {
      text-align: center;
      padding-top: 180px;
      span {
        display: block;
        font-size: 12px;
      }
    }
  }
}
</style>
