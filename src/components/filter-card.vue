<template>
  <el-card class="filter-field-card">
    <div slot="header" class="header-card">
      <span class="card-input mr-10">
        <el-input v-model="keyword" :placeholder="placeholder" @input="inputHanlde">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </span>
      <div>
        <div class="cur-option" v-for="item in curFilter" :key="item.module">
          <div class="cur-des font-12">
            <OverflowTooltip style="max-width:320px">{{`${item.moduleLabel}：${item.label}`}}</OverflowTooltip>
          </div>
          <div class="cur-close active">
            <i class="el-icon-close" @click="curCloseHandle(item)"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="filter-field-content" v-if="filterFiedleList.length">
      <div class="filter-fiele-list" ref="filterFieleList" :style="isToggle ? {} : style">
        <div class="filter-item" v-for="item in filterFiedleList" :key="item.id">
          <div class="item-des" ref="itemDes">{{item.label}}</div>
          <div v-if="!item.type" class="item-content" :ref="item.id">
            <div :class="{'item-folder': true, 'item-folder-open': item.open}">
              <div :class="{'item-folder-option': true, 'scroll': item.open}">
                <span :class="{'option-item': true, 'filter-option': subItem.checked}" v-for="subItem in item.options" :key="subItem.id" @click="selectHandle(item, subItem)">
                  <OverflowTooltip class="width">{{subItem.label}}</OverflowTooltip>
                  <div class="option-close" v-if="subItem.checked"><i class="el-icon-close" @click.stop="closeHandle(item, subItem)"></i></div>
                </span>
              </div>
              <div class="folder-arrow">
                <i :class="{'iconfont icon-shousuoxiajiantou font-14': true, 'active': item.open}" v-if="item.isArrow" @click.stop="isOpenHandle(item)"></i>
              </div>
            </div>
          </div>
          <div v-if="item.type === 'date'" class="item-content item-date" :ref="item.id">
            <el-date-picker v-model="date" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" value-format="yyyy-MM-dd hh:mm:ss" @change="changeDate(item)"></el-date-picker>
            <div :class="{'item-folder': true, 'item-folder-open': date && date.length}" v-if="date && date.length">
              <div :class="{'item-folder-option': true, 'scroll': date && date.length}">
                <span :class="{'option-item': true, 'filter-option': date && date.length}">
                  <OverflowTooltip style="max-width:320px">{{`${item.label}: ${date[0]} ~ ${date[1]}`}}</OverflowTooltip>
                  <div class="option-close"><i class="el-icon-close" @click.stop="curCloseHandle(item)"></i></div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="filter-arrow" v-if="isArrow">
        <i :class="{'iconfont icon-shousuoxiajiantou': true, 'active': isToggle}" @click="isToggle=!isToggle"></i>
      </div>
    </div>
  </el-card>
</template>

