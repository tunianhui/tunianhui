<!--
 * @Author: rhx
 * @LastEditors: YONG
 * @Date: 2021-06-18 09:08:38
 * @LastEditTime: 2023-08-01 09:44:00
 * @Description:
-->
<template>
  <section>
    <div class="main">
      <div class="head">
        <div class="headimg">
          <img src="../../assets/images/welcome.jpg">
        </div>
        <div style="cursor: pointer;">
          <a @click="buttonrouter">进入数据中台</a>
        </div>
        <!-- <div class="headtitle" @click="buttonrouter">进入资源治理</div> -->
      </div>
      <div class="container1">
        <div class="container-left">
          <div class="header">
            <p>功能说明</p>
          </div>
          <div class="table">
            <table>
              <thead>
                <th>资源管理</th>
                <th>治理概念</th>
              </thead>
              <tbody>
                <tr>
                  <td width="50%">
                    主要用于分析资源。资源分析是从全局视角为您展示资源消耗、资源消耗增速、资源消耗分布及资源治理概况
                  </td>
                  <td>
                    <p>治理分析：针对全局进行问题诊断、待治理问题点的分析</p>
                    治理效果：助您分析治理后效果，评定治理情况、推动治理优化
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <th>治理工作台</th>
                <th>治理项管理</th>
              </thead>
              <tbody>
                <tr>
                  <td width="50%">
                    我的治理：面向当前登录用户，根据其所参与和所负责的项目，为您提供高效快捷的治理入口和能力
                  </td>
                  <td width="50%">
                    治理项管理：面向管理员对系统支持的治理模型进行上下线操作
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <th>溯源管理</th>
                <th>回收站</th>
              </thead>
              <tbody>
                <tr>
                  <td width="50%">
                    面向当前登陆用户对待治理项实例识别原因和深度优化操作提供库表、任务、队列元数据的追溯
                  </td>
                  <td width="50%">
                    将您在治理工作台中删除或下线的表或过期分区数据进行临时归档，以防止对数据的误操作
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="container-right">
          <div class="header">
            <p>产品概述</p>
          </div>
          <div class="content">
            资源治理功能助您完成数据使用消耗的分析，全局把控计算与存储成本，提升使用效率
          </div>
          <div class="header">
            <p>使用说明</p>
          </div>
          <div class="content">
            非通过大数据平台服务上建立的数据湖和仓库，在资源治理中项目归属为“其它项目”
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import Header from './header.vue'
import { on, off } from '@/libs/dom'

export default {
  name: 'welcome',
  components: {
    // Header
  },
  data () {
    return {
      gs: '',
      menus: [],
      activeMenuName: '',
      isHome: false,
      visible: false
    }
  },
  computed: {
    cacheList () {
      // const list = this.
      return []
    }
  },
  mounted () {
    this.resize()
    on(window, 'resize', this.resize)
  },
  destroyed () {
    off(window, 'resize', this.resize)
  },
  methods: {
    buttonrouter () {
      window.open('/back/home')
      // this.$router.push('/asset')
      // this.$router.push('/home')
    },
    resize () {
      const width = window.innerWidth
      this.visible = width < 992
    }
  }
}
</script>

<style lang="scss">
.main {
  // min-height: 1200px;
  background-color: #ececec;
  width: 100%;
  // height: 100%;
  padding: 10px;
  overflow-y: scroll;
  .head {
    height: 300px;
    background-color: #ffffff;
    display: flex;
    // height: 25%;
    width: 100%;
    // margin: 0 auto;
    position: relative;
    .headimg {
      margin-left: 10%;
      width: 50%;
      height: 300px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    a {
      position: absolute;
      left: 70%;
      color: #fff;
      text-align: center;
      line-height: 50px;
      display: block;
      width: 250px;
      height: 50px;
      background: #00c1de;
      // margin: 0 auto;
      font-family: PingFangSC-Medium, MicrosoftYaHei;
    }
  }
  .container1 {
    width: 100%;
    height: 700px;
    // border: px solid black;
    display: flex;
    .container-left {
      width: 85%;
      min-width: 1000px;
      background-color: #ffffff;
      height: 700px;
      .header {
        width: 80%;
        // width: 950px;
        // overflow: hidden;
        margin: 15px auto;
        font-family: MicrosoftYaHei;
        font-size: 18px;
        color: #666;
        text-align: left;
        height: 29px;
        /* margin: 15px 0; */
        /* padding-left: 30px; */
        p {
          display: inline-block;
          height: 30px;
          font-weight: bold;
          padding: 5px 10px;
          margin: 0;
          font-size: 14px;
          color: #666;
          padding-top: 0;
        }
      }
      .table {
        width: 100%;
        overflow: auto;
        /* border: 1px solid #f0eff0; */
      }
      table {
        width: 80%;
        // width: 950px;
        margin: 0 auto;
        text-align: center;
        border: 1px solid #f0eff0;
        border-spacing: 0;
        // overflow: hidden;
      }
      table th,
      table td {
        border-right: 1px solid #f0eff0;
        border-bottom: 1px solid #f0eff0;
      }
      table tr td:last-child,
      table tr th:last-child {
        border-right: none;
      }
      table tr:last-child td {
        border-bottom: none;
      }
      table th {
        background: #f9fafc;
        line-height: 59px;
        font-size: 14px;
        color: #666;
        font-weight: normal;
      }
      table td {
        // color: #9b9b9b;
        color: #888;
        vertical-align: top;
        font-size: 12px;
      }
      table tr {
        line-height: 39px;
        height: 100px;
      }
    }
    .container-right {
      width: 15%;
      min-width: 150px;
      margin-left: 10px;
      background-color: #ffffff;
      height: 700px;
      .header {
        width: 80%;
        // overflow: hidden;
        margin: 15px auto;
        font-family: MicrosoftYaHei;
        font-size: 18px;
        color: #666;
        text-align: left;
        height: 29px;
        /* margin: 15px 0; */
        /* padding-left: 30px; */
        p {
          display: inline-block;
          height: 30px;
          font-weight: bold;
          // padding: 5px 10px;
          margin: 0;
          font-size: 14px;
          color: #666;
          padding-top: 0;
        }
      }
      .content {
        width: 80%;
        margin: 0 auto;
        // color: #9b9b9b;
        color: #888;
        font-size: 12px;
      }
    }
  }
}
</style>
<style>
</style>
