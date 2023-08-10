import {setStyles} from '@/libs/dom'

export default function setPopperPos(event, el, options = {}) {
  if (!el) return
  const {placement = 'right', offset = [20, 20], pointCenter} = options,
    x = event.offsetX || event.clientX || event.x,
    y = event.offsetY || event.clientY || event.y,
    {offsetWidth, offsetHeight} = el,
    rect = el.parentNode.getBoundingClientRect(),
    width = el.parentNode.offsetWidth,
    height = el.parentNode.offsetHeight,
    pl = x - offsetWidth - offset[0],
    plc = x - offsetWidth / 2,
    pr = x + offset[0],
    pt = y - offsetHeight - offset[1],
    ptc = y - offsetHeight / 2,
    pb = y + offset[1]
  let left, top

  if (placement === 'left') {
    left = pl < 0 ? pr : pl
  } else if (placement === 'right') {
    left = pr + offsetWidth > width ? pl : pr
  } else if (placement === 'top') {
    top = pt < 0 ? pb : pt
  } else if (placement === 'bottom') {
    top = pb + offsetHeight > height ? pt : pb
  }
  if (placement === 'left' || placement === 'right') {
    if (y + offsetHeight / 2 > height) {
      pointCenter && (left = plc)
      top = pt
    } else if (y - offsetHeight / 2 < 0) {
      pointCenter && (left = plc)
      top = pb + offsetHeight > height ? pt : pb
    } else {
      top = pointCenter ? ptc : pb
    }
  }
  if (placement === 'top' || placement === 'bottom') {
    if (x + offsetWidth / 2 > width) {
      left = pl
      pointCenter && (top = ptc)
    } else if (x - offsetWidth / 2 < 0) {
      left = pr
      pointCenter && (top = ptc)
    } else {
      left = pointCenter ? plc : pr
    }
    if (
      (top === pb && top + offsetHeight > height) ||
      (top < 0 && top === pt)
    ) {
      pointCenter && (top = ptc)
      left = left + offsetWidth > width ? pl : pr
    }
  }

  left < rect.left && (left = pr)
  top < rect.top && (top = pb)
  left + offsetWidth + rect.left > window.innerWidth && (left = pl)
  top + offsetHeight + rect.top > window.innerHeight && (top = pt)
  setStyles(el, {
    left: left + 'px',
    top: top + 'px'
  })
}