<script>
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'FilterFieldCard',
  props: {
    placeholder: {
      type: String,
      default: '请输入关键字'
    },
    keywords: {
      type: String,
      default: ''
    },
    filterData: Array,
    isArrow: {
      type: Boolean,
      default: true
    }
  },
  components: {
    OverflowTooltip
  },
  watch: {
    filterData: {
      deep: true,
      immediate: true,
      handler (val) {
        if (val) {
          let data = JSON.parse(JSON.stringify(val))
          data.forEach(item => {
            item.isArrow = false
            item.open = false
            if (item.options && item.options.length > 0) {
              item.options.forEach(el => {
                el.checked = false
              })
            }
          })
          this.filterFiedleList = data
        }
      }
    },
    keywords: {
      handler (val) {
        this.keyword = val
      }
    }
  },
  data () {
    return {
      keyword: '',
      date: [],
      filterFiedleList: [],
      curFilter: [],
      style: { height: '44px', overflow: 'hidden' },
      isToggle: false
    }
  },
  created () {

  },
  mounted () {
    // const filterFieleListWidth = this.$refs.filterFieleList.offsetWidth
    // this.filterFiedleList.forEach(item => {
    //   const curDomWidth = this.$refs[item.id][0].offsetWidth
    //   if (curDomWidth >= filterFieleListWidth - 105) {
    //     item.isArrow = true
    //   } else {
    //     item.isArrow = false
    //   }
    // })
  },
  updated () {
    const filterFieleListWidth = this.$refs.filterFieleList.offsetWidth
    this.filterFiedleList.forEach(item => {
      const curDomWidth = this.$refs[item.id][0].offsetWidth
      if (curDomWidth >= filterFieleListWidth - 105) {
        item.isArrow = true
      } else {
        item.isArrow = false
      }
    })
  },
  methods: {
    selectHandle (item, subItem) {
      const index = item.options.findIndex(val => val.checked === true)
      if (index > -1) {
        item.options[index].checked = false
      }
      subItem.checked = true
      const curIndex = this.curFilter.findIndex(val => val.module === item.id)
      if (curIndex > -1) {
        this.curFilter[curIndex].label = subItem.label
        this.curFilter[curIndex].value = subItem.id
      } else {
        this.curFilter.push({
          module: item.id,
          moduleLabel: item.label,
          label: subItem.label,
          value: subItem.id,
          options: item.options
        })
      }
      this.$emit('confirm', this.curFilter, this.keyword)
    },
    isOpenHandle (item) {
      if (this.isToggle === true) {
        item.open = !item.open
      } else {
        item.open = true
      }
      this.isToggle = true
    },
    closeHandle (item, subItem) {
      subItem.checked = false
      const index = this.curFilter.findIndex(val => val.module === item.id)
      if (index > -1) {
        this.curFilter.splice(index, 1)
        this.$emit('confirm', this.curFilter, this.keyword)
      }
    },
    curCloseHandle (item) {
      if (!item.type) {
        const index = this.curFilter.findIndex(val => val.module === item.module)
        const subIndex = item.options.findIndex(val => val.checked === true)
        item.options[subIndex].checked = false
        this.curFilter.splice(index, 1)
        this.$emit('confirm', this.curFilter, this.keyword)
      } else {
        const index = this.curFilter.findIndex(val => val.module === item.module)
        this.date = []
        this.curFilter.splice(index, 1)
        this.$emit('confirm', this.curFilter, this.keyword)
      }
    },
    inputHanlde (value) {
      this.keyword = value
      this.$emit('confirm', this.curFilter, this.keyword)
    },
    changeDate (item) {
      const curIndex = this.curFilter.findIndex(val => val.module === item.id)
      if (curIndex > -1) {
        this.curFilter.splice(curIndex, 1)
      } else {
        this.curFilter.push({
          module: item.id,
          moduleLabel: item.label,
          type: item.type,
          label: this.date[0] + ' ~ ' + this.date[1],
          value: this.date
        })
      }
      this.$emit('confirm', this.curFilter, this.keyword)
    },
    clear () {
      this.curFilter = []
      this.filterFiedleList.forEach(item => {
        item.options.forEach(i => {
          i.checked = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-field-card {
  $height: 37px;
  border-radius: 0;
  box-shadow: none;
  .header-card {
    min-height: 52px;
    display: flex;
    align-items: center;
    .card-input {
      width: 175px;
    }
    > div {
      .cur-option {
        @extend .filter;
        position: relative;
      }
      .cur-close {
        @extend .close;
        &.active {
          font-size: 12px;
        }
      }
    }
  }
  .el-card__body {
    .filter-field-content {
      .filter-fiele-list {
        transition: all 0.15s linear;
        .filter-item {
          display: flex;
          align-items: baseline;
          padding: 4px 0;
          border-bottom: 1px solid $grey7;
          font-size: 12px;
          &:last-child {
            border-bottom: none;
          }
          .item-des {
            width: 105px;
            flex-shrink: 0;
            padding-right: 20px;
            color: rgba($color: $grey1, $alpha: 0.5);
          }
          .item-content {
            display: flex;
            flex-direction: column;
            .item-folder {
              display: flex;
              overflow: hidden;
              height: $height;
              transition: all 0.3s linear;
              &.item-folder-open {
                overflow: auto;
                height: auto;
                max-height: 152px;
              }
              .item-folder-option {
                color: #333;
                &.scroll {
                  max-height: 120px;
                  overflow-y: auto;
                }
                .option-item {
                  display: inline-block;
                  padding: 0 15px;
                  border: 1px solid transparent;
                  margin: 4px 10px 4px 0;
                  background-color: $screenItemTag;
                  color: rgba(0, 0, 0, 0.5);
                  line-height: 28px;
                  white-space: nowrap;
                  box-sizing: border-box;
                  cursor: pointer;
                  position: relative;
                  // max-width: 130px;
                  &:hover {
                    background-color: #d2d6e4;
                  }

                  &.filter-option {
                    @extend .filter;
                  }
                  .width {
                    // width: calc(100% - 1px);
                    max-width: 130px;
                  }
                  .option-close {
                    @extend .close;
                  }
                }
              }
              .folder-arrow {
                width: 25px;
                flex-shrink: 0;
                font-size: 18px;
                line-height: $height;
                > i {
                  color: rgba(0, 0, 0, 0.5);
                  cursor: pointer;
                  transition: all 0.3s;
                  display: inline-block;
                  &.active {
                    transform: rotate(-180deg);
                  }
                }
              }
            }
            &.item-date {
              flex-direction: row;
              align-items: center;
              .el-date-editor {
                margin-right: 10px;
              }
            }
          }
        }
      }
      .filter-arrow {
        display: flex;
        height: 26px;
        align-items: center;
        justify-content: center;
        margin-top: -4px;
        font-size: 14px;
        i {
          color: rgba(0, 0, 0, 0.5);
          cursor: pointer;
          transition: all 0.3s;
          display: inline-block;
          &.active {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .filter {
    display: inline-flex;
    overflow: hidden;
    height: 28px;
    flex-shrink: 0;
    align-items: center;
    padding: 0 15px;
    border: 1px solid rgba($myBtn, 0.3);
    margin-right: 10px;
    background-color: rgba($myBtn, 0.05);
    color: $--color-primary;
    &:hover {
      background-color: $grey10;
    }
  }
  .close {
    position: absolute;
    width: 14px;
    height: 14px;
    align-self: flex-end;
    // margin-right: -20px;
    // margin-left: 11px;
    right: -7px;
    background: $--color-primary;
    cursor: pointer;
    transform: skewX(-45deg);
    > i {
      position: absolute;
      top: 3.5px;
      right: 3.5px;
      color: hsla(0, 0%, 100%, 0.7);
      font-weight: bolder;
      transform: skewX(45deg) scale(0.45);
      transition: transform 0.2s ease;
    }
  }
}
</style>
<style lang="scss">
.filter-field-card {
  .el-card__header {
    padding-top: 0;
    padding-bottom: 0;
    .header-card {
      .el-input .el-input__inner {
        border: none;
        border-bottom: 1px solid $grey7;
        border-radius: 0;
      }
    }
  }
  .el-card__body {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
