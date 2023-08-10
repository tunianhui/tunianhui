<!-- https://dataphin.console.aliyun.com/workingArea -->
<!-- https://help.aliyun.com/product/87584.html?spm=a2c4g.11186623.3.1.43a26412NTFi1y -->

# dataphin

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Lints and fixes files

```
yarn run lint
```

### 升级到最新的包

```
yarn upgrade --latest
yarn upgrade three --latest
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

### webpack 配置

- 别名
  - @ => src
  - @c => src/components
- scss 全局参数
- 开启图片压缩
- 打包分析
- 打包移除 console
- 打包时开始对 js|css|json|txt|html|ico|svg 文件的 gzip 与 zopfli 压缩
- 添加对 IE 的兼容
  - main.js 中加入 import '@babel/polyfill'
  - babel.config.js 中加入下面配置

```js
{
  presets: [['@vue/app', {useBuiltIns: 'entry'}]]
}
```

- 添加 node 中使用 ES6 模块的配置

### 项目配置（./scr/config/）

- index.js 中的配置可以在 vue 组件中以 this.\$config[key]的方式访问
- style-vars.scss/style-vars.js 文件用于定义全局的 css 变量
  - 使用时修改 js 文件的变量即可，scss 的变量会自动编译生成
  - scss 中的变量可以在任何 vue 文件中 style 为 scss 的标签下访问, elementui 中的 scss 变量在 style-vars.scss 定义会覆盖它默认的变量值
  - js 中的变量可以通过 this.\$styleVars 使用
- directive 文件中定义了常用的 vue 指令，可根据需求使用

### 代码规范

#### vue

- 所有文件都使用 aaa-bbb 式命名，不使用驼峰命令（AaaBbb）
- vue 文件中使用组件，只要是自己写的组件都使用驼峰命令（AaaBbb）
- 所有 vue 组件都加上 name 字段，且 vue 组件中的样式都加上 class 作用域，即最外层包裹一层 class
- 控制台中有关于 vue 组件报警的，最好尽快解决，以防生产环境有 bug 出现
- mixin 中 global.js 中的配置会添加到每个组件的中
- 所有 form 表单的 label 后面需要加上'：'（中文冒号）label-suffix="："
- 对于`el-input`输入框，名称， 英文名，描述 这三个字段需要添加`maxlength="" show-word-limit`属性
  - 一般情况下名称、英文名 `maxlength=32`，描述 `maxlength=128`
- 命名尽量简单，可以采取缩写的方式命名
- js 监听的事件，尽可能在组件销毁的时候，销毁监听事件
- 异步引入组件时，`webpackChunkName` 必需唯一，否则可能回显意外 bug;

  ```js
  const index = import(/* webpackChunkName: "index" */ './index.vue')
  ```

#### js

- 全部使用 ES6 语法
- 能用 const 就不要用 let
- 尽可能少的使用 js 代码控制页面样式
- 变量尽量简化，可以采取缩写的方式命名

#### css

- 公用变量都提取到./scr/config/style-vars.js 中
- 变量提取尽可能语义化，并最好加上注释
- 每个组件内部的样式最好在根 DOM 上添加一个 class 命名空间，以防外部样式冲突影响
- css 命名规则
  - class (class="aa-bb")
  - id (id="aaBb")
  - class 名尽量简化
- assets/css/common.scss 下定义了一些全局公用的 css 样式，其中包括一些覆盖 element-ui 的样式
  - 对 element-ui 样式的覆盖定义，最好有注释说明，且使用时添加 class 即可使用
  - 在写样式前最好看一下是否有定义好的公用样式可以使用，减少重复代码
- 对于颜色变量的控制，可以考虑 scss 的颜色函数或查看[http://scg.ar-ch.org/](http://scg.ar-ch.org/)或[https://www.cnblogs.com/kaiye/p/7553041.html](https://www.cnblogs.com/kaiye/p/7553041.html)
- 数字字体 font-family: DS-Digital;
- 合理使用 css 变量（height, lineHeight）
- 能用 css 样式实现的页面布局，就尽量少的使用 js 修改样式
- 多用 css 过渡，优化页面展示效果

#### monaco-editor 编辑器使用说明

- 引入
  - import MonacoEditor from '@c/monaco-editor/index'
- 入参
  - theme dark/light 两种，默认 dark
  - code 代码 通过`.sync`修饰符可以实时更新 code
  - language 默认 sql
  - hasTopTools 是否有上方工具栏，默认为 false
  - hasBottomTools 是否有右下角工具 ，默认为 false
  - readonly 是否只读， 默认 false

#### 开发时，无接口

- 当成有接口的来开发
- 对于比较复杂的页面可以先问后台要返回数据的格式大概是什么样子
  - 如果后台不能给到数据格式，那就自己先定好数据格式，发给后台，询问这种格式可行否
    - 不可行就让他改成可行的数据格式
    - 可行的话就可以直接使用
- 数据可以直接放在 YAPI 上或者放在对应组件的文件夹下

### 项目使用到的技术栈

1.使用 vuecli3.0 搭建项目，并进行构建优化
2.页面开发主要使用 vue、vuex、vue-router、element-ui、axios、webStorage、lodash、clipboard 等包；
3.可视化开发

- d3.js 完成 er 图、血缘关系图、资产结构图的开发
- three.js 完成资产全局、资产流动页面的 3d 可视化开发，配合@tweenjs/tween.js 实现动画效果
- @antv/g2 开发调度页面的流程图

4.线上编辑器使用 monaco-editor、sql-formatter 完成相关页面的开发

### 按钮权限

- 使用 v-btn-auth 指令，具体使用查看，`src\directive\module\btn-auth.js`
- 所有的新建或新增功能按钮，一律使用`新建`
- 所有的编辑或修改功能按钮，一律使用`编辑`
- btnId 由具体的功能按钮的所在页面的路由为前缀，后缀为按钮的具体功能
- src\views\rd\dev\norm-modeling\norm-define\dimension 下面的文件有使用案例，基本覆盖了项目中的所有使用场景，供其他页面参考
