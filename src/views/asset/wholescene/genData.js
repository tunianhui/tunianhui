function pickOne(data) {
  return data[Math.floor(Math.random() * data.length)]
}

function pickData(data, count, start = 0, end) {
  data = data.slice(start, end)
  if (data.length < count) return data

  const list = []
  while (count >= 0) {
    const item = pickOne(data)

    list.push(item)
    data = data.filter(d => d !== item)
    count--
  }
  return list
}

function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function randomWord(min = 2, max = 20) {
  const letter = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({length: randomInRange(min, max)}, item => pickOne(letter.split(''))).join('')
}

function randomList(length, fn) {
  return Array.from({length}, fn)
}

function randomWordList(length, min = 2, max = 20) {
  return randomList(length, _ => randomWord(min, max))
}

// const cates = ['IDC', 'CDN', 'DNS', '备案', '云']

const outter = [
  '时间',
  '位置',
  '事件',
  '业务大类',
  'IP',
  '企业',
  '域名',
  '网站',
  '机房',
  '链路',
  '行业',
  '用户',
  ...randomWordList(50)
].map(name => ({
  name,
  id: randomWord(18, 20)
}))

const inner = [
  '采集',
  '解密',
  '解压',
  'XML解析',
  '清洗',
  '关联企业',
  '关联域名',
  '关联网站',
  '关联机房',
  '关联链路',
  '关联工商',
  '关联用户',
  ...randomWordList(20)
].map(name => ({
  name,
  id: randomWord(18, 20)
}))

function genRelationData() {
  const data = outter.reduce((list, source, i) => {
    const gap = 3,
      start = i - gap > 0 ? i - gap : 0,
      end = i + gap > inner.length ? inner.length : i + gap,
      count = randomInRange(1, 5),
      targets = pickData(inner, count, start, end)
    list = list.concat(
      targets.map(target => ({
        source: source.id,
        target: target ? target.id : ''
        // targets: targets
      }))
    )
    return list
  }, [])

  const outterRelations = pickData(outter, 10)
  for (let i = 0; i < outterRelations.length; i += 2) {
    if (!outterRelations[i] || !outterRelations[i + 1]) continue
    const si = outter.findIndex(item => item.id === outterRelations[i].id)
    const ti = outter.findIndex(item => item.id === outterRelations[i + 1].id)
    if (si > ti) {
      data.push({
        target: outterRelations[i].id,
        source: outterRelations[i + 1].id
        // outterRelations
      })
    } else {
      data.push({
        source: outterRelations[i].id,
        target: outterRelations[i + 1].id
        // outterRelations
      })
    }
  }
  return data
}

function getSources() {
  const data = outter.map(item => ({
    ...item,
    type: pickOne(['general', 'other'])
    // type: pickOne(['1', '2', '3', '4'])
  }))
  data.forEach((item, idx) => {
    if (Math.random() > 0.8 && (idx !== 0 || idx !== data.length - 1)) {
      const i = Math.random() > 0.5 ? idx - 1 : idx + 1
      item.parentId = (data[i] || {}).id
    }
  })
  return data
}

const structureData = {
  relations: genRelationData(),
  sources: getSources(),
  targets: inner
}

const flowData = {}

