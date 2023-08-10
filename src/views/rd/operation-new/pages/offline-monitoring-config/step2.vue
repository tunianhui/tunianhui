<template>
  <div class="step2">
    <div class="step2-wrapper">
      <div class="left">
        <div class="top">
          <span>监控项选择</span>
          <span>
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="逻辑表字段" name="first"></el-tab-pane>
              <el-tab-pane label="逻辑表字段" name="second"></el-tab-pane>
              <el-tab-pane label="逻辑表字段" name="third"></el-tab-pane>
            </el-tabs>
          </span>
        </div>
        <div class="left-content-wrapper">
          <el-input v-model="keyworkLeft" placeholder="请输入关键字搜索" class="mb-10"></el-input>
          <ul>
            <li>
              <el-checkbox v-model="allCheckbox" @change="changeAllCheck">全选</el-checkbox>
            </li>
            <li v-for="item in datalist" :key="item.id">
              <el-checkbox v-model="item.checkbox">{{ item.name }}</el-checkbox>
            </li>
          </ul>
        </div>
      </div>
      <div class="center">
        <i class="el-icon-d-arrow-right"></i>
      </div>
      <div class="right">
        <div class="top">
          <span>已选监控项({{datalistNew.length}} / {{datalist.length}})</span>
          <span>
            <el-select v-model="typeValue" placeholder="请选择" style="width:130px">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </span>
        </div>
        <div class="right-content-wrapper">
          <div class="right-content-wrapper-top">
            <div>监控项</div>
            <div>类型</div>
          </div>
          <ul>
            <li v-for="item in datalistNew" :key="item.id">
              <span>{{ item.name }}</span>
              <span>{{ item.type }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Step2',
  computed: {
    selectItems() {
      return this.datalist.filter(item => item.checkbox)
    }
  },
  watch: {
    selectItems: {
      handler(val) {
        this.datalistNew = val
        if (val.length === this.datalist.length) {
          this.allCheckbox = true
        } else {
          this.allCheckbox = false
        }
      },
      deep: true
    }
  },
  data() {
    return {
      activeName: 'first',
      keyworkLeft: '',
      typeValue: '1',
      allCheckbox: false,
      datalist: [
        { name: 'tab1', id: 1, checkbox: false, type: '手动物理任务' },
        { name: 'tab2', id: 2, checkbox: false, type: '手动物理任务' },
        { name: 'tab3', id: 3, checkbox: false, type: '手动物理任务' },
        { name: 'tab4', id: 4, checkbox: false, type: '手动物理任务' },
        { name: 'tab5', id: 5, checkbox: false, type: '手动物理任务' },
        { name: 'tab6', id: 6, checkbox: false, type: '手动物理任务' },
        { name: 'tab7', id: 7, checkbox: false, type: '手动物理任务' },
        { name: 'tab8', id: 8, checkbox: false, type: '手动物理任务' }
      ],
      datalistNew: [],
      options: [
        { value: '1', label: '全部类型' },
        { value: '2', label: '逻辑表字段' },
        { value: '3', label: '周期物理任务' },
        { value: '4', label: '手动物理任务' },
      ],
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    changeAllCheck(val) {
      this.datalist.forEach(item => {
        item.checkbox = val
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.step2 {
  .step2-wrapper {
    display: flex;
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 15px;
      border-bottom: 1px solid #ebeef5;
      margin-bottom: 10px;
      height: 40px;
      >span:first-child {
        font-weight: 500;
        font-size: 14px;
      }
    }
    .left {
      width: 0;
      flex: 1;
      height: 100%;
      .left-content-wrapper {
        background: #fff;
        padding: 15px;
        height: 300px;
        min-height: 300px;
        > ul {
          height: calc(100% - 38px);
          overflow: auto;
          li {
            height: 28px;
            line-height: 28px;
          }
        }
      }
    }
    .right {
      flex: 1;
      width: 0;
      height: 100%;
      .right-content-wrapper {
        height: 300px;
        min-height: 300px;
        background: #fff;
        padding: 15px;
        overflow: auto;
        &-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 28px;
          margin-bottom: 10px;
          >div {
            font-size: 12px;
            color: rgba($color: #000000, $alpha: 0.6);
          }
        }
        > ul {
          height: calc(100% - 38px);
          li {
            height: 28px;
            line-height: 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
          }
        }
      }
    }
    .center {
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: rgba($color: #000000, $alpha: 0.6)
    }
  }
  ::v-deep {
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__nav-wrap::after {
      height: 0;
    }
    .el-tabs__item {
      padding-right: 0!important;
      font-size: 12px;
    }
  }
  
}
</style>