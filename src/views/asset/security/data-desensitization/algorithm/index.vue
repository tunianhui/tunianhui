<!--
 * @Author: YONG
 * @LastEditors: YONG
 * @Date: 2022-08-26 10:44:16
 * @LastEditTime: 2023-08-08 17:17:50
 * @Description:
-->

<template>
  <section class="security-wrapper">
    <div class="dp-page-layout">
      <div class="dp-page-header-filters">
        <div class="head">
          <div class="flex">
            <div class="page-title mr-20">脱敏算法</div>
          </div>
          <div>
            <div class="flex">
              <el-input v-model="searchText" prefix-icon="el-icon-search" @input="searchChange" clearable placeholder="请输入算法名" class="ml-10 mr-10" style="width:150px"></el-input>
              <el-select v-model="typeList" multiple collapse-tags placeholder="请选择算法类型" class="mr-10" style="width:200px" @change="searchChange">
                <el-option v-for="item in algorithmList" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
              </el-select>
              <el-button @click="showIntroduce" class="ml-10"><i class="el-icon-question"></i>{{showIntroduceBox ? '收起':'说明'}}</el-button>
              <el-button icon="el-icon-refresh-right" @click="getTableList()"></el-button>
            </div>
          </div>
        </div>

        <div v-if="showIntroduceBox" class="introduce-wrapper">
          <div class="title">
            <span>算法函数使用说明</span>
            <i class="iconfont icon-shousuoshangjiantou" @click="showIntroduceBox = false"></i>
          </div>
          <el-divider></el-divider>
          <div class="introduce">
            <div class="list-wrapper" v-for="(item, index) in list" :key="index">
              <div style="width: 100%">
                <div class="type"><i class="iconfont icon-font icon-shousuo"></i>{{item.type}}</div>
                <div class="content">{{item.content}}</div>
              </div>
              <el-divider direction="vertical" v-if="index < list.length - 1"></el-divider>
            </div>
          </div>
        </div>
      </div>
      <div class="dp-table-layout">
        <el-table :data="tableData" tooltip-effect="dark" height="100%" style="width: 100%;" :class="{'fixed': fixed, 'tabel-cell-noe': false}" v-loading="!!loading">
          <el-table-column prop="maskAlgoName" label="算法名称" width="300">
            <template slot-scope="{row}">
              <OverflowTooltip class="width">
                <div class="flex">
                  <span class="icon iconfont icon-project"></span>
                  <span class="ml-10 cube_name">{{row.maskAlgoName}}</span>
                </div>
              </OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="maskTypeName" label="算法类型" width="180">
          </el-table-column>
          <el-table-column prop="maskAlgoDescription" label="功能描述" min-width="240">
          </el-table-column>
          <el-table-column prop="funExample" label="函数示例" min-width="240">
          </el-table-column>
          <el-table-column prop="identifyRuleName" label="脱敏示例" min-width="240">
            <template slot-scope="{row}">
              <div>输入：{{row.beforeInput}}</div>
              <div>输出：{{row.afterInput}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="{row}">
              <el-tooltip class="item" effect="dark" content="测试" placement="top">
                <el-button type="text" @click="handleTest(row)"><i class="iconfont icon-ceshi font-16 color-btn"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <SelectFooter :tableData="tableData" :totalNum="total" @sendTableList="sendTableList"></SelectFooter>

    <el-dialog :title="title" :visible.sync="showDialogVisible" width="950px" class="rule-dialog" :close-on-click-modal="false">
      <div class="test-wrapper">
        <el-form :model="form" ref="formRef" label-width="100px" :rules="rules" class="import">
          <el-form-item label="脱敏函数" prop="mask_algo_fun_name" class="left">
            <span>{{form.maskAlgoFunName}}</span>
          </el-form-item>
          <el-form-item label="脱敏参数1" prop="maskParams1">
            <el-input v-model="form.maskParams1" placeholder="字段名称" disabled></el-input>
          </el-form-item>
          <el-form-item label="脱敏参数2" prop="maskParams2" v-if="form.maskAlgoName === '自定义替换'">
            <div class="params2">
              <el-button type="plain" @click="handleAdd" class="mb-10">新增脱敏区间</el-button>
              <div v-for="(item, index) in section_list" :key="item.section_id" class="mb-10">
                <div>第{{index + 1}}区间</div>
                <div>
                  <span class="mr-5">x</span>
                  <el-input-number v-model="item.x" :min="1" class="mr-20"></el-input-number>
                  <span class="mr-5">y</span>
                  <el-input-number v-model="item.y" :min="1"></el-input-number>
                  <el-select v-model="item.mapping_type" placeholder="选择码表" style="width:100px" class="ml-10">
                    <el-option v-for="item in replaceList" :key="item.value" :label="item.name" :value="item.value">
                    </el-option>
                  </el-select>

                  <template v-if="item.mapping_type === 'interval_random'">
                    <el-input-number class="mt-10 ml-10" v-model="item.random_start" :min="0" :max="999"></el-input-number>
                    <span class="mr-10 ml-10 mt-10">—</span>
                    <el-input-number class="mt-10 mr-10" v-model="item.random_end" :min="0" :max="999"></el-input-number>
                  </template>
                  <el-button v-if="item.mapping_type !== 'interval_random'" class="ml-10 mr-5" type="text" @click="handleEdit(item)">{{ item.mapping_type === 'random_table' ? '随机码表' : '映射码表'}} <i class="el-icon-edit-outline"></i></el-button>
                  <el-button type="text" @click="handleDel(index)">删除</el-button>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="脱敏参数2" prop="maskParams2" v-if="form.maskTypeName !== '替换脱敏'">
            <template v-if="form.maskTypeName === '哈希脱敏'">
              <el-input v-model="params2Arr[0][1]" placeholder="请输入'盐值'"></el-input>
            </template>
            <template v-if="['特殊字符前遮盖（针对首次出现该字符）','特殊字符后遮盖（针对首次出现该字符）'].includes(form.maskAlgoName)">
              <div class="params2">
                <div>{{form.maskTypeName}}</div>
                <el-radio-group v-model="params2Arr[0][1]">
                  <el-radio label="*">*</el-radio>
                  <el-radio label="#">#</el-radio>
                </el-radio-group>
                <div class="mt-10">{{form.maskAlgoName}}</div>
                <el-radio-group v-model="params2Arr[1][1]">
                  <el-radio label="*">*</el-radio>
                  <el-radio label="@">@</el-radio>
                  <el-radio label=".">.</el-radio>
                </el-radio-group>
              </div>
            </template>
            <template v-if="['保留前n后m','保留自x至y','遮盖前n后m','遮盖自x至y'].includes(form.maskAlgoName)">
              <div class="params2">
                <div>{{form.maskTypeName}}</div>
                <el-radio-group v-model="params2Arr[0][1]">
                  <el-radio label="*">*</el-radio>
                  <el-radio label="#">#</el-radio>
                </el-radio-group>
                <div class="mt-10">{{form.maskAlgoName}}</div>
                <div v-if="params2Arr.length > 1">
                  <span class="mr-5">{{params2Arr[1][0]}}</span>
                  <el-input-number v-model="params2Arr[1][1]" :min="1" class="mr-20"></el-input-number>
                  <span class="mr-5">{{params2Arr[2][0]}}</span>
                  <el-input-number v-model="params2Arr[2][1]" :min="1"></el-input-number>
                </div>
              </div>
            </template>
            <template v-if="['数字取整'].includes(form.maskAlgoName)">
              <div class="params2">
                <div>保留小数点前第N位</div>
                <el-input-number v-model="params2Arr[0][1]" :min="1"></el-input-number>
              </div>
            </template>
            <template v-if="['字符位移'].includes(form.maskAlgoName)">
              <div class="params2">
                <div>字符位移</div>
                <el-input-number v-model="params2Arr[0][1]" :min="1"></el-input-number>
                <div></div>
                <el-radio-group v-model="params2Arr[1][1]" class="mt-10">
                  <el-radio :label="1">向左</el-radio>
                  <el-radio :label="2">向右</el-radio>
                </el-radio-group>
              </div>
            </template>
            <template v-if="['AES', 'DES', '3DES', 'SM4', 'RAS', 'SM2'].includes(form.maskAlgoName)">
              <el-select v-model="params2Arr[0][1]" placeholder="请选择脱敏密钥">
                <el-option v-for="item in secretKeys" :key="item.secretKeyId" :label="item.secretKeyName" :value="item.secretKeyId">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="输入值" prop="beforeInput">
            <el-input v-model="form.beforeInput" type="textarea" :rows="3" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <div class="center">
          <el-button type="primary" icon="el-icon-arrow-right" @click="test"></el-button>
        </div>
        <div class="export">
          <div class="mb-10">输出值</div>
          <div class="content">
            {{form.afterInput || '此处展示输出内容'}}
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleSure">关 闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="codeText" :visible.sync="showCodeTable" width="450px" :close-on-click-modal="false">
      <div>{{codeMsg}}</div>
      <el-input type="textarea" :rows="6" v-model="codeForm" placeholder="aaa:bbb,ddd:eeee"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCodeSure">确 定</el-button>
        <el-button @click="showCodeTable = false">关 闭</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import {
  getAlgorithmTypes,
  getPagedAlgorithm,
  algorithmTest,
  getSecretKeysData,
  replaceMaskType
} from '@/api/asset/security.js'
import SelectFooter from '@c/footer-simple'
import pager from '@/mixins/pager'
export default {
  name: 'algorithm',
  components: {
    SelectFooter
  },
  mixins: [pager],
  data () {
    return {
      showIntroduceBox: false,
      loading: 0,
      fixed: false,
      form: {},
      codeForm: '',
      searchText: '',
      tableData: [],
      typeList: [],
      algorithmList: [],
      showDialogVisible: false,
      showCodeTable: false,
      codeText: '',
      codeMsg: '',
      title: '',
      rules: {
        maskParams1: [
          { required: true, message: '请输入字段名称', trigger: 'blur' }
        ],
        maskParams2: [
          { required: true, message: '请输入字段名称', trigger: 'blur' }
        ],
        beforeInput: [
          { required: true, message: '请输入输入值', trigger: 'blur' }
        ]
      },
      list: [
        {
          type: '第一步：安装资产安全策略',
          content: '密钥是特殊脱敏算法的必填参数，常用于加盐哈希脱敏和加解密算法。第一步：安装资产安全策略脱敏算法是项目内的安全函数，部分引擎需要项目安装资产安全策略之后才可以脱敏，去安装；部分引擎使用引擎自带函数，可以直接脱敏 查看详情'
        },
        {
          type: '第二步：选择算法',
          content: '根据需求场景选择算法：对敏感数据的查看进行脱敏，选择遮盖脱敏/哈希脱敏算法；对数据进行加密存储和传输，后续使用还需要原始值，选择对称加密/非对称加密算法。'
        },
        {
          type: '第三步：注册密钥',
          content: '第三步：注册密钥对于需要密钥的算法（如对称加解算法），需要提前在密钥管理进行密钥的注册。'
        },
        {
          type: '第四步：引用函数',
          content: '在研发模块进行数据处理脚本编写或即席查询时，即可在SQL语句中引用安全函数；配置脱敏规则时，也可以选择所需的安全函数。'
        }
      ],
      params2Arr: [['', ''], ['', ''], ['', '']],
      secretKeys: [],
      section_list: [
        {
          'section_id': Date.now(),
          'x': '',
          'y': '',
          'mapping_type': 'random_table',
          'replace_values': ''
        }
      ],
      replaceList: [],
      tempRow: {}
    }
  },
  mounted () {
    const { maskAlgoName } = this.$route.query
    if (maskAlgoName) {
      this.searchText = maskAlgoName
    }

    this.getTableList()
    this.getAlgorithmTypeList()
    this.getReplaceMaskTypeList()
  },
  methods: {
    getList (val) {
      if (!val) {
        return []
      }
      const arr = val.split(',')
      let list = []
      arr.forEach(item => {
        const data = item.split(':')
        list.push({ key: data[0], value: data[1] })
      })
      return list
    },

    searchChange (val) {
      this.getTableList()
    },

    sendTableList (val) {
      this.pageFilters = val
      this.getTableList()
    },

    showIntroduce () {
      this.showIntroduceBox = !this.showIntroduceBox
    },

    async getTableList () {
      this.loading++
      const str = `${this.typeList}`
      const params = {
        maskAlgoName: this.searchText,
        maskTypeId: str,
        ...this.pageFilters
      }
      const res = await getPagedAlgorithm(params)
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading--
    },

    async getAlgorithmTypeList () {
      const res = await getAlgorithmTypes()
      if (res) {
        this.algorithmList = res.data
      }
    },

    async getSecretKeys (algoType) {
      const params = {
        algoType,
        pageNo: 1,
        pageSize: 100
      }
      const res = await getSecretKeysData(params)
      if (res) {
        this.secretKeys = res.data.totalList
      }
    },

    async getReplaceMaskTypeList () {
      const res = await replaceMaskType()
      if (res) {
        this.replaceList = res.data
      }
    },

    handleTest (row) {
      const { maskTypeId, maskAlgoId, maskAlgoName } = row
      this.getSecretKeys(maskAlgoName)
      this.configData(maskTypeId, maskAlgoId)

      this.showDialogVisible = true
      this.title = `测试脱敏算法：${row.maskAlgoName}`
      // maskAlgoName -->
      this.form = JSON.parse(JSON.stringify(row))
      this.form.beforeInput = ''
      this.form.afterInput = ''
      this.form.maskParams1 = '字段名字'

      let str = row.maskParams2 // '{"salt":"123456"}'
      if (str) {
        let obj = JSON.parse(str)
        if (row.maskAlgoName === '自定义替换') {
          // this.section_list = obj.section_list
          // this.section_list.forEach(ele => {
          //   ele.replaceList = this.getList(ele.replace_values)
          // })
        }
        // this.params2Arr = Object.entries(obj)
      }
    },

    configData (maskTypeId, maskAlgoId) {
      if (maskTypeId === '01') {
        this.params2Arr = [['salt', '']]
      }

      if (maskTypeId === '02') {
        switch (maskAlgoId) {
          case '02001':
          case '02003':
            this.params2Arr = [['cover_char', '*'], ['n', ''], ['m', '']]
            break
          case '02002':
          case '02004':
            this.params2Arr = [['cover_char', '*'], ['x', ''], ['y', '']]
            break
          case '02005':
          case '02006':
            this.params2Arr = [['cover_char', '*'], ['special_char', '*']]
            break
          default:
            break
        }
      }

      if (maskTypeId === '03') {
        //
      }

      if (maskTypeId === '04') {
        if (maskAlgoId === '04001') {
          this.params2Arr = [['retain_n', '']]
        }
        if (maskAlgoId === '04003') {
          this.params2Arr = [['move_n_bit', ''], ['move_forword', '']]
        }
      }

      if (maskTypeId === '05') {
        this.params2Arr = [['secret_key_id', '']]
      }
    },

    async test () {
      if (this.params2Arr && this.params2Arr.length) {
        const maskParams2 = {}
        this.params2Arr.forEach(ele => {
          maskParams2[ele[0]] = ele[1]
        })
        this.form.maskParams2 = JSON.stringify(maskParams2)
      }

      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.submitTest()
        }
      })
    },

    async submitTest () {
      const params = {
        maskAlgoFunName: this.form.maskAlgoFunName,
        maskParams2: this.form.maskParams2,
        beforeInput: this.form.beforeInput,
        maskTypeId: this.form.maskTypeId
      }
      const res = await algorithmTest(params)
      if (res) {
        this.form.afterInput = res.data.maskData
      }
    },

    handleSure () {
      this.showDialogVisible = false
    },

    handleAdd () {
      const param = {
        'section_id': Date.now(),
        'x': '',
        'y': '',
        'mapping_type': 'random_table',
        'replace_values': ''
      }
      this.section_list.push(param)
    },

    handleEdit (item) {
      if (item.mapping_type === 'random_table') {
        this.codeText = '自定义替换算法-随机码表'
        this.codeMsg = '多个随机值之间用换行分割，如：'
      } else {
        this.codeText = '自定义替换算法-映射码表'
        this.codeMsg = '一对映射值如 aaa:bbb 表示aaa映射成bbb, 多对映射值之间用换行分割，如：'
      }
      this.showCodeTable = true
      // this.codeForm = row.replace_values
      this.tempRow = item
    },

    handleCodeSure () {
      this.showCodeTable = false
      this.tempRow.replace_values = this.codeForm
    },

    handleDel (index) {
      this.section_list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.security-wrapper {
  position: relative;
  height: 100%;
  .el-divider--vertical {
    height: 135px !important;
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .test-wrapper {
    display: flex;
    gap: 10px;
    .left {
      flex: 1;
    }
    .center {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .import {
      width: 558px;
    }
    .export {
      width: 280px;
      .content {
        padding: 20px 10px;
        background-color: #f7f8f9;
        border-color: #e4e7ed;
        border: 1px solid;
        color: #c0c4cc;
        height: calc(100% - 50px);
      }
    }
  }
  .params2 {
    background-color: #fff;
    padding: 10px 10px 20px;
    max-height: 240px;
    overflow: auto;
  }
}
</style>