const aliStructureData = {
  'processList': [
    {
      'id': 23751619,
      'name': '下单',
      'relationIds': null
    }, {
      'id': 22803543,
      'name': 'ApiBiz7',
      'relationIds': null
    }, {
      'id': 41935,
      'name': '成功交易',
      'relationIds': [41919]
    }, {
      'id': 400504,
      'name': 'fdsd',
      'relationIds': null
    }, {
      'id': 1700564,
      'name': 'fsdffsdf',
      'relationIds': null
    }, {
      'id': 22680132,
      'name': '创建交易',
      'relationIds': [22680124, 22679185, 22682020]
    }, {
      'id': 24248840,
      'name': '浏览日志',
      'relationIds': null
    }, {
      'id': 22707941,
      'name': 'ApiBiz5',
      'relationIds': [22707937]
    }, {
      'id': 452,
      'name': '销售',
      'relationIds': [45267, 6316203, 41919]
    }, {
      'id': 23104090,
      'name': '33',
      'relationIds': null
    }, {
      'id': 24611501,
      'name': '订单1',
      'relationIds': null
    }, {
      'id': 23735066,
      'name': 'one',
      'relationIds': null
    }, {
      'id': 24611488,
      'name': '订单',
      'relationIds': null
    }, {
      'id': 23740221,
      'name': '支付',
      'relationIds': null
    }, {
      'id': 26341843,
      'name': '沙龙订单',
      'relationIds': [26357203, 26357217]
    }, {
      'id': 32846688,
      'name': '贷前',
      'relationIds': null
    }
  ],
  'dimensionList': [
    {
      'id': 22799184,
      'name': 'tt',
      'type': 6,
      'parentId': null,
      'relationIds': [22799182, 22799181]
    }, {
      'id': 22887758,
      'name': 'fa',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22799183,
      'name': '叶子tt',
      'type': 6,
      'parentId': null,
      'relationIds': [22799182, 22799181]
    }, {
      'id': 22799182,
      'name': '2级tt',
      'type': 6,
      'parentId': null,
      'relationIds': [22799181]
    }, {
      'id': 22799181,
      'name': '1级tt',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24766816,
      'name': 'remo',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23755594,
      'name': 'Rohan11',
      'type': 6,
      'parentId': null,
      'relationIds': [23755592, 23755580, 23755590, 23755591]
    }, {
      'id': 23755592,
      'name': '3级Rohan11',
      'type': 6,
      'parentId': null,
      'relationIds': [23755591]
    }, {
      'id': 23755593,
      'name': '叶子Rohan11',
      'type': 6,
      'parentId': null,
      'relationIds': [23755592, 23755590, 23755591]
    }, {
      'id': 23755584,
      'name': 'Rodman11',
      'type': 1,
      'parentId': 23754690,
      'relationIds': [23755580]
    }, {
      'id': 23755590,
      'name': '1级Rohan11',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23740230,
      'name': '店名',
      'type': 1,
      'parentId': null,
      'relationIds': [23735471]
    }, {
      'id': 23755591,
      'name': '2级Rohan11',
      'type': 6,
      'parentId': null,
      'relationIds': [23755590]
    }, {
      'id': 22958704,
      'name': '5级ppp',
      'type': 6,
      'parentId': null,
      'relationIds': [22958703]
    }, {
      'id': 22958705,
      'name': 'ppp',
      'type': 6,
      'parentId': null,
      'relationIds': [22958702, 22958703, 22951700, 22951701, 22958704]
    }, {
      'id': 22958702,
      'name': '3级ppp',
      'type': 6,
      'parentId': null,
      'relationIds': [22951701]
    }, {
      'id': 24611398,
      'name': 'cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611396, 24611395, 24611394, 24611393, 24611392, 24611391, 24611390, 24611389, 24611388]
    }, {
      'id': 22958703,
      'name': '4级ppp',
      'type': 6,
      'parentId': null,
      'relationIds': [22958702]
    }, {
      'id': 24611397,
      'name': '叶子cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611396, 24611395, 24611394, 24611393, 24611392, 24611391, 24611390, 24611389, 24611388]
    }, {
      'id': 24611396,
      'name': '9级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611395]
    }, {
      'id': 24611395,
      'name': '8级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611394]
    }, {
      'id': 24611394,
      'name': '7级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611393]
    }, {
      'id': 24611393,
      'name': '6级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611392]
    }, {
      'id': 22666095,
      'name': 'aa',
      'type': 1,
      'parentId': null,
      'relationIds': [22666280]
    }, {
      'id': 24725582,
      'name': 'xunhuan',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24611392,
      'name': '5级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611391]
    }, {
      'id': 22675296,
      'name': 'virtual',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 400442,
      'name': 'bbb',
      'type': 1,
      'parentId': null,
      'relationIds': [45267, 530125]
    }, {
      'id': 691530,
      'name': '二级tewo',
      'type': 6,
      'parentId': null,
      'relationIds': [691529]
    }, {
      'id': 26357203,
      'name': '沙龙会员',
      'type': 1,
      'parentId': null,
      'relationIds': [26341830]
    }, {
      'id': 691531,
      'name': '叶子tewo',
      'type': 6,
      'parentId': null,
      'relationIds': [691530, 691529]
    }, {
      'id': 400452,
      'name': '性别',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 691529,
      'name': '一级tewo',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 691532,
      'name': 'tewo',
      'type': 6,
      'parentId': null,
      'relationIds': [691530, 691529]
    }, {
      'id': 24611391,
      'name': '4级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611390]
    }, {
      'id': 22675217,
      'name': '三级phone',
      'type': 6,
      'parentId': null,
      'relationIds': [22675216]
    }, {
      'id': 24611390,
      'name': '3级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611389]
    }, {
      'id': 22675216,
      'name': '二级phone',
      'type': 6,
      'parentId': null,
      'relationIds': [22675215]
    }, {
      'id': 22951700,
      'name': '1级ppp',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24611389,
      'name': '2级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': [24611388]
    }, {
      'id': 22675219,
      'name': '叶子phone',
      'type': 6,
      'parentId': null,
      'relationIds': [22675215, 22675217, 22675216, 22675218]
    }, {
      'id': 24611388,
      'name': '1级cc1',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22951701,
      'name': '2级ppp',
      'type': 6,
      'parentId': null,
      'relationIds': [22951700]
    }, {
      'id': 22675218,
      'name': '四级phone',
      'type': 6,
      'parentId': null,
      'relationIds': [22675217]
    }, {
      'id': 1813079,
      'name': 'permission',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22675220,
      'name': 'phone',
      'type': 6,
      'parentId': null,
      'relationIds': [22675215, 22675217, 22675216, 22675218]
    }, {
      'id': 26341854,
      'name': '用户会员',
      'type': 1,
      'parentId': null,
      'relationIds': [26357217]
    }, {
      'id': 22666249,
      'name': '叶子demo',
      'type': 6,
      'parentId': null,
      'relationIds': [22666248, 22666247]
    }, {
      'id': 22666248,
      'name': '二级demo',
      'type': 6,
      'parentId': null,
      'relationIds': [22666247]
    }, {
      'id': 29565329,
      'name': '买家',
      'type': 1,
      'parentId': null,
      'relationIds': [26357203]
    }, {
      'id': 22666250,
      'name': 'demo',
      'type': 6,
      'parentId': null,
      'relationIds': [22666248, 22666247]
    }, {
      'id': 23755580,
      'name': 'Iverson11',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22675215,
      'name': '一级phone',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 26341830,
      'name': '性别沙龙',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22675204,
      'name': '账户',
      'type': 1,
      'parentId': null,
      'relationIds': [22680124, 22679185, 692167]
    }, {
      'id': 22666247,
      'name': '一级demo',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23756302,
      'name': 'Lbj11',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22680124,
      'name': 'vu',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22697264,
      'name': 'wwww',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22666280,
      'name': 'dfs',
      'type': 1,
      'parentId': 22666095,
      'relationIds': null
    }, {
      'id': 26357217,
      'name': '沙龙性别信息',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 25869305,
      'name': 'test1',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23735070,
      'name': 's_test',
      'type': 6,
      'parentId': null,
      'relationIds': [23735068, 23735069]
    }, {
      'id': 6318869,
      'name': '会员测试维度',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23735068,
      'name': '1级s_test',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23735069,
      'name': '2级s_test',
      'type': 6,
      'parentId': null,
      'relationIds': [23735068]
    }, {
      'id': 24603895,
      'name': '2级cen',
      'type': 6,
      'parentId': null,
      'relationIds': [24603894]
    }, {
      'id': 24603894,
      'name': '1级cen',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 1770905,
      'name': '叶子permission_test',
      'type': 6,
      'parentId': null,
      'relationIds': [1770904, 1770903]
    }, {
      'id': 1770904,
      'name': '二级permission_test',
      'type': 6,
      'parentId': null,
      'relationIds': [1770903]
    }, {
      'id': 1770903,
      'name': '一级permission_test',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24603898,
      'name': 'cen',
      'type': 6,
      'parentId': null,
      'relationIds': [24603895, 24603894, 24603896]
    }, {
      'id': 24603897,
      'name': '叶子cen',
      'type': 6,
      'parentId': null,
      'relationIds': [24603895, 24603894, 24603896]
    }, {
      'id': 24603896,
      'name': '3级cen',
      'type': 6,
      'parentId': null,
      'relationIds': [24603895]
    }, {
      'id': 22843596,
      'name': '卢一测试',
      'type': 1,
      'parentId': 24603871,
      'relationIds': null
    }, {
      'id': 24603887,
      'name': 'xx2',
      'type': 1,
      'parentId': 24603871,
      'relationIds': null
    }, {
      'id': 24788706,
      'name': '2级vvc',
      'type': 6,
      'parentId': null,
      'relationIds': [24788705]
    }, {
      'id': 24788707,
      'name': 'vvc',
      'type': 6,
      'parentId': null,
      'relationIds': [24788706, 24788705]
    }, {
      'id': 23053508,
      'name': '测试1',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24788705,
      'name': '1级vvc',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22696647,
      'name': 'yyy',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24603881,
      'name': 'pt1子',
      'type': 1,
      'parentId': 24603871,
      'relationIds': [23752095]
    }, {
      'id': 23751624,
      'name': 'rr',
      'type': 1,
      'parentId': 23735428,
      'relationIds': null
    }, {
      'id': 23754697,
      'name': 'JordanPlus11',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24603871,
      'name': 'p11',
      'type': 1,
      'parentId': null,
      'relationIds': [22843596, 24611398, 24603887, 24603881]
    }, {
      'id': 23754690,
      'name': 'William11',
      'type': 1,
      'parentId': null,
      'relationIds': [23755584]
    }, {
      'id': 22660593,
      'name': '二级dd',
      'type': 6,
      'parentId': null,
      'relationIds': [22660592]
    }, {
      'id': 22660592,
      'name': '一级dd',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22660595,
      'name': 'dd',
      'type': 6,
      'parentId': null,
      'relationIds': [22662571, 22662572, 22660593, 22660592]
    }, {
      'id': 22660594,
      'name': '叶子dd',
      'type': 6,
      'parentId': null,
      'relationIds': [22662571, 22662572, 22660593, 22660592]
    }, {
      'id': 23735494,
      'name': '交易额',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23754695,
      'name': 'Allen11',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23751620,
      'name': 'aabb',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22666217,
      'name': '叶子mod',
      'type': 6,
      'parentId': null,
      'relationIds': [22666216, 22666215]
    }, {
      'id': 22666216,
      'name': '二级mod',
      'type': 6,
      'parentId': null,
      'relationIds': [22666215]
    }, {
      'id': 22666218,
      'name': 'mod',
      'type': 6,
      'parentId': null,
      'relationIds': [22666216, 22666215]
    }, {
      'id': 22696673,
      'name': 'lluyi',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22707937,
      'name': 'ApiDimTest5',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22666215,
      'name': '一级mod',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23053536,
      'name': 'mv',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 41919,
      'name': '日志维',
      'type': 1,
      'parentId': null,
      'relationIds': [41923]
    }, {
      'id': 24788410,
      'name': '7级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788409]
    }, {
      'id': 1700569,
      'name': '二级kkk',
      'type': 6,
      'parentId': null,
      'relationIds': [1700568]
    }, {
      'id': 1700568,
      'name': '一级kkk',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24788411,
      'name': '8级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788410]
    }, {
      'id': 24788408,
      'name': '5级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788407]
    }, {
      'id': 1700571,
      'name': '四级kkk',
      'type': 6,
      'parentId': null,
      'relationIds': [1700569, 1700568, 1700570]
    }, {
      'id': 23754665,
      'name': 'Jordan11',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 41923,
      'name': '错误日志',
      'type': 1,
      'parentId': 41919,
      'relationIds': null
    }, {
      'id': 24788409,
      'name': '6级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788408]
    }, {
      'id': 1700570,
      'name': '三级kkk',
      'type': 6,
      'parentId': null,
      'relationIds': [1700569, 1700568]
    }, {
      'id': 22777503,
      'name': '1级eeee',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 1700573,
      'name': 'kkk',
      'type': 6,
      'parentId': null,
      'relationIds': [1700569, 1700568, 1700571, 1700570]
    }, {
      'id': 23735471,
      'name': '名',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 530125,
      'name': 'ext_bbb',
      'type': 1,
      'parentId': 400442,
      'relationIds': null
    }, {
      'id': 1700572,
      'name': '叶子kkk',
      'type': 6,
      'parentId': null,
      'relationIds': [1700569, 1700568, 1700571, 1700570]
    }, {
      'id': 24788412,
      'name': '9级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788411]
    }, {
      'id': 24608176,
      'name': 'ssss',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24788413,
      'name': 'jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788410, 24788411, 24788408, 24788409, 24788412, 24788406, 24788407, 24788404, 24788405]
    }, {
      'id': 3581438,
      'name': '叶子four',
      'type': 6,
      'parentId': null,
      'relationIds': [3581436, 3581437, 3581434, 3581435, 3581433]
    }, {
      'id': 3581439,
      'name': 'four',
      'type': 6,
      'parentId': null,
      'relationIds': [3581436, 3581437, 3581434, 3581435, 3581433]
    }, {
      'id': 3581436,
      'name': '四级four',
      'type': 6,
      'parentId': null,
      'relationIds': [3581434, 3581435, 3581433]
    }, {
      'id': 6316203,
      'name': '产品信息',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22679185,
      'name': 'country',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 3581437,
      'name': '五级four',
      'type': 6,
      'parentId': null,
      'relationIds': [3581436, 3581434, 3581435, 3581433]
    }, {
      'id': 24788406,
      'name': '3级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788405]
    }, {
      'id': 3581434,
      'name': '二级four',
      'type': 6,
      'parentId': null,
      'relationIds': [3581433]
    }, {
      'id': 692167,
      'name': '订单',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24788407,
      'name': '4级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788406]
    }, {
      'id': 3581435,
      'name': '三级four',
      'type': 6,
      'parentId': null,
      'relationIds': [3581434, 3581433]
    }, {
      'id': 24788404,
      'name': '1级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 3581433,
      'name': '一级four',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24788405,
      'name': '2级jjj',
      'type': 6,
      'parentId': null,
      'relationIds': [24788404]
    }, {
      'id': 45267,
      'name': 'vir',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23751602,
      'name': 'mor',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23735478,
      'name': '店',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 1673721,
      'name': 'dim526_继承',
      'type': 1,
      'parentId': 692167,
      'relationIds': null
    }, {
      'id': 23735426,
      'name': 'eru',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 24611481,
      'name': '测试长英文名',
      'type': 5,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23735428,
      'name': 'othanc',
      'type': 1,
      'parentId': null,
      'relationIds': [23735426]
    }, {
      'id': 41967,
      'name': 'abc',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 23679643,
      'name': 'luyitest111',
      'type': 1,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22662571,
      'name': '四级dd',
      'type': 6,
      'parentId': null,
      'relationIds': [22662572, 22660593, 22660592]
    }, {
      'id': 23752095,
      'name': 'meju',
      'type': 2,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22662572,
      'name': '三级dd',
      'type': 6,
      'parentId': null,
      'relationIds': [22660593, 22660592]
    }, {
      'id': 23735443,
      'name': '1级店铺信息1',
      'type': 6,
      'parentId': null,
      'relationIds': null
    }, {
      'id': 22777506,
      'name': 'eeee',
      'type': 6,
      'parentId': null,
      'relationIds': [22777503, 22777504]
    }, {
      'id': 22777505,
      'name': '叶子eeee',
      'type': 6,
      'parentId': null,
      'relationIds': [22777503, 22777504]
    }, {
      'id': 22777504,
      'name': '2级eeee',
      'type': 6,
      'parentId': null,
      'relationIds': [22777503]
    }, {
      'id': 22696615,
      'name': 'etx',
      'type': 1,
      'parentId': 22682020,
      'relationIds': null
    }, {
      'id': 22682020,
      'name': 'aoa',
      'type': 1,
      'parentId': null,
      'relationIds': [22680124]
    }, {
      'id': 23735444,
      'name': '2级店铺信息1',
      'type': 6,
      'parentId': null,
      'relationIds': [23735443]
    }, {
      'id': 23735445,
      'name': '店铺信息1',
      'type': 6,
      'parentId': null,
      'relationIds': [23735443, 23735444]
    }
  ]
}

