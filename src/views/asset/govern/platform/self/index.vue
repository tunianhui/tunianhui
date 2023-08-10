<template>
  <section class="platform-self">
    <div class="space-between mb-10">
      <div class="flex">
        <div class="page-title">我的治理列表</div>
      </div>
    </div>

    <div class="search-wrapper">
      <div class="mb-20">
        <span class="title">治理领域</span>
        <!-- <Select :list="list1" @select='select1'></Select> -->
        <div class="wrapper">
          <ul>
            <li v-for="(item, index) in list" :key="index" @click="select1(item,index)" :class="{'item-select': selectIndex === index }">
              <span class="text">{{ item.name }}({{item.resultNum}})</span>
            </li>
          </ul>
        </div>
        <div class="line"></div>
      </div>
      <div class="mb-20">
        <span class="title">治理对象</span>
        <!-- <Select :list="list2" @select='select2' :activeIndex="active"></Select> -->
        <div class="wrapper">
          <ul>
            <li v-for="(item, index) in list2" :key="index" @click="select2(item,index)" :class="{'item-select': selectIndex2 === index }">
              <span class="text">{{ item.objectName }}({{item.resultNum}})</span>
            </li>
          </ul>
        </div>
        <div class="line"></div>
      </div>
      <div class="mb-20">
        <span class="title">治理项</span>
        <div class="wrapper">
          <ul>
            <li v-for="(item, index) in list3" :key="index" @click="select3(item,index)" :class="{'item-select': selectIndex3 === index }">
              <span class="text">{{ item.itemName }}({{item.resultNum}})</span>
            </li>
          </ul>
        </div>
        <!-- <Select :list="list3" @select='select3'></Select> -->
      </div>
    </div>

    <keep-alive>
      <Governance 
      :score="ScoreExplain" 
      :data="tableData" 
      @select="selecthandle" 
      :operation="buttonStrs" 
      :verifica="verifica" 
      :selectIndex3="selectIndex3"
      :selectIndex="selectIndex"
      :selectIndex2="selectIndex2"
      :sourceType="sourceType"
      :noDealpoint="usenoDealpoint"
      :count="total">
    </Governance>
    </keep-alive>
  </section>
</template>

