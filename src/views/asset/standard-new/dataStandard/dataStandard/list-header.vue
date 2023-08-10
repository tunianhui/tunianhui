<!--
 * @Author: YONG
 * @LastEditors: 大炸鹅
 * @Date: 2023-03-02 11:32:59
 * @LastEditTime: 2023-04-14 09:12:46
 * @Description:
-->

<template>
  <div class="list-header">
    <!-- <input id="importFile" type="file" multiple ref="file" value="" accept="application/json" hidden>
    <el-button @click="importCode" class="mr-10">导入数据</el-button> -->
    <div>{{ title }}</div>
    <div>
      <el-checkbox v-model="meChecked">我负责的</el-checkbox>
      <el-input placeholder="请输入标准集名称编码" style="width:170px" class="ml-10" v-model="keywork">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="plain" class="ml-10" size="mini">
        <i class="iconfont icon-shaixuan mr-5"></i>
      </el-button>
      <el-button type="plain" @click="viewHistory">查看导入记录</el-button>
      <el-button type="primary" class="ml-10" @click="batchImport">批量导入</el-button>
      <el-button type="primary" @click="add"><i class="el-icon-plus"></i>新建标准</el-button>
      <el-button type="plain" icon="el-icon-refresh-right"></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListHeader',
  props: {
    title: String
  },
  data () {
    return {
      meChecked: false,
      keywork: '',
      list: []
    }
  },
  methods: {
    // const promise = new Promise(function (resolve, reject) {
    // })
    importCode () {
      let _this = this
      let input = document.getElementById('importFile')
      this.$refs.file.value = ''
      this.$refs.file.click()
      input.onchange = function () {
        if (this.files.length) {
          const data = {}
          const length = this.files.length
          Array.from(this.files).forEach((file, index) => {
            let reader = new FileReader()
            reader.readAsText(file, 'utf-8') // utf-8编码
            reader.onload = function () {
              const arr = JSON.parse(this.result).features
              arr.forEach(ele => {
                const item = ele.properties
                data[item.name] = item.cp || item.center
              })
              if (index === length - 1) {
                console.log(data)
                _this.exportCode(data)
              }
            }
          })
        }
      }
    },
    exportCode (data) {
      let content = JSON.stringify(data)
      let eleLink = document.createElement('a')
      eleLink.download = 'city.json'
      eleLink.style.display = 'none'
      // 字符内容转变成blob地址
      let blob = new Blob([content])
      eleLink.href = URL.createObjectURL(blob)
      document.body.appendChild(eleLink)
      eleLink.click()
      document.body.removeChild(eleLink)
    },
    add () {
      this.$emit('add')
    },
    batchImport () {
      this.$emit('batchImport')
    },
    viewHistory () {
      this.$emit('viewHistory')
    }
  }
}
</script>

<style lang="scss" scoped>
.list-header {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

</style>
