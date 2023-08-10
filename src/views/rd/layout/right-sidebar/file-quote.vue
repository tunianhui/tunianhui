<template>
  <section class="file-quote">
    <h3>文件引用</h3>
    <el-row>
      <el-radio-group v-model="radio">
        <el-radio label="source">资源</el-radio>
        <el-radio label="func">函数</el-radio>
      </el-radio-group>
    </el-row>
    <el-row>
      <el-select v-model="select" @change="changeSelect" value-key="id">
        <el-option v-for="item in selectList" :key="item.id" :label="item.label" :value="item"></el-option>
      </el-select>
      <p>
        <el-link type="info" :underline="false">没有可选？点击快速</el-link>
        <el-link type="primary" @click="createSelect" :underline="false">新建选择</el-link>
      </p>
    </el-row>
    <h4 class="mt-20">当前已选资源</h4>
    <ul>
      <li v-for="(item, index) in selectedList" :key="item.id">
        <el-tooltip placement="top">
          <div slot="content">
            <p class="mb-5">{{item.label}}</p>
            <p>
              <span>描述：</span>
              <span>{{item.desc || '暂无'}}</span>
            </p>
          </div>
          <el-tag effect="plain" type="info" size="medium" closable @close="handleRemove(item, index)">{{item.label}}</el-tag>
        </el-tooltip>

        <span class="copy-span" v-clipboard="{value: item.label}">
          <i class="el-icon-copy-document"></i>
          <span>copy 引用</span>
        </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'FileQuote',
  data () {
    return {
      radio: 'source',
      select: '',
      sourceList: [
        { label: 'source1', id: 'source1' },
        { label: 'source2', id: 'source2' },
        { label: 'source3', id: 'source3' },
        { label: 'source4', id: 'source4' }
      ],
      funcList: [
        { label: 'func1', id: 'func1' },
        { label: 'func2', id: 'func2' },
        { label: 'func3', id: 'func3' },
        { label: 'func4', id: 'func4' }
      ],
      selectedList: []
    }
  },
  computed: {
    selectList () {
      const newList = [],
        selectList = this.radio === 'source' ? this.sourceList : this.funcList,
        selectedList = this.selectedList.filter(d => d.type === this.radio)
      selectList.forEach(n => {
        const sel = selectedList.find(m => n.id === m.id)
        !sel && newList.push(n)
      })
      return newList
    }
  },
  created () { },
  methods: {
    ...mapMutations({
      setActiveRdEditDialog: 'SET_ACTIVE_RD_EDIT_DIALOG'
    }),
    createSelect () {
      let component = 'SourceManageEdit',
        title = '新建资源'

      if (this.radio === 'func') {
        component = 'FuncManageEdit'
        title = '新建函数'
      }

      this.setActiveRdEditDialog({
        component,
        title,
        callback: this.saveCallback
      })
    },
    changeSelect (val) {
      this.selectedList.push({
        ...val,
        type: this.radio
      })
      this.select = ''
    },
    handleRemove (data, index) {
      this.selectedList.splice(index, 1)
    },
    saveCallback (data) {
    }
  }
}
</script>

<style lang="scss">
.file-quote {
  height: 100%;
  font-size: 12px;
  padding: 15px;
  $h3Height: 40px;
  h3 {
    font-size: 16px;
    height: $h3Height;
    line-height: $h3Height;
  }
  .el-row {
    margin-top: 15px;
    .el-select {
      width: 75%;
    }
  }
  ul {
    margin-top: 12px;
    li {
      margin-bottom: 8px;
      .copy-span {
        margin-left: 15px;
        cursor: pointer;
        color: $grey3;
        .el-icon-copy-document {
          font-size: 16px;
        }
        span {
          position: relative;
          top: -3px;
          margin-left: 5px;
        }
        &:hover {
          color: $grey2;
        }
      }
    }
  }
}

</style>