const structureData1 = {
  'flag': true,
  'msg': 'ok',
  'data': {
    'relations': [
      {
        'source': '130000201302196791',
        'target': '370000200802146854'
      }, {
        'source': '130000201302196791',
        'target': '710000200107246849'
      }, {
        'source': '130000201302196791',
        'target': '120000198806288669'
      }, {
        'source': '50000020130512387X',
        'target': '120000198806288669'
      }, {
        'source': '50000020130512387X',
        'target': '370000200802146854'
      }, {
        'source': '50000020130512387X',
        'target': '450000200702222653'
      }, {
        'source': '370000199207208146',
        'target': '120000198806288669'
      }, {
        'source': '500000200411085489',
        'target': '710000200107246849'
      }, {
        'source': '500000200411085489',
        'target': '370000200802146854'
      }, {
        'source': '990000198105190839',
        'target': '330000198711285456'
      }, {
        'source': '990000198105190839',
        'target': '130000200305032026'
      }, {
        'source': '990000198105190839',
        'target': '710000200107246849'
      }, {
        'source': '640000198806217547',
        'target': '450000200702222653'
      }, {
        'source': '640000198806217547',
        'target': '130000200305032026'
      }, {
        'source': '640000198806217547',
        'target': '330000198711285456'
      }, {
        'source': '370000199009111634',
        'target': '340000198512063609'
      }, {
        'source': '370000199009111634',
        'target': '230000197805256172'
      }, {
        'source': '370000199009111634',
        'target': '810000199705179410'
      }, {
        'source': '370000199009111634',
        'target': '450000200702222653'
      }, {
        'source': '420000200101249898',
        'target': '440000197907291656'
      }, {
        'source': '420000200101249898',
        'target': '340000198512063609'
      }, {
        'source': '710000199401247441',
        'target': '340000198512063609'
      }, {
        'source': '710000199401247441',
        'target': '810000199705179410'
      }, {
        'source': '710000199401247441',
        'target': '230000197805256172'
      }, {
        'source': '710000199401247441',
        'target': '440000197907291656'
      }, {
        'source': '220000198303175906',
        'target': '340000198512063609'
      }, {
        'source': '220000198303175906',
        'target': '810000199705179410'
      }, {
        'source': '990000201906100594',
        'target': '440000197907291656'
      }, {
        'source': '650000199807258160',
        'target': ''
      }, {
        'source': '71000019720727448X',
        'target': ''
      }, {
        'source': '620000200011067262',
        'target': ''
      }, {
        'source': '340000200212310137',
        'target': ''
      }, {
        'source': '210000200711287550',
        'target': ''
      }, {
        'source': '430000200002093658',
        'target': ''
      }, {
        'source': '360000198905189230',
        'target': ''
      }, {
        'source': '54000019720320372X',
        'target': ''
      }, {
        'source': '430000198906057844',
        'target': ''
      }, {
        'source': '220000198303175906',
        'target': '210000200711287550'
      }, {
        'source': '50000020130512387X',
        'target': '360000198905189230'
      }, {
        'target': '430000200002093658',
        'source': '990000198105190839'
      }, {
        'source': '130000201302196791',
        'target': '650000199807258160'
      }, {
        'target': '430000198906057844',
        'source': '420000200101249898'
      }
    ],
    'sources': [
      {
        'name': '时间',
        'id': '130000201302196791',
        'type': 'general'
      }, {
        'name': '位置',
        'id': '50000020130512387X',
        'type': 'other'
      }, {
        'name': '事件',
        'id': '370000199207208146',
        'type': 'other'
      }, {
        'name': '业务大类',
        'id': '500000200411085489',
        'type': 'general'
      }, {
        'name': '业务小类',
        'id': '990000198105190839',
        'type': 'other',
        'parentId': '640000198806217547'
      }, {
        'name': 'IP',
        'id': '640000198806217547',
        'type': 'general'
      }, {
        'name': '企业',
        'id': '370000199009111634',
        'type': 'other'
      }, {
        'name': '域名',
        'id': '420000200101249898',
        'type': 'other'
      }, {
        'name': '网站',
        'id': '710000199401247441',
        'type': 'general',
        'parentId': '420000200101249898'
      }, {
        'name': '机房',
        'id': '220000198303175906',
        'type': 'general'
      }, {
        'name': '链路',
        'id': '990000201906100594',
        'type': 'other'
      }, {
        'name': '行业',
        'id': '650000199807258160',
        'type': 'general'
      }, {
        'name': '用户',
        'id': '71000019720727448X',
        'type': 'other'
      }, {
        'name': 'fivjcpurpwdyhtjtqyqe',
        'id': '620000200011067262',
        'type': 'general'
      }, {
        'name': 'cdrpdu',
        'id': '340000200212310137',
        'type': 'general'
      }, {
        'name': 'jcufoqjzl',
        'id': '210000200711287550',
        'type': 'other',
        'parentId': '430000200002093658'
      }, {
        'name': 'diphrrwxpfbdh',
        'id': '430000200002093658',
        'type': 'other'
      }, {
        'name': 'psnsuqbscrdk',
        'id': '360000198905189230',
        'type': 'general'
      }, {
        'name': 'ullihx',
        'id': '54000019720320372X',
        'type': 'general'
      }, {
        'name': 'dpnftpkmnllclkxbtc',
        'id': '430000198906057844',
        'type': 'general'
      }
    ],
    'targets': [
      {
        'name': '采集',
        'id': '370000200802146854'
      }, {
        'name': '解密',
        'id': '710000200107246849'
      }, {
        'name': '解压',
        'id': '120000198806288669'
      }, {
        'name': 'XML解析',
        'id': '450000200702222653'
      }, {
        'name': '清洗',
        'id': '330000198711285456'
      }, {
        'name': '关联企业',
        'id': '130000200305032026'
      }, {
        'name': '关联域名',
        'id': '230000197805256172'
      }, {
        'name': '关联网站',
        'id': '340000198512063609'
      }, {
        'name': '关联机房',
        'id': '810000199705179410'
      }, {
        'name': '关联链路',
        'id': '440000197907291656'
      }, {
        'name': '关联工商',
        'id': '130000199604071505'
      }, {
        'name': '关联用户',
        'id': '150000197908115495'
      }, {
        'name': 'csrfpdrqhbhgxvrfovi',
        'id': '610000200310286180'
      }, {
        'name': 'ojgyqlombiscpddglw',
        'id': '650000198702212284'
      }, {
        'name': 'rpsvwnuhscw',
        'id': '150000199807121529'
      }, {
        'name': 'oisqkuiqayve',
        'id': '120000199810106578'
      }, {
        'name': 'dugejqblvrthgxgd',
        'id': '620000199907313985'
      }, {
        'name': 'sevnf',
        'id': '210000199401072786'
      }, {
        'name': 'tglrq',
        'id': '360000200808173288'
      }, {
        'name': 'qnysiqlv',
        'id': '330000199707129519'
      }, {
        'name': 'vsnlfrd',
        'id': '31000019840612832X'
      }, {
        'name': 'ymveffg',
        'id': '510000201510161789'
      }, {
        'name': 'wrysbdr',
        'id': '210000198812165130'
      }, {
        'name': 'aafjpdfhxbyahzjd',
        'id': '820000201508137387'
      }, {
        'name': 'vxsmtb',
        'id': '450000200305061964'
      }, {
        'name': 'qtypvozucxjslgp',
        'id': '610000199909238315'
      }, {
        'name': 'cnrf',
        'id': '120000200004042536'
      }, {
        'name': 'frjutsevqnmwa',
        'id': '650000199105169876'
      }, {
        'name': 'fkjdvmfusn',
        'id': '460000201104240735'
      }, {
        'name': 'vesvbkrjbdlhs',
        'id': '460000197612020588'
      }, {
        'name': 'fduomofwbebscdos',
        'id': '310000199604277152'
      }, {
        'name': 'dvbll',
        'id': '140000197103265515'
      }, {
        'name': 'uqhkievnjgyq',
        'id': '520000197307089323'
      }, {
        'name': 'urdwsxismdgd',
        'id': '500000200103304547'
      }, {
        'name': 'grfeu',
        'id': '420000199904036874'
      }, {
        'name': 'hxfxsrp',
        'id': '220000198201266225'
      }, {
        'name': 'eyqys',
        'id': '350000199411073310'
      }, {
        'name': 'dfwokwnrepzexwmpdna',
        'id': '820000199901235872'
      }, {
        'name': 'kvypvnhiq',
        'id': '120000201703016104'
      }, {
        'name': 'jumeusadu',
        'id': '430000201902215643'
      }, {
        'name': 'swxjwivhrffcbil',
        'id': '640000197704292496'
      }, {
        'name': 'pufcjd',
        'id': '23000019770613556X'
      }, {
        'name': 'ouddjbhgmscin',
        'id': '640000198905231651'
      }, {
        'name': 'jbpbuttt',
        'id': '220000200001311634'
      }, {
        'name': 'tuk',
        'id': '230000201804118957'
      }, {
        'name': 'ycjddwmgs',
        'id': '540000200012108695'
      }, {
        'name': 'mpkiafbzg',
        'id': '510000197505297455'
      }, {
        'name': 'hciuc',
        'id': '370000201103203105'
      }, {
        'name': 'kciziwpkuilwalc',
        'id': '520000200303267326'
      }, {
        'name': 'aqezyqtnjlrkovwocfs',
        'id': '150000198906223235'
      }, {
        'name': 'clfrxxxycduel',
        'id': '500000199001040135'
      }, {
        'name': 'yicojaklcqh',
        'id': '210000201507062893'
      }, {
        'name': 'mnpwcbwtvlct',
        'id': '130000197307135964'
      }, {
        'name': 'lyfplmmuifzirqf',
        'id': '320000197210204770'
      }, {
        'name': 'octompcmagino',
        'id': '440000201608071273'
      }, {
        'name': 'bqvddhcfyp',
        'id': '500000201411016349'
      }, {
        'name': 'tfcvutibeq',
        'id': '440000201005073245'
      }, {
        'name': 'prgzxotddetuic',
        'id': '230000200304240142'
      }, {
        'name': 'hryygfny',
        'id': '530000201311103897'
      }, {
        'name': 'obeqibdlacmhxq',
        'id': '120000199704121475'
      }, {
        'name': 'bncfkkcdopjyvpbgvln',
        'id': '370000198201286886'
      }, {
        'name': 'tonlegqrukdudsh',
        'id': '820000201506204443'
      }, {
        'name': 'ufxvwgfj',
        'id': '130000200509086712'
      }, {
        'name': 'wyonkgtq',
        'id': '540000200106113639'
      }, {
        'name': 'rthgakpliwdm',
        'id': '510000198004046986'
      }, {
        'name': 'mbcbvwojmjnna',
        'id': '61000020150603326X'
      }, {
        'name': 'uuykgy',
        'id': '150000201501314643'
      }, {
        'name': 'ezgufqbxdidsikxm',
        'id': '340000197008230856'
      }, {
        'name': 'ofhvctfyffmaseyk',
        'id': '440000200610307420'
      }, {
        'name': 'bgighxwkdtxlwbdfvpe',
        'id': '340000198102175755'
      }, {
        'name': 'jbg',
        'id': '120000197803139313'
      }, {
        'name': 'udlwvqcctpgpv',
        'id': '520000197902144841'
      }
    ]
  }
}

export default {
  structureData: {data: structureData},
  structureData1,
  aliStructureData,
  flowData
}
