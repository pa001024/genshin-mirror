<template>
  <v-img class="weapon-image" :src="src" :lazy-src="lazySrc" :width="size" :height="size" @error.once="onError" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { WeaponType } from "~/modules/core";

@Component({})
export default class WeaponImage extends Vue {
  @Prop() id!: string;
  @Prop({ default: "thumb" }) type!: "thumb" | "full";
  @Prop({ type: Number, default: 64 }) size!: number;
  @Prop({ default: WeaponType.Sword }) fallback!: WeaponType;

  loadFailed = false;
  onError(e: Event) {
    this.loadFailed = true;
    console.log("onError", e);
  }

  get src() {
    return `/img/weapon/${this.type}/${this.loadFailed ? WeaponType[this.fallback] : this.id}.png`;
  }

  get lazySrc() {
    return `/img/weapon/${this.type}/${WeaponType[this.fallback]}.png`;
  }
}
</script>

<style lang="less">
.weapon-image {
  display: inline-block;
  user-select: none;
}
</style>
