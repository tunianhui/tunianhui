<template>
  <section class="platform-self">
    <div class="head">
      <div class="flex">
        <div class="page-title mr-20">治理项管理</div>
      </div>
      <div>
        <div class="flex">
          <!-- <el-input v-model="inputVal" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入搜索数据名称" class="mr-10"></el-input> -->
          <!-- <el-button type="primary" icon="el-icon-plus" @click="handleAdd">新建治理项</el-button> -->
        </div>
      </div>
    </div>

    <div class="search-wrapper">
      <div class="mb-20">
        <span class="title">治理领域</span>
        <Select :list="list" @select='select1'></Select>
        <div class="line"></div>
      </div>
      <div class="mb-20">
        <span class="title">治理对象</span>
        <Select :list="list1" @select='select2' :activeIndex="activeIndx"></Select>
        <div class="line"></div>
      </div>
      <div class="mb-20">
        <span class="title">治理项</span>
        <Select :list="list2" @select='select3' :activeIndex1="activeIndex1"></Select>
      </div>
    </div>

    <keep-alive>
      <Storage :data=itemList @select="searchChange" :total="count"
      ></Storage>
    </keep-alive>
  </section>
</template>

<script>
import Storage from './storage.vue'
import Calculation from './calculation.vue'
import Select from '../comps/select.vue'
import { getDomainNum, getObjectNum, getItemNum, getItemList} from '@/api/govern/platform'
export default {
  name: 'PlatformSelf',
  components: {
    Storage,
    Calculation,
    Select
  },
  data () {
    return {
      count: 0,
      activeIndx: 0,
      activeIndex1: 0,
      itemList: [],
      activeName: 'first',
      inputVal: '',
      index: 0,
      loading: 0,
      list: [],
      list1: [],
      list2: [],
      list3: [],
      active: 0,
      index: 0,
      verifica: {
        code: '',
        objectCode: '',
        itemCode: ''
      },
      form: {
        state: '',
        itemName: '',
        pageSize: 15,
        pageNo: 1,
      },
    }
  },
  mounted () {
    this.getDomainNum()
    // this.getItemList()
  },
  methods: {
    searchChange (val) { 
      this.form = val
      this.getItemList()
    },
    handleClick (val) { },
    select1 (item, index) {
      this.verifica.itemCode = ''
     
      this.index = index
      this.verifica.code = item.code
      this.getObjectNum()
      this.activeIndx=0
      this.activeIndex1--
    },
    select2 (item, index) {
      this.verifica.itemCode = ''
      this.verifica.objectCode = item.objectCode
      this.activeIndx = index
      this.activeIndex1--
      this.getItemNum()
      this.getItemList()
    },
    select3 (item, index) {
      this.verifica.itemCode = item.itemCode
      this.getItemList()
    },
    async getDomainNum() {
      const res = await this.$simpleAsyncTo(getDomainNum({webCode: "rgsmgr",}), '获取治理领域列表失败')
      if (res) {
        this.list = res.data
        this.verifica.code = this.list[0].code
        this.getObjectNum()
      }
    },
    async getObjectNum() {
      const params = {
        code: this.verifica.code,
        webCode: "rgsmgr",
      }
      const res = await this.$simpleAsyncTo(getObjectNum(params), '获取治理对象列表失败')
      if (res) {
        this.list1 = res.data
        this.verifica.objectCode = res.data[0].objectCode
        this.getItemNum()
        this.getItemList()
      }
    },
    async getItemNum() {
      const params = {
        objectCode: this.verifica.objectCode,
        webCode: "rgsmgr",
        code: this.verifica.code
      }
      const res = await this.$simpleAsyncTo(getItemNum(params), '获取治理项列表失败')
      if (res) {
        this.list2 = res.data
        
      }
    },
    async getItemList() {
      const params = {
        ...this.form,
        ...this.verifica,
        state: this.form.state !== '' ? this.form.state : -1,
        itemName: this.form.itemName || undefined,
        itemCode: this.verifica.itemCode || undefined
      }
      const res = await this.$simpleAsyncTo(getItemList(params), '')
      if (res) {
        this.itemList = res.data.totalList
        this.count = res.data.total
      }
    }
  }
}
</script>

<style lang="scss">
.platform-self {
  position: relative;
  height: 100%;
  .head {
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
  }
  .search-wrapper {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .title {
      display: inline-block;
      font-size: 14px;
      text-align: right;
      width: 80px;
      margin-right: 20px;
    }
    .line {
      height: 1px;
      background-color: #d9d9d9;
      margin-top: 10px;
      margin-left: 105px;
    }
  }
  .tips {
    font-size: 14px;
    padding: 5px 10px;
    background-color: #d7dcef;
    border: 1px solid #c5cbea;
    margin-bottom: 10px;
    .count {
      font-size: 18px;
      font-weight: bold;
      color: #000e7f;
      margin-left: 5px;
      margin-right: 5px;
    }
    .link {
      font-weight: bold;
      color: #000e7f;
      margin-left: 5px;
      margin-right: 5px;
    }
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .count {
    color: #4783ff;
  }
}

</style>
