import styleVars from '@/config/style-vars'

// node_modules\monaco-editor\esm\vs\editor\standalone\common\themes.js
export const dark = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    {
      token: '',
      foreground: 'ffffff',
      background: styleVars.editorDarkBg
    },
    {token: 'constant', foreground: '46aaff'},
    {token: 'keyword', foreground: '46aaff'},
    {token: 'comment', foreground: '999999'},
    {token: 'tag', foreground: '46aaff'},
    {token: 'operator.sql', foreground: '46aaff'}
  ],
  colors: {
    'editor.background': styleVars.editorDarkBg,
    'editorGutter.background': styleVars.headerBg,
    'editorLineNumber.foreground': styleVars.editorDarkLineNumberFg,
    'editorIndentGuide.background': styleVars.editorDarkIndentGuideBg,
    'editorIndentGuide.activeBackground': styleVars.editorDarkIndentGuideBg,
    'editorCursor.foreground': styleVars.grey10,
    'editor.selectionBackground': styleVars.grey1,
    'editor.inactiveSelectionBackground':
      styleVars.editorDarkInactiveSelectionBg,
    'editor.lineHighlightBackground': styleVars.editorDarkLineHighlightBg,
    'editor.findMatchHighlightBackground': styleVars.editorDarkLineHighlightBg,
    'editorWidget.border': styleVars.grey1,
    'editorWidget.background': styleVars.editorDarkLineHighlightBg,
    'editorWidget.findMatchBackground': styleVars.editorDarkLineHighlightBg,
    // 'editorHoverWidget.background': styleVars.editorDarkLineHighlightBgDeep,
    'list.hoverBackground': styleVars.editorDarkLineHighlightBgShadow,
    'menu.background': styleVars.headerBg,
    'menu.foreground': styleVars.grey10,
    'menu.selectionBackground': styleVars.editorDarkLineHighlightBg,
    'editorSuggestWidget.background': styleVars.headerBg,
    'editorSuggestWidget.border': styleVars.headerBg,
    'editorSuggestWidget.foreground': styleVars.grey10,
    // 'editorSuggestWidget.highlightForeground':
    // styleVars.editorDarkLineHighlightBg,
    'editorSuggestWidget.selectedBackground':
      styleVars.editorDarkLineHighlightBg
  }
}

export const light = {
  base: 'vs',
  inherit: true,
  rules: [{background: styleVars.grey7}],
  colors: {
    'editor.background': styleVars.grey10,
    'editorGutter.background': styleVars.grey7,
    'editorLineNumber.foreground': styleVars.grey2,
    'editorCursor.foreground': styleVars.grey2,
    // 'editor.selectionForeground': styleVars.grey10,
    'editor.selectionBackground': styleVars.editorLightSelectionBg,
    'editor.inactiveSelectionBackground': styleVars.grey6,
    'editor.lineHighlightBackground': styleVars.grey6,
    'editor.findMatchHighlightBackground':
      styleVars.editorLightFindMatchHighlightBg,
    'editorWidget.border': styleVars.grey10,
    'editorWidget.background': styleVars.grey6
  }
}
