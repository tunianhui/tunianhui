<template>
  <section class="govern"
           ref="govern">
    <div class="scene">
      <div v-for="i in count"
           :key="i"
           :class="`div${i}`"
           ref="div">{{i}}</div>
    </div>
  </section>
</template>

<script>
import { on, off } from '@/libs/dom'
export default {
  name: 'Rotate3D',
  data () {
    return {
      count: 10,
      speed: 0.002
    }
  },
  mounted () {
    this.setLayout()
    this.animation()
    on(window, 'resize', this.setLayout)
  },
  destroyed () {
    off(window, 'resize', this.setLayout)
  },
  methods: {
    setLayout () {
      const container = this.$refs.govern,
        width = container.offsetWidth,
        height = container.offsetHeight,
        div = this.$refs.div[0],
        dWidth = div.offsetWidth,
        dHeight = div.offsetHeight,
        padding = 20
      this.radius = width < height ? width - padding : height - padding
      this.radius /= 2
      this.y = height / 2 - padding - dHeight
      this.origin = {
        x: this.radius + padding / 2 + dWidth / 2,
        y: this.y
      }
    },
    animation () {
      this.$refs.div &&
        this.$refs.div.forEach((el, i) => {
          !el.angle &&
            (el.angle =
              Math.PI / 2 - ((Math.PI * 2) / this.$refs.div.length) * i)
          this.rotate(el)
        })
      requestAnimationFrame(this.animation.bind(this))
    },
    rotate (el) {
      el.angle += this.speed
      el.angle > Math.PI * this.radius && (el.angle -= Math.PI * this.radius)
      el.x = this.radius * Math.sin(el.angle) + this.origin.x
      el.z = this.radius * Math.cos(el.angle)
      el.y = this.radius * Math.cos(el.angle) + this.origin.y
      el.style.transform = `translate3d(${el.x}px, ${el.y}px, ${el.z}px)`
    }
  }
}
</script>

<style lang="scss">
.govern {
  position: relative;
  height: 100%;
  transform-style: preserve-3d;
  // transform: rotateX(-45deg);
  backface-visibility: visible;
  .scene {
    position: relative;
    // perspective: 1000px;
    height: 100%;
    transform: rotateX(45deg);
  }
  div {
    // transform: prespective(300px);
    position: absolute;
    width: 100px;
    height: 100px;
    line-height: 100px;
    font-size: 20px;
    text-align: center;
  }
  @for $i from 1 through 10 {
    .div#{$i} {
      background-color: darken($--color-primary, 15 * $i / 100);
    }
  }
}
</style>
