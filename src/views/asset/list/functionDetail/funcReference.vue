<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-11-25 10:24:49
 * @LastEditTime: 2023-01-10 10:10:56
 * @Description:
-->
<template>
  <div class="func-reference">
    <h4></h4>
    <AssetSetailTitle title="引用方式"></AssetSetailTitle>
    <el-row>
      <el-col :span="12">
        <div class="item-type">
          <label>类名称：</label>
          <div class="value">{{asset_basic_data.class_main}}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="item-type">
          <label>资源：</label>
          <div class="value">{{asset_basic_data.func_name}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="item-type">
          <label>函数类型：</label>
          <div class="value">{{asset_basic_data.classify_name}}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="item-type">
          <label>命令格式：</label>
          <div class="value">{{asset_basic_data.func_format}}</div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="item-type">
          <label>引用路径：</label>
          <div class="value">{{asset_basic_data.project_name}}：{{asset_basic_data.func_format}}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="item-type">
          <label>使用说明：</label>
          <div class="value">{{asset_basic_data.help_text}}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AssetSetailTitle from '../component/title.vue'
export default {
  name: 'func-refer',
  props: {
    asset_basic_data: {
      type: Object,
      default: () => { }
    }
  },
  components: {
    AssetSetailTitle
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.func-reference {
  .item-type {
    display: flex;
    align-items: center;
    font-size: 14px;
    margin: 8px 0;
    label {
      color: #76797d;
    }
    .value {
      flex: 1;
      color: #121314;
      width: 0;
      word-break: break-all;
    }
  }
}
</style>
