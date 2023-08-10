<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-10 13:59:22
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-11 10:47:35
 * @FilePath: \数据智能构建\src\views\asset\standard-new\assess\rule\filter-config.vue
-->
<template>
  <div class="filter-config">
    <div class="complex-filter-operator no-parent">
      <div class="complex-filter-operator-top-line" style="top:20px"></div>
      <div class="complex-filter-operator-bottom-line"></div>
      
      <div class="complex-filter-operator-type" ref="operatorType">
        <div class="complex-filter-operator-center-line"></div>
        <div class="complex-filter-operator-type-value">
          <el-select style="width: 60px" class="etl-filter-select" v-model="filter.logicalOperator" :disabled="disabled">
            <el-option value="AND" label="且"></el-option>
            <el-option value="OR" label="或"></el-option>
          </el-select>
        </div>
      </div>
      <div class="complex-filter-operator-child" ref="complexFilterOperatorChild">
        <template v-for="(item, index) in filter.trees">
          <div :key="item.uuid" class="complex-filter-atom">
            <el-select v-model="item.fieldId" placeholder="请选择" style="width:100%" class="mr-10" :disabled="disabled">
              <el-option label="字段1" value="1"></el-option>
              <el-option label="字段2" value="2"></el-option>
            </el-select>
            <el-select v-model="item.oper" placeholder="请选择" style="width:100%" class="mr-10" :disabled="disabled">
              <el-option label="等于" value="="></el-option>
              <el-option label="不等于" value="!="></el-option>
              <el-option label="属于" value="1"></el-option>
              <el-option label="不属于" value="2"></el-option>
              <el-option label="包含" value="3"></el-option>
              <el-option label="不包含" value="4"></el-option>
            </el-select>
            <el-input v-model="item.value" class="mr-10" placeholder="请输入刷选条件" :disabled="disabled"></el-input>
            <el-button type="text" class="mr-5" @click="delRule(index)" :disabled="disabled">
              <i class="el-icon-delete"></i>
            </el-button>
          </div>
        </template>
        <div class="complex-filter-atom">
          <el-button type="primary" class="mr-5" @click="addRule" :disabled="disabled">添加规则</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { uuid } from '@/libs/util'
export default {
  name: 'FilterConfig',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      logicalOperator: 'AND',
      filter: {
        logicalOperator: 'AND',
        trees: [
          {
            fieldId: '1',
            oper: '=',
            value: '123',
            uuid: uuid(16),
          },
          {
            fieldId: '2',
            oper: '=',
            value: '123',
            uuid: uuid(16),
          },
          {
            fieldId: '2',
            oper: '=',
            value: '123',
            uuid: uuid(16),
          },
        ]
      }
    }
  },
  methods: {
    addRule() {
      this.filter.trees.push({
        fieldId: '',
        type: '',
        value: '',
        uuid: uuid(16),
      })
    },
    delRule(index) {
      this.filter.trees.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-config {
  width: 60%;
  max-height: 280px;
  overflow: overlay;
  .complex-filter-operator {
    display: flex;
    position: relative;
    justify-content: flex-start;
    align-items: center;
    &::before {
      content: "";
      display: block;
      height: 1px;
      width: 43px;
      position: absolute;
      top: 50%;
      right: 100%;
      background: #ccc;
    }
    &.no-parent::before {
      width: 0;
    }
    .complex-filter-operator-top-line, .complex-filter-operator-bottom-line {
      display: block;
      width: 1px;
      position: absolute;
      left: 24px;
    }
    .complex-filter-operator-top-line {
      top: 0;
      bottom: 50%;
      background: #ccc;
      left: 92px;
    }
    .complex-filter-operator-bottom-line {
      top: 50%;
      bottom: 20px;
      background: linear-gradient(0deg, #ccc, #ccc 4px, transparent 0, transparent 6px);
      // background: #ccc;
      background-size: 100% 6px;
      left: 92px;
    }
    
    .complex-filter-operator-type {
      position: relative;
      .complex-filter-operator-center-line {
        width: 33px;
        position: absolute;
        background: #ccc;
        height: 1px;
        right: -33px;
        top: 50%;
      }
    }
    .complex-filter-operator-child {
      margin-left: 55px;
    }
    .complex-filter-atom {
      height: 40px;
      width: fit-content;
      margin: 0 auto 0px 0;
      padding-left: 10px;
      position: relative;
      justify-content: flex-start;
      display: flex;
      align-items: center;
      &::before {
        content: "";
        display: block;
        height: 1px;
        width: 33px;
        position: absolute;
        top: 50%;
        right: 100%;
        left: -23px;
        background: #ccc;
      }
    }
  }
}
</style>