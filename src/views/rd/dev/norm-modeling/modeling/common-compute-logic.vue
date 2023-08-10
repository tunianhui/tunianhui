<template>
  <el-dialog
    width="1000px"
    :visible.sync="isVisible"
    class="common-compute-logic"
    @close="close"
    :close-on-click-modal="false"
  >
    <div slot="title">
      <span>定义公用计算逻辑&nbsp;</span>
      <el-tooltip
        content="定义完整 SQL 计算逻辑并赋予命名，在编辑当前逻辑表字段时可直接引用，效果类似临时表或中间表。"
        placement="bottom-start"
      >
        <i class="el-icon-info"></i>
      </el-tooltip>
    </div>
    <div class="flex-layout">
      <div class="ccl-left">
        <el-input
          size="medium"
          v-model="keyword"
          clearable
          placeholder="请输入关键字搜索"
          @input="filterList"
          prefix-icon="el-icon-search"
        ></el-input>
        <el-popover
          width="420"
          popper-class="no-gutter"
          v-model="visibelPopover"
          :offset="20"
          :visible-arrow="false"
          placement="bottom-start"
        >
          <el-form ref="form" :model="filter" :rules="rules" @submit.native.prevent>
            <el-form-item prop="name">
              <el-input
                v-model="filter.name"
                @keyup.native.enter="addListItem"
                maxlength="64"
                show-word-limit
                placeholder="请输入公用计算逻辑名，仅支持英文、数字、下划线"
              ></el-input>
            </el-form-item>
          </el-form>
          <p class="fr">
            <el-button type="default" @click="closePopover">取消</el-button>
            <el-button type="primary" @keyup.native.stop @click="addListItem">确定</el-button>
          </p>
          <p slot="reference">
            <i class="el-icon-plus"></i>
            &nbsp;新建公用计算逻辑
          </p>
        </el-popover>
        <div class="ccl-left-main">
          <ul class="ccl-list" v-show="list.length">
            <li
              v-for="item in list.filter(item => item.visible)"
              :key="item.label"
              @click="setActive(item)"
              :class="{'is-active': item.label === active.label}"
            >
              <el-checkbox v-model="item.checked" :label="item.label" @change="changeCheckbox">
                <span
                  v-html="$highlightKeyword(item.label, keyword, {style: 'color: red; font-weight: bold;'})"
                ></span>
              </el-checkbox>
              <i class="iconfont icon-dengyu"></i>
            </li>
          </ul>
          <div class="ccl-left-notice" v-show="!list.length">
            <p>暂无任何公用计算逻辑</p>
            <p>请新建以便未来引用</p>
          </div>
        </div>
        <div class="ccl-left-bottom">
          <el-checkbox v-model="checkAll" :disabled="!list.length" @change="changeCheckAll">全选</el-checkbox>
          <el-button
            type="text"
            :disabled="!checkedList.length"
            icon="el-icon-delete"
            @click="visibleConfirm = true"
          >批量删除</el-button>
        </div>
      </div>
      <div class="ccl-right">
        <div class="ccl-brief" v-show="!list.length">
          <h4>公用计算逻辑</h4>
          <p>
            <strong>定义：</strong>逻辑表内可公共使用的SQL片段，即可沉淀并定义为“公用计算逻辑”，以保证相同的数据处理逻辑得到快捷、方便的复用，达到临时表或者中间表效果。
          </p>
          <p>
            <strong>Eg：</strong>编辑逻辑表A时，字段order_id, order_type都需要过滤无效商品，故而：
          </p>
          <p>1）定义逻辑表A的“公用计算逻辑”。将过滤无效商品的SQL片段定义为公用计算逻辑【s_item】</p>
          <MonacoEditor :code="exp1" readonly></MonacoEditor>
          <p>2）编辑字段时引用“公用计算逻辑”。字段 order_id, order_type的计算逻辑中引用【s_item】</p>
          <div class="flex-layout">
            <MonacoEditor class="pr-20" :code="exp2[0]" readonly></MonacoEditor>
            <MonacoEditor :code="exp2[1]" readonly></MonacoEditor>
          </div>
          <p>
            <strong>适用场景：</strong>逻辑表内编辑多个字段计算逻辑时，不同字段间会有相同的数据处理场景，如特定数据过滤、数据集合并，所以表内跨字段间会存在常见且公共使用的SQL片段，如定义相同的from及where条件、引用相同的多表 join 或 union后构建的子查询。
          </p>
          <p>
            <strong>注意事项：</strong>如果逻辑表的“公用计算逻辑”与逻辑表所属项目的物理表重名，字段引用的对象会被优先识别为逻辑表的“公用计算逻辑”，新建保存“公用计算逻辑”时请关注是否有项目内重名表、已存在字段SQL是否会误用“公用计算逻辑”。如字段只是引用物理表，请务必带上物理表项目前缀。
          </p>
        </div>
        <div class="ccl-edit" v-show="list.length">
          <MonacoEditor
            ref="editor"
            has-top-tools
            has-bottom-tools
            show-save-btn
            :code.sync="code"
            @save="save"
          ></MonacoEditor>
        </div>
      </div>
    </div>
    <div slot="footer">
      <p>
        <el-button type="primary" @click="finished">完成</el-button>
      </p>
      <p>点击“完成”，仅“已保存”内容会生效</p>
    </div>

    <el-dialog
      :visible.sync="visibleConfirm"
      ref="confirmDialog"
      class="confirm-dialog"
      title="删除共用计算逻辑"
      width="450px"
      append-to-body
    >
      <div class="confirm-body">
        <p class="confirm-left error el-icon-warning"></p>
        <div class="confirm-content">
          <p>
            <b>确认删除以下公用计算逻辑么</b>
          </p>
          <ul>
            <li v-for="item in checkedList" :key="item.label">{{item.label}}</li>
          </ul>
          <p>请先确认此操作不影响任何字段，以免发布提交表失败</p>
        </div>
      </div>
      <div slot="footer">
        <el-button type="default" @click="closeConfirmDialog">取消</el-button>
        <el-button type="primary" @click="batchDelete">确定</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  name: 'CommonComputeLogic',
  props: {
    visible: Boolean
  },
  data() {
    return {
      isVisible: this.visible,
      keyword: '',
      code: '',
      checkAll: '',
      checkedList: [],
      visibelPopover: false,
      visibleConfirm: false,
      filter: {
        name: ''
      },
      rules: {
        name: [
          {required: true, message: '公用计算逻辑名不能为空！'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          },
          {validator: this.validateRepeat}
        ]
      },
      exp1: `--s_item 是为了实现过滤无效商品以得到所需数据，而定义的公用计算逻辑
    select item_id,
    substr(item_name, 1, 64) as item_name
from
(
     select  a1.item_id,
             item_type,
             item_name,
             a1.ds
     from onedata.tmp_item_pc a1
     join onedata.tmp_item_pc_ext a2
     on a1.item_id = a2.item_id
     where …
 union
     select
         b1.item_id,
         item_type,
         item_name,
         b1.ds
     from onedata.tmp_item_wl b1
     join onedata.tmp_item_wl_ext b2
     on b1.item_id = b2.item_id
     where …
) x
where item_id > 0
and item_type = 'Y'
and ds='\${bizdate}'`,
      exp2: [
        `order_id string
select order_id
from onedata.s_order a
join s_item b
on a.item_id=b.item_id
where ds='\${bizdate}'`,
        `order_type string
select order_item_name
from onedata.s_order a
join s_item b
on a.item_id=b.item_id
where ds='\${bizdate}'`
      ],
      list: [],
      active: {}
    }
  },
  watch: {
    visible(val) {
      this.isVisible = val
    },
    visibelPopover(val) {
      !val && this.closePopover()
    }
  },
  methods: {
    validateRepeat(rules, value, callback) {
      if (this.list.find(item => item.label === value)) {
        callback(new Error('公用计算逻辑名重复！'))
      }
      callback()
    },
    close() {
      this.list = []
      this.active = {}
      this.$emit('close')
      this.$emit('update:visible', false)
    },
    finished() {
      // await
      this.$emit('confirm')
      // this.close()
    },
    setActive(item) {
      this.active = item
      this.code = item.code
      this.$refs.editor.setScrollTop(0)
    },
    save() {
      this.active.code = this.code
    },
    closePopover() {
      this.$refs.form.resetFields()
      this.visibelPopover = false
    },
    filterList() {
      this.$debounce(_ => {
        this.list.forEach(item => {
          const reg = new RegExp(this.keyword, 'i')
          item.visible = reg.test(item.label)
        })
      }, 200)()
    },
    changeCheckbox() {
      this.checkedList = this.list.filter(item => item.checked)
      this.checkAll = this.checkedList.length === this.list.length
    },
    changeCheckAll(val) {
      this.checkedList = []
      this.list.forEach(item => {
        item.checked = val
        val && this.checkedList.push(item)
      })
    },
    addListItem() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.active = {
            label: this.filter.name,
            code: `--使用场景说明：如过滤无效商品
select item_id,item_name
from onedata.tmp_seller
where item_id>0 and item_type='Y' and ds='$(bizdate)'`,
            checked: false,
            visible: true
          }
          this.checkAll = false
          this.list.push(this.active)
          this.code = this.active.code
          this.filterList()
          this.closePopover()
        }
      })
    },
    batchDelete() {
      this.checkedList.forEach(item => {
        const index = this.list.findIndex(d => d.label === item.label)
        index > -1 && this.list.splice(index, 1)
      })
      this.checkedList = []
      this.closeConfirmDialog()
    },
    closeConfirmDialog() {
      this.visibleConfirm = false
    }
  }
}
</script>

