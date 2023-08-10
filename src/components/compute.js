import {getComputeUnit, convertCompute} from '@/libs/util'

export default {
  name: 'Compute',
  props: {
    value: Number,
    fontSize: {
      type: Number,
      default: 12
    }
  },
  render() {
    return (
      <span>
        <strong style={`font-size: ${this.fontSize}px`}>
          {parseFloat(convertCompute(this.value))}
        </strong>
        &nbsp;
        <span class="unit">{getComputeUnit(this.value)}</span>
      </span>
    )
  }
}
