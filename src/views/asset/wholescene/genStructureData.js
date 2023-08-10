function pickOne(data) {
  return data[Math.floor(Math.random() * data.length)]
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

function genRelations(i, data) {
  const gap = 3,
    start = i - gap > 0 ? i - gap : 0,
    end = i + gap > data.length ? data.length : i + gap,
    count = randomInRange(1, 5),
    list = pickData(data, count, start, end)
      .filter(item => !!item)
      .map(item => item.id)
  return list
}

const dimensionList = [
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
  type: pickOne([1, 2]),
  id: randomWord(18, 20),
  relationIds: null,
  parentId: null
}))

const processList = [
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
].map((name, index) => ({
  name,
  id: randomWord(10, 20),
  type: 'process',
  relationIds: Math.random() > 0.6 ? genRelations(index, dimensionList) : null
}))

function genDimensionRelations() {
  const data = pickData(dimensionList, 40)
  for (let i = 0; i < data.length; i += 2) {
    if (!data[i] || !data[i + 1]) continue
    const si = dimensionList.findIndex(item => item.id === data[i].id)
    const ti = dimensionList.findIndex(item => item.id === data[i + 1].id)
    if (si < ti) {
      if (dimensionList[si].relationIds) {
        dimensionList[si].relationIds.push(dimensionList[ti].id)
      } else {
        dimensionList[si].relationIds = [dimensionList[ti].id]
      }
    } else {
      if (dimensionList[ti].relationIds) {
        dimensionList[ti].relationIds.push(dimensionList[si].id)
      } else {
        dimensionList[ti].relationIds = [dimensionList[si].id]
      }
    }
  }
}

function genDimensionParentId() {
  dimensionList.forEach((item, index) => {
    if (Math.random() > 0.9 && (index !== 0 || index !== dimensionList.length - 1)) {
      const i = Math.random() > 0.5 ? index - 1 : index + 1
      item.parentId = (dimensionList[i] || {}).id || null
      item.type = pickOne([2, 3])
    }
  })
}

genDimensionRelations()
genDimensionRelations()
genDimensionParentId()

// 1 普通维度 2 其他维度 3 普通子维度 4 其他子维度
// const types = [1, 2, 3, 4]

const data = {
  data: {
    dimensionList,
    processList
  }
}

export default data
