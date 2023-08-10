<!--
 * @Author: cxm
 * @LastEditors: YONG
 * @Date: 2021-07-20 10:13:03
 * @LastEditTime: 2022-11-02 17:01:47
-->
<template>
  <div class='catalogue-type'>
    <section class="head" ref="head">
      <div class="head-title font-18">类目管理</div>
    </section>
    <el-row class="catalogue-con">
      <el-col :span="5">
        <div class="catalogue-com catalogue-left">
          <div class="left-top mb-10"><i class="type-icon iconfont icon-huanyingye" @click="addCatalogue"></i></div>
          <div class="left-con">
            <el-tree class="catalogue-tree" ref="tree" :data="treeData" :props="treeProps" :node-key="nodeKey" @node-click="nodeClick" :default-expanded-keys="[key]" :default-checked-keys="[key]">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ data.catalog_name }}</span>
                <span>
                  <i class="type-icon iconfont icon-huanyingye" @click.stop="addCatalogue(node, data)"></i>
                  <i class="ml-10 type-icon iconfont icon-shanchu" @click.stop="delCatalogue(node, data)"></i>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="catalogue-com catalogue-right">
          <el-tabs v-model="activeName">
            <el-tab-pane label="类目信息" name="CATALOGUE">
              <AddForm type="edit" :catalog="catalog" @refresh="refresh" v-if="activeName === 'CATALOGUE'"></AddForm>
            </el-tab-pane>
            <el-tab-pane label="数据表" name="DATA">
              <DataTable :catalogId="catalog.catalog_id" v-if="activeName === 'DATA'"></DataTable>
            </el-tab-pane>
            <el-tab-pane label="文件" name="FILE">
              <FileList :catalogId="catalog.catalog_id" v-if="activeName === 'FILE'"></FileList>
            </el-tab-pane>
            <el-tab-pane label="API" name="API">
              <ApiList :catalogId="catalog.catalog_id" v-if="activeName === 'API'"></ApiList>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="新增类目" :visible.sync="addDialogVisible" width="30%" :close-on-click-modal="false" :close-on-press-escape="false">
      <AddForm v-if="addDialogVisible" :parentId="parentId" type="add" @refresh="refresh" @close="cancelAdd"></AddForm>
    </el-dialog>
    <Dialog :visible="visible" :title="title" :data="curData" @close="close" :textTitle="textTitle" :textDes="textDes" @myConfirm="refreshData"></Dialog>
  </div>
</template>

<script>
import mixin from '../mixin'
import AddForm from './add-form'
import DataTable from './data-table/list'
import FileList from './file/list'
import ApiList from './api/list'
import {
  getCatalogList,
  deleteCatalog
} from '@/api/asset/catalogue'
export default {
  name: 'CatalogueType',
  props: {},
  mixins: [mixin],
  components: {
    AddForm,
    DataTable,
    FileList,
    ApiList
  },
  data () {
    return {
      activeName: 'CATALOGUE',
      nodeKey: 'catalog_id',
      key: '',
      treeData: [],
      treeProps: {
        children: 'children',
        label: 'catalog_name'
      },
      addDialogVisible: false,
      curTree: {},
      parentId: '',
      catalog: {}
    }
  },
  computed: {},
  created () {
    this._getCatalogList()
  },
  methods: {
    async _getCatalogList () {
      const res = await this.$simpleAsyncTo(getCatalogList(), '获取失败')
      if (res) {
        if (res.data && res.data.length !== 0) {
          this.key = res.data[0].catalog_id
          this.catalog = res.data[0]
        }
        this.treeData = res.data
      }
    },
    addCatalogue (node, data) {
      console.log(node, data, '===addd')
      if (data) {
        this.curTree = data
        this.parentId = data.catalog_id
      }
      this.addDialogVisible = true
    },
    refresh () {
      this.addDialogVisible = false
      this._getCatalogList()
    },
    cancelAdd () {
      this.addDialogVisible = false
    },
    close () {
      this.visible = false
      this._getCatalogList()
    },
    delCatalogue (node, data) {
      console.log(node, data, node.data, '===del')
      this.visible = true
      this.title = '删除目录'
      this.curData = node.data
      this.textTitle = '是否确认删除该目录？'
      this.textDes = ''
    },
    refreshData () {
      this._deleteCatalog()
    },
    async _deleteCatalog () {
      const params = {
        catalog_id: this.curData.catalog_id
      }
      const res = await this.$simpleAsyncTo(deleteCatalog(params), '删除失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.close()
      }
    },
    nodeClick (data) {
      this.catalog = data
    }
  }
}
</script>

<style lang="scss">
.catalogue-type {
  height: 100%;
  position: relative;
  overflow-y: overlay;
  display: flex;
  flex-direction: column;
  .head {
    padding-top: 10px;
    padding-bottom: 8px;
  }
  .catalogue-con {
    flex: 1;
    .el-col {
      height: 100%;
      .catalogue-com {
        background-color: #fff;
        height: 100%;
        border-radius: 4px;
        padding: 16px;
      }
      .catalogue-left {
        margin-right: 16px;
        .type-icon {
          cursor: pointer;
        }
        .left-top {
          text-align: right;
        }
        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 14px;
          padding-right: 8px;
        }
      }
    }
  }
}

</style>
