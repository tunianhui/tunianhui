const filters = [
  {
    'id': 'RULE_STATUS',
    'des': '开发状态',
    'options': [
      {
        'value': 'SUBMITTED',
        'des': '已提交'
      },
      {
        'value': 'DRAFT',
        'des': '草稿'
      },
      {
        'value': 'DEVELOPING',
        'des': '开发中'
      }
    ]
  },
  {
    'id': 'DOMAIN',
    'des': '数据域',
    'options': [
      {
        'value': '1019',
        'des': '通信域'
      },
      {
        'value': '898',
        'des': '电商0915'
      },
      {
        'value': '880',
        'des': 'ss_电商'
      },
      {
        'value': '863',
        'des': '付川的测试行为域'
      },
      {
        'value': '761',
        'des': 'shuijin'
      },
      {
        'value': '628',
        'des': 'gc0723'
      },
      {
        'value': '744',
        'des': 'a电商'
      },
      {
        'value': '714',
        'des': 'qyt_测试电商域'
      },
      // {
      //   'value': '616',
      //   'des': '游戏域'
      // },
      // {
      //   'value': '652',
      //   'des': 'aaa'
      // },
      // {
      //   'value': '642',
      //   'des': 'baison_test'
      // },
      // {
      //   'value': '625',
      //   'des': '百胜电商'
      // },
      // {
      //   'value': '605',
      //   'des': 'hn1'
      // },
      // {
      //   'value': '565',
      //   'des': 'hntest_电商'
      // },
      // {
      //   'value': '515',
      //   'des': 'hn_电商'
      // },
      // {
      //   'value': '496',
      //   'des': '国际资本域'
      // },
      // {
      //   'value': '463',
      //   'des': '运营'
      // },
      // {
      //   'value': '461',
      //   'des': '移动端'
      // },
      // {
      //   'value': '446',
      //   'des': 'cc_domain'
      // },
      // {
      //   'value': '434',
      //   'des': 'test_tommy'
      // },
      // {
      //   'value': '297',
      //   'des': '用户'
      // },
      // {
      //   'value': '393',
      //   'des': '广告数据'
      // },
      // {
      //   'value': '375',
      //   'des': '行为域测试0310'
      // },
      // {
      //   'value': '372',
      //   'des': '测试域'
      // },
      // {
      //   'value': '337',
      //   'des': 'btn_order_member'
      // },
      // {
      //   'value': '322',
      //   'des': 'btn_hw'
      // },
      // {
      //   'value': '313',
      //   'des': '沉睡流失标识'
      // },
      // {
      //   'value': '304',
      //   'des': '玉兔_hw'
      // },
      // {
      //   'value': '242',
      //   'des': '电商'
      // },
      // {
      //   'value': '178',
      //   'des': 'ec_domain_yz'
      // },
      // {
      //   'value': '219',
      //   'des': 'ecommerce_zk'
      // },
      // {
      //   'value': '190',
      //   'des': '交易'
      // },
      // {
      //   'value': '122',
      //   'des': '销售'
      // },
      // {
      //   'value': '112',
      //   'des': 'EC_Domain'
      // },
      // {
      //   'value': '93',
      //   'des': 'ibdd_shopping_and_watching'
      // },
      // {
      //   'value': '60',
      //   'des': 'ibdd_shoppoing_domain'
      // },
      // {
      //   'value': '82',
      //   'des': 'ibdd_watching_domian'
      // }
    ]
  },
  {
    'id': 'BIZ_LINE',
    'des': '业务线',
    'options': [
      {
        'value': '1021',
        'des': '移动业务线'
      },
      {
        'value': '899',
        'des': '淘宝0915'
      },
      {
        'value': '881',
        'des': 'ss_淘宝'
      },
      {
        'value': '864',
        'des': '付川的测试业务线'
      },
      {
        'value': '765',
        'des': 'shuijin'
      },
      {
        'value': '629',
        'des': 'gc0723'
      },
      {
        'value': '745',
        'des': 'a淘宝'
      },
      {
        'value': '716',
        'des': 'qyt_测试聚划算业务线'
      },
      {
        'value': '715',
        'des': 'Qyt测试淘宝业务线'
      },
      {
        'value': '686',
        'des': '手游'
      },
      {
        'value': '643',
        'des': 'taobao'
      },
      {
        'value': '626',
        'des': '淘宝业务线'
      },
      {
        'value': '606',
        'des': 'hn1_电商'
      },
      {
        'value': '566',
        'des': 'hntest_淘宝'
      },
      {
        'value': '516',
        'des': 'hn_淘宝'
      },
      {
        'value': '499',
        'des': '厂鹅业务线'
      },
      {
        'value': '498',
        'des': '哆哆品业务线'
      },
      {
        'value': '497',
        'des': '冬晶业务线'
      },
      {
        'value': '464',
        'des': '移动端'
      },
      {
        'value': '462',
        'des': '访问'
      },
      {
        'value': '447',
        'des': '电商业务线'
      },
      {
        'value': '438',
        'des': '用户行为'
      },
      {
        'value': '414',
        'des': 'test027'
      },
      {
        'value': '376',
        'des': '业务线测试0310'
      },
      {
        'value': '373',
        'des': '测试线'
      },
      {
        'value': '338',
        'des': 'btn_order_member_online'
      },
      {
        'value': '323',
        'des': 'btn_order_hw'
      },
      {
        'value': '314',
        'des': '订单_test'
      },
      {
        'value': '305',
        'des': 'item_hw'
      },
      {
        'value': '298',
        'des': '高顿'
      },
      {
        'value': '293',
        'des': '聚划算'
      },
      {
        'value': '287',
        'des': '天猫'
      },
      {
        'value': '276',
        'des': 'business_line_yz1'
      },
      {
        'value': '243',
        'des': '淘宝'
      },
      {
        'value': '221',
        'des': '自然属性业务'
      },
      {
        'value': '220',
        'des': '购物分析业务'
      },
      {
        'value': '191',
        'des': '购物交易'
      },
      {
        'value': '179',
        'des': 'intl_business_yz'
      },
      {
        'value': '123',
        'des': '4s店销售'
      },
      {
        'value': '113',
        'des': 'EC_business'
      },
      {
        'value': '94',
        'des': 'ibdd_shopping_and_watching'
      },
      {
        'value': '83',
        'des': 'ibdd_watching_line_of_bussiness'
      },
      {
        'value': '61',
        'des': 'ibdd_shoppoing_line_of_bussiness'
      }
    ]
  },
  {
    'id': 'ACTION',
    'des': '动作',
    'options': [
      {
        'value': '1028',
        'des': '拨打'
      },
      {
        'value': '1027',
        'des': '位置移动'
      },
      {
        'value': '1023',
        'des': 'm访问'
      },
      {
        'value': '902',
        'des': '浏览0915'
      },
      {
        'value': '901',
        'des': '收藏0915'
      },
      {
        'value': '900',
        'des': '购买0915'
      },
      {
        'value': '890',
        'des': 'ss_收藏'
      },
      {
        'value': '883',
        'des': 'ss_浏览'
      },
      {
        'value': '882',
        'des': 'ss_购买'
      },
      {
        'value': '871',
        'des': '动作'
      },
      {
        'value': '865',
        'des': '付川测试下单行为'
      },
      {
        'value': '762',
        'des': 'shuijin'
      },
      {
        'value': '630',
        'des': 'gc0723'
      },
      {
        'value': '748',
        'des': 'a浏览'
      },
      {
        'value': '747',
        'des': 'a收藏'
      },
      {
        'value': '746',
        'des': 'a购买'
      },
      {
        'value': '720',
        'des': '测试浏览'
      },
      {
        'value': '719',
        'des': '淘宝浏览动作'
      },
      {
        'value': '718',
        'des': '测试淘宝看'
      },
      {
        'value': '687',
        'des': '游戏内购买'
      },
      {
        'value': '647',
        'des': 'taobao_fav'
      },
      {
        'value': '645',
        'des': 'taobao_buy'
      },
      {
        'value': '646',
        'des': 'taobao_cart'
      },
      {
        'value': '644',
        'des': 'taobao_pv'
      },
      {
        'value': '635',
        'des': 'bs浏览'
      },
      {
        'value': '618',
        'des': '角色登录'
      },
      {
        'value': '609',
        'des': 'hn1_收藏'
      },
      {
        'value': '608',
        'des': 'hn1_购买'
      },
      {
        'value': '607',
        'des': 'hn1_浏览'
      },
      {
        'value': '594',
        'des': 'hntest_浏览'
      },
      {
        'value': '593',
        'des': 'hntest_收藏'
      },
      {
        'value': '567',
        'des': 'hntest_购买'
      },
      {
        'value': '519',
        'des': 'hn_浏览'
      },
      {
        'value': '518',
        'des': 'hn_收藏'
      },
      {
        'value': '517',
        'des': 'hn_购买'
      },
      {
        'value': '501',
        'des': 'nl浏览'
      },
      {
        'value': '500',
        'des': 'nl购买'
      },
      {
        'value': '465',
        'des': '访问'
      },
      {
        'value': '435',
        'des': '加购物车'
      },
      {
        'value': '422',
        'des': '未使用优惠券'
      },
      {
        'value': '420',
        'des': 'test_act1'
      },
      {
        'value': '415',
        'des': '使用优惠券'
      },
      {
        'value': '339',
        'des': 'btn_order_member_order'
      },
      {
        'value': '332',
        'des': 'btn_user_order_hw_q1'
      },
      {
        'value': '324',
        'des': 'btn_user_order_hw'
      },
      {
        'value': '315',
        'des': '用户购买_test_hw'
      },
      {
        'value': '306',
        'des': 'purchase_hw'
      },
      {
        'value': '291',
        'des': '登录'
      },
      {
        'value': '279',
        'des': 'collect_yz'
      },
      {
        'value': '278',
        'des': 'browse_yz'
      },
      {
        'value': '277',
        'des': 'purchase_yz'
      },
      {
        'value': '244',
        'des': '浏览'
      },
      {
        'value': '241',
        'des': 'zk_订单结束'
      },
      {
        'value': '234',
        'des': 'zk_添加用户'
      },
      {
        'value': '225',
        'des': 'zk_交易完成'
      },
      {
        'value': '192',
        'des': '购买'
      },
      {
        'value': '180',
        'des': 'placeyz'
      },
      {
        'value': '128',
        'des': 'watching'
      },
      {
        'value': '124',
        'des': '试驾'
      },
      {
        'value': '114',
        'des': 'pay'
      },
      {
        'value': '95',
        'des': '购物和看电影'
      },
      {
        'value': '70',
        'des': '取消订单'
      },
      {
        'value': '69',
        'des': '观看'
      },
      {
        'value': '68',
        'des': '评价'
      },
      {
        'value': '67',
        'des': '收藏'
      },
      {
        'value': '66',
        'des': '支付'
      },
      {
        'value': '65',
        'des': '加入购物车'
      },
      {
        'value': '64',
        'des': '下单'
      }
    ]
  },
  {
    'id': 'OBJECT',
    'des': '对象',
    'options': [
      {
        'value': '1025',
        'des': '网站'
      },
      {
        'value': '906',
        'des': '商品0915'
      },
      {
        'value': '884',
        'des': 'ss_商品'
      },
      {
        'value': '872',
        'des': '对象'
      },
      {
        'value': '866',
        'des': '付川测试对象'
      },
      {
        'value': '763',
        'des': 'shuijinobj'
      },
      {
        'value': '631',
        'des': 'gcobj'
      },
      {
        'value': '749',
        'des': 'a商品'
      },
      {
        'value': '722',
        'des': '女孩礼包'
      },
      {
        'value': '721',
        'des': '商品测试'
      },
      {
        'value': '672',
        'des': '礼包'
      },
      {
        'value': '637',
        'des': 'bs商品'
      },
      {
        'value': '648',
        'des': 'baison_goods'
      },
      {
        'value': '619',
        'des': '角色'
      },
      {
        'value': '611',
        'des': 'hn1_商品类目'
      },
      {
        'value': '610',
        'des': 'hn1_商品'
      },
      {
        'value': '595',
        'des': 'hntest_商品类目'
      },
      {
        'value': '568',
        'des': 'hntest_商品'
      },
      {
        'value': '521',
        'des': 'hn_商品类目'
      },
      {
        'value': '520',
        'des': 'hn_商品'
      },
      {
        'value': '506',
        'des': '支付宝'
      },
      {
        'value': '505',
        'des': '饿了么'
      },
      {
        'value': '504',
        'des': '聚划算'
      },
      {
        'value': '503',
        'des': '天猫'
      },
      {
        'value': '502',
        'des': '淘宝'
      },
      {
        'value': '466',
        'des': '报表'
      },
      {
        'value': '448',
        'des': 'cc商品'
      },
      {
        'value': '436',
        'des': '商品1'
      },
      {
        'value': '416',
        'des': 'test_order'
      },
      {
        'value': '325',
        'des': 'btn_user_hw'
      },
      {
        'value': '316',
        'des': '用户_hw'
      },
      {
        'value': '307',
        'des': 'item_hw'
      },
      {
        'value': '292',
        'des': 'app'
      },
      {
        'value': '280',
        'des': 'product_yz'
      },
      {
        'value': '233',
        'des': 'zk_用户'
      },
      {
        'value': '226',
        'des': 'zk_订单'
      },
      {
        'value': '193',
        'des': '小票明细'
      },
      {
        'value': '185',
        'des': 'orderyz'
      },
      {
        'value': '181',
        'des': 'commodityyz'
      },
      {
        'value': '129',
        'des': 'movies'
      },
      {
        'value': '127',
        'des': '试驾车'
      },
      {
        'value': '118',
        'des': 'order'
      },
      {
        'value': '115',
        'des': 'commodity'
      },
      {
        'value': '96',
        'des': '商品和视频'
      },
      {
        'value': '72',
        'des': '视频'
      },
      {
        'value': '71',
        'des': '商品'
      }
    ]
  },
  {
    'id': 'RECENT_REFRESH_STATUS',
    'des': '最近补数据状态',
    'options': [
      {
        'value': 'NOT_RUNNING',
        'des': '未执行'
      },
      {
        'value': 'RUNNING',
        'des': '运行中'
      },
      {
        'value': 'SUCCESS',
        'des': '成功'
      },
      {
        'value': 'FAILED',
        'des': '失败'
      }
    ]
  }
]

export function getFiltersList() {
  return new Promise((resolve, reject) => {
    let data = filters
    setTimeout(() => {
      resolve({
        flag: true,
        data,
        msg: ''
      })
    }, 1500)
  })
}
