<template>
  <!-- <SimpleEditDialog
      :visible="isVisible"
      @close="close"
      @confirm="confirm"
      width="560px"
      top="25vh"
      class="category-sort"
    >
    <div slot="title">批量工厂标签归类(当前分类：其他标签)</div>
  </SimpleEditDialog> -->
  <el-dialog :visible="isVisible" class="category-sort" width="680px">
    <div slot="title" class="title">批量工厂标签归类<span class="font-12 ml-10">(当前分类：{{curData.length&&curData[0].label_category}})</span></div>
    <el-row style="width:100%">
      <el-col :span="10" style="height:100%;overflow-y:auto;border-right:1px solid #ccc">
        <div class="label-sort mb-10 mr-10 mt-10" v-for="(item, index) in curData" :key="item.name">
          <div>
            <div>
              <i class="iconfont icon-biaoqian"></i>
            </div>
            <div>
              <div class="first-text">
                <span>{{item.name}}</span>
              </div>
              <div class="second-text">
                <span>{{item.code}}</span>
              </div>
            </div>
          </div>
          <div>
            <i class="el-icon-delete" @click="delSort(item, index)" style="cursor: pointer;" v-if="curData.length > 1"></i>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="sort-right-content">
          <div class="right-title my-btn mt-10">
            <span class="font-14 ml-20">归类至</span>
            <el-button type="primary mr-20" icon="el-icon-plus" @click="add">新建类目</el-button>
          </div>
          <div class="select-leimu pl-20 mt-20">
            <span>已选（单选）</span>
            <span style="opacity: .6;" v-if="category_id===''">暂未选择分类</span>
            <span class="cur-item" v-else>
              <OverflowTooltip style="width:calc(100% - 10px)">{{curCategory.category_name}}</OverflowTooltip>
              <span class="selected-option-close"><i class="el-icon-close" @click="closeSelect"></i></span>
            </span>
          </div>
          <div class="pl-20 pr-20 mt-20 my-select-leimu">
            <!-- <el-select v-model="value" placeholder="搜索分类">
              <el-option
                v-for="item in categoryList"
                :key="item.category_name"
                :label="item.category_name"
                :value="item.id">
              </el-option>
            </el-select> -->
            <el-select v-model="category_id" placeholder="请选择" ref="treeSelect" popper-class="select-tree">
              <el-option :label="category_name" :value="category_id" style="max-height:auto;background-color:#fff">
                <el-tree :data="treeData" :props="defaultProps" :current-node-key="currentNodeKey" node-key="id" accordion :highlight-current="true" :expand-on-click-node="false" @node-click="handleNodeClick" ref="tree" style="font-weight: 400">
                </el-tree>
              </el-option>
            </el-select>
          </div>
        </div>
      </el-col>
    </el-row>
    <div slot="footer" class="my-btn">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" class="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  queryCategory,
  classifyOper,
  getTabCategoryList
} from '@/api/rd/exreact/tag-center'
import { mapGetters, mapMutations } from 'vuex'
import OverflowTooltip from '@c/overflow-tooltip'
export default {
  name: 'CategorySory',
  props: {
    data: {
      type: Array
    },
    type: String
  },
  components: {
    OverflowTooltip
  },
  watch: {
    data: {
      handler (val) {
        this.curData = val
      },
      deep: true,
      immediate: true
    },
    category_id: {
      handler (val) {
        this.curCategory = { category_id: val, category_name: this.category_name }
      }
    }
  },
  computed: {
    ...mapGetters(['project'])
  },
  data () {
    return {
      isVisible: true,
      curData: [],
      categoryList: [],
      value: '',
      curCategory: {},
      category_id: '',
      category_name: '',
      treeData: [],
      defaultProps: {
        children: 'child',
        label: 'name'
      },
      currentNodeKey: ''
    }
  },
  created () {
    this.$root.eventEmitter.on('refresh', type => {
      this._queryCategory()
    })
  },
  mounted () {
    this._queryCategory()
    this.getTreeData()
  },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    async _queryCategory () {
      const res = await this.$simpleAsyncTo(queryCategory({ project_code: this.project.project_code }))
      if (res) {
        this.categoryList = res.data
      }
    },
    close (data) {
      this.$emit('closeSort', data)
    },
    async confirm () {
      if (!this.category_id) return this.$message({ type: 'error', message: '请选择类目' })
      const ids = this.curData.map(item => item.id)
      const params = {
        type: this.type === 'factory' ? 'factoryLabel' : 'manualLabel',
        category_id: this.curCategory.category_id,
        label_category: this.curCategory.category_name,
        ids: JSON.stringify(ids)
      }
      const res = await this.$simpleAsyncTo(classifyOper(params), '操作失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.close('success')
      }
    },
    closeSelect () {
      this.currentNodeKey = ''
      this.category_id = ''
      this.category_name = ''
      this.curCategory = {}
    },
    delSort (item, index) {
      this.curData.splice(index, 1)
      this.$emit('delSort', this.curData)
    },
    add () {
      this.setActiveRdEditDialog({
        title: '新建标签类目',
        component: `CategoryEdit`,
        data: { ...this.project }
      })
    },
    handleNodeClick (data, node) {
      this.category_id = data.id
      this.category_name = data.name
    },
    async getTreeData () {
      const params = {
        project_code: this.project.project_code
      }
      const res = await this.$simpleAsyncTo(getTabCategoryList(params), '获取失败')
      if (res) {
        this.treeData = []
        this.recursionTreeData(res.data.child, this.treeData)
        console.log(this.treeData)
      }
    },
    recursionTreeData (nodes, arr = []) {
      for (let item of nodes) {
        if (item.name === '工厂标签' || item.name === '手工标签') continue
        let obj = { ...item, child: [] }
        arr.push(obj)
        if (item.child && item.child.length) this.recursionTreeData(item.child, obj.child)
      }
      return arr
    }
  }
}
</script>

