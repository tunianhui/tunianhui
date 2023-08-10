<template>
  <div class="custom-monaco-editor" :class="{'full-screen': isFullScreen}">
    <EditorHeader
      v-if="hasTopTools"
      :isSqlVerification="isSqlVerification"
      :isShowExample="isShowExample"
      :example="example"
      :qualityExample="qualityExample"
      :tip-content="tipContent"
      @format="format"
      @verification="verificationHandle"
      @copyHint="copyHint"
    />
    <div class="editor-container" :class="!hasTopTools ? 'full-height' : ''">
      <div ref="editor" class="editor"></div>
    </div>
    <div class="bottom-operation" v-if="hasBottomTools">
      <el-button v-if="showSaveBtn" type="primary" @click="saveCode"
        >保存</el-button
      >
      <i
        class="icon el-icon-document-copy"
        title="复制"
        @mouseenter.once="copyHandle"
        @click="copyHandle"
      ></i>
      <i
        :class="[
          'icon iconfont',
          isFullScreen ? 'icon-exit-full-screen' : 'icon-full-screen'
        ]"
        :title="isFullScreen ? '退出全屏' : '全屏'"
        @click="fullScreenHandle"
      ></i>
    </div>
  </div>
</template>

<script>
import EditorHeader from './header'
import clipboard from '@/libs/clipboard'
import sqlFormatter from 'sql-formatter'
// import {automaticPromptInfo} from '@/api/rd/ad-search'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution' // 语法高亮
import 'monaco-editor/esm/vs/editor/contrib/find/findController' // 查找
import 'monaco-editor/esm/vs/editor/contrib/folding/folding' // 折叠
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/contextmenu' // 右键菜单
// import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController' // 输入提示
// import 'monaco-editor/esm/vs/editor/contrib/snippet/snippetController2'
import 'monaco-editor/esm/vs/editor/contrib/hover/hover' // 错误插件
import Snippets from './snippets'
// import hints from './hint'
import {dark, light} from './theme'
import './ide.scss'
import {mapGetters} from 'vuex'

