<!--
 * @Author: 大炸鹅
 * @Date: 2023-04-21 10:11:22
 * @LastEditors: 大炸鹅
 * @LastEditTime: 2023-04-21 17:59:10
 * @FilePath: \数据智能构建\src\views\rd\operation-new\component\filter-header.vue
-->
<template>
  <div :class="['filter-header-wrapper', customClassName]">
    <div class="filter-container">
      <div class="filter-header">
        <div class="filter-header-content">
          <el-input
            v-if="showInput"
            :placeholder="searchKeyPlaceholder"
            @change="handleSearch"
            v-model="searchKey"
            class="search-input"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <template v-for="item in headerSearchList">
            <el-checkbox
              v-if="item.type === 'checkbox'"
              :label="item.value"
              :key="item.value"
              v-model="item.vModelValue"
            >
              {{ item.label }}
            </el-checkbox>
            <div v-if="item.type === 'date'" :key="item.type" class="ml-10">
              <label style="color: #7f7f7f;font-size:12px;" class="mr-10">{{item.label}}</label>
              <el-radio-group v-model="item.btnValue" @input="val => quickTime(val, item)">
                <el-radio-button :label="subOItem.value" v-for="subOItem in item.btns" :key="subOItem.value">{{subOItem.label}}</el-radio-button>
              </el-radio-group>
              <el-date-picker
                v-model="item.vModelValue"
                type="date"
                class="ml-10"
                align="center"
                placeholder="选择日期"
                :value-format="valueFormat"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
            <div class="select" v-if="item.type === 'select'" :key="item.label">
              <label style="color: #7f7f7f;font-size:12px;" class="mr-10">{{item.label}}</label>
              <el-select v-model="item.vModelValue" placeholder="请选择" class="mr-10" :multiple="item.multiple" style="width:155px">
                <el-option
                  v-for="item in item.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </template>
        </div>
        <div class="filter-extra" v-if="showDody">
          <el-button type="primary" size="mini" class="ml-10" style=" padding: 5px 8px; border-radius: 0;">
            重置
          </el-button>
          <div class="filter-open" @click="visibleFilterMore = !visibleFilterMore">
            <i class="iconfont icon-shousuoxiajiantou" v-if="!visibleFilterMore"></i>
            <i class="iconfont icon-shousuoshangjiantou" v-if="visibleFilterMore"></i>
            <span class="text">展开刷选</span>
          </div>
        </div>
        <div v-else>
          <el-button type="primary" size="mini" class="ml-10" style=" padding: 5px 8px; border-radius: 0;">
            重置
          </el-button>
          <el-button type="primary" size="mini" class="ml-10" style=" padding: 5px 8px; border-radius: 0;" @click="searchSubmit">
            搜索
          </el-button>
        </div>
      </div>
      <div class="filter-body" v-if="visibleFilterMore && showDody">
        <template v-for="item in bodySearchList">
          <div class="" v-if="item.type === 'select'" :key="item.label">
            <label style="color: #7f7f7f;font-size:12px;" class="mr-10">{{item.label}}</label>
            <el-select v-model="item.vModelValue" placeholder="请选择" class="mr-10" :multiple="item.multiple" style="width:155px">
              <el-option
                v-for="item in item.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div v-if="item.type === 'date'" :key="item.type" class="ml-10">
            <label style="color: #7f7f7f;font-size:12px;" class="mr-10">{{item.label}}</label>
            <el-radio-group v-model="item.btnValue" @input="val => quickTime(val, item)">
              <el-radio-button :label="subOItem.value" v-for="subOItem in item.btns" :key="subOItem.value">{{subOItem.label}}</el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="item.vModelValue"
              type="date"
              class="ml-10"
              align="center"
              placeholder="选择日期"
              :value-format="valueFormat"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </template>
        <el-button type="primary" size="mini" class="ml-10" style=" padding: 5px 8px; border-radius: 0;" @click="searchSubmit">
          搜索
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  name: 'FilterHeader',
  props: {
    customClassName: String,
    searchKeyPlaceholder: {
      type: String,
      default: '请输入搜索关键字'
    },
    headerSearchList: {
      type: Array,
      default: () => [
        { label: '我的实例', value: 'myInstance', type: 'checkbox', vModelValue: false, key: 'myInstance' },
        { label: '失败实例', value: 'errorInstance', type: 'checkbox', vModelValue: false, key: 'errorInstance' },
        { label: '未完成实例', value: 'incompleteInstance', type: 'checkbox', vModelValue: false, key: 'errorInstance' },
        {
          label: '开始运行日期',
          btnValue: 'today',
          vModelValue: dayjs().format('YYYY-MM-DD'),
          type: 'date',
          key: 'startRunDate',
          btns: [
            {
              label: '今天',
              value: 'today',
              type: 'radio'
            },
            {
              label: '昨天',
              value: 'yesterday',
              type: 'radio'
            },
            {
              label: '全部',
              value: 'all',
              type: 'radio'
            }
          ]
        }
      ]
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    bodySearchList: {
      type: Array,
      default: () => [
        {
          label: '补数据状态',
          type: 'select',
          vModelValue: '',
          key: 'status',
          options: [
            {
              label: '成功',
              value: 'success'
            }
          ]
        },
        {
          label: '实例负责人',
          type: 'select',
          vModelValue: '',
          key: 'instanceLeader',
          options: [
            {
              label: 'dazhae',
              value: '1'
            }
          ]
        },
        {
          label: '补数提交人',
          type: 'select',
          vModelValue: '',
          key: 'submitter',
          options: [
            {
              label: 'dazhae',
              value: '1'
            }
          ]
        },
        {
          label: '业务日期',
          btnValue: 'today',
          vModelValue: dayjs().format('YYYY-MM-DD'),
          type: 'date',
          key: 'businessDate',
          btns: [
            {
              label: '今天',
              value: 'today',
              type: 'radio'
            },
            {
              label: '昨天',
              value: 'yesterday',
              type: 'radio'
            }
          ]
        }
      ]
    },
    showDody: {
      type: Boolean,
      default: true
    },
    showInput: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      searchKey: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      visibleFilterMore: false
    }
  },
  methods: {
    handleSearch(val, item) {
      // this.$emit('search', val, item)
      this.searchSubmit()
    },
    quickTime(val, item) {
      if (val === 'today') {
        item.vModelValue = dayjs().format('YYYY-MM-DD')
      } else if (val === 'yesterday') {
        item.vModelValue = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
      } else {
        item.vModelValue = ''
      }
    },
    searchSubmit() {
      const searchParams = {}
      this.headerSearchList.map(d => {
        searchParams[d.key] = d.vModelValue
      })
      this.bodySearchList.map(d => {
        searchParams[d.key] = d.vModelValue
      })
      this.$emit('search', {...searchParams, searchKey: this.searchKey})
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-header-wrapper {
  padding-top: 10px;
  .filter-container {
    background-color: #f8f8fa;
    .filter-header {
      display: flex;
      min-height: 52px;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      border-bottom: 1px solid rgba(229,229,229, 1);
      background-color: #fff;
      line-height: 40px;
      position: relative;
      .filter-header-content {
        display: flex;
        align-items: center;
        flex: 1;
        .search-input {
          flex: 1;
          max-width: 337px;
          min-width: 40px;
          margin-right: 20px;
        }
      }
      .filter-extra {
        display: flex;
        align-items: center;
        background: #fff;
        z-index: 1;
        .filter-open {
          margin-left: 20px;
          cursor: pointer;
          i {
            font-size: 12px;
            margin-right: 15px;
          }
          .text {
            font-size: 12px;
          }
        }
      }
    }
    .filter-body {
      padding: 5px 20px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      > div {
        min-height: 49px;
        display: flex;
        align-items: center;
      }
    }
  }
    .el-checkbox {
      margin-right: 15px;
      .el-checkbox__label {
        color: #191919;
        font-size: 12px;
      }
    }
    ::v-deep .el-radio-button__inner {
      border-radius: 0!important;
    }
}
</style>