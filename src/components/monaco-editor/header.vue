<!--
 * @Author: cxm
 * @LastEditors: cxm
 * @Date: 2021-06-18 09:08:34
 * @LastEditTime: 2021-08-06 11:29:02
 * @Description:
-->
<template>
  <div class="editor-header">
    <a href="javascript:;"
       @click="formatHandle">
      <i class="icon el-icon-document"></i>
      格式化
    </a>
    <a href="javascript:;"
       slot="reference"
       v-if="isShowExample">
      <el-popover popper-class="dark-popper"
                  placement="bottom"
                  :trigger="qualityExample ? 'hover': 'click'">
        <div class="hint p-10"
             v-if="example">
          仅需定义维度主键字段的完整 SQL，如：
          <br />
          <pre>
select idcid -- 事实主键字段
from t_dwd_activeurl -- 来源主表
where ds = "${bizdata}" and protocol = "http" -- 事实主键字段逻辑
          </pre>
        </div>
        <div v-else>
          <div class="hint p-10"
               v-if="qualityExample">
            -目标：指定字段聚合数据监测<br />
            -待校验目标表：current_table<br />
            -相关联数据表: related_table<br />
            -校验逻辑：通过id关联current_table、related_table中公共的id,汇总current_table中value的加和，进行固定值对比或者波动监测：<br />
            <pre>
select
  sum(value) as metric
from
  current_table ctb
  left outer join related_table rtb on ctb.id = rtb.id
where
  ds = \{val1};
            </pre>
            <div class="hint-copy"
                 @click="copyHandle">点击复制到剪贴板</div>
          </div>
          <div v-else
               class="hint p-10">
            不支持嵌套查询，如果您选择的来源表为分区表，请选择分区字段，如: <br />ds='${bizdate}'，点击查看系统参数解析说明
          </div>
        </div>
        <span slot="reference">
          <i class="icon el-icon-paperclip"></i>
          参考示例
        </span>
      </el-popover>
    </a>
    <a href="javascript:;"
       @click="verificationHandle"
       v-if="isSqlVerification">
      <i class="icon el-icon-tickets"></i>
      规范性校验
    </a>
    <el-tooltip popper-class="dark-popper"
                effect="dark"
                :content="tipContent"
                placement="top"
                v-if="tipContent">
      <i class="el-icon-info"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'EditorHeader',
  props: {
    tipContent: {
      type: String
      // default: '提示'
    },
    isShowExample: Boolean,
    example: Boolean,
    qualityExample: Boolean,
    isSqlVerification: Boolean
  },
  methods: {
    formatHandle () {
      this.$emit('format')
    },
    verificationHandle () {
      this.$emit('verification')
    },
    copyHandle () {
      this.$emit('copyHint', `select
  sum(value) as metric
from
  current_table ctb
  left outer join related_table rtb on ctb.id = rtb.id
where
  ds = \{val1}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.editor-header {
  height: 36px;
  padding-left: 12px;
  border-bottom: 1px solid $grey7;
  background: $grey7;
  line-height: 36px;
  vertical-align: middle;
  > a {
    display: inline-block;
    margin-right: 30px;
    color: $grey2;
    .icon {
      margin-right: 6px;
      color: $grey4;
    }
  }
}
.hint-copy {
  color: $--color-primary;
  cursor: pointer;
}
pre {
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, Courier,
    monospace;
}
</style>
