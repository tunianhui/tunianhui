// 以下网址可以查看此文件中相关函数实现的定义
// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/
// https://docs.microsoft.com/zh-cn/windows/win32/direct3dhlsl/dx-graphics-hlsl-intrinsic-functions/
// https://docs.unity3d.com/ScriptReference/Mathf.html
// http://moutjs.com/docs/v0.11/math.html#map

export const VERSION = '1.0.0'
export const PI = Math.PI

// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/clamp.xhtml
// 约束一个值，使其位于另外两个值之间
export function clamp(v, minVal, maxVal) {
  return Math.min(maxVal, Math.max(minVal, v))
}

// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/step.xhtml
// 指定用于生成step函数的值
export function step(edge, v) {
  return v < edge ? 0 : 1
}

// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/smoothStep.xhtml
// 在两个值之间执行Hermite插值(埃尔米特插值)
// Hermite插值 就是要求插值函数不仅经过所给节点，而且要保证在该点的导数也相等
export function smoothStep(edge0, edge1, v) {
  const t = clamp((v - edge0) / (edge1 - edge0), 0.0, 1.0)
  return t * t * (3.0 - 2.0 * t)
}

// v 0 1 中取中间值
export function clamp01(v) {
  return clamp(v, 0, 1)
}

// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mix.xhtml
// 在两个值之间进行线性插值
export function lerp(x, y, a) {
  if (a <= 0) return x
  if (a >= 1) return y
  return x + a * (y - x)
}

export const mix = lerp

// https://docs.unity3d.com/ScriptReference/Mathf.InverseLerp.html
// 计算在[a, b]范围内产生插值值的线性参数a
export function inverseLerp(a, b, v) {
  return (v - a) / (b - a)
}

export const inverseMix = inverseLerp

// https://docs.unity3d.com/ScriptReference/Mathf.LerpUnclamped.html
// 在x和y之间进行线性插值
export function lerpUnclamped(x, y, a) {
  if (a <= 0) return x
  if (a >= 1) return y
  return x + a * (y - x)
}

export const mixUnclamped = lerpUnclamped

// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/fract.xhtml
// 获取参数的小数部分
export function fract(v) {
  return v - Math.floor(v)
}

export const frac = fract

// http://stackoverflow.com/questions/4965301/finding-if-a-number-is-a-power-of-2
// 求一个数是否为2的幂
export function isPowerOfTwo(v) {
  return ((v - 1) & v) === 0
}

// https://bocoup.com/weblog/find-the-closest-power-of-2-with-javascript
// 返回最接近2的幂
export function closestPowerOfTwo(v) {
  return Math.pow(2, Math.round(Math.log(v) / Math.log(2)))
}

// 返回等于或大于该参数的下一个2的幂
export function nextPowerOfTwo(v) {
  return Math.pow(2, Math.ceil(Math.log(v) / Math.log(2)))
}

// https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/mod.xhtml
// http://stackoverflow.com/questions/1878907/the-smallest-difference-between-2-angles
// 计算一个参数模另一个参数的值
// export function mod(a, n) { return a - Math.floor(a/n) * n; }
export function mod(a, n) {
  return ((a % n) + n) % n
}

// 角度转换为弧度
export function deg2Rad(degrees) {
  return (degrees * Math.PI) / 180
}

export const toRadians = deg2Rad

// 弧度转换为角度
export function rad2Deg(radians) {
  return (radians * 180) / Math.PI
}

export const toDegrees = rad2Deg

// https://docs.unity3d.com/ScriptReference/Mathf.DeltaAngle.html
// 计算以角度为单位的两个给定角度之间的最小差值。
export function deltaAngle(a, b) {
  let d = mod(b - a, 360)
  if (d > 180) d = Math.abs(d - 360)
  return d
}

export const deltaAngleDeg = deltaAngle

