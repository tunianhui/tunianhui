// import {language} from 'monaco-editor/esm/vs/basic-languages/sql/sql'
// const {keywords, operators, builtinFunctions, builtinVariables} = language

// monaco.languages.CompletionItemKind
const kindMap = {
  // 业务板块
  module: 'Module',
  // 关键字，变量 variable，常量 constant
  keyword: 'Keyword',
  // 函数
  function: 'Function',
  // 字段
  field: 'Field',
  维度逻辑表: 'Unit',
  事实逻辑表: 'Interface',
  汇总逻辑表: 'Struct',
  物理表: 'Constructor'
}

export default class SqlSugesstion {
  constructor(
    monaco,
    customKeywords = [],
    dbSchema = [
      {db_name: '', tables: [{table_name: '', table_desc: '', columns: []}]}
    ]
  ) {
    this.SORT_TEXT = {
      Table: '0',
      Database: '1',
      Column: '2',
      Keyword: '3',
      Func: '4',
      Const: '5'
    }
    this.monaco = monaco
    this.customKeywords = customKeywords
    this.dbConst = []
    this.dbFuncs = []
    this.dbKeywords = []
    // this.dbKeywords = Array.from(
    //   new Set([...keywords, ...operators, ...customKeywords])
    // )
    // this.dbConst = [...builtinVariables]

    // this.dbFuncs = [...builtinFunctions]
    this.dbSchema = dbSchema
    this.getKeywordSuggest = this.getKeywordSuggest.bind(this)
    this.getFuncSuggest = this.getFuncSuggest.bind(this)
    this.getTableSuggest = this.getTableSuggest.bind(this)
    this.getTableColumnSuggest = this.getTableColumnSuggest.bind(this)
  }

  /**
   * 动态设置数据库表&&数据库字段
   * @param {*} dbSchema 数据库schema
   * @example [{db_name: '', tables: [{table_name: '', table_desc: '', columns: []}]}]
   */
  setDbSchema(dbSchema) {
    this.dbSchema = dbSchema
  }

  /**
   * 动态设置数据库表&&数据库字段
   * @param {*} dbSchema 数据库schema
   * @example {dbs: [{db_name: '', tables: [{table_name: '', table_desc: '', columns: []}]}], functions: [], keywords: [], constants: []}
   */
  setSuggestionData(data) {
    const {dbs = [], functions = [], keywords = [], constants = []} = data
    this.dbSchema = dbs
    this.dbFuncs = functions
    this.dbConst = constants
    this.dbKeywords = keywords
  }

  setFunctions(data) {
    this.dbFuncs = data
  }

  setConstants(data) {
    this.dbConst = data
  }

  setKeywords(data) {
    this.dbKeywords = data
  }

  /**
   * monaco提示方法
   * @param {*} model
   * @param {*} position
   */
  async provideCompletionItems(model, position) {
    const {lineNumber, column} = position
    const textBeforePointer = model.getValueInRange({
      startLineNumber: lineNumber,
      startColumn: 0,
      endLineNumber: lineNumber,
      endColumn: column
    })
    const tokens = textBeforePointer.trim().split(/\s+/)

    const lastToken = tokens[tokens.length - 1].toLowerCase()
    // 数据库名联想
    if (lastToken.trim() === 'database') {
      return {
        suggestions: this.getDataBaseSuggest()
      }
      // <库名>.<表名>联想
    } else if (this.dbSchema.find(db => `${db.db_name}.` === lastToken)) {
      return {
        suggestions: [
          ...this.getTableSuggestByDbName(
            lastToken.slice(0, lastToken.length - 1)
          )
        ]
      }
      // 表名联想
    } else if (lastToken.trim() === 'from' || lastToken.trim() === 'join') {
      const tables = this.getTableSuggest()
      const databases = this.getDataBaseSuggest()
      return {
        suggestions: [...tables, ...databases]
      }
      // 字段联想
    } else if (lastToken.trim() === 'select') {
      return {
        suggestions: this.getTableColumnSuggest()
      }
      // 自定义字段联想
    } else if (this.customKeywords.toString().includes(lastToken)) {
      return {
        suggestions: this.getCustomSuggest()
      }
      // 默认联想
    } else if (lastToken.length >= 1) {
      return {
        suggestions: [
          ...this.getAllTableColumn(),
          ...this.getTableSuggest(),
          ...this.getKeywordSuggest(),
          ...this.getFuncSuggest(),
          ...this.getConstSuggest(),
          ...this.getDataBaseSuggest()
        ]
      }
    }
  }

