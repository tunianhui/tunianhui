/* eslint-disable */
// 配置ES6的module语法可以在node中使用
require('babel-register')({
  presets: [
    [
      'env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ]
})

const path = require('path')
const fs = require('fs')
const styleVarsPrefix = path.resolve(__dirname, `./src/config/style-vars`)
const scssStyleVarsPath = [styleVarsPrefix, 'scss'].join('.')
const jsStyleVarsPath = [styleVarsPrefix, 'js'].join('.')
const IS_PROD = process.env.NODE_ENV === 'production'
const fcfg = require('./src/config/').default

// const SkeletonPlugin = require('page-skeleton-webpack-plugin').SkeletonPlugin

const resolve = dir => {
  return path.join(__dirname, dir)
}

function isFile(_path) {
  try {
    const stat = fs.statSync(_path)
    return stat.isFile()
  } catch (e) {
    // console.log(e)
    return false
  }
}

function isDirectory(_path) {
  try {
    const stat = fs.statSync(_path)
    return stat.isDirectory()
  } catch (e) {
    // console.log(e)
    return false
  }
}

function changeStyleFile(data) {
  let _data = data
  if (data) {
    _data = Object.keys(data)
      .map(key => `$${key}: ${data[key]};`)
      .join('\n')
  }
  const oldData = isFile(scssStyleVarsPath)
    ? fs.readFileSync(scssStyleVarsPath).toString()
    : null

  oldData !== _data && fs.writeFileSync(scssStyleVarsPath, _data)
}

// chain webpack相关参数
const chains = {
  setAlias(config) {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@c', resolve('src/components'))
  },
  // scss全局参数
  setScssGlobalVars(config) {
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: [
            './node_modules/element-ui/packages/theme-chalk/src/common/var.scss',
            scssStyleVarsPath,
            './src/assets/css/mixins.scss'
          ]
        })
        .end()
    })
  },
  // 监听全局js样式文件，并更新全局scss变量文件
  handleVars() {
    let data = ''
    if (!isFile(jsStyleVarsPath)) {
      const str = `export default {
  // default: '#409EFF'
}`
      fs.writeFileSync(jsStyleVarsPath, str)
    } else {
      data = require(jsStyleVarsPath).default
    }
    changeStyleFile(data)
    fs.watchFile(jsStyleVarsPath, async (curr, prev) => {
      delete require.cache[require.resolve(jsStyleVarsPath)]
      const d = require(jsStyleVarsPath).default
      changeStyleFile(d)
    })
  },
  // 图片压缩
  // imageZip(config) {
  //   config.module
  //     .rule('images')
  //     .use('image-webpack-loader')
  //     .loader('image-webpack-loader')
  //     .options({
  //       mozjpeg: { progressive: true, quality: 65 },
  //       optipng: { enabled: false },
  //       pngquant: { quality: '65-90', speed: 4 },
  //       gifsicle: { interlaced: false },
  //       webp: { quality: 75 }
  //     })
  // },
  // 打包分析
  bundleAnalyzer(config) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
      .BundleAnalyzerPlugin
    if (IS_PROD) {
      config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
        {
          analyzerMode: 'static'
        }
      ])
    }
  }
}

// configureWebpack相关函数
const proConfigures = {
  uglify(config) {
    const TerserPlugin = require('terser-webpack-plugin')
    return IS_PROD
      ? [
          new TerserPlugin({
            terserOptions: {
              warnings: false,
              compress: {
                drop_console: false,
                drop_debugger: true,
                pure_funcs: ['console.log'] // 移除console
              }
            },
            sourceMap: false,
            parallel: true
          })
        ]
      : []
  },
  // gzip zopfli 压缩
  gzip(config) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')
    const zopfli = require('@gfx/zopfli')
    const BrotliPlugin = require('brotli-webpack-plugin')
    const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
    return IS_PROD
      ? [
          new CompressionWebpackPlugin({
            // filename: '[path].gz[query]',
            algorithm(input, compressionOptions, callback) {
              return zopfli.gzip(input, compressionOptions, callback)
            },
            // threshold: 1024 * 244,
            compressionOptions: {
              numiterations: 15
            },
            minRatio: 0.8,
            test: productionGzipExtensions
          }),
          new BrotliPlugin({
            test: productionGzipExtensions,
            minRatio: 0.8
          })
        ]
      : []
  }
}

const configures = {
  // 自动注入getWorkerUrl全局变量
  // 处理worker的编译配置
  // 自动引入控件和语言包。
  mocano(config) {
    const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
    return [new MonacoWebpackPlugin()]
  },
  MonacoLocalesPlugin() {
    const MonacoLocalesPlugin = require('monaco-editor-locales-plugin')
    return [
      new MonacoLocalesPlugin({
        // 设置支持的语言
        languages: ['es', 'zh-cn'],
        // 默认语言
        defaultLanguage: 'zh-cn',
        // 打印不匹配的文本
        logUnmatched: false,
        // 自定义文本翻译
        mapLanguages: {
          'zh-cn': {
            'Peek References': '查找引用',
            'Go to Symbol...': '跳到变量位置',
            'Command Palette': '命令面板'
          }
        }
      })
    ]
  }
}

module.exports = {
  runtimeCompiler: true,
  outputDir: process.env.outputDir,
  publicPath: process.env.NODE_ENV === 'production'
  // ? '/rsgw/'
  ? '/back/'
  : '/back',
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  // lintOnSave: !IS_PROD,
  lintOnSave: false,
  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    port: 8100,
    useLocalIp: true,
    // host: '0.0.0.0',
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: fcfg.proxy,
    // https: true,
  },
  transpileDependencies: ['element-ui', 'vue-echarts', 'resize-detector'],
  chainWebpack(config) {
    Object.keys(chains).forEach(key => {
      chains[key](config)
    })
  },
  configureWebpack(config) {
    Object.keys(configures).forEach(key => {
      config.plugins.push(...configures[key](config))
    })
    // config.plugins.push({
    //   apply: (compilter) => {
    //     compilter.hooks.done.tap('DonePlugin', () => {
    //       setTimeout(() => {
    //         process.exit(0)
    //       })
    //     })
    //   }
    // })
    IS_PROD &&
      Object.keys(proConfigures).forEach(key => {
        config.plugins.push(...proConfigures[key](config))
      })
    // console.log(IS_PROD, 'IS_PROD')
    return IS_PROD
      ? {
          optimization: {
            splitChunks: {
              minChunks: 1,
              chunks: 'all',
              maxInitialRequests: 5,
              minSize: 0,
              cacheGroups: {
                'monaco-editor': {
                  test: /monaco-editor/,
                  name: 'monaco-editor',
                  priority: 1
                },
                three: {
                  test: /three/,
                  name: 'three',
                  priority: 1
                },
                '@antv': {
                  test: /@antv/,
                  name: '@antv',
                  priority: 3
                }
                // map3d: {
                //   chunks: 'all',
                //   test: /[\\/]libs[\\/]map3d[\\/]/,
                //   name: 'map3d',
                //   minChunks: 2,
                //   maxInitialRequests: 5,
                //   minSize: 0,
                //   priority: 2
                // }
              }
            }
          }
        }
      : {}
  }
}
