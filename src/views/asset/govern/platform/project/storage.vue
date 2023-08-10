<template>
  <section class="platform-self">
    <div class="mb-10">
      <div class="flex">
        <el-select v-model="form.state" filterable clearable placeholder="请选择治理项状态" @change.self="changehandle">
          <el-option v-for="item in typeList1" :key="item.value" :label="item.name" :value="item.value">
          </el-option>
        </el-select>
        <el-input v-model="form.itemName"  prefix-icon="el-icon-search" @change="changehandle" clearable placeholder="请输入治理项名称" class="input-value ml-10 mr-10"></el-input>
      </div>
      <div class="mb-5">
        <SelectFooter @checkAllChange="checkAllChange" :multipleSelection="multipleSelection" :tableData="data"  @batchDel="handleDelete"></SelectFooter>
      </div>
    </div>
    <el-card>
      <el-table  ref="multipleTable"  :data="data" border style="width: 100%" v-loading="!!loading" @selection-change="handleSelectionChange" fit>
        <template slot="empty">
            <!-- <el-empty :image-size="100" description="暂无数据"></el-empty> -->
            <img src="@/assets/images/nodata.png" alt="">
            <p>暂无数据</p>
        </template>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="治理项名称" prop="itemName" :width="flexColumnWidth('itemName',data)">
          <template slot-scope="scope">
            <div class="col-1">
              <i class="iconfont icon-project"></i>
              <span>{{ scope.row.itemName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="创建人" min-width="100" prop="createPerson"></el-table-column>
        <el-table-column label="创建时间" min-width="130" prop="createTime"></el-table-column>
        <el-table-column label="治理项描述"  prop="itemComment" :width="flexColumnWidth('itemComment',data)"></el-table-column>
        <el-table-column label="状态" min-width="80px" prop="state">
          <template slot-scope="scope">
            <div>{{ scope.row.state === 0 ? '激活' : '失效' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="模型名称" min-width="280" prop="modelName"></el-table-column>
        <el-table-column label="操作" width="70px" style="white-space: nowrap; display: inline-block;" >
          <template slot-scope="scope" >
                <div class="optionDiv'" style="white-space: nowrap; display: inline-block;">
                  <el-tooltip v-if="scope.row.state === 0" class="item" effect="dark" content="失效" placement="top-start">
                    <el-button type="text" style="font-size: 24px;" @click="loseEfficacyClick(scope.row)"><i class='iconfont icon-tishi'></i></el-button>
                  </el-tooltip>
                  <el-tooltip v-if="scope.row.state === 1" class="item" effect="dark" content="激活" placement="top-start">
                    <el-button type="text" style="font-size: 24px;" @click="loseEfficacyClick(scope.row)"><i class='iconfont icon-jihuo'></i></el-button>
                  </el-tooltip>
                </div>
            </template>
        </el-table-column>
        </el-table>
    </el-card>
    <el-pagination
    class="fr pt-10 pb-10"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page.sync="form.pageNo"
    :page-sizes="[15, 25, 50, 100]"
    :page-size="form.pageSize"
    layout="total, sizes, prev, pager, next"
    :total="total">
    </el-pagination>
  </section>
</template>

<script>
import SelectFooter from './footer'
// import pager from '@/mixins/pager'
import { modifyItemState } from '@/api/govern/platform'
export default {
  name: 'PlatformSelf',
  components: {
    SelectFooter,
    // detailsPage,
    // TablepageDetail,
  },
  props: {
      data: Array,
      verifica: Object,
      total: Number,
      selectIndex3: Number,
      selectIndex: Number,
      selectIndex2: Number,
      sourceType: String,
  },
  // mixins: [pager],
  data () {
    return {
      multipleSelection: [],
      state: '',
      detailCollapse: false,
      // personList: [],
      fullscreen: false,
      cellWidth: 280,
      bodyHeight: 400,
      windheight:0,
      setheight: 0,
      detailsList: {},
      yarnData: {},
      visible: false,
      visibleYarn: false,
      checked: '',
      menName: '',
      radio: '',
      iceformData: {
        iceSnapTime: '',
        iceSnapTimeOut: '',
      },
      typeList1: [
        {value: 0, name: '激活'},
        {value: 1, name: '失效'}
      ],
      typeList2: [],
      form: {
          state: '',
          itemName: '',
          pageSize: 15,
          pageNo: 1,
      },
      // total: 0,
      formData: {
        lifeCycle: '',
        num: ''
      },
      loading: 0,
      tableData: [],
      // multipleSelection: [],
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      springData: '',
      newLifecycle: '',
      iscode: true,
      isdisabled: false,
      detailed: [],
    }
  },
  watch: {
    data: {
      handler(val) {
        this.detailCollapse = false
        this.visible =  false
        this.visibleYarn = false
      }
    },
  },
  mounted () {
  },
  updated() {
  },
  methods: {
    // 自适应表格列宽
    flexColumnWidth(str, tableData) {
            // str为该列的字段名(传字符串);tableData为该表格的数据源(传变量);
            // flag为可选值，可不传该参数,传参时可选'max'或'equal',默认为'max'
            // flag为'max'则设置列宽适配该列中最长的内容,flag为'equal'则设置列宽适配该列中第一行内容的长度。
            str = str + ''
            let columnContent = ''
            if (!tableData || !tableData.length || tableData.length === 0 || tableData === undefined) {
                return
            }
            if (!str || !str.length || str.length === 0 || str === undefined) {
                return
            }
              // 获取该列中最长的数据(内容)
            let index = 0
            for (let i = 0; i < tableData.length; i++) {
              if (tableData[i][str] === null) {
                  return
              }
              const now_temp = tableData[i][str] + ''
              const max_temp = tableData[index][str] + ''
              if (now_temp.length > max_temp.length) {
                  index = i
              }
            }
            columnContent = tableData[index][str]
            let flexWidth = 0
            for (const char of columnContent) {
                if ((char >= 'A' && char <= 'Z') || (char >= 'a' && char <= 'z')) {
                // 如果是英文字符，为字符分配8个单位宽度
                flexWidth += 8
                } else if (char >= '\u4e00' && char <= '\u9fa5') {
                // 如果是中文字符，为字符分配15个单位宽度
                flexWidth += 15
                } else {
                // 其他种类字符，为字符分配8个单位宽度
                flexWidth += 7
                }
            }
            if (str === 'itemName') {
              flexWidth = flexWidth + 80
            } 
            if (str === 'itemComment') {
              flexWidth = flexWidth + 100
            }
            return flexWidth + 'px'
      },
    handleDelete(val) {
      const stateList=this.multipleSelection.map(item => item.state)
      let isstate = []
      if (val === '激活') {
        isstate=stateList.every(item => item === 1)
      } else {
        isstate=stateList.every(item => item === 0)
      }
      if (this.multipleSelection.length > 0) {
        if (isstate) {
          const itemId = this.multipleSelection.map(item => item.itemId)
          const data = {
            itemIds: itemId + '',
            state: val === '激活' ? 0 : 1,
          }
          // this.modifyItemState(data)
          this.$confirm(`确定要将这些治理项${val}?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.modifyItemState(data)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        } else {
          this.$message({
            type: 'warning',
            message: `批量${val}，只能选择已经${val === '激活' ? '失效' : '激活'}的治理项`
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择治理项'
        })
      }
      
    },
    handleLifeCycle(val) {
      const stateList=this.multipleSelection.map(item => item.state)
      const isstate=stateList.every(item => item === 0)
      if (isstate) {
        const itemId = this.multipleSelection.map(item => item.itemId)
        const data = {
          itemIds: itemId + '',
          state: 0,
        }
        this.modifyItemState(data)
        this.$confirm(`确定要将该治理项${state}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.modifyItemState(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '批量失效，只能选择已经激活的治理项'
        })
      }
    },
    checkAllChange(boolean) {
      if (boolean) {
        this.data.forEach(item => {
          this.$refs.multipleTable.toggleAllSelection(item)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (row) {
      this.multipleSelection = row
    },
    loseEfficacyClick(val) {
      const state = val.state === 1 ? '激活' : '失效'
      this.$confirm(`确定要将该治理项${state}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params={
          state: val.state === 1 ? 0 : 1,
          itemIds: val.itemId
        }
        this.modifyItemState(params)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    async modifyItemState(data) {
      const res = await this.$simpleAsyncTo(modifyItemState(data), '')
      if (res) {
        this.$emit('select', this.form)
        this.$message({
          type: 'success',
          message: '成功'
        })
      }
    },
    // 关闭
    close() {
      this.visible =  false
    },
    collapsefun(val) {
      this.detailCollapse = val
      this.visible =  false
      this.visibleYarn = false
    },
    
    
    handleSizeChange(val) {
      this.form.pageSize = val
      this.handleCurrentChange(1)
    },
    handleCurrentChange(val) {
      this.form.pageNo = val
      this.$emit('select', this.form)
    },
    searchChange (val) {
    },
   
    changehandle(val) {
      this.$emit('select', this.form)
    },
   
   

   

   
   

    

    
  }
}
</script>

<style lang="scss">
.platform-self {
  .mb-10{
    // border: 1px solid black;
    display: flex;
    position: relative;
    .mb-5{
      position: absolute;
      min-width: 320px;
      right: 0;
      bottom: -20px;
    }
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
  .unit {
    color: #999;
    margin-left: 5px;
  }
  .input-value {
    width: 200px;
  }
  .num-input {
    width: 100px;
    margin-left: 5px;
    margin-right: 5px;
  }
  .dialog {
    .el-dialog__body {
      .el-form .el-form-item__content{
        display: flex;
        .el-button {
          margin-left: 40px;
        }
        .el-input {
          width: 50%;
        }
      }
    }
    
  }
  .col-1{
    display: flex;
    align-items: center;
    height: 30px;
    .iconfont{
      // margin-top: 10px;
      font-size: 28px;
      color: #68b6b0;
      margin-right: 8px;
    }
  }
  .menNameform {
    .el-table {
      height: 350px;
      overflow: auto;
    }
  }
}
</style>

