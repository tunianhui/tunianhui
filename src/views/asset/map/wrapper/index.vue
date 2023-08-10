<template>
  <section class="map-wrapper">
    <section class="search-map">
      <div class="input">
        <el-input size="medium"
                  ref="input"
                  @input="inputHandle"
                  @focus="focusHandle"
                  @blur="blurHandle"
                  v-model="value"
                  @keyup.enter.native="searchClick">
          <el-button slot="append"
                     @click="searchClick">搜索</el-button>
        </el-input>
        <transition name="el-fade-in-linear">
          <el-card class="box-card"
                   v-if="isShow">
            <div v-for="(v,index) in options"
                 :key="index">
              <div class="group pl-20">{{v.name}}</div>
              <div v-for="o in v.options"
                   :key="o.value"
                   class="text item pl-20"
                   @click="selectClickHandle(o)">
                {{ o.value }}
              </div>
            </div>
            <div style="height:30px;font-size:12px;line-height:30px;text-align:center;"
                 v-if="clear">
              <span class="pl-10 pr-10 pt-5 pb-5"
                    style="cursor: pointer;"
                    @click="clearHistory">
                <i class="el-icon-refresh-right"></i> 清空历史
              </span>
            </div>
          </el-card>
        </transition>
      </div>
    </section>
    <router-view ref="view"></router-view>
  </section>
</template>

<script>
import {
  getUserSearchHistory,
  getRelated,
  getGlobalRelated,
  getClearHistory,
  getSearchResultSave
} from '@/api/asset/map'
import { mapMutations } from 'vuex'
export default {
  name: 'Map',
  data () {
    return {
      loading: 0,
      isShow: false,
      clear: false,
      value: '',
      options: [],
      keyWordList: [],
      restaurants: [],
      state3: ''
    }
  },
  created () {
    this.getGlobalHistory()
  },
  methods: {
    ...mapMutations({
      setCubeId: 'SET_CUBE_ID'
    }),
    // 获取用户搜索历史
    async getUserSearchHistory () {
      const res = await this.$simpleAsyncTo(getUserSearchHistory(), '获取用户搜索历史失败')
      if (res) {
        let user_history = res.data.map(e => {
          return { label: e.keyword, value: e.keyword }
        })
        this.options = [
          {
            name: '搜索历史',
            options: user_history
          }
        ]
      }
    },
    async remoteMethod (v) {
      if (v !== '') {
        const params = { keyword: v }
        const res = await this.$simpleAsyncTo(getRelated(params), '检索失败')
        if (res) {
          let recommendKeywords = res.data.recommendKeywords.map(e => {
            return {
              label: e.cube_code,
              value: e.cube_code
            }
          })
          let searchResults = res.data.searchResults.map(e => {
            return {
              cube_id: e.cube_id,
              value: e.cube_code,
              label: e.cube_name,
              object_type: e.object_type
            }
          })
          this.options = [
            {
              name: '关联表',
              options: searchResults
            },
            {
              name: '关联词',
              options: recommendKeywords
            }
          ]
        }
      } else {
        this.getUserSearchHistory()
      }
    },
    // 全局搜索历史
    async getGlobalHistory () {
      const res = await this.$simpleAsyncTo(getGlobalRelated(), '获取全局搜索历史失败')
      if (res) {
        this.keyWordList = res.data
      }
    },
    // 清空历史
    async clearHistory () {
      const res = await this.$simpleAsyncTo(getClearHistory(), '清空历史失败')
      if (res) {
        this.$message({
          type: 'success',
          message: '清除成功'
        })
        this.getUserSearchHistory()
        this.$refs.input.blur()
      }
    },
    focusHandle (e) {
      if (e.target.value === '') {
        this.getUserSearchHistory()
        this.clear = true
      } else {
        this.clear = false
        this.remoteMethod(e.target.value)
      }
      this.isShow = true
    },
    blurHandle (e) {
      this.isShow = false
    },
    inputHandle (v) {
      if (v === '') {
        this.clear = true
        this.getUserSearchHistory()
      } else {
        this.clear = false
        this.remoteMethod(v)
      }
    },
    async searchClick () {
      this.$router.push({ name: 'search', query: { data: JSON.stringify({ keyword: this.value }) } })
      this.getSearchResultSave(this.value)
    },
    selectClickHandle (o) {
      this.value = o.value
      if (o.object_type) {
        this.$router.push({ name: 'detail' })
        this.setCubeId(o.cube_id)
      } else {
        this.$router.push({ name: 'search', query: { data: JSON.stringify({ keyword: this.value }) } })
      }
      this.getSearchResultSave(this.value)
    },
    // 保存搜索信息
    async getSearchResultSave (keyword) {
      const res = await this.$simpleAsyncTo(getSearchResultSave({ keyword }), '保存失败')
      if (res) {
        this.$message({
          type: 'success',
          message: res.msg
        })
      }
    }
  }
}
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 2px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background: $grey4;
  border-radius: 10px;
}
.map-wrapper {
  background: $grey7;
  height: 100%;
  overflow-y: auto;
}
.search-map {
  width: 500px;
  height: 110px;
  padding-top: 20px;
  margin: 0 auto;
  $height: 40px;
  .input {
    position: relative;
    height: $height;
    .el-input {
      height: 100%;
      .el-input__inner {
        border-radius: 0;
        height: 100%;
      }
      .el-input-group__append {
        border-radius: 0;
        background: $--color-primary;
        color: $grey10;
        border-color: $--color-primary;
      }
    }
    .box-card {
      width: calc(100% - 60px);
      margin-top: 5px;
      max-height: 300px;
      overflow-y: auto;
      position: absolute;
      z-index: 999;
      .el-card__body {
        padding: 20px 0;
      }
      .group {
        font-size: 12px;
        color: $grey5;
        margin: 10px 0;
      }
      .item {
        font-size: 14px;
        padding: 5px 25px;
        cursor: pointer;
        &:hover {
          background: $grey7;
        }
      }
    }
  }
}
</style>