<script>
// import Storage from './storage.vue'
// import Calculation from './calculation.vue'
import Governance from './governance.vue'
import Select from '../comps/select.vue'
import {getItemCode, getScoreExplain, getDomainNum, getObjectNum, getItemNum, getMyGoverSto, getMyGoverCom} from '@/api/govern/platform'
export default {
  name: 'PlatformSelf',
  components: {
    // Storage,
    // Calculation,
    Select,
    Governance
  },
  data () {
    return {
      sourceType: '',
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
          deployName: '',
          objectName: '',
          dealState: '',
          pageSize: 15,
          pageNo: 1,
          // pageNum: 1,
      },
      selectIndex: 0,
      selectIndex2: 0,
      selectIndex3: 0,
      ScoreExplain: {
        scoreExplain: '',
        itemComments: '',
        docUrl: '',
        score: ''
      },
      tableData: [],
      goverAreas: '',
      buttonStrs: [],
      usenoDealpoint: 0,
      total: 0,
      localVerifice: {},
    }
  },

  watch: {
  },
  created() {
    this.getDomainNum()
    this.localVerifice = JSON.parse(window.localStorage.getItem('verifica'))
    if (this.localVerifice) {
      this.selectIndex = this.localVerifice.selectIndex
      this.selectIndex2 = this.localVerifice.selectIndex2
      this.selectIndex3 = this.localVerifice.selectIndex3
    }
    // this.getScoreExplain()
    // this.getMyGoverSto()
  },
  mounted () {
    // this.list2 = this.list21
    // this.list3 = this.list31
    // this.getItemCode()
  },
  methods: {
    select1 (item, index) {
      this.index = index
     
      this.goverAreas = item.name
      this.verifica.code = item.code
      this.selectIndex = index
      this.selectIndex2 = 0
      this.selectIndex3 = 0
      this.emptyhandle()
      this.getObjectNum(item.code)
      // this.list2 = 
      // this.list2 = index === 0 ? this.list21 : this.list22
      // this.list3 = index === 0 ? this.list31 : this.list32
    },
    select2 (item, index) {

      this.verifica.objectCode = item.objectCode
      this.sourceType = item.objectName
      this.selectIndex2 = index
      this.selectIndex3 = 0
      this.emptyhandle()
      this.getItemNum(item.objectCode)
    },
    select3 (item, index) {
      this.verifica.itemCode = item.itemCode
      this.selectIndex3 = index
      this.emptyhandle()
      this.getScoreExplain()
      this.buttonStrs = JSON.parse(item.buttonStrs)
      // this.buttonStrs = item.buttonStrs
      this.usenoDealpoint = item.noDealPoint
      this.searchChange(this.buttonStrs)
      if (this.goverAreas === '存储') {
        this.getMyGoverSto()
      } else {
        this.getMyGoverCom()
      }
    },
    emptyhandle() {
      this.form.deployName = ''
      this.form.dealState = ''
      this.form.objectName = ''
    },
    searchChange (val) {
      val.forEach(item => {
        if (item.buttonAction === 'I000001') {
          item.icon = 'iconfont icon-shanchu'
        } else if (item.buttonAction === 'I000003') {
          // item.icon = 'el-icon-refresh-right'
          item.icon = 'iconfont icon-xiaxian2'
        } else if (item.buttonAction === 'I000007') {
          item.icon = 'iconfont icon-zhuanjiao'
        } else if (item.buttonAction === 'I000002') {
          // item.icon = 'el-icon-refresh'
          item.icon = 'iconfont icon-shengmingzhouqi'
        } else if (item.buttonAction === 'I000006') {
          item.icon = 'iconfont icon-baimingdan'
        } else if (item.buttonAction === 'I000004') {
          item.icon = 'iconfont icon-yuanshuju'
        } else if (item.buttonAction === 'I000005') {
          item.icon = 'iconfont icon-shengmingzhouqi'
        } else if (item.buttonAction === 'I000012') {
          item.icon = 'iconfont icon-merge-cells'
        }
      })
      // return val
      this.buttonStrs = val
    },
    selecthandle(val) {
      this.form = val
      if (this.goverAreas === '存储') {
        this.getMyGoverSto()
      } else {
        this.getMyGoverCom()
      }
    },
    async getDomainNum() {
      const res = await this.$simpleAsyncTo(getDomainNum({webCode: "myrgs",}), '获取治理领域列表失败')
      if (res) {
        this.list = res.data
        if (!this.localVerifice) {
          this.verifica.code = this.list[0].code
        } else {
          this.verifica.code = this.localVerifice.code
        }
        const data = res.data
        data.forEach((item) => {
          if (this.verifica.code === item.code) {
            this.goverAreas = item.name
          }
        })
        this.getObjectNum()
        // this.verifica.code = this.list[0].code
      }
    },
    async getObjectNum() {
      const params = {
        code: this.verifica.code,
        webCode: "myrgs",
      }
      const res = await this.$simpleAsyncTo(getObjectNum(params), '获取治理对象列表失败')
      if (res) {
        this.list2 = res.data
        this.sourceType = this.list2[0].objectName
        if (!this.localVerifice) {
          this.verifica.objectCode = this.list2[0].objectCode
        } else {
          this.verifica.objectCode = this.localVerifice.objectCode
        }
        this.getItemNum()
        // this.verifica.objectCode = this.list2[0].objectCode
      }
    },
    async getItemNum() {
      const params = {
        objectCode: this.verifica.objectCode,
        webCode: "myrgs",
        code: this.verifica.code
      }
      const res = await this.$simpleAsyncTo(getItemNum(params), '获取治理项列表失败')
      if (res) {
        this.list3 = res.data
        // this.verifica.itemCode = this.list3[0].itemCode
        if (!this.localVerifice) {
          this.verifica.itemCode = this.list3[0].itemCode
        } else {
          this.verifica.itemCode = this.localVerifice.itemCode
        }
        let data = []
        this.list3.forEach(item => {
          if (this.verifica.itemCode === item.itemCode) {
            data = JSON.parse(item.buttonStrs)
            this.usenoDealpoint = item.noDealPoint
            // data = item.buttonStrs
          }
        })
        // const data = this.list3[0].buttonStrs
        this.searchChange(data)
        this.getScoreExplain()
        if (this.goverAreas === '存储') {
          this.getMyGoverSto()
        } else {
          this.getMyGoverCom()
        }
        window.localStorage.removeItem('verifica')
      }
    },
    async getScoreExplain() {
      const params = {
        itemCode: this.verifica.itemCode
      }
      const res = await this.$simpleAsyncTo(getScoreExplain(params), '') 
      if (res) {
        this.ScoreExplain = res.data ? res.data : {}
      }
    },
    async getMyGoverSto() {
      this.loading++
      const params = {
        ...this.form,
        dealState: !this.form.dealState ? this.form.dealState : Number(this.form.dealState),
        itemCode: this.verifica.itemCode
      }
      const res = await this.$simpleAsyncTo(getMyGoverSto(params), '获取存储待治理项列表失败')
      if (res) {
          this.tableData = res.data.totalList
          this.total = res.data.total
      }
      this.loading--
    },
    async getMyGoverCom() {
      this.loading++
      const params = {
        ...this.form,
        dealState: !this.form.dealState ? this.form.dealState : Number(this.form.dealState),
        itemCode: this.verifica.itemCode
      }
      const res = await this.$simpleAsyncTo(getMyGoverCom(params), '获取计算待治理项列表失败')
      if (res) {
          this.tableData = res.data.totalList
          this.total = res.data.total
      }
      this.loading--
    }
    // async _getItemCode() {
    //   this.loading++
    //   const res = await this.$simpleAsyncTo(getItemCode(), '')
    //   if (res) {
    //     // this.list = res.codeList
    //     // this.list1 = res.codeList
    //     // this.list2 = res.codeList[0].objectCodeList
    //     // this.list3 = res.codeList[0].objectCodeList[0].itemCodeList
    //   }
    //   this.loading--
    // },
  }
}
</script>

<style lang="scss">
.platform-self {
  position: relative;
  .space-between{
    padding-bottom: 2px;
    border-bottom: 1px solid #d9d9d9;
  }
  .search-wrapper {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 10px;
    .wrapper {
      display: inline-block;
      ul {
        display: flex;
        list-style: none;
        li {
          margin: 0 5px;
          cursor: pointer;
          .text {
            padding: 5px 10px;
            display: inline-block;
            text-align: center;
            color: #666;
            font-size: 12px;
            background-color: #e0e1ee;
            border: 1px solid transparent;
          }
          &:hover {
            .text {
              color: #000e7f;
              background-color: #eaedf8;
              border: 1px solid #000e7f;
            }
          }
        }
        .item-select {
          .text {
            color: #000e7f;
            background-color: #eaedf8;
            border: 1px solid #000e7f;
          }
        }
      }
    }
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
  .mb-20{
    white-space: nowrap;
  }
}

</style>
