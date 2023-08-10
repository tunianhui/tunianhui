<template>
  <SimpleEditDialog
    title="指标归类"
    :visible.sync="isVisible"
    @close="close"
    @confirm="confirm"
    top="10vh"
    witdh="425px"
    class="cate-dialog"
  >
    <el-row class="mb-20">
      <el-col :span="12" class="pr-20">
        <div></div>
        <p>已归类至:该指标尚未被归类-</p>
      </el-col>
      <el-col :span="12" class="pl-20">
        <h4>
          <span>归类至</span>
          <el-popover width="300" placement="left" v-model="visibelPopover">
            <el-form
              ref="form"
              :model="newFilter"
              :rules="rules"
              label-suffix="："
              @submit.native.prevent
            >
              <el-form-item prop="name">
                <el-input
                  v-model="newFilter.name"
                  @keyup.native.enter="add"
                  maxlength="32"
                  show-word-limit
                  placeholder="请输入分类名称"
                ></el-input>
              </el-form-item>
            </el-form>
            <p class="fr">
              <el-button type="default" @click="closePopover">取消</el-button>
              <el-button type="primary" @keyup.native.stop @click="add"
                >确定</el-button
              >
            </p>
            <el-button type="text" slot="reference">
              <i class="el-icon-plus"></i>创建分类
            </el-button>
          </el-popover>
        </h4>
        <transition name="el-fade-in-linear">
          <div class="mb-10" v-show="!!selectedCate.length">
            <label for>已选：</label>
            <el-tag
              v-for="item in selectedCate"
              :key="item.value"
              size="mini"
              closable
              @close="item.selected = false"
              >{{ item.value }}</el-tag
            >
          </div>
        </transition>

        <el-input
          v-model="keyword"
          placeholder="搜索或创建分类"
          prefix-icon="el-icon-search"
          @input="filterByKeyword"
        ></el-input>
        <ul>
          <li
            v-for="(item, index) in catelist.filter(cate => cate.visible)"
            :key="item.value"
            :class="{'is-select': item.selected}"
            @click="handleSelectCate(item)"
          >
            <span v-html="$highlightKeyword(item.value, keyword)"></span>
            <span>
              <el-button
                type="text"
                v-if="item.selected"
                icon="el-icon-check"
              ></el-button>
              <el-button
                type="text"
                @click.stop="handleDeleteCate(index)"
                icon="el-icon-delete"
              ></el-button>
            </span>
          </li>
        </ul>
      </el-col>
    </el-row>
  </SimpleEditDialog>
</template>

<script>
export default {
  name: 'CateDialog',
  props: {
    visible: Boolean,
    data: Object
  },
  data() {
    return {
      isVisible: false,
      filter: {},
      newFilter: {
        name: ''
      },
      keyword: '',
      catelist: [],
      rules: {
        name: [
          // {required: true, message: '分类名称不能为空！'},
          {
            pattern: /^[a-zA-Z_][a-zA-Z_0-9]*$/,
            message: '英文名只能用英文、数字、下划线组成，且开头必须是字母'
          },
          {validator: this.validateRepeat}
        ]
      },
      visibelPopover: false
    }
  },
  computed: {
    selectedCate() {
      return this.catelist.filter(cate => cate.selected)
    }
  },
  watch: {
    data(val) {
      Object.assign(this.filter, val)
    },
    visible(val) {
      this.isVisible = val
    }
  },
  methods: {
    validateRepeat(rules, value, callback) {
      if (this.catelist.find(item => item === value)) {
        callback(new Error('分类名称重复！'))
      }
      callback()
    },
    filterByKeyword(val) {
      const reg = new RegExp(val, 'i')
      this.catelist.forEach(item => {
        item.visible = reg.test(item.value)
      })
    },
    closePopover() {
      this.$refs.form.resetFields()
      this.visibelPopover = false
    },
    add() {
      this.catelist.push({
        value: this.newFilter.name,
        visible: true,
        selected: false
      })
      this.closePopover()
    },
    handleSelectCate(item) {
      item.selected = !item.selected
    },
    handleDeleteCate(index) {
      this.catelist.splice(index, 1)
    },
    close() {
      this.$emit('update:visible', false)
      this.filter = {}
    },
    confirm() {
      this.close()
      this.$emit('confirm', this.fitler)
    }
  }
}
</script>

<style lang="scss">
.cate-dialog {
  h4 {
    display: flex;
    justify-content: space-between;

    > span {
      line-height: 28px;
    }
  }

  ul {
    li {
      height: 32px;
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: $transition;
      padding: 0 20px 0 5px;
      cursor: pointer;

      .el-button {
        transition: $transition;

        &:last-child {
          opacity: 0;
          /* width: 0;
          margin-left: 0; */
        }
      }
      &.is-select {
        background-color: lighten($grey6, 5%);
      }
      &:hover {
        background-color: lighten($grey6, 5%);

        .el-button:last-child {
          opacity: 1;
          /* width: 14px;
          margin-left: 12px; */
        }
      }
    }
  }
}
</style>
