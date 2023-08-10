export function pickOne(data) {
  return data[Math.floor(Math.random() * data.length)]
}

export function pickData(data, count, start = 0, end) {
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

export function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

export function randomWord(min = 2, max = 10) {
  const letter = 'abcdefghijklmnopqrstuvwxyz'
  return Array.from({length: randomInRange(min, max)}, item => pickOne(letter.split(''))).join('')
}

export function randomList(length, fn) {
  return Array.from({length}, fn)
}

export function randomWordList(length, min = 2, max = 10) {
  return randomList(length, _ => randomWord(min, max))
}
