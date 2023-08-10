<!--
 * @Author: 大炸鹅
 * @Date: 2023-05-04 10:56:06
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-07-28 11:51:55
 * @FilePath: \智能数据构建\src\views\management\component\filter.vue
-->
<template>
  <div class="search-item-config">
    <div :class="['wrapper', minHeightClass ? '' : 'min']">
      <template v-for="itemData in list">
        <div class="item" :key="itemData.key + ''" v-if="itemData.show">
          <span class="label">{{itemData.label}}</span>
          <div class="filter-item-content">
            <div class="task-type">
              <template v-if="itemData.type === 'select-multiple'">
                <el-select v-model="itemData[itemData.key[0]]" placeholder="请选择" style="width:50%" class="not-border border-r">
                  <el-option
                    v-for="item in itemData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <MultipleSelect v-model="itemData[itemData.key[1]]" :options="itemData.multipleSelectOptions" style="width:50%" class="not-border"></MultipleSelect>
              </template>
              <template v-if="itemData.type === 'select'">
                <MultipleSelect v-model="itemData[itemData.key]" :options="itemData.options" style="width:100%" class="not-border"></MultipleSelect>
              </template>
              <div v-if="itemData.type === 'select-one'" style="display: flex;align-items: center;">
                <el-select
                  v-model="itemData[itemData.key]"
                  placeholder="请选择"
                  style="width:0;flex:1;"
                  :class="['not-border', itemData.checkboxShow ? 'border-r': '']"
                  :disabled="itemData.checkbox"
                >
                  <el-option
                    v-for="item in itemData.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-checkbox v-model="itemData.checkbox" v-if="itemData.checkboxShow" style="width:80px;margin-left:10px">{{itemData.checkboxLabel}}</el-checkbox>
              </div>
              <template v-if="itemData.type === 'checkbox'">
                <el-checkbox-group v-model="itemData[itemData.key]" style="width:100%;padding-left:15px" class="custom-font-size">
                  <el-checkbox :label="item.value" v-for="item in itemData.options" :key="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </template>
              <template v-if="itemData.type === 'time'">
                <SelectQuickTime
                  v-model="itemData[itemData.key]"
                  :options="itemData.options"
                  :valueFormat="itemData.valueFormat"
                  :typeView="itemData.typeView"
                ></SelectQuickTime>
              </template>
            </div>
          </div>
        </div>
      </template>
      <div class="filter-actions">
        <div class="expand-collapse" @click="expandCollapseHandle" v-if="showMore">
          <i class="el-icon-arrow-up"></i>
          <span>更多</span>
        </div>
        <el-button @click="resetting">重置</el-button>
        <el-button type="primary" @click="search">查询</el-button>
        <span class="ml-10">
          <!-- <el-checkbox v-model="checked"></el-checkbox><span class="font-12 ml-5">查询后收起</span> -->
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import MultipleSelect from './check-select.vue'
import SelectQuickTime from './select-time.vue'
export default {
  name: 'SearchItemConfig',
  props: {
    filterOptions: {
      type: Array,
      default: () => []
    },
    showMore: {
      type: Boolean,
      default: true
    }
  },
  components: {
    MultipleSelect,
    SelectQuickTime
  },
  watch: {
    filterOptions: {
      handler(val) {
        this.list = val.map(d => {
          return {
            ...d,
            show: d.isCollapse ? false : true,
            options: d.options || [],
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      list: [],
      options: [],
      multipleSelectOptions: [],
      checked: true,
      minHeightClass: false
    }
  },
  methods: {
    expandCollapseHandle() {
      this.minHeightClass = !this.minHeightClass
      this.list = this.list.map(item => {
        return {
          ...item,
          show: item.isCollapse ? !item.show : true
        }
      })
    },
    search() {
      const data = {}
      this.list.map(item => {
        data[item.key] = item[item.key]
        return
      })
      this.$emit('change', data)
    },
    resetting() {
      this.list = this.list.map(item => {
        return {
          ...item,
          [item.key]: Array.isArray(item[item.key]) ? [] : ''
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item-config {
  background: #fff;
  .wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 20px 20px 8px;
    margin: 0;
    width: 100%;
    position: relative;
    .item {
      border: 1px solid rgba(0,0,0,0.15);
      display: inline-flex;
      min-height: 30px;
      width: calc(50% - 10px);
      margin-bottom: 12px;
      position: relative;
      border-radius: 4px;
      .label {
        font-size: 12px;
        font-family: Helvetica;
        color: rgba(0,0,0,0.65);
        width: 115px;
        display: inline-flex;
        padding: 6px 12px;
        position: relative;
      }
      .filter-item-content {
        font-size: 12px;
        border-left: 1px solid rgba(0,0,0,0.15);
        width: 100%;
        box-sizing: content-box;
        display: inline-flex;
        align-items: center;
        justify-content: flex-start;
        position: relative;
        padding: 0;
        .task-type {
          width: 100%;
        }
      }
    }
    .filter-actions {
      display: inline-flex;
      align-items: center;
      height: 28px;
      margin-bottom: 12px;
      margin-left: auto;
      position: relative;
      .expand-collapse {
        margin-right: 12px;
        color: rgba(16,115,255,1);
        cursor: pointer;
        font-size: 12px;
      }
    }
    &.min {
      max-height: 202px;
    }
  }
  .not-border {
    ::v-deep {
      .el-input__inner {
        border: none !important;
      }
    }
  }
  .border-r {
    border-right: 1px solid rgba(0,0,0,0.15);
  }
  .custom-font-size {
    ::v-deep {
      .el-checkbox__label {
        font-size: 12px;
      }
    }
  }
}
</style>