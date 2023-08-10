<template>
  <el-dialog
    class="id-type-manage"
    :visible.sync="visible"
    @close="$emit('idTypeManageClose')"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="850px">
    <div slot="title" class="title">
      <div class="mr-20">
        <span>ID类型管理</span>
        <el-tooltip class="item ml-10" effect="dark" content="若无您所需ID类型，可点击右上角新增ID类型进行新建" placement="top">
          <i class="el-icon-warning-outline font-14"></i>
        </el-tooltip>
      </div>
      <div class="mr-40 my-btn">
        <span  class="mr-15"><el-checkbox v-model="checked">仅显示自定义</el-checkbox></span>
        <el-button @click="addIdType" icon="el-icon-plus">新增ID类型</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      v-loading="loading"
      style="width: 100%"
      max-height="350px">
      <el-table-column
        prop="idType"
        label="ID类型">
        <template slot-scope="scope">
          <OverflowTooltip style="width:calc(100% - 20px)" v-if="!scope.row.isSave">{{scope.row.idName}}</OverflowTooltip>
          <el-select v-model="scope.row.idType" v-if="scope.row.isSave">
            <el-option
              v-for="item in mappingIdList"
              :key="item.idType"
              :value="item.idType"
              :label="item.idName"
            ></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="mappingId"
        label="ID归一化">
        <template slot-scope="scope">
          <OverflowTooltip style="width:calc(100% - 20px)" v-if="!scope.row.isSave">{{scope.row.mappingName}}</OverflowTooltip>
          <el-select v-model="scope.row.mappingId" placeholder="请选择" v-if="scope.row.isSave">
            <el-option
              v-for="item in idNormalizeConfigList"
              :key="item.id"
              :label="item.sourceMappingCode"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作" width="80px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" v-if="!scope.row.isSave" class="font-18" @click="del(scope.row)"></el-button>
          <div v-else>
            <el-button type="text" icon="el-icon-check" class="font-18 success" @click="add(scope.row)"></el-button>
            <el-button type="text" icon="el-icon-close" class="font-18 error" @click="delNewAdd(scope.$index)"></el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <div class="font-12">
        <span>查看
          <el-popover
            placement="top-start"
            trigger="hover">
            <p class="mb-20">ID倒排表参考 <span style="opacity: .4;">在数据萃取对应的项目中，开发上线ID倒排表</span></p>
            <el-table :data="gridData">
              <el-table-column width="150" property="field" label="字段"></el-table-column>
              <el-table-column width="350" property="desc" label="描述"></el-table-column>
              <el-table-column width="250" property="value" label="参考值"></el-table-column>
            </el-table>
            <a href="javascript:;" slot="reference">ID倒排表</a>
          </el-popover>
          获取更多
          <a href="javascript:;">ID类型</a>
          参考
        </span>
      </div>
      <div class="my-btn">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" class="primary" @click="confirm">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getIdTypeList, deleteIdTypeNew, asveIdTypeNew, getIdNormalizeConfigList, getListAll } from '@/api/rd/exreact/regular'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'IdTypeManage',
  components: {
    OverflowTooltip
  },
  data() {
    return {
      visible: true,
      checked: false,
      loading: false,
      tableData: [],
      gridData: [
        {
          field: 'oneid',
          desc: '唯一识别对象的id值，id类型为OneId，可根据oneid找到对应任意key_type值的key_id',
          value: '生成规则#关键ID类型#随机生成不重复24位编码, eg:#Dcard#62791010…29929200202'
        },
        {
          field: 'key_type',
          desc: '系统中存在的ID类型，根据业务系统中存在的可识别对象的数据，设定的枚举值',
          value: 'OneID（系统默认的归一后ID的ID类型），Mobile，IDcard，等大小写不敏感'
        },
        {
          field: 'key_id',
          desc: '该key|_type对应的具体id值',
          value: '具体的ID取值，如OneID类型取值为‘#关键ID类型#随机生成不重复24位编码’，Mobile类型的ID取值为‘+86具体手机号'
        }
      ],
      idNormalizeConfigList: [],
      mappingIdList: []
    }
  },
  async created() {
    this.loading = true
    await this.getIdTypeList()
    await this._getIdNormalizeConfigList()
    await this._getListAll()
  },
  methods: {
    async getIdTypeList() {
      const res = await this.$simpleAsyncTo(getIdTypeList(), '获取失败')
      if (res) {
        this.mappingIdList = res.data
      }
    },
    async _getListAll(loading = true) {
      this.loading = loading
      const res = await this.$simpleAsyncTo(getListAll(), '获取数据ID类型列表失败')
      if (res) {
        this.tableData = (res.data || []).map(d => {
          return {
            ...d,
            isSave: false
          }
        })
      }
      this.loading = false
    },
    addIdType() {
      this.tableData.push(
        {
          isSave: true,
          idType: '',
          system_type: '自定义',
          id_type_desc: ''
        }
      )
    },
    async add(row) {
      if (row.idType === '') return this.$message({type: 'error', message: 'id类型不能为空'})
      const params = {
        idType: row.idType,
        mappingId: row.mappingId
      }
      const res = await this.$simpleAsyncTo(asveIdTypeNew(params), '新增失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '新增成功'
        })
        this._getListAll()
      }
    },
    async del(row) {
      const res = await this.$simpleAsyncTo(deleteIdTypeNew({id: row.id}), '删除失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this._getListAll()
      }
    },
    delNewAdd(index) {
      this.tableData.splice(index, 1)
    },
    close() {
      this.$emit('idTypeManageClose')
    },
    async _getIdNormalizeConfigList() {
      const res = await this.$simpleAsyncTo(getIdNormalizeConfigList(), '获取数据失败')
      if (res) {
        this.idNormalizeConfigList = res.data
      }
    },
    confirm() {
      const arr = this.tableData.filter(item => {
        return item.isSave
      })
      if (arr && arr.length) {
        this.$message({
          type: 'error',
          message: '请先保存'
        })
      } else {
        this.close()
      }
    }
  }
}
</script>

<style lang="scss">
.id-type-manage {
  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
