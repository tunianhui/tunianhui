import {convertByte, getByteUnit} from '@/libs/util'

export default {
  name: 'Byte',
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
          {parseFloat(convertByte(this.value))}
        </strong>
        &nbsp;
        <span class="unit">{getByteUnit(this.value)}</span>
      </span>
    )
  }
}
