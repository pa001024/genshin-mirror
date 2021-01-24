<template>
  <GsIcon v-if="elementIcon" :type="elementIcon" class="element-icon" :size="size" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ElementType } from "~/modules/core";

@Component({})
export default class ElementIcon extends Vue {
  @Prop() element!: ElementType;
  @Prop({ default: 32 }) size!: number;

  get elementIcon(): string {
    const vMap: { [x: number]: string } = {
      [ElementType.Anemo]: "anemo",
      [ElementType.Geo]: "geo",
      [ElementType.Electro]: "electro",
      [ElementType.Dendro]: "dendro",
      [ElementType.Hydro]: "hydro",
      [ElementType.Pyro]: "pyro",
      [ElementType.Cryo]: "cryo",
    };
    return vMap[this.element as number];
  }
}
</script>

<style lang="less">
@import "~/assets/global.less";

.element-icon {
  &.gs-icon-anemo {
    color: @anemo;
    background: radial-gradient(@anemo-gradient, #0000 70%);
  }
  &.gs-icon-geo {
    color: @geo;
    background: radial-gradient(@geo-gradient, #0000 70%);
  }
  &.gs-icon-electro {
    color: @electro;
    background: radial-gradient(@electro-gradient, #0000 70%);
  }
  &.gs-icon-dendro {
    color: @dendro;
    background: radial-gradient(@dendro-gradient, #0000 70%);
  }
  &.gs-icon-hydro {
    color: @hydro;
    background: radial-gradient(@hydro-gradient, #0000 70%);
  }
  &.gs-icon-pyro {
    color: @pyro;
    background: radial-gradient(@pyro-gradient, #0000 70%);
  }
  &.gs-icon-cryo {
    color: @cryo;
    background: radial-gradient(@cryo-gradient, #0000 70%);
  }
}
</style>
