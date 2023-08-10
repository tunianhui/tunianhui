<template>
  <el-card class="mt-15 mb-10 my-filter-card">
    <div slot="header" class="clearfix my-btn bgc">
      <div class="my-search">
        <div class="my-group-entry" style="border-bottom:none">
          <div class="my-group-des font-12 width">
            <el-input
              style="width:200px"
              v-model="keyword"
              placeholder="请输入关键字"
              prefix-icon="el-icon-search"
            ></el-input>
          </div>
          <div class="my-group-content">
            <div :class="['my-group-folder', 'group-folder-opened']">
              <div class="my-group-options">
                <span :class="['my-option-item', 'my-filter-option']"
                  v-for="item in curCheckedList" :key="item.value"
                  >
                  <span class="font-12">{{item.pardes}}: {{item.des}}</span>
                  <div class="my-filter-option-close" @click.stop="myCurDel(item)">
                    <i class="el-icon-close"></i>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="my-search" :style="isToggle ? style : {}" v-if="isShow">
      <div class="my-group-entry" v-for="(curItem, curIndex) in filterGroupList" :key="curItem.id">
        <div class="my-group-des font-12">{{curItem.des}}</div>
        <div class="my-group-content">
          <div :class="['my-group-folder', curItem.flag ? 'group-folder-opened' : '']">
            <div class="my-group-options">
              <span :class="['my-option-item', item.flag ? 'my-filter-option' : '']"
                v-for="(item) in curItem.options"
                :key="item.value"
                @click.stop="myClickHandle(item, curItem)"
                >
                <span class="font-12">{{item.des}}</span>
                <div class="my-filter-option-close" v-if="item.flag" @click.stop="myCancelHanle(item)">
                  <i class="el-icon-close"></i>
                </div>
              </span>
            </div>
            <div class="my-group-folder-arrow">
              <i :class="['iconfont icon-shousuoxiajiantou', curItem.flag ? 'active' : '']" @click.stop="curItemToggle(curItem)" v-if="curIndex !== 0 && curIndex !== 5"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="my-filter-group-arrow" v-if="isShow">
      <i :class="['iconfont icon-shousuoxiajiantou', isToggle ? 'active' : '']" @click="isToggle=!isToggle"></i>
    </div>
  </el-card>
</template>

<script>
// import { getFiltersList } from '@/views/rd/exreact/tag-center/factory/data.js'
export default {
  name: 'FilterGroup',
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      query: true
    }
  },
  data() {
    return {
      filterGroupList: [],
      curCheckedList: [],
      isToggle: true,
      keyword: '',
      style: {height: '46px', overflow: 'hidden'}
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(val) {
        this.filterGroupList = val
      }
    }
  },
  created() {
    // this.getFiltersList()
  },
  methods: {
    // async getFiltersList() {
    //   const res = await getFiltersList()
    //   if (res) {
    //     let data = res.data
    //     this.mapFlag(data)
    //     this.filterGroupList = data
    //   }
    // },
    // mapFlag(data) {
    //   data.forEach(e => {
    //     e.flag = false
    //     if (e.options && e.options.length) {
    //       this.mapFlag(e.options)
    //     }
    //   })
    // },
    myClickHandle(subitem, paritem) {
      paritem.options.forEach(e => {
        e.flag = false
      })
      let index = this.curCheckedList.findIndex(e => e.parid === paritem.id)
      if (index === -1) {
        this.curCheckedList.push({
          ...subitem,
          parid: paritem.id,
          pardes: paritem.des,
          options: paritem.options
        })
      } else {
        this.curCheckedList[index].value = subitem.value
        this.curCheckedList[index].des = subitem.des
      }
      this.$emit('filterHandle', this.curCheckedList)
      subitem.flag = true
    },
    myCancelHanle(item) {
      item.flag = false
      let index = this.curCheckedList.findIndex(e => item.value === e.value)
      this.curCheckedList.splice(index, 1)
      this.$emit('filterHandle', this.curCheckedList)
    },
    myCurDel(item) {
      let resArr = this.filterGroupList.filter(e => {
        return e.id === item.parid
      })
      let index = this.curCheckedList.findIndex(e => e.value === item.value)
      if (index !== -1) {
        this.curCheckedList.splice(index, 1)
      }
      if (resArr && resArr.length) {
        resArr[0].options.forEach(e => {
          e.flag = false
        })
      }
      this.$emit('filterHandle', this.curCheckedList)
    },
    curItemToggle(item) {
      item.flag = !item.flag
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/css/filter-group.scss';
</style>
