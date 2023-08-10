<template>
  <section class="side-attr">
    <div class="subtitle">
      <div>
        <OverflowTooltip class="mr-10" style="width:calc(100% - 30px)">{{infos.cube_code}}</OverflowTooltip>
        <!-- <span class="status-tag-right">{{getDicsValue('status_tag', data.data.status)}}</span> -->
        <!-- <span class="status-tag-right">{{getDicsValue('status_tag',  data.data.status)}}</span> -->
      </div>
      <div class="attr-name1">
        行为规则ID：
        <OverflowTooltip class="" style="width:calc(100% - 80px)">{{infos.id}}</OverflowTooltip>
      </div>
      <div class="attr-name1 mb-5">
        行为：
        <OverflowTooltip class="" style="width:calc(100% - 50px)">{{infos.base_name}}</OverflowTooltip>
      </div>
    </div>
    <div class="operate-btn my-btn mt-20">
      <el-button type="primary" class="primary" @click.stop="editHandle(curData)">
        <i class="el-icon-edit-outline"></i>
        编辑
      </el-button>
      <el-button type="primary" class="primary" @click.stop="addData(curData)">
        <i class="iconfont icon-bushuju"></i>
        补数据
      </el-button>
      <el-dropdown class="my-el-dropdown ml-10" @command="handleCommand" placement="bottom-end">
        <el-button type="primary">
          <i class="iconfont icon-gengduo"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="my-el-dropdown-menu">
          <el-dropdown-item icon="el-icon-document-copy" command="cloneHandle">克隆</el-dropdown-item>
          <el-dropdown-item icon="iconfont icon-biaoqian1" command="seeTagTaskHandle">标签任务</el-dropdown-item>
          <el-dropdown-item icon="iconfont icon-xiaxian" command="offlineHandle">下线</el-dropdown-item>
          <el-dropdown-item icon="el-icon-delete" command="delHandle">下线并删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="my-content mt-20">
      <div class="my-basc mb-20">
        <div class="my-title">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">基本信息</span>
        </div>
        <div style="padding:10px 0 20px 0">
          <el-form label-width="140px">
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">行为英文名：</span>
              </div>
              <OverflowTooltip class="font-12" style="width:calc(100% - 30px)">{{infos.base_code}}</OverflowTooltip>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D">来源表筛选条件：</span>
              </div>
              <OverflowTooltip class="font-12" style="width:calc(100% - 30px)">{{infos.cube_code}}</OverflowTooltip>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">更新人：</span>
              </div>
              <OverflowTooltip class="font-12" style="width:calc(100% - 30px)">{{infos.oper_user}}</OverflowTooltip>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">更新时间：</span>
              </div>
              <OverflowTooltip class="font-12" style="width:calc(100% - 30px)">{{infos.oper_time}}</OverflowTooltip>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">最近补数据：</span>
              </div>
              <span class="font-12">成功</span>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
              <div slot="label">
                <span style="color: #7C7C7D" class="font-12">补数据记录：</span>
              </div>
              <span class="font-12"><i class="iconfont icon-huishuajilu"></i></span>
            </el-form-item>
          </el-form>
        </div>
        <div class="my-title">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">消费信息</span>
        </div>
        <el-form label-width="140px">
          <el-form-item style="margin-bottom:0">
            <div slot="label">
              <span style="color: #7C7C7D" class="font-12">标签依赖：</span>
            </div>
            <OverflowTooltip class="font-12" style="width:calc(100% - 30px);color: #0c4cff;cursor: pointer;" v-for="item in infos.labels" :key="item.label_code">{{item.label_code}}： {{item.label_name}}</OverflowTooltip>
          </el-form-item>
          <el-form-item style="margin-bottom:0">
            <div slot="label">
              <span style="color: #7C7C7D" class="font-12">资产详情：</span>
            </div>
            <OverflowTooltip class="font-12" style="width:calc(100% - 30px);color: #0c4cff;cursor: pointer;">{{infos.produce}}</OverflowTooltip>
          </el-form-item>
        </el-form>
        <div class="my-title mt-10">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">行为主体信息</span>
        </div>
        <el-table :data="mainTableData" style="width: 100%" class="act-weigth mt-10" :span-method="(({ row, column, rowIndex, columnIndex }) => objectSpanMethod({ row, column, rowIndex, columnIndex }, spanArr2))">
          <el-table-column prop="name" label="行为主体">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.name}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="idType" label="ID_Type">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.idType}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="idValue" label="ID_Value">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.idValue}}</OverflowTooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="my-title mt-10">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">对象信息</span>
        </div>
        <el-table :data="objectTableData" style="width: 100%" class="act-weigth mt-10">
          <el-table-column prop="name" label="对象">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.name}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="标识符">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.value}}</OverflowTooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="my-title mt-10">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">对象属性信息</span>
        </div>
        <el-table :data="objectAttrTableData" :span-method="(({ row, column, rowIndex, columnIndex }) => objectSpanMethod({ row, column, rowIndex, columnIndex }, spanArr1))" style="width: 100%" class="act-weigth mt-10">
          <el-table-column prop="name" label="对象属性">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 15px)">{{scope.row.name}}</OverflowTooltip>
              <OverflowTooltip style="width:calc(100% - 15px)">{{scope.row.code}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="object_attr_code" label="属性">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.object_attr_code}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="source_attr" label="属性值">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.source_attr}}</OverflowTooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="my-title mt-10">
          <span class="my-spot mr-10"></span>
          <span class="my-label font-14">行为属性</span>
        </div>
        <el-table :data="actAttrTableData" :span-method="(({ row, column, rowIndex, columnIndex }) => objectSpanMethod({ row, column, rowIndex, columnIndex }, spanArr))" style="width: 100%" class="act-weigth mt-10">
          <el-table-column prop="name" label="对象属性">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.name}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="behavior_attr" label="属性">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.behavior_attr}}</OverflowTooltip>
            </template>
          </el-table-column>
          <el-table-column prop="source_attr" label="属性值">
            <template slot-scope="scope">
              <OverflowTooltip style="width:calc(100% - 5px)">{{scope.row.source_attr}}</OverflowTooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </section>
