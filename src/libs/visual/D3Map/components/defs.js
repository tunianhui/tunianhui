export default `
<!-- 条形图样式 -->
<linearGradient id="f-bar" x1="0%" y1="100%" x2="0%" y2="0%">
  <stop offset="0%" stop-color="yellow"></stop>
  <stop offset="100%" stop-color="red"></stop>
</linearGradient>
<linearGradient id="f-bar-hover" x1="0%" y1="100%" x2="0%" y2="0%">
  <stop offset="0%" stop-color="#C94BC3"></stop>
  <stop offset="100%" stop-color="#0D365D"></stop>
</linearGradient>

<image id="mapBg" xlink:href="static/img/1.png" width="1000" height="1000"></image>

<!-- 连线样式 -->
<linearGradient id="f-line" gradientUnits="objectBoundingBox">
  <stop offset="0" stop-color="transparent" />
  <stop offset=".33" stop-color="#06f" />
  <stop offset=".67" stop-color="#f60" />
  <stop offset="1" stop-color="#D1EACC" />
</linearGradient>

<!-- 连线点样式 -->
<radialGradient id="f-line-point">
  <stop offset="0%" style="stop-color: transparent;" />
  <stop offset="40%" style="stop-color: #FF7770;" />
  <stop offset="100%" style="stop-color: #D1F9D6;" />
</radialGradient>

<!-- 飞线样式 -->
<linearGradient id="f-fly" gradientUnits="objectBoundingBox">
  <stop offset="0" stop-color="#0e374f" />
  <stop offset=".33" stop-color="#069a2b" />
  <stop offset=".67" stop-color="#d6f252" />
  <stop offset="1" stop-color="#ffffff" />
</linearGradient>

<!-- 扩散点样式 -->
<radialGradient id="f-point">
  <stop offset="0%" style="stop-color: transparent;" />
  <stop offset="40%" style="stop-color: transparent;" />
  <stop offset="100%" style="stop-color: #00F6FF;" />
</radialGradient>

<!-- 地图文理 -->
<pattern id="material" x="0" y="0" height="1" width="1" patternUnits="objectBoundingBox">
  <image id="materialImage" x="0" y="0" xlink:href="static/material/airflow.jpg"></image>
</pattern>


<filter id="blurFilter">
  <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
</filter>
<filter id="blurFilter5">
  <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
</filter>
<filter id="blurFilter6">
  <feGaussianBlur in="SourceGraphic" stdDeviation="6" />
</filter>
<filter id="blurFilter7">
  <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
</filter>

<!-- 地图伪3D阴影效果 -->
<filter id="f-shadow">
  <feColorMatrix type="matrix" values="
    0 0 0 0 0
    0 0 0 .8 0
    0 0 0 .8 0
    0 0 0 0.5 0
  "></feColorMatrix>
  <feGaussianBlur stdDeviation="1" result="colorBlur1"></feGaussianBlur>

  <feOffset result="offsetBlur0" in="colorBlur1" dx="-1" dy="1" />
  <feOffset result="offsetBlur1" in="colorBlur1" dx="-3" dy="3" />
  <feOffset result="offsetBlur2" in="colorBlur1" dx="-5" dy="5" />

  <feSpecularLighting in="SourceGraphic" lighting-color="#ffb8b8" surfaceScale="1" specularConstant="1" specularExponent="115"
    result="light">
    <feDistantLight elevation="1" azimuth="1"></feDistantLight>
  </feSpecularLighting>
  <feComposite in="light" in2="SourceGraphic" operator="in" result="light-effect"></feComposite>

  <feBlend in="light" in2="SourceGraphic" mode="screen"></feBlend>
  <feMerge>
    <feMergeNode in="offsetBlur0" />
    <feMergeNode in="offsetBlur1" />
    <feMergeNode in="offsetBlur2" />
    <feMergeNode in="SourceGraphic" />
    <feMergeNode in="light-effect" />
  </feMerge>
</filter>

<filter id="filter">
  <feOffset result="offset" dx="2.5" dy="-2" in="SourceAlpha"/>
  <feGaussianBlur result="blur" stdDeviation="3.162"/>
  <feFlood result="flood" flood-color="#fff" flood-opacity="0.88"/>
  <feComposite result="composite" operator="in" in2="blur"/>
  <feBlend result="blend" in="SourceGraphic"/>
</filter>
`