  /**
   * 获取自定义联想建议
   */
  getCustomSuggest() {
    return this.customKeywords.map(this.getKeywordSuggest)
  }

  /**
   * 获取所有字段
   */
  getAllTableColumn() {
    const columns = []
    this.dbSchema.forEach(db => {
      db.tables.forEach(table => {
        table.columns.forEach(field => {
          columns.push({
            label: field.element_code,
            kind: this.monaco.languages.CompletionItemKind.Field,
            detail: `${field.element_desc}`,
            sortText: this.SORT_TEXT.Column,
            insertText: field.element_code
          })
        })
      })
    })
    return columns
  }

  /**
   * 获取数据库库名联想建议
   */
  getDataBaseSuggest() {
    return this.dbSchema.map(db => {
      // node_modules\monaco-editor\esm\vs\editor\editor.api.d.ts CompletionItem #4757
      return {
        label: db.db_name,
        kind: this.monaco.languages.CompletionItemKind.Module,
        detail: `业务板块`,
        sortText: this.SORT_TEXT.Database,
        insertText: db.db_name
      }
    })
  }

  /**
   * 获取关键字联想建议
   */
  getKeywordSuggest() {
    return this.dbKeywords.map(keyword => ({
      label: keyword,
      kind: this.monaco.languages.CompletionItemKind.Keyword,
      detail: '关键字',
      sortText: this.SORT_TEXT.Keyword,
      // Fix插入两个$符号
      insertText: keyword.startsWith('$') ? keyword.slice(1) : keyword
    }))
  }

  /**
   * 获取常量联想建议
   */
  getConstSuggest() {
    return this.dbConst.map(keyword => ({
      label: keyword,
      kind: this.monaco.languages.CompletionItemKind.Variable,
      detail: '常量',
      sortText: this.SORT_TEXT.Const,
      insertText: keyword
    }))
  }

  /**
   * 获取函数联想建议
   * @param {*} keyword
   */
  getFuncSuggest() {
    return this.dbFuncs.map(func => ({
      label: func,
      kind: this.monaco.languages.CompletionItemKind.Function,
      detail: '函数',
      sortText: this.SORT_TEXT.Func,
      insertText: func
    }))
  }

  /**
   * 获取数据库表名建议
   */
  getTableSuggest() {
    const tables = []
    this.dbSchema.forEach(db => {
      db.tables.forEach(table => {
        tables.push({
          label: table.table_name,
          kind: this.getTableKind(table.table_desc),
          detail: table.table_desc,
          sortText: this.SORT_TEXT.Table,
          insertText: `${db.db_name}.${table.table_name}`
        })
      })
    })
    return tables
  }

  getTableSuggestByDbName(db_name) {
    const currentDb = this.dbSchema.find(db => db.db_name === db_name)
    const tables = []
    if (currentDb) {
      currentDb.tables.forEach(table => {
        tables.push({
          label: table.table_name,
          kind: this.getTableKind(table.table_desc),
          detail: table.table_desc,
          sortText: this.SORT_TEXT.Table,
          insertText: table.table_name
        })
      })
    }
    return tables
  }

  /**
   * 获取所有表字段
   * @param {*} table
   * @param {*} column
   */
  getTableColumnSuggest(table, column) {
    const defaultFields = []
    this.dbSchema.forEach(db => {
      db.tables.forEach(table => {
        table.columns.forEach(field => {
          defaultFields.push({
            label: field.element_code,
            kind: this.monaco.languages.CompletionItemKind.Field,
            detail: field.element_desc,
            sortText: this.SORT_TEXT.Column,
            insertText: field.element_code
          })
        })
      })
    })
    return defaultFields
  }

  getTableKind(type) {
    return this.monaco.languages.CompletionItemKind[kindMap[type]]
  }
}