</template>

<script>
import rdAttr from '@/mixins/rd-attr'
import OverflowTooltip from '@c/overflow-tooltip'
import { types } from '@/config/rd-config'
import {
  getAttrInfos
} from '@/api/rd/exreact/regular'
export default {
  name: 'RegularAttr',
  components: {
    OverflowTooltip
  },
  mixins: [rdAttr],
  inject: ['tabStore', 'editComponentsMap', 'attrStore', 'fileStore'],
  data () {
    return {
      curData: {},
      actAttrTableData: [],
      types,
      infos: {},
      mainTableData: [],
      objectTableData: [],
      objectAttrTableData: [],
      spanArr: [],
      spanArr1: [],
      spanArr2: [],
      pos: '',
      pos1: '',
      pos2: ''
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler (val) {
        this.curData = this.data.data
        this._getAttrInfos()
      }
    }
  },
  created () {
    // this.curData = this.data.data
  },
  async mounted () {
    // await this._getAttrInfos()
  },
  methods: {
    remove () { },
    editHandle (data) {
      const opt = {
        label: data.label,
        data: data,
        tabType: this.types.REGULAR,
        name: data.id,
        component: 'RegularEdit'
      }
      this.tabStore.commit('add', opt)
      this.fileStore.commit('add', opt)
      this.fileStore.commit('setActiveToFirst', opt)
    },
    addData (data) { },
    handleCommand (data) {
      this[data]()
    },
    // 属性信息
    async _getAttrInfos () {
      const res = await this.$simpleAsyncTo(getAttrInfos({ id: this.curData.id }), '获取数据失败')
      if (res) {
        this.infos = res.data
        // this.mainTableData = [{
        //   rule_name: 'ID归一化配置:Y',
        //   id_type: res.data.id_type,
        //   id_value: res.data.id_value
        // }]
        this.mainTableData = res.data.actorInfos.map(d => {
          return {
            ...d,
            name: '行为主体',
            code: 'main'
          }
        })
        this.getSpanArr2(this.mainTableData)
        this.objectTableData = [
          {
            name: '对象标识',
            value: res.data.object_id
          },
          {
            name: '对象名称',
            value: res.data.object_name
          }
        ]
        this.objectAttrTableData = res.data.objectInfos.map(item => {
          return {
            ...item,
            name: '对象属性',
            code: 'object_propertiess'
          }
        })
        this.getSpanArr1(this.objectAttrTableData)
        this.actAttrTableData = res.data.rulesInfos.map(item => {
          return {
            ...item,
            name: '行为属性'
          }
        })

        this.getSpanArr(this.actAttrTableData)
      }
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }, spanArr) {
      if (columnIndex === 0) {
        const _row = spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // objectSpanMethod1({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 0) {
    //     const _row = this.spanArr1[rowIndex]
    //     const _col = _row > 0 ? 1 : 0
    //     return {
    //       rowspan: _row,
    //       colspan: _col
    //     }
    //   }
    // },
    getSpanArr (data) {
      this.spanArr = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          this.spanArr[this.pos] += 1
          this.spanArr.push(0)
        }
      }
    },
    getSpanArr1 (data) {
      this.spanArr1 = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr1.push(1)
          this.pos1 = 0
        } else {
          this.spanArr1[this.pos1] += 1
          this.spanArr1.push(0)
        }
      }
    },
    getSpanArr2 (data) {
      this.spanArr2 = []
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr2.push(1)
          this.pos2 = 0
        } else {
          this.spanArr2[this.pos2] += 1
          this.spanArr2.push(0)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.attr-name1 {
  font-weight: 400;
  font-size: 12px;
}

</style>
