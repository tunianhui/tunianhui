
<template>
  <div class="trashlist">
    <ListHeader title="标准集目录" class="mb-10" @clickAddCatelogue="clickAddCatelogue"></ListHeader>
    <div class="table-wrapper">
      <div class="table" v-resize="resizeDom">
        <el-table
          ref="multipleTable"
          :data="tableData"
          lazy
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :load="load"
          style="width: 100%"
          :height="height"
          row-key="id"
        >
          <el-table-column prop="field1" label="目录名称">
          </el-table-column>
          <el-table-column prop="field2" label="目录编码">
          </el-table-column>
          <el-table-column prop="field3" label="标准集总数">
          </el-table-column>
          <el-table-column prop="field4" label="最近更新人"></el-table-column>
          <el-table-column prop="field5" label="最近更新时间"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-tooltip content="新建子目录" placement="top">
                <el-button size="mini" type="text" @click="addSubCatalogue">
                  <i class="iconfont icon-yuanbiao-xianxing font-14 color-btn"></i>
                </el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text"><i class="el-icon-edit-outline font-14 color-btn" @click="handleEdit(scope.row)"></i></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text"><i class="el-icon-delete font-14 color-btn" @click="handleDelete(scope.row)"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="foot">
        <el-pagination layout="prev, pager, next, sizes" :pager-count="5" :page-sizes="[10, 20, 30, 40]" :total="100">
        </el-pagination>
      </div>
    </div>
    <CatelogueModal v-if="visible" :title="catelogueModalTitle" @close="visible = false" :viewType="viewType"></CatelogueModal>
  </div>
</template>

<script>
import ListHeader from './list-header.vue'
import pager from '@/mixins/pager'
import CatelogueModal from './modal.vue'
export default {
  name: 'Rule',
  components: {
    ListHeader,
    CatelogueModal
  },
  mixins: [pager],
  data () {
    return {
      form: {
      },
      loading: 0,
      tableData: [
        {
          id: 1,
          field1: '一级目录',
          field2: 'xxh1',
          field3: '4',
          field4: 'test001',
          field5: '20210803 19:90:13',
          isRoot: true,
          children: [
            {
              id: 2,
              field1: '二级目录',
              field2: 'xxh1',
              field3: '4',
              field4: 'test001',
              field5: '20210803 19:90:13',
              isRoot: false,
            }
          ]
        },
        {
          id: 4,
          field1: 'list_test',
          field2: 'xxh1',
          field3: '4',
          field4: 'test001',
          field5: '20210803 19:90:13',
          isRoot: true,
        }
      ],
      height: 0,
      catelogueModalTitle: '新建一级目录',
      visible: false,
      viewType: ''
    }
  },
  mounted () { },
  methods: {
    resizeDom (data) {
      this.height = parseInt(data.height)
    },
    handleClick (val) { },
    searchChange (val) { },
    // 清除
    handleEdit (item) { },
    load() {},
    // 新建一级目录
    clickAddCatelogue() {
      this.visible = true
      this.catelogueModalTitle = '新建一级目录'
      this.viewType = 'first'
    },
    // 新建子目录
    addSubCatalogue() {
      this.visible = true
      this.catelogueModalTitle = '新建子目录'
      this.viewType = 'second'
    },
    // 编辑
    handleEdit(item) {
      this.visible = true
      if (item.isRoot) {
        this.catelogueModalTitle = '编辑一级目录'
        this.viewType = 'first'
      } else {
        this.catelogueModalTitle = '编辑子目录'
        this.viewType = 'second'
      }
    },
    // 删除
    handleDelete(item) {
      this.$confirm('此操作将永久删除该目录, 是否继续?', '提示', {
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
