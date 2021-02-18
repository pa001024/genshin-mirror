<template>
  <v-img class="item-image" :src="src" :width="size" :height="size" @error.once="onError" />
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ItemImage extends Vue {
  @Prop() id!: string;
  @Prop({ type: Number, default: 64 }) size!: number;

  loadFailed = false;
  onError(e: Event) {
    this.loadFailed = true;
    console.log("onError", e);
  }

  get src() {
    return `/img/item/${this.id}.png`;
  }
}
</script>

<style lang="less">
.item-image {
  display: inline-block;
  user-select: none;
}
</style>
