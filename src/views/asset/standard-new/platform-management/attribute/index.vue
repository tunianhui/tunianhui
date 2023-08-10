
<template>
  <section class="trashlist">
    <ListHeader title="公共标准集属性" class="mb-10" @clickAddAttr="clickAddAttr"></ListHeader>

    <div class="table-wrapper">
      <div class="table" v-resize="resizeDom">
        <el-table ref="multipleTable" :height="height" :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="属性名称">
            <template slot-scope="scope">
              <span>{{scope.row.attributeDto.name}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="属性编码">
            <template slot-scope="scope">
              <span>{{scope.row.attributeDto.code}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="属性类型">
            <template slot-scope="scope">
              <span>{{attributeType[scope.row.attributeDto.type]}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="required" label="是否必填">
            <template slot-scope="scope">
              <span v-if="scope.row.attributeDto.required">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column label="字段类型">
            <template slot-scope="scope">
              <span>{{fieldDataType[scope.row.attributeDto.valueConfig.valueDataType]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="字段长度">
            <template slot-scope="scope">
              <span>{{scope.row.attributeDto.valueConfig.valueLength}}</span>
            </template>
          </el-table-column>
          <el-table-column label="取值">
            <template slot-scope="scope">
              <span>{{fieldAttrType[scope.row.attributeDto.valueConfig.valueType]}}</span>
            </template>
          </el-table-column>
          <el-table-column label="取值约束">
            <template slot-scope="scope">
              <span>{{scope.row.attributeDto.valueConfig.valueRange.valueConstraint === 'NONE' ? '无' : '有'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="默认值">
            <template slot-scope="scope">
              <span>{{scope.row.attributeDto.valueConfig.defaultValue}}</span>
            </template>
          </el-table-column>
          <el-table-column label="描述" min-width="200">
            <template slot-scope="scope">
              <span>{{scope.row.attributeDto.description}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="复制" placement="top">
                <el-button type="text"><i class="iconfont icon-fuzhi font-14 color-btn" @click="handleCopy(scope.row)"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDelete(scope.row)"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foot">
        <el-pagination layout="prev, pager, next, sizes" :pager-count="5" :page-sizes="[10, 20, 30, 40]" :total="total">
        </el-pagination>
      </div>
    </div>
    <AttributeModal v-if="visible" :title="attributeModalTitle" @close="visible = false"></AttributeModal>
  </section>
</template>

<script>
import ListHeader from './list-header.vue'
import pager from '@/mixins/pager'
import AttributeModal from './modal.vue'
import {
  getFuzzySearchList
} from '@/api/asset/platform-managemen.js'
export default {
  name: 'Rule',
  components: {
    ListHeader,
    AttributeModal
  },
  mixins: [pager],
  data () {
    return {
      form: {
      },
      loading: false,
      tableData: [],
      height: 0,
      visible: false,
      attributeModalTitle: '新增属性',
      total: 0,
      attributeType: {
        'BIZ_ATTRIBUTE': '业务属性',
        'TECH_ATTRIBUTE': '技术属性',
        'MANAGEMENT_ATTRIBUTE': '管理属性',
        'QUALITY_ATTRIBUTE': '质量属性',
        'MASTER_DATA_ATTRIBUTE': '主数据属性',
        'LIFECYCLE_ATTRIBUTE': '生命周期属性',
        'SECURITY_ATTRIBUTE': '安全属性',
      },
      fieldAttrType: {
        'CUSTOMIZED': '自定义输入',
        'SINGLE_ENUM': '枚举值(单选)',
        'MULTIPLE_ENUMS': '枚举值(多选)',
        'RANGE': '范围值',
      },
      fieldDataType: {
        'STRING': '字符型',
        'BIGINT': '数值型',
        'DOUBLE': '数值型',
        'DATE': '日期时间型',
        'DATETIME': '日期时间型',
        'BOOLEAN': '布尔型',
      },
    }
  },
  created() {
    this._getFuzzySearchList()
  },
  mounted () { },
  methods: {
    async _getFuzzySearchList() {
      this.loading = true
      const res = await this.$simpleAsyncTo(getFuzzySearchList(), '获取数据失败')
      if (res) {
        this.tableData = res.data.totalList
        this.total = res.data.total
      }
      this.loading = false
    },
    resizeDom (data) {
      this.height = parseInt(data.height)
    },
    // 编辑
    handleEdit (item) {
      this.visible = true
      this.attributeModalTitle = '编辑公共标准集属性'
    },
    // 新增
    clickAddAttr () {
      this.attributeModalTitle = '新建公共标准集属性'
      this.visible = true
    },
    // 复制
    handleCopy() {},
    // 删除
    handleDelete() {
      this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.trashlist {
  position: relative;
  height: 100%;
  .table-wrapper {
    height: calc(100% - 40px);
    position: relative;
    flex: 1;
    padding: 10px;
    background: #fff;
    .table {
      height: calc(100% - 40px);
    }
    .foot {
      height: 40px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 15px;
    }
  }
  .icon {
    font-size: 24px;
    color: #4783ff;
  }
  .input-value {
    width: 200px;
  }
}
</style>