// 计算以弧度度为单位的两个给定弧度之间的最小差值
export function deltaAngleRad(a, b) {
  return toRadians(deltaAngle(toDegrees(a), toDegrees(b)))
}

// https://docs.unity3d.com/ScriptReference/Mathf.LerpAngle.html
// 与Lerp相同，但要确保值在360度左右正确插值。
export function lerpAngle(a, b, t) {
  var angle = deltaAngle(a, b)
  return mod(a + lerp(0, angle, t), 360)
}

export const lerpAngleDeg = lerpAngle

// 确保值在2PI弧度左右正确插值
export function lerpAngleRad(a, b, t) {
  return toRadians(lerpAngleDeg(toDegrees(a), toDegrees(b), t))
}

// https://docs.unity3d.com/ScriptReference/Mathf.gammaToLinearSpace.html
// http://gamedev.stackexchange.com/questions/74324/gamma-space-and-linear-space-with-shader
// 将给定值从gamma (sRGB)转换为线性颜色空间
export function gammaToLinearSpace(v) {
  return Math.pow(v, 2.2)
}

// https://docs.unity3d.com/ScriptReference/Mathf.linearToGammaSpace.html
// 将给定值从线性转换为伽玛(sRGB)颜色空间。
export function linearToGammaSpace(v) {
  return Math.pow(v, 1 / 2.2)
}

export function map(from1, to1, from2, to2, v) {
  return from2 + ((v - from1) * (to2 - from2)) / (to1 - from1)
}

export const scale = map

// http://www.iquilezles.org/www/articles/functions/functions.htm

export function almostIdentity(x, m, n) {
  if (x > m) return x

  const a = 2 * n - m
  const b = 2 * m - 3 * n
  const t = x / m

  return (a * t + b) * t * t + n
}

export function impulse(k, x) {
  var h = k * x
  return h * Math.exp(1 - h)
}

export function cubicPulse(c, w, x) {
  x = Math.abs(x - c)
  if (x > w) return 0
  x /= w
  return 1 - x * x * (3 - 2 * x)
}

export function expStep(x, k, n) {
  return Math.exp(-k * Math.pow(x, n))
}

export function parabola(x, k) {
  return Math.pow(4 * x * (1 - x), k)
}

export function powerCurve(x, a, b) {
  const k = Math.pow(a + b, a + b) / (Math.pow(a, a) * Math.pow(b, b))
  return k * Math.pow(x, a) * Math.pow(1 - x, b)
}

// http://iquilezles.org/www/articles/smin/smin.htm ?

export function latLonToCartesian(lat, lon) {
  lon += 180
  lat = clamp(lat, -85, 85)
  const phi = toRadians(90 - lat)
  const theta = toRadians(180 - lon)
  const x = Math.sin(phi) * Math.cos(theta)
  const y = Math.cos(phi)
  const z = Math.sin(phi) * Math.sin(theta)

  return {x: x, y: y, z: z}
}

export function cartesianToLatLon(x, y, z) {
  const n = Math.sqrt(x * x + y * y + z * z)
  return {lat: Math.asin(z / n), lon: Math.atan2(y, x)}
}

export function randomInRange(min, max) {
  return min + Math.random() * (max - min)
}

export function norm(v, minVal, maxVal) {
  return (v - minVal) / (maxVal - minVal)
}

export function hash(n) {
  return fract((1.0 + Math.cos(n)) * 415.92653)
}

export function noise2d(x, y) {
  const xhash = hash(x * 37.0)
  const yhash = hash(y * 57.0)
  return fract(xhash + yhash)
}

// http://iquilezles.org/www/articles/smin/smin.htm

export function smoothMin(a, b, k) {
  const res = Math.exp(-k * a) + Math.exp(-k * b)
  return -Math.log(res) / k
}

export function smoothMax(a, b, k) {
  return Math.log(Math.exp(a) + Math.exp(b)) / k
}

export function almost(a, b) {
  return Math.abs(a - b) < 0.0001
}
