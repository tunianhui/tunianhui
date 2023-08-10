<template>
  <section class="special-table">
    <div class="sort-title">{{title}}</div>
    <ul class="list-ul">
      <li class="flex-layout row" v-for="(item, index) in list" :key="index">
        <span v-if="showCheckedTip">
          <el-popover placement="top" trigger="hover">
            <div>系统生成字段不可删除</div>
            <el-checkbox slot="reference" v-model="item.checked" :disabled="showCheckedTip"></el-checkbox>
          </el-popover>
        </span>
        <span v-if="!showCheckedTip">
          <el-checkbox v-model="item.checked"></el-checkbox>
        </span>
        <div class="code">
          <span class="a-bg">A</span>
          {{item.code}}
        </div>
        <div class="name">{{item.name}}</div>
        <div class="type">{{item.type}}</div>
        <div class="relation">
          <div class="relation-source" v-if="relationDimension">
            <span class="source">{{item.source}}</span>
            <span>{{item.source_name}}</span>
            <el-popover placement="top" trigger="hover">
              <div class="popover-source">
                <div class="popover-source-info">原始维度：</div>
                <div class="popover-source-val">{{item.source}}</div>
                <div class="popover-source-val">{{item.source_name}}</div>
              </div>
              <i class="el-icon-tickets" slot="reference"></i>
            </el-popover>
          </div>
          <el-button size="mini" v-if="showType">{{title}}</el-button>
          <el-button size="mini" v-if="showType">
            <i class="el-icon-edit"></i>
            编辑模型关系
          </el-button>
        </div>
        <div class="jisuan">
          <el-button type="text" size="mini">
            <i class="icon iconfont icon-yewuliu"></i>
          </el-button>
          <el-button type="text" size="mini">
            <i class="el-icon-success"></i>
          </el-button>
        </div>
        <div class="caozuo">
          <el-button type="text" size="mini">
            <i class="el-icon-edit-outline"></i>
          </el-button>
          <el-button type="text" size="mini">
            <i class="el-icon-delete"></i>
          </el-button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'SpecialTable',
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      required: true
    }
  },
  watch: {
    title: function(val) {
      if (val !== '主键' && val !== '系统') {
        this.showType = true
        this.showCheckedTip = false
        val === '关联维度'
          ? (this.relationDimension = true)
          : (this.relationDimension = false)
      } else {
        this.showType = false
        this.showCheckedTip = true
      }
    }
  },
  data() {
    return {
      showCheckedTip: false,
      showType: false,
      relationDimension: false
    }
  },
  computed: {},
  mounted() {
    if (this.title !== '主键' && this.title !== '系统') {
      this.showType = true
      this.showCheckedTip = false
      this.title === '关联维度'
        ? (this.relationDimension = true)
        : (this.relationDimension = false)
    } else {
      this.showType = false
      this.showCheckedTip = true
    }
  },
  methods: {}
}
</script>

<style lang='scss'>
// .flex-layout{}
.special-table {
  .sort-title {
    font-size: 12px;
    display: block;
    margin-top: 10px;
    margin-bottom: 5px;
    color: $grey4;
  }
  .row {
    position: relative;
    width: 100%;
    height: 62px;
    align-items: center;
    &:not(:last-child):after {
      position: absolute;
      bottom: 0;
      left: 0px;
      width: 100%;
      height: 1px;
      background: $grey7;
      content: '';
    }
    .a-bg {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 25px;
      border-radius: 50%;
      background: #68b6b0;
      color: $grey10;
      font-size: 20px;
      text-align: center;
      font-weight: 500;
      margin-right: 10px;
      vertical-align: middle;
    }
    .relation-source {
      font-size: 12px;
      margin-bottom: 3px;
      span {
        margin-right: 10px;
      }
      .popover-source-info {
        color: $grey7;
      }
    }
  }
}
</style>