<style lang="scss">
.common-compute-logic {
  display: flex;
  .el-dialog {
    margin: auto !important;
  }

  .el-dialog__body {
    padding: 0;
    height: 600px;
  }
  .flex-layout {
    height: 100%;
  }
  .ccl-left {
    width: 240px;
    border-right: 1px solid $grey7;
    .el-input__inner {
      border: none;
      border-radius: 0;
      border-bottom: 1px solid $grey7;
    }
    .el-popover__reference {
      padding: 0 12px;
      height: 36px;
      line-height: 36px;
      margin-bottom: 3px;
      border-bottom: 1px solid $grey7;
      cursor: pointer;
      &:hover {
        background-color: rgba($--color-primary, 0.1);
        color: $--color-primary;
      }
    }
    .ccl-left-main {
      height: calc(100% - 36px * 3 - 3px);
      overflow: hidden;
      position: relative;
    }
    .ccl-left-notice {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      p {
        line-height: 26px;
        color: $grey4;
        font-size: 12px;
      }
    }
    ul.ccl-list {
      height: 100%;
      overflow: auto;
      li {
        padding: 0 12px;
        height: 36px;
        line-height: 36px;
        cursor: pointer;
        &:hover,
        &.is-active {
          background: $grey6;
        }
      }
    }
    .ccl-left-bottom {
      border-top: 1px solid $grey6;
      height: 36px;
      line-height: 36px;
      display: flex;
      padding: 0 12px;
      justify-content: space-between;
      .el-button {
      }
    }
  }
  .ccl-right {
    flex: 1;
    .ccl-brief {
      padding: 0 20px;
    }
    h4 {
      line-height: 30px;
      font-size: 14px;
    }
    p {
      line-height: 22px;
      margin-bottom: 2px;
    }
    .ccl-edit {
      height: 100%;
      position: relative;
      // .sql-editor {
      // }

      // > .el-button {
      //   position: absolute;
      //   right: 70px;
      //   bottom: 10px;
      //   padding: 4px 10px;
      // }
    }
  }
  .el-dialog__footer {
    p {
      font-size: 12px;
      color: $grey4;
      margin-top: 5px;
    }
  }
}
.confirm-dialog {
  display: flex;
  .el-dialog {
    margin: auto !important;
    .el-dialog__body {
      padding-top: 20px;
      border-bottom: 0;
    }
  }
  .confirm-body {
    display: flex;

    font-size: 12px;
    .confirm-left {
      font-size: 50px;
      padding: 0 20px;
    }
    p {
      b {
        font-size: 14px;
        font-weight: normal;
        color: $grey2;
      }
    }
    ul {
      max-height: 250px;
      overflow: auto;
      li {
        line-height: 24px;
      }
    }
  }
}
</style>
