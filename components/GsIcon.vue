<template>
  <svg class="gs-icon" :class="['gs-icon-' + type, { shadow }]" :style="size && { fontSize: size + 'px' }">
    <use :xlink:href="'/img/symbols.svg#icon-' + type"></use>
  </svg>
  <!-- <svg class="icon" :class="[`gs-icon-` + name, { shadow }]" :style="size && { fontSize: size + 'px' }" :viewBox="viewBox">
    <path :d="path"></path>
  </svg> -->
</template>
<script lang="ts">
import "reflect-metadata";
import { Vue, Component, Prop } from "vue-property-decorator";
// import { SVGData } from "../assets/svgicons";

// const AliasTable: { [key: string]: string } = {};

@Component({})
export default class GsIcon extends Vue {
  @Prop() type!: string;
  @Prop() size!: number;
  @Prop({ type: Boolean }) shadow!: boolean;
  // get name() {
  //   const type = this.type.toLowerCase();
  //   if (type in AliasTable) return AliasTable[type];
  //   return type;
  // }

  // get raw() {
  //   return SVGData[this.name] || SVGData.tenno;
  // }

  // get path() {
  //   return this.raw && this.raw.path;
  // }

  // get viewBox() {
  //   const vs = (this.raw && this.raw.size) || 32;
  //   return `0 0 ${vs} ${vs}`;
  // }
}
</script>

<style lang="less">
[class^="gs-icon-"],
[class*=" gs-icon-"] {
  display: inline-block;
  vertical-align: -0.15em;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  // transform: translateY(2px);
  &.shadow {
    filter: drop-shadow(2px 3px 2px rgba(0, 0, 0, 0.2));
  }
}
</style>
