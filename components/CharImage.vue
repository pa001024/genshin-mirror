<template>
  <div class="avatar-image">
    <v-avatar v-if="avatar" :width="size" :height="size">
      <img :src="url" />
    </v-avatar>
    <img v-else :src="url" :width="size" :height="size" />
    <GsIcon v-if="elementIcon" :type="elementIcon" class="avatar-element-icon" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { ElementType } from "~/modules/core";

@Component({})
export default class CharImage extends Vue {
  @Prop() name!: string;
  @Prop() element!: ElementType;
  @Prop({ default: "thumb" }) type!: "thumb" | "portrait";
  @Prop({ default: 32 }) size!: number;
  @Prop({ type: Boolean }) avatar!: boolean;

  get url() {
    return "/img/avatar/" + this.type + "/" + this.name + ".png";
  }

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

.avatar-image {
  display: inline-block;
  user-select: none;
  width: inherit;
  height: inherit;
  position: relative;
  padding: 0 8px;
}
.avatar-element-icon {
  && {
    position: absolute;
    width: 20px;
    height: 20px;
    left: 0;
    bottom: 0;
    background: var(--white);
    border-radius: 100%;
    box-shadow: 1px 1px 1px var(--shadow);
  }

  &.gs-icon-anemo {
    color: @anemo;
  }
  &.gs-icon-geo {
    color: @geo;
  }
  &.gs-icon-electro {
    color: @electro;
  }
  &.gs-icon-dendro {
    color: @dendro;
  }
  &.gs-icon-hydro {
    color: @hydro;
  }
  &.gs-icon-pyro {
    color: @pyro;
  }
  &.gs-icon-cryo {
    color: @cryo;
  }
}
</style>
