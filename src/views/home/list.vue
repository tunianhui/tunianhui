<template>
  <section class="list">
    <ul class="flex-column flex-1">
      <li
        v-for="first in list"
        :key="first.name"
        :class="['first-floor', 'floor', first.children ? `flex-${first.children.length}` : 'flex-1']"
      >
        <div class="prefix">
          <span class="dashed"></span>
          <span class="text">{{first.name}}</span>
        </div>
        <ListItem class="content" v-if="!first.children" :data="first"></ListItem>
        <ul v-else class="flex-column flex-1">
          <li v-for="second in first.children" :key="second.name" class="second-floor floor flex-1">
            <div class="prefix">{{second.name}}</div>
            <ListItem class="content" v-if="!second.children" :data="second"></ListItem>
            <ul class="flex-1" v-else>
              <li v-for="third in second.children" :key="third.name" class="third-floor floor">
                <ListItem class="content" v-if="!third.children" :data="third"></ListItem>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script>
import ListItem from './list-item'

export default {
  name: 'List',
  components: {
    ListItem
  },
  data() {
    return {
      list: [
        {
          name: '数仓规划',
          title: '数据仓库规划',
          img: require('@/assets/images/home/1.png'),
          brief:
            '全局架构逻辑空间和物理空间，包括数据系统和公共概念定义，支持组织和资源控制。',
          link: '/plan'
        },
        {
          name: '研发工作台',
          children: [
            {
              name: '数据引入',
              title: '数据引入',
              img: require('@/assets/images/home/2.png'),
              brief: '数据采集、清理、结构化、业务数据的高可靠性集成、沉淀。',
              // link: '/rd/dev/data-process/sync-task'
              link: '/rd/dev/data-process/computing-task'
            },
            {
              name: '规范建模',
              children: [
                {
                  title: '规范定义',
                  img: require('@/assets/images/home/3.png'),
                  brief:
                    '数据字典定义与设计约束条件确定。口径、算法、命名、质量等唯一一致。',
                  link: '/rd/dev'
                },
                {
                  title: '数据建模',
                  img: require('@/assets/images/home/4.png'),
                  brief:
                    '数据模型设计与研发约束条件确定。模型对象及关系业务化且稳定易扩展。',
                  link: '/rd/dev/modeling/dimension-table'
                }
              ]
            },
            {
              name: '通用研发',
              title: '数据通用研发',
              img: require('@/assets/images/home/5.png'),
              brief: 'ETL通用数据的再加工生产。',
              link: '/rd/dev/data-process/code-task'
            },
            {
              name: '数据萃取',
              title: '数据连接萃取',
              img: require('@/assets/images/home/6.png'),
              brief: 'ID识别和标签画像生产。',
              // link: '/rd/exreact'
              link: '/tag/asset-market/asset-market'
            },
            {
              name: '调度运维',
              title: '调度运维',
              img: require('@/assets/images/home/7.png'),
              brief: '作业运维、任务调度与监控报警。',
              link: '/rd/ops'
            }
          ]
        },
        {
          name: '资产中心',
          title: '资产中心',
          img: require('@/assets/images/home/8.png'),
          brief:
            '数据资产的调查和使用、事前检测和控制、事后事项管理、应用和操作。',
          // link: '/asset/map'
          link: '/asset/wholescene'
        },
        {
          name: '主题服务',
          title: '数据主题式服务',
          img: require('@/assets/images/home/9.png'),
          brief: '主题导向的即席/在线查询，支持代码式/问答式/API服务。',
          link: '/rd/dev/ad-search'
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.list {
  height: 100%;
  padding: 15px 10px;
  background-color: $grey8;

  > ul {
    height: 100%;
  }
  .floor {
    display: flex;
    .prefix {
      writing-mode: vertical-lr;
      width: auto;
      white-space: nowrap;
      line-height: 15px;
      position: relative;
      font-size: 14px;
      text-align: center;
      color: $grey3;
      .dashed {
        position: absolute;
        width: 0px;
        height: 100%;
        border-left: 1px dashed $grey3;
        left: 50%;
        top: 0;
      }
      .text {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: $grey8;
        z-index: 1;
        padding: 3px 0;
      }
    }

    &.first-floor {
      .prefix {
        margin: 0 20px 0 10px;
      }

      &:first-child .prefix .text {
        // top: 0;
        // transform: translate(-50%, 0);
      }
      &:last-child .prefix .text {
        // bottom: 0;
        // transform: translate(-50%, 0);
      }
    }
    &.second-floor {
      .prefix {
        color: $grey4;
        margin: 0 15px 0 10px;
      }
    }
  }
}
</style>