<style lang="scss">
.category-sort {
  .el-dialog__body {
    height: 460px;
    display: flex;
    padding: 0;
    padding-left: 20px;
    .label-sort {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 12px;
      background-color: $grey10;
      > div:first-child {
        display: flex;
        align-items: center;
        > div:first-child {
          width: 30px;
          height: 30px;
          background-color: #6ca0f5;
          text-align: center;
          line-height: 30px;
          margin-right: 10px;
          i {
            color: #fff;
            font-size: 24px;
            vertical-align: bottom;
          }
        }
      }
      > div:last-child {
        i {
          display: none;
        }
      }
      &:hover {
        > div:last-child {
          i {
            display: inline-block;
          }
        }
      }
    }
    .sort-right-content {
      .right-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .select-leimu {
        display: flex;
        align-items: center;
        height: 28px;
        .cur-item {
          display: inline-flex;
          overflow: hidden;
          height: 28px;
          flex-shrink: 0;
          align-items: center;
          padding: 0 0 0 12px;
          border: 1px solid rgba(33, 83, 212, 0.3);
          margin-right: 10px;
          background-color: rgba(33, 83, 212, 0.05);
          color: #2153d4;
          margin-left: 5px;
          &:hover {
            border: 1px solid rgba(33, 83, 212, 0.5);
            background-color: #fff;
          }
          .selected-option-close {
            position: relative;
            width: 14px;
            height: 14px;
            align-self: flex-end;
            margin-right: -20px;
            margin-left: 3px;
            background: #2153d4;
            cursor: pointer;
            transform: skewX(-45deg);
            i {
              position: absolute;
              top: 4px;
              right: 1.5px;
              color: hsla(0, 0%, 100%, 0.7);
              font-weight: bolder;
              transform: skewX(45deg) scale(0.45);
              transition: transform 0.2s ease;
            }
          }
        }
      }
      .my-select-leimu {
        .el-input__inner {
          border-radius: 0;
        }
      }
    }
  }
  .title {
    > span {
      opacity: 0.6;
    }
  }
}
.select-tree {
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
}
</style>
