<template>
  <div class="avatar-image">
    <v-avatar v-if="avatar" :width="size" :height="size">
      <img :src="url" />
    </v-avatar>
    <img v-else :src="url" :width="size" :height="size" />
    <GsIcon v-if="elementIcon" :type="elementIcon" class="avatar-element-icon" />
    <GsIcon v-if="visionIcon" :type="visionIcon" class="avatar-vision-icon" />
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { ElementType, Region } from "~/modules/core";

@Component({})
export default class CharImage extends Vue {
  @Prop() id!: string;
  @Prop() element!: ElementType;
  @Prop() region!: Region;
  @Prop({ default: "thumb" }) type!: "thumb" | "portrait";
  @Prop({ type: Number, default: 32 }) size!: number;
  @Prop({ type: Boolean }) avatar!: boolean;
  @Getter("app/travelerGender") travelerGender!: number;

  get url() {
    const id = this.id === "Traveler" ? (this.travelerGender ? "Aether" : "Lumine") : this.id;
    return "/img/char/" + this.type + "/" + id + ".png";
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

  get visionIcon(): string {
    const vMap: { [x: number]: string } = {
      [Region.Mondstadt]: "mondstadt-vision",
      [Region.Liyue]: "liyue-vision",
      [Region.Snezhnaya]: "liyue-vision",
    };
    return vMap[this.region as number];
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
  // padding: 0 8px;
  img {
    pointer-events: none;
  }
}
.avatar-vision-icon {
  && {
    position: absolute;
    width: 26px;
    height: 26px;
    left: 0;
    bottom: 0;
    color: gray;
  }
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
