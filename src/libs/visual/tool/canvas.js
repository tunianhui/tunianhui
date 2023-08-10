export function createCanvas(width, height, background) {
  const canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  ctx.fillStyle = background || 'rgba(255, 255, 255, 0)'
  ctx.fillRect(0, 0, width, height)
  return {
    ctx,
    canvas
  }
}

export function drawText(ctx, options = {}) {
  const {
    text = '',
    fontSize = 12,
    // sans-serif Arial 微软雅黑 宋体
    fontFamily = '宋体',
    fontStyle = 'normal',
    fontWeight = 'normal',
    color = '#ffffff',
    x = 0,
    y = 0,
    textAlign = 'center',
    textBaseline = 'middle',
    maxWidth = ctx.canvas.width - 8
  } = options
  ctx.save()
  ctx.font = `${fontSize}px ${fontFamily} ${fontWeight} ${fontStyle}`
  ctx.textAlign = textAlign
  ctx.textBaseline = textBaseline
  ctx.fillStyle = color
  ctx.fillText(text, x, y, maxWidth)
  ctx.restore()
}

export function drawTrangle(ctx, x1, y1, x2, y2, x3, y3, color, type) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineTo(x3, y3)
  ctx[type + 'Style'] = color
  ctx.closePath()
  ctx[type]()
  ctx.restore()
}

/**
 * 绘制一个有填充色的圆角矩形
 * @param {Canvas2DContext} ctx
 * @param {*} width 矩形的宽度
 * @param {*} height 矩形的高度
 * @param {*} radius 圆的半径
 */
export function drawRoundRect(ctx, width, height, radius) {
  ctx.beginPath(0)
  ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2)
  ctx.lineTo(radius, height)
  ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)
  ctx.lineTo(0, radius)
  ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2)
  ctx.lineTo(width - radius, 0)
  ctx.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2)
  ctx.lineTo(width, height - radius)
  ctx.closePath()
}