export default {
  name: 'MonacoEditor',
  components: {
    EditorHeader
  },
  props: {
    theme: {
      type: String,
      default: 'dark'
    },
    code: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'sql'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    changed: {
      type: Boolean,
      default: false
    },
    hasTopTools: {
      type: Boolean,
      default: false
    },
    hasBottomTools: {
      type: Boolean,
      default: false
    },
    showSaveBtn: {
      type: Boolean,
      default: false
    },
    minimap: Boolean,
    tipContent: String,
    hint: Boolean,
    isShowExample: {
      type: Boolean,
      default: true
    },
    example: {
      type: Boolean,
      dedault: true
    },
    qualityExample: {
      type: Boolean,
      dedault: false
    },
    isSqlVerification: {
      type: Boolean,
      default: true
    }
    // dbSchema: Object
  },
  data() {
    return {
      isFullScreen: false
    }
  },
  computed: {
    ...mapGetters(['dbSchema']),
    options() {
      return {
        // 自适应调整
        automaticLayout: true,
        fontSize: 14,
        lineHeight: 20,
        wordWrap: 'on', // 自动换行
        lineNumbersMinChars: 3, // the width of line numbers
        lineDecorationsWidth: 0, // the width reserved for line decorations
        minimap: {
          enabled: this.minimap
        },
        glyphMargin: false,
        readOnly: this.readonly,
        suggestOnTriggerCharacters: false
      }
    }
  },
  watch: {
    code: {
      immediate: true,
      handler(val) {
        if (this.innerChange) {
          this.innerChange = false
          return
        }
        if (this.monacoEditor) {
          this.monacoEditor.setValue(val)
          this.innerChange = false
          this.monacoEditor.setScrollTop(0)
        }
      }
    }
  },
  mounted() {
    this.dispose()
    // this.getDBSchema()
    this.initEditor()
  },
  beforeDestroy() {
    this.dispose()
  },
  methods: {
    initEditor() {
      this.$refs.editor.innerHTML = ''
      monaco.editor.defineTheme('act-dark', dark)
      monaco.editor.defineTheme('act-light', light)
      this.sqlSnippets = new Snippets(monaco)

      this.setSnippets()

      window._$monacoProvider = monaco.languages.registerCompletionItemProvider(
        'sql',
        {
          triggerCharacters: [' ', '.', '$'],
          provideCompletionItems: (model, position) => {
            return this.sqlSnippets.provideCompletionItems(model, position)
          }
        }
      )

      this.monacoEditor = monaco.editor.create(this.$refs.editor, {
        // model: monaco.editor.createModel(sqlFormatter.format(this.code), 'sql'),
        value: this.code,
        language: this.language,
        theme: `act-${this.theme}`,
        ...this.options
      })

      // node_modules\monaco-editor\esm\vs\editor\editor.api.d.ts IActionDescriptor #999
      if (this.language !== 'json') {
        const action = {
          // there are three of them: 1 - 'navigation', 2 - '1_modification', 3 - '9_cutcopypaste'
          contextMenuGroupId: '1_modification',
          contextMenuOrder: 2,
          keybindings: [
            monaco.KeyMod.Shift + monaco.KeyMod.Alt + monaco.KeyCode.KEY_F
          ],
          label: '格式化文件',
          alias: 'Format Document',
          // ...this.monacoEditor.getAction('editor.action.formatDocument'),
          id: 'editor.action.formatSql',
          run: this.format
        }
        this.monacoEditor.addAction(action)
      }

      // 监听用户的输入
      this.monacoEditor.onDidChangeModelContent(event => {
        this.innerChange = true
        const changeContent = this.monacoEditor.getValue()
        this.$emit('update:code', changeContent)
        this.$emit('update:changed', true)
        this.$emit('change')
      })
    },
    // 复制
    copyHandle(e) {
      const changeContent = this.monacoEditor.getValue()
      clipboard(e, {value: changeContent, type: 'code'})
    },
    // 复制参考示例
    copyHint(params) {
      this.$emit('copyHint', params)
    },
    // 全屏
    fullScreenHandle() {
      this.isFullScreen = !this.isFullScreen
    },
    saveCode() {
      this.$emit('save', this.monacoEditor.getValue())

      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      })
    },
    getSelectionsValue() {
      const model = this.monacoEditor.getModel()
      const selections = this.monacoEditor.getSelections()
      const values =
        selections
          .map(selection => model.getValueInRange(selection))
          .join('\n') || this.monacoEditor.getValue()
      return values
    },
    jsonformat() {
      this.monacoEditor.getAction(['editor.action.formatDocument'])._run()
    },
    // 规范性校验
    verificationHandle() {
      const changeContent = this.monacoEditor.getValue()
      this.$emit('verification', changeContent)
    },
    async setSnippets() {
      // await this.$sleep(100)
      const {
        dbs = [],
        functions = [],
        keywords = [],
        constants = []
      } = this.dbSchema
      this.sqlSnippets.setDbSchema(dbs)
      this.sqlSnippets.setFunctions(functions)
      this.sqlSnippets.setConstants(constants)
      this.sqlSnippets.setKeywords(keywords)
    },
    // async getDBSchema() {
    //   await this.$sleep(1000)
    //   const res = await this.$simpleAsyncTo(
    //     automaticPromptInfo(),
    //     '获取SQL联想数据失败'
    //   )
    //   // const res = hints
    //   if (res) {
    //     const {
    //       dbs = [],
    //       functions = [],
    //       keywords = [],
    //       constants = []
    //     } = res.data
    //     this.sqlSnippets.setDbSchema(dbs)
    //     this.sqlSnippets.setFunctions(functions)
    //     this.sqlSnippets.setConstants(constants)
    //     this.sqlSnippets.setKeywords(keywords)
    //   }
    // },
    // 设置Y轴滚动条的位置
    setScrollTop(num) {
      this.monacoEditor.setScrollTop(num)
    },
    // 格式化
    format() {
      const changeContent = this.monacoEditor.getValue()
      const formatValue = sqlFormatter.format(changeContent)
      this.monacoEditor.setValue(formatValue)
      this.innerChange = true
    },
    dispose() {
      this.monacoEditor && this.monacoEditor.dispose()
      window._$monacoProvider && window._$monacoProvider.dispose()
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-monaco-editor {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-height: 100px;
  &.full-screen {
    position: fixed;
    z-index: 1001;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh !important;
  }
  .editor-container {
    width: 100%;
    height: calc(100% - 36px);
    &.full-height {
      height: 100%;
    }
    .editor {
      width: 100%;
      height: 100%;
      min-height: 100px;
    }
  }
  .bottom-operation {
    position: absolute;
    right: 12px;
    bottom: 12px;

    .el-button {
      padding: 4px 10px;
    }
    .icon {
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 8px;
      background: $grey7;
      color: rgba(0, 0, 0, 0.5);
      cursor: pointer;
      font-size: 14px;
      line-height: 20px;
      vertical-align: middle;
      text-align: center;

      &:hover {
        color: #222;
      }
    }
  }
}
</style>
